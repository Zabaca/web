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

## Gotcha: `bun run lint` fails after a build

Biome walks `apps/web/dist`, so once you have built, `bun run lint` reports a few
thousand errors in minified build output and exits non-zero. Delete `dist/` and it
passes. This predates the bun conversion: the same thing happens on `main` with
pnpm, it is just easy to miss because a fresh clone has no `dist` to walk.

Worse, `lint` is wired to `biome check --write`, so a failing run also rewrites
source files as a side effect. Two things need fixing together: an ignore for
`dist` that biome actually honours (`files.includes` and `vcs.useIgnoreFile` were
both tried and neither took effect from the nested `"root": false` config), and
splitting the mutating fix step out of `lint` so checking is not the same verb as
changing. Not attempted here because it is unrelated to the deploy work.

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
