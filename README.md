## Likitha Sweets Store

Modern, production-ready **Indian Sweets & Snacks Shop** built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

### Tech (implemented)

- Next.js (App Router)
- Tailwind CSS
- TypeScript
- Framer Motion
- Zustand (client cart)
- ShadCN-style UI primitives
- Prisma ORM + PostgreSQL
- NextAuth (Credentials)
- Stripe Checkout + webhook (test mode supported)
- Cloudinary (signed uploads) for product images

Currency is **INR (₹)**; sample data uses local images in `public/products/`.

## Getting Started

### Install

From the project root:

```bash
npm install
```

### Configure env (local)

Create `.env.local` using `.env.example` and set at least:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL=http://localhost:3000`
- `DATABASE_URL` (Postgres)

Optional (for full demo): Stripe + Cloudinary keys.

### Run (dev)

```bash
npm run dev
```

Open `http://localhost:3000`.

## Demo mode (what to show your client)

- **Homepage**: premium Indian mithai/namkeen theme + featured products
- **Products**: search + category filter + animated product cards
- **Product details**: gallery + hover zoom + quantity + add to cart
- **Cart**: quantity controls + subtotal + checkout button
- **Checkout**: Stripe Checkout session creation (test mode)
- **Admin** (`/admin`):
  - Products: create/edit/hide/delete + images (Cloudinary upload or paste URL)
  - Categories: create/edit/delete (delete disabled when category has products)
  - Orders: view list + update status

## Database + seed (for real admin demo)

After setting `DATABASE_URL`:

```bash
npm run db:push
npm run db:seed
```

Seeded admin (unless you override env):

- `ADMIN_EMAIL` (default `admin@likithasweets.com`)
- `ADMIN_PASSWORD` (default `admin123`)

## Stripe webhook (optional but recommended for orders)

For local demo with Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the printed webhook secret into `STRIPE_WEBHOOK_SECRET`.

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

- Sample product images are local SVG placeholders (fast + reliable).
- The UI theme is a warm, premium sweets brand palette defined in `app/globals.css`.

