import { z } from 'zod'
import { defineModule } from '../../src/define-module'

/**
 * d1: provisions a Cloudflare D1 database via the REST API (turso-style, token
 * from ctx.secrets, idempotent list-then-create, console.log progress).
 *
 * Exists so database lifecycle is owned by infra instead of being a side effect
 * of someone running `wrangler d1 create` by hand.
 *
 * ⚠️ THE BINDING IS NOT WIRED FROM THIS MODULE'S OUTPUT. Unlike r2, the
 * cloudflare module implements no D1 binding resolver, so there is no
 * `{ binding, from, output }` reference to declare. A consumer copies the
 * `databaseId` printed on apply into its own wrangler.jsonc `d1_databases`
 * entry by hand. That means the two are UNLINKED: destroy and re-apply this
 * instance and it mints a fresh uuid while wrangler.jsonc keeps the dead one,
 * and the worker binds a database that no longer exists. Re-copy the id after
 * any destroy. Closing this properly means a D1 resolver in the cloudflare
 * module, upstream in zbc.
 *
 * Token scope: CLOUDFLARE_API_TOKEN needs Account to D1: Edit.
 */

const API = 'https://api.cloudflare.com/client/v4'

interface CfEnvelope<T> {
  success: boolean
  errors: Array<{ code: number; message: string }>
  result: T
}

async function cfFetch<T>(
  token: string,
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: init?.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
  })
  let envelope: CfEnvelope<T>
  try {
    envelope = (await res.json()) as CfEnvelope<T>
  } catch {
    throw new Error(`Cloudflare API ${path}: HTTP ${res.status} (non-JSON body)`)
  }
  if (!res.ok || !envelope.success) {
    const codes = (envelope.errors ?? []).map((e) => e.code)
    const detail = (envelope.errors ?? []).map((e) => `${e.code}: ${e.message}`).join('; ')
    if (codes.includes(10000)) {
      throw new Error(
        `Cloudflare API ${path} rejected the token (10000 Authentication error). ` +
          `CLOUDFLARE_API_TOKEN is likely missing the Account → D1: Edit scope. ` +
          `Edit the token at https://dash.cloudflare.com/profile/api-tokens and re-run zbc apply.`,
      )
    }
    throw new Error(`Cloudflare API ${path} failed (HTTP ${res.status}): ${detail}`)
  }
  return envelope.result
}

export const d1Module = defineModule({
  name: 'd1',
  configSchema: z.object({
    /** Cloudflare account id (not a secret, it is in the dashboard URL). */
    accountId: z.string(),
    /** Database name, account-scoped, so namespace it per project and env. */
    databaseName: z.string(),
  }),
  outputs: z.object({
    databaseName: z.string(),
    databaseId: z.string(),
  }),
  async apply(config, ctx) {
    const apiToken = ctx.secrets['CLOUDFLARE_API_TOKEN']
    if (!apiToken) throw new Error('Missing secret: CLOUDFLARE_API_TOKEN')
    const base = `/accounts/${config.accountId}/d1/database`

    const listing = await cfFetch<Array<{ name: string; uuid: string }>>(
      apiToken,
      `${base}?per_page=1000`,
    )
    const existing = listing.find((d) => d.name === config.databaseName)

    if (existing) {
      console.log(`  D1 database "${config.databaseName}" already exists (${existing.uuid})`)
      return { databaseName: config.databaseName, databaseId: existing.uuid }
    }
    const created = await cfFetch<{ name: string; uuid: string }>(apiToken, base, {
      method: 'POST',
      body: { name: config.databaseName },
    })
    console.log(`  Created D1 database "${config.databaseName}" (${created.uuid})`)
    return { databaseName: config.databaseName, databaseId: created.uuid }
  },
  async destroy(config, ctx) {
    const apiToken = ctx.secrets['CLOUDFLARE_API_TOKEN']
    if (!apiToken) throw new Error('Missing secret: CLOUDFLARE_API_TOKEN')
    try {
      const listing = await cfFetch<Array<{ name: string; uuid: string }>>(
        apiToken,
        `/accounts/${config.accountId}/d1/database?per_page=1000`,
      )
      const existing = listing.find((d) => d.name === config.databaseName)
      if (!existing) return
      await cfFetch(apiToken, `/accounts/${config.accountId}/d1/database/${existing.uuid}`, {
        method: 'DELETE',
      })
      console.log(`  Deleted D1 database "${config.databaseName}"`)
    } catch (err) {
      console.log(`  D1 delete skipped: ${(err as Error).message}`)
    }
  },
})
