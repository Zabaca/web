# Workspace Documentation

This document provides detailed information about the pnpm workspace setup and development workflows for the Zabaca Web monorepo.

## 📋 Table of Contents

- [Workspace Overview](#workspace-overview)
- [Project Structure](#project-structure)
- [Package Management](#package-management)
- [Development Workflows](#development-workflows)
- [Adding New Packages](#adding-new-packages)
- [Troubleshooting](#troubleshooting)

## 🏗️ Workspace Overview

This monorepo uses [pnpm workspaces](https://pnpm.io/workspaces) to manage multiple packages efficiently. The workspace configuration allows for:

- **Shared Dependencies**: Common packages are hoisted to the root
- **Cross-Package Dependencies**: Packages can depend on each other
- **Unified Tooling**: Consistent linting, formatting, and build processes
- **Efficient Storage**: pnpm's content-addressable storage reduces disk usage

## 📁 Project Structure

```
zabaca-web/
├── package.json              # Root workspace configuration
├── pnpm-workspace.yaml      # Workspace packages definition
├── tsconfig.json            # Root TypeScript configuration
├── .gitignore               # Monorepo gitignore rules
├── README.md                # Main project documentation
├── WORKSPACE.md             # This file
├── apps/                    # Applications
│   └── web/                 # Main Astro website
│       ├── package.json     # App-specific dependencies
│       ├── tsconfig.json    # Extends root config
│       ├── astro.config.mjs # Astro configuration
│       ├── tailwind.config.mjs
│       ├── biome.json       # Code quality configuration
│       ├── src/             # Source code
│       ├── public/          # Static assets
│       └── dist/            # Build output (ignored)
└── packages/                # Shared packages (future)
```

## 📦 Package Management

### Workspace Configuration

The workspace is defined in `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Dependencies

- **Root Dependencies**: Shared development tools (TypeScript, etc.)
- **App Dependencies**: App-specific packages in `apps/web/package.json`
- **Package Dependencies**: Future shared packages in `packages/*/package.json`

### Installing Dependencies

```bash
# Install all workspace dependencies
pnpm install

# Add dependency to specific package
pnpm --filter web add react
pnpm --filter web add -D @types/react

# Add dependency to workspace root
pnpm add -w typescript

# Add dependency to all packages
pnpm add lodash --filter="./packages/*"
```

### Dependency Management Best Practices

1. **Shared Tools**: Install build tools, linters, and formatters at the root
2. **App-Specific**: Keep app dependencies in their respective package.json
3. **Version Consistency**: Use the same version of shared dependencies
4. **Peer Dependencies**: Be mindful of peer dependency requirements

## 🔧 Development Workflows

### Starting Development

```bash
# Start development server for web app
pnpm dev

# Or target specific app
pnpm --filter web dev
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter web build
```

### Code Quality

```bash
# Run TypeScript checks across workspace
pnpm typecheck

# Lint and format code
pnpm lint
pnpm format

# Target specific package
pnpm --filter web lint
```

### Cleaning

```bash
# Clean all build artifacts and node_modules
pnpm clean

# Clean specific package
pnpm --filter web clean
```

### Running Scripts

All scripts defined in the root `package.json` are workspace-aware:

```json
{
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm --filter web build",
    "typecheck": "pnpm --filter web typecheck",
    "lint": "pnpm --filter web lint"
  }
}
```

## ➕ Adding New Packages

### Creating a New App

1. **Create directory structure**:
   ```bash
   mkdir apps/new-app
   cd apps/new-app
   ```

2. **Initialize package.json**:
   ```json
   {
     "name": "@zabaca/new-app",
     "version": "1.0.0",
     "private": true,
     "scripts": {
       "dev": "...",
       "build": "..."
     }
   }
   ```

3. **Update root scripts** (if needed):
   ```json
   {
     "scripts": {
       "dev:new-app": "pnpm --filter new-app dev"
     }
   }
   ```

### Creating a Shared Package

1. **Create directory structure**:
   ```bash
   mkdir packages/shared-utils
   cd packages/shared-utils
   ```

2. **Initialize package.json**:
   ```json
   {
     "name": "@zabaca/shared-utils",
     "version": "1.0.0",
     "main": "dist/index.js",
     "types": "dist/index.d.ts",
     "scripts": {
       "build": "tsc",
       "dev": "tsc --watch"
     }
   }
   ```

3. **Add TypeScript configuration**:
   ```json
   {
     "extends": "../../tsconfig.json",
     "compilerOptions": {
       "outDir": "dist",
       "declaration": true
     },
     "include": ["src/**/*"]
   }
   ```

4. **Use in other packages**:
   ```bash
   pnpm --filter web add @zabaca/shared-utils
   ```

## 🔍 Troubleshooting

### Common Issues

1. **Dependency Resolution Issues**
   ```bash
   # Clear node_modules and reinstall
   pnpm clean
   pnpm install
   ```

2. **TypeScript Errors**
   ```bash
   # Check TypeScript configuration
   pnpm typecheck
   
   # Rebuild TypeScript references
   pnpm --filter "*" run build
   ```

3. **Workspace Detection Issues**
   ```bash
   # Verify workspace configuration
   pnpm list --depth=0
   
   # Check workspace packages
   pnpm -r list
   ```

4. **Build Issues**
   ```bash
   # Clean and rebuild everything
   pnpm clean
   pnpm install
   pnpm build
   ```

### Debugging Commands

```bash
# List all workspace packages
pnpm list --depth=0

# Show dependency tree
pnpm list --depth=2

# Check outdated dependencies
pnpm outdated

# Verify workspace setup
pnpm why <package-name>

# Run command in all packages
pnpm -r exec <command>
```

### Performance Tips

1. **Use Filters**: Target specific packages to speed up operations
2. **Parallel Execution**: pnpm runs compatible scripts in parallel
3. **Caching**: pnpm caches dependencies and build outputs
4. **Selective Install**: Use `--filter` to install dependencies for specific packages

## 📚 References

- [pnpm Workspaces Documentation](https://pnpm.io/workspaces)
- [pnpm CLI Reference](https://pnpm.io/cli/add)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Monorepo Best Practices](https://monorepo.tools/)

---

**Need Help?** Check the main [README.md](./README.md) or create an issue in the repository.