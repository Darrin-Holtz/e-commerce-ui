# e-commerce-ui

This repository is a pnpm workspace and Turborepo monorepo.

## Apps

- `client` - storefront app on port `3000`
- `admin` - admin app on port `3001`

## Shared Packages

- `packages/types` - shared application types and form schemas
- `packages/ui` - shared React UI primitives for future cross-app reuse

## Commands

Run everything from the repository root.

```bash
pnpm install
pnpm dev
pnpm dev:client
pnpm dev:admin
pnpm lint
pnpm build
```

## Goal

The goal is one monorepo with:

- one root lockfile: `pnpm-lock.yaml`
- one workspace definition: `pnpm-workspace.yaml`
- one Turbo pipeline: `turbo.json`
- multiple apps and shared packages managed together

It is normal for workspace packages to still have local config files like `package.json`, `tsconfig.json`, and `next.config.ts`.
It is also normal for pnpm to create package-level `node_modules` links, but dependency management is centralized at the workspace root.