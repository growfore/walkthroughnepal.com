import { Geist_Mono, Montserrat, Sora } from "next/font/google"
import type { Metadata, Viewport } from "next"

import "./globals.css"
import "react-toastify/dist/ReactToastify.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ToastContainer } from "react-toastify"

const montserrat = Montserrat({
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
    default: "Walk Through Nepal",
  },
  description:
    "Discover authentic treks, cultural journeys, wildlife adventures and local experiences across the Himalayas with Walk Through Nepal.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Walk Through Nepal",
    title: "Walk Through Nepal",
    description:
      "Discover authentic treks, cultural journeys, wildlife adventures and local experiences across the Himalayas.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Walk Through Nepal",
    description:
      "Discover authentic treks, cultural journeys, wildlife adventures and local experiences across the Himalayas.",
  },
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
        montserrat.variable,
        fontMono.variable,
        sora.variable
      )}
    >
      <body>
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
          <Footer />
          <ToastContainer position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
