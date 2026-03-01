import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AdminRequiresDb() {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-8">
      <div className="text-lg font-semibold">Admin is in demo mode</div>
      <p className="mt-2 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
        Database is not connected yet. You can preview the catalog, but creating/editing products,
        categories, and orders requires Postgres.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline">
          <Link href="/products">View storefront</Link>
        </Button>
        <Button asChild>
          <Link href="/admin">Back to overview</Link>
        </Button>
      </div>
    </div>
  );
}

