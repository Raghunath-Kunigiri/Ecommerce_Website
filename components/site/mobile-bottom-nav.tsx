"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MenuSquare, ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";

const items = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/menu", label: "Menu", Icon: MenuSquare },
  { href: "/cart", label: "Cart", Icon: ShoppingBag },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname() ?? "/";
  const cartCount = useCart((s) => s.count());
  const hasHydrated = useCart((s) => s.hasHydrated);

  // Hide on admin + auth + demo routes (these have their own UX)
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/demo")
  ) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-auto w-full max-w-[430px] border-t border-[color:var(--border)] bg-[color:var(--bg)]/95 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
        <div className="grid grid-cols-3 gap-1">
          {items.map(({ href, label, Icon }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold uppercase tracking-wider",
                  active
                    ? "text-[color:var(--brand)]"
                    : "text-[color:var(--muted)]",
                )}
              >
                <span className="relative">
                  <Icon className="size-5" />
                  {href === "/cart" && hasHydrated && cartCount > 0 ? (
                    <span className="absolute -right-2 -top-2 grid min-w-4 place-items-center rounded-full bg-[color:var(--brand)] px-1 text-[10px] font-bold leading-4 text-white">
                      {cartCount}
                    </span>
                  ) : null}
                </span>
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

