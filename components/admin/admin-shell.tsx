"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, Tags, ReceiptText } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutGrid },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ReceiptText },
];

export function AdminShell({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr]">
      <aside className="h-fit rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-3">
        <div className="px-3 py-3 text-sm font-semibold">Admin</div>
        <nav className="space-y-1">
          {items.map((it) => {
            const active =
              it.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-[color:var(--muted)] transition-colors hover:bg-[color:var(--surface-2)] hover:text-[color:var(--fg)]",
                  active &&
                    "bg-[color:var(--brand-soft)] text-[color:var(--brand-strong)]",
                )}
              >
                <it.icon className="size-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <section className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-sm text-[color:var(--muted)] sm:text-base">
              {description}
            </p>
          ) : null}
        </header>
        {children}
      </section>
    </div>
  );
}

