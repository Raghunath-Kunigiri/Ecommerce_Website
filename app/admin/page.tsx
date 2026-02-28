import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Admin",
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-8">
        <h1 className="text-3xl font-semibold tracking-tight">Admin dashboard</h1>
        <p className="mt-2 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
          NextAuth (role-protected admin access) + Prisma product management will
          be wired next.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/products">View store</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

