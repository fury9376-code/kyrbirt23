# KYRBIRT
Argentine streetwear brand store with exclusive drop-based product releases, WhatsApp order flow, and a full admin CMS.

## Run & Operate
- **Frontend dev**: `pnpm --filter @workspace/kyrbirt run dev`
- **API dev**: `pnpm --filter @workspace/api-server run dev`
- **DB push**: `cd lib/db && pnpm run push`
- **Required env vars**: `DATABASE_URL`, `GMAIL_USER`, `GMAIL_APP_PASSWORD` (optional: `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`)
- **Admin password**: stored as `ADMIN_PASSWORD` Replit Secret — never in source code

## Stack
- **Frontend**: React 19, Vite 7, Wouter, TanStack Query, Framer Motion, shadcn/ui, Tailwind v4, Embla Carousel
- **Backend**: Express 5, Pino logger, Nodemailer, node-fetch
- **DB**: Drizzle ORM + PostgreSQL (`@workspace/db` at `lib/db/`)
- **Runtime**: Node 20, pnpm workspaces

## Where things live
- `artifacts/kyrbirt/src/` — React frontend
  - `pages/` — `home.tsx`, `drops.tsx`, `admin.tsx`, `not-found.tsx`
  - `components/` — navbar, hero, drops, store, fam, footer, product-modal, purchase-form
  - `hooks/` — `use-site-settings.ts`, `use-site-products.ts`, `use-drops.ts`
  - `data/products.ts` — static fallback products + `Colorway` type
- `artifacts/api-server/src/routes/` — health, maintenance, orders, settings, products
- `lib/db/src/schema/` — `orders.ts`, `products.ts`, `settings.ts`

## Architecture decisions
- Products are **DB-first** via `siteProductsTable`; admin auto-seeds from `data/products.ts` if the DB is empty
- Site settings (drop timer, footer, FAM photos, size guide) are stored as key/value rows in `siteSettingsTable`; defaults are hardcoded in `use-site-settings.ts`
- All admin API routes require `x-admin-password` header matching `process.env.ADMIN_PASSWORD`
- WhatsApp Meta API integration is **optional** — silently skipped if env vars absent
- Orders are saved to DB first, then email + WA fire async (failure doesn't block the user)
- Locked products (drop-gated) are revealed when the countdown reaches zero

## Product
- Hero with live drop countdown timer
- Full store with category/subcategory filtering, colorway + size selection, per-colorway sold-out logic
- FAM gallery (lightbox, CMS-managed)
- WhatsApp + email order flow with success confirmation
- Maintenance mode toggle
- 8-tab admin CMS: Órdenes, Productos, Drop/Timer, FAM, Contacto, Guía Talles, Mantenimiento, Pie de Página

## User preferences
- Font: FranklinGothic (body/display), Neutro/Bebas Neue (hero titles)
- Color scheme: dark, near-black background (#050505), white text
- GIF logo at `/public/logo.gif` displayed in navbar
- All prices in Argentine pesos (`$XX.XXX`)
- Sizes use Argentine conventions (1, 2 / S, M, L / XS–XL)

## Gotchas
- After any DB schema change, run `cd lib/db && pnpm run push` then restart the API server
- The migration backup workflows in `.migration-backup/` always fail (no node_modules) — ignore them
- `logo.gif` must be in `artifacts/kyrbirt/public/` for the navbar to show it
- `use-site-settings.ts` has hardcoded defaults — settings only take effect once they exist in the DB (seeded via admin or direct INSERT)

## Pointers
- Drizzle schema: `lib/db/src/schema/`
- shadcn/ui config: `artifacts/kyrbirt/src/components/ui/`
- Tailwind config: `artifacts/kyrbirt/src/index.css`
