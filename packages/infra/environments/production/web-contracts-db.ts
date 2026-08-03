import { d1Module } from '../../modules/d1'

// D1 behind /web-contract: one row per client agreement link, holding who it was
// minted for and, once they accept, their countersignature.
//
// The agreement TEXT is deliberately not in here. It lives in the Astro page, in
// git, and the signature row stores a SHA-256 of the text the signer's browser
// rendered. That hash is a drift detector, not evidence: the client computes and
// sends it, and nothing recomputes it. Storing the rendered text itself, or the
// deployed commit sha, would do more for record integrity than the hash does.
//
// database_id lands in apps/web/wrangler.jsonc's d1_databases binding, same shape
// as foothill-inbox's AUTH_DB.
export default d1Module.instance({
  name: 'web-contracts-db',
  config: {
    accountId: '99a19e584439be0568f33aad0477372b',
    databaseName: 'zabaca-contracts',
  },
})
