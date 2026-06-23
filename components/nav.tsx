import { Mail, Phone, Globe, ExternalLink } from "lucide-react"
import Link from "next/link"

const navLinks = ["Treks", "Tours", "Destinations", "Experiences", "About Us", "Travel Info", "Blog", "Contact"]

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <img src="/walkthrough-nepal-logo.png" alt="Walk Through Nepal" className="h-10 w-auto" />
    </Link>
  )
}

export function Nav() {
  return (
    <>
      <div className="bg-navy text-navy-foreground text-xs">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> info@walkthroughnepal.com</span>
            <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> +977 984 123 4567</span>
          </div>
          <div className="hidden items-center gap-5 sm:flex">
            <a href="#">About Us</a><a href="#">FAQs</a><a href="#">Reviews</a><a href="#">Trip Planner</a>
            <div className="flex items-center gap-2 pl-3">
              <Globe className="h-3.5 w-3.5" /><ExternalLink className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm font-medium text-navy lg:flex">
            {navLinks.map((l) => (
              <a key={l} href="#" className="transition-colors hover:text-orange">{l}</a>
            ))}
          </nav>
          <button className="rounded-md bg-orange px-5 py-2.5 text-sm font-semibold text-orange-foreground transition hover:opacity-90">
            Plan Your Trip
          </button>
        </div>
      </header>
    </>
  )
}
