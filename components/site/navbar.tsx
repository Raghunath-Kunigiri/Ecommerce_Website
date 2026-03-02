"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, LogIn, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";

const navItems = [
  { href: "/menu", label: "Menu" },
  { href: "/products", label: "Products" },
  { href: "/#featured", label: "Featured" },
  { href: "/#about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const cartCount = useCart((s) => s.count());
  const hasHydrated = useCart((s) => s.hasHydrated);
  const { data } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--bg)]/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group inline-flex items-center gap-2">
          <div className="relative grid size-9 place-items-center rounded-2xl bg-[color:var(--brand-soft)]">
            <div className="size-2.5 rounded-full bg-[color:var(--brand)]" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-[color:var(--border)]" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-[color:var(--fg)]">
              Balaji Sweets
            </div>
            <div className="text-xs text-[color:var(--muted)]">
              Premium sweets & snacks
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/products"
                ? pathname?.startsWith("/products")
                : false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--fg)]",
                  active && "text-[color:var(--fg)]",
                )}
              >
                {item.label}
                {active ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-[color:var(--brand)]"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" className="hidden sm:inline-flex">
            <Link href="/products">Shop now</Link>
          </Button>

          <ThemeToggle />

          {data?.user ? (
            <Button
              type="button"
              variant="ghost"
              className="hidden sm:inline-flex"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut />
              Sign out
            </Button>
          ) : (
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/login" className="gap-2">
                <LogIn />
                Sign in
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" size="icon" aria-label="Cart">
            <Link href="/cart" className="relative">
              <ShoppingBag />
              {hasHydrated && cartCount > 0 ? (
                <span className="absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full bg-[color:var(--brand)] px-1.5 text-[10px] font-semibold leading-5 text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

