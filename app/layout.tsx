import { Mulish, Geist_Mono, Sora } from "next/font/google"
import type { Metadata, Viewport } from "next"
import Script from "next/script"

import "./globals.css"
import "react-toastify/dist/ReactToastify.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ToastContainer } from "react-toastify"
import { OrganizationJsonLd } from "@/components/json-ld"
import { developer, developerAttributionGraph } from "@/lib/developer-attribution"

const SITE_URL = "https://walkthroughnepal.com"

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://walkthroughnepal.com"),
  title: {
    template: "%s | Walk Through Nepal",
    default: "Walk Through Nepal — Authentic Himalayan Adventures",
  },
  description:
    "Discover authentic treks, cultural journeys, wildlife adventures and local experiences across the Himalayas with Walk Through Nepal. 20+ years of local expertise.",
  keywords: [
    "Nepal trekking",
    "Himalayan adventure",
    "Nepal travel agency",
    "trekking in Nepal",
    "Nepal tour packages",
    "Everest Base Camp trek",
    "Annapurna Circuit",
    "Nepal hiking",
    "adventure travel Nepal",
    "Nepal cultural tours",
    "wildlife safari Nepal",
    "Pokhara trekking",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://walkthroughnepal.com",
    siteName: "Walk Through Nepal",
    title: "Walk Through Nepal — Authentic Himalayan Adventures",
    description:
      "Discover authentic treks, cultural journeys, wildlife adventures and local experiences across the Himalayas.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Walk Through Nepal — Authentic Himalayan Adventures",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Walk Through Nepal — Authentic Himalayan Adventures",
    description:
      "Discover authentic treks, cultural journeys, wildlife adventures and local experiences across the Himalayas.",
    images: ["/opengraph-image"],
  },
  creator: developer.name,
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eaebec" },
    { media: "(prefers-color-scheme: dark)", color: "#1a3f4f" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        mulish.variable,
        fontMono.variable,
        sora.variable
      )}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TLS8DKG5GG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TLS8DKG5GG');
          `}
        </Script>
      </head>
      <body>
        <OrganizationJsonLd />
        <script
          id="schema-attribution"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": developerAttributionGraph("Walk Through Nepal", SITE_URL)[
                "@graph"
              ].filter(
                (node) =>
                  node["@type"] !== "WebSite" &&
                  node["@id"] !== `${SITE_URL}/#organization`,
              ),
            }),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:m-2 focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-navy-foreground focus:outline-none focus:ring-2 focus:ring-orange"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <Navigation />
          <main id="main-content" className="pt-[40px] md:pt-[100px]">
            {children}
          </main>
          <BackToTop />
          <WhatsAppButton />
          <Footer />
          <ToastContainer position="bottom-right" />
        </ThemeProvider>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
