import { cloudflareModule } from '../../modules/cloudflare'

// The zabaca.com company site: a static Astro build shipped as an assets-only
// Cloudflare Worker (topology in apps/web/wrangler.jsonc). The module runs the
// build locally, then `wrangler deploy` uploads dist/.
//
// Same account the zabaca.com DNS zone was migrated onto (2026-07-27), which is
// the point: the site was the last thing left on Netlify.
//
// This deploys to zabaca-web.<subdomain>.workers.dev only. www.zabaca.com is
// still Netlify until the DNS records are flipped deliberately.
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
