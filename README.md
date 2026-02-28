## Likitha Sweets Store

Modern, production-ready **Sweets & Snacks Shop** built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

### Tech (current)

- Next.js (App Router)
- Tailwind CSS
- TypeScript
- Framer Motion
- Zustand (client cart)
- ShadCN-style UI primitives (Button/Badge)

Planned next (will be added step-by-step): Prisma + PostgreSQL, NextAuth, Cloudinary, Stripe, admin dashboard CRUD.

## Getting Started

### Install

From the project root:

```bash
npm install
```

### Run (dev)

```bash
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

### 1) Import the repo

Import the GitHub repo in Vercel and set the **Root Directory** to:

- `likitha-sweets-store`

### 2) Configure Environment Variables (Vercel → Project → Settings → Environment Variables)

Required for full functionality:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (set to your Vercel URL, e.g. `https://your-app.vercel.app`)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

You can copy the keys from `.env.example`.

### 3) Build command (Prisma + Next)

This project includes a Vercel build script:

- `vercel-build` → runs Prisma generate, then **migrate deploy** (if migrations exist) or **db push** (if not), then `next build`.

Vercel will automatically run `npm run vercel-build` when that script exists.

### 4) Database schema

For production, the recommended flow is:

- Run `npm run db:migrate` locally once (with your Postgres URL)
- Commit `prisma/migrations/`
- Deploy

### Project structure

```
app/
  page.tsx
  products/
  cart/
  checkout/
  admin/
components/
  home/
  products/
  cart/
  site/
  ui/
lib/
  store/
  sample-data.ts
  types.ts
  utils.ts
prisma/        (coming next)
public/
styles/        (reserved)
```

### Notes

- Remote images are allowed from Unsplash (sample data) and Cloudinary (when enabled).
- The UI theme is a warm, premium sweets brand palette defined in `app/globals.css`.

## Next steps

- Add Prisma schema + PostgreSQL + seed script
- Add NextAuth authentication + admin role protection
- Add Cloudinary image uploads for products
- Add Stripe checkout flow + order success page
- Build full admin CRUD for products/categories/orders

