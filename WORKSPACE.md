# Workspace Documentation

The bun workspace layout for the Zabaca Web monorepo, and the two things about
it that are not obvious.

Most of what used to live here was a restatement of the pnpm manual. That is not
worth maintaining: `bun --help` is more current than any copy of it. What follows
is only what is specific to this repo.

## Layout

```
zabaca-web/
├── package.json              # workspaces: ["apps/*", "packages/*"]
├── bun.lock                  # committed
├── tsconfig.json             # root config, plus the paths mapping below
├── zbc.config.ts             # zbc project + environments
├── .sops.yaml                # age recipients for secrets.yaml
├── apps/
│   └── web/                  # the Astro site
│       ├── astro.config.mjs
│       ├── wrangler.jsonc    # Cloudflare Worker topology
│       ├── biome.json
│       ├── src/
│       ├── public/
│       └── dist/             # build output, gitignored
└── packages/
    └── infra/                # zbc modules + environment instances
```

## Everyday commands

```bash
bun install                       # all workspace dependencies
bun run dev                       # dev server on :4321
bun run build                     # astro check && astro build
bun run typecheck
bun run lint                      # biome
bun run --cwd apps/web <script>   # target one package directly
bun add --cwd apps/web react      # add a dependency to one package
```

## Gotcha: bun does not symlink these workspace packages

`node_modules/@zabaca-web/` does not exist. Nothing in the tree declares a
dependency on `@zabaca-web/infra`, so bun records it in `bun.lock` as a workspace
but never links it, and `import { defineConfig } from '@zabaca-web/infra'` in
`zbc.config.ts` fails to resolve on its own.

What makes it work is the mapping in the root `tsconfig.json`, which bun honours
at runtime:

```json
"paths": {
  "@zabaca-web/*": ["./packages/*/src"]
}
```

Note it only covers the bare specifier. A subpath import
(`@zabaca-web/infra/thing`) would mis-resolve to `./packages/infra/thing/src`.
Nothing imports that way today; if something needs to, add an explicit entry
rather than widening the glob.

## Gotcha: `bun run lint` cannot pass, and mutates source when it fails

**There is no clean state to get it into.** On a fresh clone that has never been
built, `bun run lint` exits 1 with 40 errors, and because `lint` is wired to
`biome check --write` it also rewrites 19 files under `apps/web/src` on its way
out. Building first makes it worse rather than better: biome then also walks
`apps/web/dist`, and the count goes to roughly 3,950.

So deleting `dist/` is not a workaround. It only takes you back to the 40.

None of this is new. `apps/web/src` and `apps/web/biome.json` are byte-identical
to `main`, so the same thing happens under pnpm; it is easy to miss only because
nobody runs it. Use `bun run typecheck` as the pre-commit check instead, which is
genuinely clean.

Fixing it is two changes that belong together, and neither belongs in a deploy
commit:

1. **Separate checking from changing.** `lint` should not be `--write`. A command
   that edits your tree when it fails is not a check.
2. **Make the ignores take effect.** `apps/web/biome.json` sets `"root": false`
   while no biome config exists at the repo root. In biome 2.x a nested
   `root: false` config expects a parent to inherit from, and without one,
   `files.includes` and `vcs.useIgnoreFile` in that file do nothing. Both were
   tried here and neither worked; the fix is at the root config, not in that file.

## Adding a package

Create `packages/<name>/` with a `package.json` named `@zabaca-web/<name>` and a
`src/index.ts`, then `bun install`. The tsconfig mapping above already covers it,
so no config change is needed. A package that other packages actually depend on
should be listed in their `dependencies` as `"@zabaca-web/<name>": "workspace:*"`,
which is also what gets it symlinked.

## Deployment

See the Deployment section of [README.md](./README.md). Short version:
`bunx @zabaca/zbc apply production` builds `apps/web/dist` and ships it as a
Cloudflare Worker; www.zabaca.com is still on Netlify until the DNS cutover.
