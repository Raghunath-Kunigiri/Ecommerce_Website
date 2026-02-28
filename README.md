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

