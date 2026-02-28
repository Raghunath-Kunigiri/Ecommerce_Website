import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AdminRequiresDb() {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-8">
      <div className="text-lg font-semibold">Admin temporarily unavailable</div>
      <p className="mt-2 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
        Please try again later or contact support.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/login">Go to login</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">View storefront</Link>
        </Button>
      </div>
    </div>
  );
}

