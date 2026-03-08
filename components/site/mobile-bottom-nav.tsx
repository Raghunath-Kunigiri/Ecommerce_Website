"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MenuSquare, ShoppingBag, Package } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";
import { useCartPopup } from "@/components/cart/cart-popup-context";

const linkItems = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/menu", label: "Menu", Icon: MenuSquare },
  { href: "/track", label: "Track", Icon: Package },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname() ?? "/";
  const cartCount = useCart((s) => s.count());
  const hasHydrated = useCart((s) => s.hasHydrated);
  const openCartPopup = useCartPopup().openPopup;

  // Hide on admin + demo routes (these have their own UX)
  if (pathname.startsWith("/admin") || pathname.startsWith("/demo")) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[color:var(--border)] bg-[color:var(--bg)] px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 md:hidden"
      aria-label="Main"
    >
      <div className="grid grid-cols-4 gap-1">
          {linkItems.map(({ href, label, Icon }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-2 text-[10px] font-semibold uppercase tracking-wider touch-manipulation",
                  active
                    ? "text-[color:var(--brand)]"
                    : "text-[color:var(--muted)]",
                )}
              >
                <Icon className="size-5 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={openCartPopup}
            className="relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-2 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--muted)] touch-manipulation hover:text-[color:var(--fg)]"
            aria-label={`Cart${hasHydrated && cartCount > 0 ? `, ${cartCount} items` : ""}`}
          >
            <span className="relative">
              <ShoppingBag className="size-5 shrink-0" />
              {hasHydrated && cartCount > 0 ? (
                <span className="absolute -right-2 -top-2 grid min-w-4 place-items-center rounded-full bg-[color:var(--brand)] px-1 text-[10px] font-bold leading-4 text-white">
                  {cartCount}
                </span>
              ) : null}
            </span>
            <span>Cart</span>
          </button>
        </div>
    </nav>
  );
}

