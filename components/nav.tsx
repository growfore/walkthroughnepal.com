"use client"

import { Menu, X, Mail, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { siteConfig } from "@/lib/siteConfig"
import { Logo } from "./logo"

const navLinks = [
  { label: "Treks", href: "#" },
  { label: "Tours", href: "#" },
  { label: "Destinations", href: "#" },
  { label: "Experiences", href: "#" },
  { label: "About Us", href: "/about" },
  { label: "Travel Info", href: "#" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
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
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b border-border bg-background transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Top bar */}
      <div className="hidden bg-navy text-navy-foreground md:block">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex flex-1 items-center justify-end gap-2">
            <span className="flex items-center gap-1 text-sm font-medium">
              <span className="flex text-orange">★★★★★</span>
              <span>
                4.9 <span className="text-navy-foreground/60">·</span> 2,800+
                reviews
              </span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={`tel:${siteConfig.phoneNumbers[0].tel ?? siteConfig.whatsAppNumber}`}
              className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-orange"
            >
              <Phone className="h-4 w-4" /> {siteConfig.phoneNumbers[0].phone}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-orange"
            >
              <Mail className="h-4 w-4" /> {siteConfig.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">
        <div className="flex flex-1">
          <Logo invert={false}/>
        </div>

        <div className="hidden justify-center gap-3 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="px-3 py-1.5 text-lg font-bold tracking-wider text-ink/80 uppercase transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Link
            href="/design-your-trip"
            className="hidden rounded-md border border-navy px-4 py-2 text-sm font-semibold text-navy transition hover:bg-navy hover:text-navy-foreground md:inline-flex"
          >
            Customize My Trip
          </Link>
          <Link href="/inquiry" className="hidden rounded-md bg-orange px-4 py-2 text-sm font-semibold text-orange-foreground transition hover:opacity-90 md:inline-flex uppercase">
           INQUIRE NOW
          </Link>
          <button
            className="p-2 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="block px-4 py-3 text-center text-sm font-bold tracking-wider text-ink/80 uppercase transition-colors hover:bg-muted hover:text-ink md:px-8"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 border-t border-border p-4 md:px-8">
            <Link
              href="/design-your-trip"
              className="flex-1 rounded-md border border-navy px-4 py-2 text-center text-sm font-semibold text-navy uppercase"
            >
              Customize My Trip
            </Link>
            <Link href="/inquiry" className="uppercase flex-1 rounded-md bg-orange px-4 py-2 text-sm font-semibold text-orange-foreground text-center">
              Inquire Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
