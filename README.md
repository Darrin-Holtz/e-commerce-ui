# e-commerce-ui

This repository is a pnpm workspace and Turborepo monorepo.

## Apps

- `apps/client` - storefront app on port `3000`
- `apps/admin` - admin app on port `3001`
- `apps/auth-service` - authentication service
- `apps/order-service` - order service on port `8001`
- `apps/payment-service` - payment service on port `8002`
- `apps/email-service` - email service

## Shared Packages

- `packages/types` - shared application types and form schemas
- `packages/ui` - shared React UI primitives for future cross-app reuse
- `packages/kafka` - shared Kafka client, producer, and consumer
- `packages/order-db` - Mongoose models and MongoDB connection for orders
- `packages/product-db` - Prisma client and schema for products (Postgres)

---

## Starting the Application

Follow these steps **in order** every time you start the project (especially after a Codespace restart).

### Step 1 — Start Docker services

```bash
# Postgres (product database)
cd packages/product-db
docker compose up -d

# Kafka (3-broker cluster + Kafka UI)
cd packages/kafka
docker compose up -d
```

### Step 2 — Install dependencies (first time only)

```bash
cd /workspaces/e-commerce-ui
pnpm install
```

### Step 3 — Run database migrations (first time or after schema changes)

```bash
cd packages/product-db
pnpm db:migrate
```

### Step 4 — Start the Stripe webhook listener

> **Important:** Always forward to `localhost`, not the public Codespace URL.
> Forwarding through the Codespace HTTPS proxy modifies the request body and breaks Stripe's signature verification.

```bash
stripe listen --forward-to http://localhost:8002/webhooks/stripe
```

The CLI will print a signing secret like:
```
Your webhook signing secret is whsec_xxxx
```

If this secret differs from `STRIPE_WEBHOOK_SECRET` in `apps/payment-service/.env`, update it:

```bash
# Replace with the value printed by stripe listen
sed -i 's|STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE|' apps/payment-service/.env
```

> The secret stays the same as long as you don't reinstall the Stripe CLI or reset your account. It only changes if `stripe listen` is run fresh against a different account.

### Step 5 — Start all apps

```bash
cd /workspaces/e-commerce-ui
pnpm dev
```

### Step 6 — Make service ports public (Codespaces only)

In the **Ports** panel, right-click each port and set visibility to **Public**:

| Port | Service |
|------|---------|
| 3000 | client (storefront) |
| 3001 | admin |
| 8001 | order-service |
| 8002 | payment-service |

---

## Payment Flow

A successful end-to-end payment follows this path:

```
Stripe Checkout
  → POST /webhooks/stripe (payment-service)
  → Kafka: payment.successful
  → order-service: saves order to MongoDB
  → Kafka: order.created
  → email-service: sends confirmation email
```

---

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