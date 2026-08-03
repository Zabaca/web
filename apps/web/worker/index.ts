/**
 * The site is static. This Worker exists for two reasons: keeping the apex
 * redirecting to www the way Netlify did, and serving the /web-contract signing
 * API. Everything else is handed straight to the static assets.
 *
 * Why a Worker and not a Cloudflare Redirect Rule, which is the native tool for
 * the redirect: a Redirect Rule lives in the dashboard, and zbc cannot see or
 * reproduce dashboard state. Eight lines in the repo beat a setting nobody can diff.
 *
 * This costs a Worker invocation on every request, because `run_worker_first` is
 * on in wrangler.jsonc. Without it the edge would serve a matching asset before
 * the Worker ever ran, and the apex would serve the site instead of redirecting.
 * The site is low traffic and static, so the invocations are cheap.
 */

interface Env {
  ASSETS: Fetcher
  CONTRACTS: D1Database
}

interface ContractRow {
  id: number
  client_name: string
  client_entity: string | null
  contract_slug: string
  signed_at: string | null
  signed_name: string | null
  signed_title: string | null
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

/** Hex SHA-256. Used for the token lookup and for the agreement-text fingerprint. */
async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * One response shape for "no such link", used for an absent token and an unknown
 * one alike. Distinguishable errors would turn this endpoint into an oracle for
 * guessing valid tokens.
 */
const NOT_FOUND = { error: 'This signing link is not valid.' }

function payload(row: ContractRow) {
  return {
    // Row id, not the token. Rides along to Stripe as client_reference_id so a
    // payment can be traced back to the agreement it belongs to. Not a secret:
    // knowing it grants nothing, since every read is keyed on the token hash.
    contractId: row.id,
    clientName: row.client_name,
    clientEntity: row.client_entity,
    contractSlug: row.contract_slug,
    signed: row.signed_at
      ? { at: row.signed_at, name: row.signed_name, title: row.signed_title }
      : null,
  }
}

async function lookup(env: Env, token: string | null): Promise<ContractRow | null> {
  if (!token) return null
  const row = await env.CONTRACTS.prepare(
    `SELECT id, client_name, client_entity, contract_slug, signed_at, signed_name, signed_title
       FROM contract_links WHERE token_hash = ?`,
  )
    .bind(await sha256Hex(token))
    .first<ContractRow>()
  return row ?? null
}

async function handleGet(request: Request, env: Env): Promise<Response> {
  const row = await lookup(env, new URL(request.url).searchParams.get('t'))
  if (!row) return json(NOT_FOUND, 404)
  return json(payload(row), 200)
}

async function handleSign(request: Request, env: Env): Promise<Response> {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400)
  }

  const token = typeof body.t === 'string' ? body.t : null
  const row = await lookup(env, token)
  if (!row || !token) return json(NOT_FOUND, 404)

  // Already signed is not an error worth alarming anyone about; hand back the
  // signature so a second visit or a double submit renders the signed state.
  if (row.signed_at) return json({ ...payload(row), alreadySigned: true }, 409)

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const title = typeof body.title === 'string' ? body.title.trim().slice(0, 120) : ''
  if (name.length < 2 || name.length > 120) {
    return json({ error: 'Please type your full name to sign.' }, 400)
  }

  // The client sends a fingerprint of the agreement text it actually rendered.
  // Stored verbatim, so a later edit to the page is detectable rather than silent.
  const hash = typeof body.agreementSha256 === 'string' ? body.agreementSha256 : ''
  if (!/^[a-f0-9]{64}$/.test(hash)) {
    return json({ error: 'Could not fingerprint the agreement. Please reload and try again.' }, 400)
  }

  const signedAt = new Date().toISOString()
  // Guarded on signed_at IS NULL so two concurrent submits cannot both win. The
  // loser sees changes === 0 and is told it is already signed.
  const res = await env.CONTRACTS.prepare(
    `UPDATE contract_links
        SET signed_at = ?, signed_name = ?, signed_title = ?, agreement_sha256 = ?,
            signer_ip = ?, signer_user_agent = ?
      WHERE token_hash = ? AND signed_at IS NULL`,
  )
    .bind(
      signedAt,
      name,
      title || null,
      hash,
      request.headers.get('CF-Connecting-IP'),
      (request.headers.get('User-Agent') ?? '').slice(0, 400),
      await sha256Hex(token),
    )
    .run()

  if (!res.meta.changes) {
    const fresh = await lookup(env, token)
    return json(fresh ? { ...payload(fresh), alreadySigned: true } : NOT_FOUND, 409)
  }

  return json({ ...payload(row), signed: { at: signedAt, name, title: title || null } }, 200)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.hostname === 'zabaca.com') {
      url.hostname = 'www.zabaca.com'
      // 301, matching what Netlify sent, so the permanence signal does not
      // regress for anything already indexed at the apex.
      return Response.redirect(url.toString(), 301)
    }

    if (url.pathname === '/api/contract' && request.method === 'GET') {
      return handleGet(request, env)
    }
    if (url.pathname === '/api/contract/sign' && request.method === 'POST') {
      return handleSign(request, env)
    }

    return env.ASSETS.fetch(request)
  },
}
