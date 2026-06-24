"use client"

import { Menu, X, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const navLinks = [
  { label: "Treks", href: "#" },
  { label: "Tours", href: "#" },
  { label: "Destinations", href: "#" },
  { label: "Experiences", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Travel Info", href: "#" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#" },
]

export function Nav() {
  const [isVisible, setIsVisible] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setIsVisible(y <= 80 || y < lastY)
      lastY = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 bg-background border-b border-border transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Top bar */}
      <div className="hidden md:block bg-navy text-navy-foreground">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-sm font-medium">
              <span className="flex text-orange">★★★★★</span>
              <span>4.9 <span className="text-navy-foreground/60">·</span> 2,800+ reviews</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="tel:+9779841234567" className="flex items-center gap-1.5 text-sm font-semibold hover:text-orange transition-colors">
              <Phone className="h-4 w-4" /> +977 984 123 4567
            </a>
            <a href="mailto:info@walkthroughnepal.com" className="flex items-center gap-1.5 text-sm font-semibold hover:text-orange transition-colors">
              <Mail className="h-4 w-4" /> info@walkthroughnepal.com
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/">
            <img src="/walkthrough-nepal-logo.png" alt="Walk Through Nepal" className="h-14 w-auto p-1" />
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-ink/80 hover:text-ink transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/design-your-trip"
            className="hidden md:inline-flex rounded-md border border-navy px-4 py-2 text-sm font-semibold text-navy transition hover:bg-navy hover:text-navy-foreground"
          >
            Customize My Trip
          </Link>
          <button className="hidden md:inline-flex rounded-md bg-orange px-4 py-2 text-sm font-semibold text-orange-foreground transition hover:opacity-90">
            Book Now
          </button>
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="block px-4 md:px-8 py-3 text-sm font-bold uppercase tracking-wider text-ink/80 hover:text-ink hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 p-4 md:px-8 border-t border-border">
            <Link
              href="/design-your-trip"
              className="flex-1 rounded-md border border-navy px-4 py-2 text-sm font-semibold text-navy text-center"
            >
              Customize My Trip
            </Link>
            <button className="flex-1 rounded-md bg-orange px-4 py-2 text-sm font-semibold text-orange-foreground">
              Book Now
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
