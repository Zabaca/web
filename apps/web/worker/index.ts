/**
 * The site is static; this Worker exists for exactly one reason, which is to keep
 * the apex redirecting to www the way Netlify did. Everything else is handed
 * straight to the static assets.
 *
 * Why a Worker and not a Cloudflare Redirect Rule, which is the native tool for
 * this: a Redirect Rule lives in the dashboard, and zbc cannot see or reproduce
 * dashboard state. Eight lines in the repo beat a setting nobody can diff.
 *
 * This costs a Worker invocation on every request, because `run_worker_first` is
 * on in wrangler.jsonc. Without it the edge would serve a matching asset before
 * the Worker ever ran, and the apex would serve the site instead of redirecting.
 * The site is low traffic and static, so the invocations are cheap; if that ever
 * stops being true, the fix is a Redirect Rule at the zone plus deleting this
 * file, not a cleverer Worker.
 */

interface Env {
  ASSETS: Fetcher
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
    return env.ASSETS.fetch(request)
  },
}
