import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Providers } from "@/components/providers";
import { MobileBottomNav } from "@/components/site/mobile-bottom-nav";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { getBaseUrl, siteName, siteTagline, defaultDescription, defaultKeywords } from "@/lib/seo";

const fontSans = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const fontDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

const baseUrl = getBaseUrl();

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#b45309",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteName} — ${siteTagline}`,
    template: `%s • ${siteName}`,
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  authors: [{ name: siteName }],
  creator: siteName,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName,
    title: `${siteName} — ${siteTagline}`,
    description: defaultDescription,
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — ${siteTagline}`,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: baseUrl },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    description: defaultDescription,
    url: baseUrl,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    description: defaultDescription,
    url: baseUrl,
    publisher: { "@type": "Organization", name: siteName },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${baseUrl}/products?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      className="h-full scroll-smooth"
      data-scroll-behavior="smooth"
      data-theme="light"
      suppressHydrationWarning
    >
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} min-h-full bg-[color:var(--bg)] text-[color:var(--fg)] antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <Providers>
          <div className="min-h-screen w-full bg-[color:var(--bg)]">
            <Navbar />
            <main className="min-h-screen pt-20 pb-28 md:pt-24 md:pb-0">
              {children}
            </main>
            <div className="hidden md:block">
              <Footer />
            </div>
          </div>
          <MobileBottomNav />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  );
}
