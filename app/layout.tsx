import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Providers } from "@/components/providers";

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
    default: "Likitha Sweets — Premium Sweets & Snacks",
    template: "%s • Likitha Sweets",
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
    <html lang="en" className="h-full scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} min-h-full bg-[color:var(--bg)] text-[color:var(--fg)] antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
