import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Providers } from "@/components/providers";
import { MobileBottomNav } from "@/components/site/mobile-bottom-nav";

const fontSans = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const fontDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Balaji Sweets — Premium Sweets & Snacks",
    template: "%s • Balaji Sweets",
  },
  description:
    "A modern premium sweets & snacks ecommerce store with fast delivery, secure payments, and handcrafted favorites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth"
      data-scroll-behavior="smooth"
      data-theme="light"
    >
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} min-h-full bg-[color:var(--bg)] text-[color:var(--fg)] antialiased`}
      >
        <Providers>
          <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[color:var(--bg)] shadow-2xl md:max-w-none md:overflow-visible md:bg-transparent md:shadow-none">
            <Navbar />
            <main className="min-h-[calc(100vh-4rem)] pb-28 md:pb-0">
              {children}
            </main>
            <div className="hidden md:block">
              <Footer />
            </div>
          </div>
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
