"use client"

import { useEffect, useRef, useState } from "react"
import { Info, Route, Check, X, HelpCircle, Star, MessageCircle } from "lucide-react"

const tabs = [
  { label: "Overview", icon: Info },
  { label: "Itinerary", icon: Route },
  { label: "Includes", icon: Check },
  { label: "Excludes", icon: X },
  { label: "Useful Info", icon: HelpCircle },
  { label: "Reviews", icon: Star },
  { label: "FAQs", icon: MessageCircle },
]

export function SectionNav() {
  const [show, setShow] = useState(false)
  const passedOverview = useRef(false)

  useEffect(() => {
    const el = document.getElementById("overview")
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          passedOverview.current = true
          setShow(false)
        } else if (passedOverview.current) {
          setShow(true)
        }
      },
      { rootMargin: "-200px 0px 0px 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className={`fixed left-0 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-2 rounded-r-2xl border border-border bg-card p-2 shadow-sm transition-opacity duration-300 lg:flex ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {tabs.map((t) => {
        const Icon = t.icon
        return (
          <a
            key={t.label}
            href={`#${t.label.toLowerCase().replace(/\s+/g, "-")}`}
            className="group relative flex items-center justify-center rounded-xl p-3 text-sm font-semibold transition-colors hover:bg-muted hover:text-navy"
          >
            <Icon className="h-4 w-4" />
            <span className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-navy px-2 py-1 text-xs text-navy-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              {t.label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}
