import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--bg)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative size-10 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)]">
              <Image
                src="/Items_Images/Logo2.jpeg"
                alt="Balaji Snacks"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="text-sm font-semibold tracking-tight">Balaji Snacks</div>
          </div>
          <p className="text-sm text-[color:var(--muted)]">
            A premium sweets & snacks store crafted for celebrations, gifting,
            and everyday cravings.
          </p>
        </div>
        <div className="space-y-3">
          <div className="text-sm font-semibold tracking-tight">Explore</div>
          <ul className="space-y-2 text-sm text-[color:var(--muted)]">
            <li>
              <Link className="hover:text-[color:var(--fg)]" href="/products">
                Products
              </Link>
            </li>
            <li>
              <Link className="hover:text-[color:var(--fg)]" href="/cart">
                Cart
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <div className="text-sm font-semibold tracking-tight">Contact</div>
          <ul className="space-y-2 text-sm text-[color:var(--muted)]">
            <li>support@likithasweets.com</li>
            <li>Mon–Sat • 10am–8pm</li>
            <li>Fast delivery • Secure payments</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[color:var(--border)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-[color:var(--muted)] sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Balaji Sweets. All rights reserved.</p>
          <p className="opacity-90">Fast delivery • Secure payments</p>
        </div>
      </div>
    </footer>
  );
}

