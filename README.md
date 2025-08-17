# Zabaca Web

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Zabaca/web)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)](https://www.typescriptlang.org/)
[![Astro](https://img.shields.io/badge/Astro-5.13.2-purple)](https://astro.build/)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-orange)](https://pnpm.io/)

The official Zabaca company website built with modern web technologies and a monorepo architecture for scalability and maintainability.

## 🚀 Tech Stack

- **Frontend Framework**: [Astro](https://astro.build/) - Static site generator with React components
- **UI Components**: [React 19](https://react.dev/) with TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom components
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Package Manager**: [pnpm](https://pnpm.io/) with workspace support
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
├── pnpm-workspace.yaml     # pnpm workspace configuration
├── tsconfig.json           # Root TypeScript config
└── package.json            # Root workspace package.json
```

## 🛠️ Development

### Prerequisites

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zabaca/web.git
   cd web
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```
   
   The site will be available at `http://localhost:4321/`

### Available Scripts

Run these commands from the workspace root:

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm typecheck        # Run TypeScript checks
pnpm lint             # Run linting and fixes
pnpm format           # Format code
pnpm format:check     # Check code formatting

# Maintenance
pnpm clean            # Clean build artifacts and dependencies
pnpm install:all      # Reinstall all dependencies
```

### Workspace Commands

You can also target specific apps directly:

```bash
# Target the web app specifically
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web typecheck
```

## 🏗️ Building for Production

```bash
# Build the website
pnpm build

# Preview the built site locally
pnpm preview
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

This project uses pnpm workspaces for monorepo management:

- **Root**: Workspace configuration and shared tooling
- **apps/web**: Main Astro website application
- **packages/**: Shared packages and utilities (future)

### Benefits

- **Dependency Management**: Shared dependencies across packages
- **Type Safety**: Cross-package TypeScript support
- **Consistent Tooling**: Unified linting, formatting, and build processes
- **Scalability**: Easy to add new apps and shared packages

## 🚀 Deployment

The website is deployed automatically on pushes to the main branch. The build process:

1. Installs dependencies with pnpm
2. Runs TypeScript checks
3. Builds the Astro site
4. Deploys static files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure all checks pass (`pnpm typecheck && pnpm lint`)
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