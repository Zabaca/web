/**
 * Mint a signing link for a client agreement and print it.
 *
 *   bun run contract:mint -- --name "Chris Lee" \
 *     --entity "Lee & Company Construction Holdings Inc." --slug lee-and-co
 *
 * Only the SHA-256 of the token is stored, so this is the one and only moment the
 * link exists in readable form. If it is lost, mint another; there is no recovery
 * path, by design.
 *
 * ponytail: shells out to wrangler rather than talking to the D1 HTTP API. One
 * fewer credential path, and wrangler already has the binding config.
 */

import { spawnSync } from 'node:child_process'

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(`--${flag}`)
  return i === -1 ? undefined : process.argv[i + 1]
}

const name = arg('name')
const entity = arg('entity')
const slug = arg('slug') ?? 'lee-and-co'
const local = process.argv.includes('--local')

if (!name) {
  console.error('Missing --name "Client Name" (--entity and --slug optional)')
  process.exit(1)
}

const token = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64url')
const tokenHash = Buffer.from(
  await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token)),
).toString('hex')

/** SQLite string literal: double any single quote. Values here are operator-typed,
 * but building SQL by hand without escaping is how that stops being true. */
const q = (v: string | undefined) => (v === undefined ? 'NULL' : `'${v.replace(/'/g, "''")}'`)

const sql =
  `INSERT INTO contract_links (token_hash, client_name, client_entity, contract_slug, created_at) ` +
  `VALUES (${q(tokenHash)}, ${q(name)}, ${q(entity)}, ${q(slug)}, ${q(new Date().toISOString())});`

const res = spawnSync(
  'bunx',
  ['wrangler', 'd1', 'execute', 'zabaca-contracts', local ? '--local' : '--remote', '--command', sql],
  { stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8' },
)

if (res.status !== 0) {
  console.error('\nInsert failed; no link was minted.')
  process.exit(res.status ?? 1)
}

// 8787 is `wrangler dev`, not `astro dev`: the signing API is in the Worker, and
// `astro dev` serves the pages without it.
const origin = local ? 'http://localhost:8787' : 'https://www.zabaca.com'
console.log(`\nSigning link for ${name}:\n\n  ${origin}/web-contract?t=${token}\n`)
console.log('Store it wherever you are sending it from. It is not recoverable.\n')
