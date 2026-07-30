---
entity_type: ArchitectureDecision
decision_title: "bun workspace, and zbc deploys to Cloudflare"
status: accepted
decision_date: "2026-07-30"
impact_scope: system-wide
technology_stack: ["bun", "zbc", "Cloudflare Workers", "sops"]
decision_topic: project_structure
---

# ADR-005: bun workspace, and zbc deploys to Cloudflare

## Status
**Accepted** - 2026-07-30. Supersedes the package-manager half of ADR-003.

## Context
Two facts forced this together.

The site was the last thing Zabaca ran on Netlify, and **nothing in this repo
described that deploy**. There was no `netlify.toml`, no CI workflow, and no
documentation of it: just a git integration configured in the Netlify dashboard.
The one Cloudflare-shaped artifact, `apps/web/astro.config.cloudflare.mjs`, was
referenced by nothing, left over from a migration someone started and dropped.
Infrastructure that exists only in a vendor's dashboard cannot be reviewed,
reproduced, or reasoned about.

Separately, the `zabaca.com` DNS zone moved to the business Cloudflare account on
2026-07-27. Once the zone was there, the host was the only piece left outside it.

zbc is the declarative deploy path used across Zabaca's repos, and it assumes
bun. That is what couples the two decisions: adopting zbc means adopting bun.

## Decision
1. Convert the workspace from pnpm to **bun**. `bun.lock` is committed.
2. Deploy via **zbc** to a Cloudflare Worker: `apps/web/wrangler.jsonc` holds the
   Worker topology, `packages/infra/environments/production/web.ts` the instance.
   The site is static, so it ships as an assets-only Worker with no script.
3. Secrets live in `packages/infra/environments/<env>/secrets.yaml`, sops-encrypted
   to age recipients in `.sops.yaml`.
4. **DNS is a separate decision.** This ADR moves the build and the host, not the
   records. `www.zabaca.com` stays on Netlify until the CNAME is deliberately
   flipped.

## Rationale
- The deploy becomes a file in the repo instead of a setting in a dashboard, so it
  is reviewable and reproducible.
- One account holds the zone, the Worker, and the rest of Zabaca's infrastructure,
  and one CLI applies all of it.
- Splitting the DNS flip out makes the cutover a one-record change with an instant
  rollback. The zone carries James's primary business email, so a reversible step
  is worth more than a fast one.

## Consequences
### Positive
- Deploys are declarative, versioned, and reviewable.
- Netlify leaves the picture entirely once DNS flips.
- bun aligns this repo with every other Zabaca repo.

### Trade-offs
- **No CI deploy.** Applies run from the operator's machine, which is why
  `.sops.yaml` has a single recipient and no CI key. Adding CI means generating a
  runner key and re-keying the secrets file.
- Cloudflare's trailing-slash canonicalization is a **307** where Netlify sends a
  **301**. URL shape is identical, so no indexed URL changes, but the permanence
  signal is weaker. Revisit if it shows up in Search Console after the cutover.
- bun does not symlink workspace packages nothing depends on, so resolving
  `@zabaca-web/infra` relies on a `paths` entry in the root `tsconfig.json`. See
  WORKSPACE.md.

## Review Criteria
Revisit if the site needs SSR or per-request logic (the assets-only Worker gains a
`main`), if deploys need to run in CI, or if the 307 canonicalization measurably
costs search ranking.
