"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";
import { useCartPopup } from "@/components/cart/cart-popup-context";

const navItems = [
  { href: "/menu", label: "Menu" },
  { href: "/products", label: "Products" },
  { href: "/#featured", label: "Featured" },
  { href: "/#about", label: "About" },
];

const SCROLL_THRESHOLD = 60;

export function Navbar() {
  const pathname = usePathname();
  const cartCount = useCart((s) => s.count());
  const hasHydrated = useCart((s) => s.hasHydrated);
  const openCartPopup = useCartPopup().openPopup;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY.current && y > SCROLL_THRESHOLD) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{ y: navVisible ? 0 : -120 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="fixed left-4 right-4 top-4 z-50 md:left-6 md:right-6 md:top-5"
    >
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg)]/95 shadow-lg backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6 md:h-16">
        <Link
          href="/"
          className="group inline-flex items-center gap-2"
          onClick={() => setMobileOpen(false)}
        >
          <div className="relative size-10 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)]">
            <Image
              src="/Items_Images/Logo2.jpeg"
              alt="Balaji Snacks"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-[color:var(--fg)]">
              Balaji Snacks
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
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="sm:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </Button>

          <Button asChild variant="secondary" className="hidden sm:inline-flex">
            <Link href="/products">Shop now</Link>
          </Button>

          <ThemeToggle />

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Cart"
            onClick={openCartPopup}
            className="relative"
          >
            <ShoppingBag />
            {hasHydrated && cartCount > 0 ? (
              <span className="absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full bg-[color:var(--brand)] px-1.5 text-[10px] font-semibold leading-5 text-white">
                {cartCount}
              </span>
            ) : null}
          </Button>
        </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40 cursor-default bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              className="fixed left-4 right-4 top-20 z-50 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] shadow-lg"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative size-9 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)]">
                    <Image
                      src="/Items_Images/Logo2.jpeg"
                      alt="Balaji Snacks"
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="text-sm font-semibold tracking-tight text-[color:var(--fg)]">
                    Balaji Snacks
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <X />
                </Button>
              </div>

              <div className="space-y-1 p-2">
                {navItems.map((item) => {
                  const active =
                    item.href === "/products"
                      ? pathname?.startsWith("/products")
                      : pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                        onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-[color:var(--fg)]",
                        active
                          ? "bg-[color:var(--surface-2)]"
                          : "hover:bg-[color:var(--surface-2)]",
                      )}
                    >
                      <span>{item.label}</span>
                      <span className="text-xs text-[color:var(--muted)]">→</span>
                    </Link>
                  );
                })}
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-[color:var(--fg)] hover:bg-[color:var(--surface-2)]"
                >
                  <span>Cart</span>
                  {hasHydrated && cartCount > 0 ? (
                    <span className="rounded-full bg-[color:var(--brand)] px-2 py-1 text-[10px] font-semibold text-white">
                      {cartCount}
                    </span>
                  ) : (
                    <span className="text-xs text-[color:var(--muted)]">→</span>
                  )}
                </Link>
              </div>

              <div className="border-t border-[color:var(--border)] p-4">
                <Button asChild className="w-full">
                  <Link href="/products" onClick={() => setMobileOpen(false)}>
                    Shop now
                  </Link>
                </Button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}

