import { Geist_Mono, Montserrat } from "next/font/google"

import "./globals.css"
import "react-toastify/dist/ReactToastify.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"
import { ToastContainer } from "react-toastify"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", montserrat.variable)}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700,800&display=swap"
        />
      </head>
      <body>
        <ThemeProvider>
          <Nav />
          <main className="pt-[100px] md:pt-[100px]">{children}</main>
          <Footer />
          <ToastContainer position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
