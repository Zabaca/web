# Runbook: move www.zabaca.com and the apex off Netlify

- **Status:** executed 2026-07-30
- **Risk owner:** James. This zone carries his primary business email.
- **Blast radius:** two DNS records out of fifteen. Email is not among them.

## What changes

Exactly two records, both listed as `# CUTOVER` in
[`dns-snapshot-zabaca-2026-07-30.txt`](./dns-snapshot-zabaca-2026-07-30.txt):

| Record | Before | After |
|---|---|---|
| `A zabaca.com` | `75.2.60.5` (Netlify), unproxied | Worker custom domain, proxied |
| `CNAME www.zabaca.com` | `zabaca.netlify.app`, unproxied | Worker custom domain, proxied |

**Nothing else is touched.** `MX`, `SPF`, `DKIM` (Google and Resend), and `DMARC`
are separate record types on separate names and are not involved. The 2026-07-27
zone migration is the precedent for how easy it is to lose a record without
noticing, which is why the snapshot is a file in the repo rather than a step
someone remembers to do.

`stiqr`, `health`, `m`, and the `ddns` delegation are untouched and keep pointing
where they pointed. `stiqr` is still on Netlify.

## How it is done

`apps/web/wrangler.jsonc` declares both hostnames as `custom_domain` routes, so
the binding between site and domain lives in a file that can be diffed rather
than in a dashboard. Steady state is one command:

```bash
bunx @zabaca/zbc apply production
```

**The first attach is the exception, and this is the part worth knowing.** When a
hostname already has a DNS record pointing somewhere else, which is exactly the
case during a cutover, attaching it fails:

```
Hostname 'www.zabaca.com' already has externally managed DNS records
(A, CNAME, etc). Delete them first or try a different hostname.  [code 100117]
```

Interactively wrangler prompts to override. Non-interactively it just fails, and
`override_existing_dns_record` on the Workers domains API is rejected too. So the
old record has to be **deleted immediately before** the attach, per hostname:

```bash
# 1. delete the existing record
curl -X DELETE ".../zones/$ZONE/dns_records/$RECORD_ID" -H "Authorization: Bearer $TOKEN"
# 2. attach the hostname to the worker, in the same breath
curl -X PUT ".../accounts/$ACCOUNT/workers/domains" -H "Authorization: Bearer $TOKEN" \
  -d '{"zone_id":"'"$ZONE"'","hostname":"'"$H"'","service":"zabaca-web","environment":"production"}'
```

That is a raw API call, which is normally the wrong habit. It is justified here
because wrangler cannot express a first attach over an existing record without a
human at a prompt, and it is a **one-time** unblock: `zbc apply production` was
re-run immediately afterwards and came back clean, so `wrangler.jsonc` is the
source of truth from that point on. Confirmed.

Do the **apex first**. It takes less traffic than www, so if the mechanism is
going to fail it fails on the cheaper name.

Cloudflare replaces each record with a proxied `AAAA` placeholder at `100::`.
That is expected, not a leftover: it is how a Worker custom domain is represented
in the zone. The record count stays at 15.

## Verifying

```bash
curl -sI https://www.zabaca.com | head -3          # 200, no `server: Netlify`
curl -sI https://zabaca.com | grep -i location     # 301 to https://www.zabaca.com/
dig +short MX zabaca.com                           # 1 smtp.google.com.
dig +short TXT google._domainkey.zabaca.com | md5  # must not change
```

The DKIM check is the one worth actually running. Broken DKIM surfaces no error
anywhere: mail simply starts failing authentication, silently, days later. Hash
it before and after and compare.

Then send a mail to and from `james@zabaca.com`. DNS says the records are intact;
only a delivered message says email works.

## Result, 2026-07-30

- Apex returns 301 to `https://www.zabaca.com/` with `server: cloudflare`.
- `www` returns 200 with `server: cloudflare`; all 14 pages plus `robots.txt` and
  `sitemap-index.xml` return 200 through the Cloudflare edge.
- MX, SPF, DMARC unchanged. **The Google DKIM TXT hashed identically before and
  after** (`md5 a73afebca2fca77631a014515e3d15a2`).
- `stiqr`, `health`, `m` unchanged. Zone still holds 15 records.
- A follow-up `zbc apply production` succeeded with no drift.

One gotcha for next time: `curl` and `dig` can disagree for several minutes after
the flip, because a cached A record sends `curl` straight to the old host while
`dig` already shows the new one. `curl` was still reporting `server: Netlify` on
the apex well after the change had landed. Force the edge to answer:

```bash
curl -sI --resolve zabaca.com:443:104.21.26.15 https://zabaca.com
```

Do not conclude the cutover failed from an un-pinned `curl`.

## Rolling back

**Detach the custom domain first.** This is the step that is easy to miss under
pressure, and it is the mirror image of the gotcha above: the hostname no longer
holds an ordinary DNS record, it holds a Workers-managed `AAAA` placeholder at
`100::`. You cannot write an A or CNAME over that while the Worker still claims
the hostname. Order per hostname:

```bash
# 1. find the attachment, then remove it
curl -s ".../accounts/$ACCOUNT/workers/domains?zone_id=$ZONE&hostname=$H" \
  -H "Authorization: Bearer $TOKEN"
curl -X DELETE ".../accounts/$ACCOUNT/workers/domains/$DOMAIN_ID" \
  -H "Authorization: Bearer $TOKEN"
# 2. recreate the original record from the snapshot, proxied=false
curl -X POST ".../zones/$ZONE/dns_records" -H "Authorization: Bearer $TOKEN" \
  -d '{"type":"CNAME","name":"www","content":"zabaca.netlify.app","proxied":false,"ttl":300}'
```

Then remove the `routes` block from `apps/web/wrangler.jsonc` so the next apply
does not recreate the attachment. The Netlify site is not deleted by this change
and keeps serving at `zabaca.netlify.app` (verified still 200), so rollback is a
DNS change only, with no rebuild.

The detach ordering is reasoned from how the forward direction behaved, not
tested: testing it would mean taking the live site down. If you are rolling back
for real, do the apex first, exactly as on the way in.

Do not delete the Netlify site until the Cloudflare version has served real
traffic for a while. It is the rollback target.

## Known difference from Netlify

Trailing-slash canonicalization returns **307** where Netlify returned **301**.
Same destination, weaker permanence signal. The apex redirect itself is a 301,
matching Netlify, because that one is worth preserving exactly.
