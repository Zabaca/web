import { cloudflareModule } from '../../modules/cloudflare'

// The zabaca.com company site: a static Astro build shipped as a Cloudflare
// Worker (topology in apps/web/wrangler.jsonc). The module runs the build
// locally, then `wrangler deploy` uploads dist/ plus the small worker script
// that redirects the apex to www.
//
// Same account the zabaca.com DNS zone was migrated onto (2026-07-27), which is
// the point: the site was the last thing left on Netlify.
//
// ⚠️ THIS IS THE LIVE COMPANY SITE. Since the 2026-07-30 cutover, applying this
// instance publishes to www.zabaca.com and zabaca.com, not just to
// zabaca-web.<subdomain>.workers.dev. There is no staging environment in front
// of it. Compare a build on the workers.dev URL first if the change is at all
// visual. Rollback: docs/runbooks/dns-cutover-zabaca.md.
export default cloudflareModule.instance({
  name: 'web',
  config: {
    workdir: 'apps/web',
    accountId: '99a19e584439be0568f33aad0477372b',
    build: {
      command: 'bun run build',
      cwd: '.',
    },
  },
})
