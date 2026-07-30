# Zabaca Web

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Zabaca/web)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)](https://www.typescriptlang.org/)
[![Astro](https://img.shields.io/badge/Astro-5.13.2-purple)](https://astro.build/)
[![bun](https://img.shields.io/badge/bun-workspace-black)](https://bun.sh/)

The official Zabaca company website built with modern web technologies and a monorepo architecture for scalability and maintainability.

## 🚀 Tech Stack

- **Frontend Framework**: [Astro](https://astro.build/) - Static site generator with React components
- **UI Components**: [React 19](https://react.dev/) with TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom components
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Package Manager**: [bun](https://bun.sh/) with workspace support
- **TypeScript**: Full type safety across the monorepo
- **Code Quality**: [Biome](https://biomejs.dev/) for linting and formatting

## 📁 Project Structure

```
zabaca-web/
├── apps/
│   └── web/                 # Main Astro website
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── pages/       # Astro pages
│       │   ├── layouts/     # Page layouts
│       │   └── styles/      # Global styles
│       ├── public/          # Static assets
│       └── package.json
├── packages/                # Shared packages (future)
├── packages/infra/          # zbc deploy config (Cloudflare Worker)
├── zbc.config.ts           # zbc project + environments
├── tsconfig.json           # Root TypeScript config
└── package.json            # Root workspace package.json
```

## 🛠️ Development

### Prerequisites

- **bun**: >= 1.2.0

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zabaca/web.git
   cd web
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start development server**
   ```bash
   bun run dev
   ```
   
   The site will be available at `http://localhost:4321/`

### Available Scripts

Run these commands from the workspace root:

```bash
# Development
bun run dev              # Start development server
bun run build            # Build for production
bun run preview          # Preview production build

# Code Quality
bun run typecheck        # Run TypeScript checks
bun run lint             # Run linting and fixes
bun run format           # Format code
bun run format:check     # Check code formatting

# Maintenance
bun run clean            # Clean build artifacts and dependencies
```

### Workspace Commands

You can also target specific apps directly:

```bash
# Target the web app specifically
bun run --cwd apps/web dev
bun run --cwd apps/web build
bun run --cwd apps/web typecheck
```

## 🏗️ Building for Production

```bash
# Build the website
bun run build

# Preview the built site locally
bun run preview
```

The built site will be output to `apps/web/dist/` as static files ready for deployment.

## 🧪 Code Quality

This project uses strict TypeScript and code quality tools:

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **Biome**: Fast linter and formatter for consistent code style
- **Astro Check**: Built-in TypeScript and content validation

All code is automatically checked for:
- Type safety
- Code formatting
- Lint rules
- Build validation

## 📦 Monorepo Architecture

This project uses bun workspaces for monorepo management:

- **Root**: Workspace configuration and shared tooling
- **apps/web**: Main Astro website application
- **packages/**: Shared packages and utilities (future)

### Benefits

- **Dependency Management**: Shared dependencies across packages
- **Type Safety**: Cross-package TypeScript support
- **Consistent Tooling**: Unified linting, formatting, and build processes
- **Scalability**: Easy to add new apps and shared packages

## 🚀 Deployment

Deploys go through [zbc](https://www.npmjs.com/package/@zabaca/zbc), which builds
`apps/web/dist` locally and ships it as an assets-only Cloudflare Worker. The
topology lives in `apps/web/wrangler.jsonc`, the instance in
`packages/infra/environments/production/web.ts`.

```bash
bunx @zabaca/zbc apply production
```

It lands on `zabaca-web.james-99a.workers.dev`.

**www.zabaca.com is still served by Netlify** (a dashboard git integration that
predates this setup and is described nowhere in this repo). The DNS cutover is a
deliberate separate step: point the `www` CNAME and the apex at the Worker, and
roll back by putting the Netlify records back. Until then the Worker is a
staging copy to compare against the live site.

There is no CI deploy. Applies run from the operator's machine, which is why
`.sops.yaml` has one recipient and no CI key.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure `bun run typecheck` and `bun run build` pass. Do **not** use
   `bun run lint` as a gate: it cannot currently pass, and it edits your source
   files when it fails. See the gotcha in [WORKSPACE.md](./WORKSPACE.md).
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style (enforced by Biome)
- Add types for all props and function parameters
- Test your changes locally before submitting
- Keep components small and focused

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [zabaca.com](https://zabaca.com)
- **Repository**: [github.com/Zabaca/web](https://github.com/Zabaca/web)
- **Astro Documentation**: [docs.astro.build](https://docs.astro.build)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

---

Built with ❤️ by the Zabaca team