"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Info,
  Route,
  DollarSign,
  Map,
  Check,
  X,
  Calendar,
  Backpack,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, LucideIcon> = {
  overview: Info,
  itinerary: Route,
  "cost-breakdown": DollarSign,
  map: Map,
  includes: Check,
  excludes: X,
  departures: Calendar,
  "packing-list": Backpack,
  "useful-info": HelpCircle,
  faqs: MessageSquare,
}

const labelMap: Record<string, string> = {
  overview: "Overview",
  itinerary: "Itinerary",
  "cost-breakdown": "Cost Breakdown",
  includes: "Includes",
  excludes: "Excludes",
  map: "Map",
  departures: "Availability",
  "packing-list": "Packing List",
  "useful-info": "Useful Info",
  faqs: "FAQs",
}

export function SectionNav({ sectionIds }: { sectionIds: string[] }) {
  const [active, setActive] = useState("")
  const navRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const scrollToTab = useCallback((id: string) => {
    const nav = navRef.current
    if (!nav) return
    const btn = nav.querySelector<HTMLElement>(`[data-tab="${id}"]`)
    if (!btn) return
    const containerRect = nav.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    const offset = btnRect.left - containerRect.left - containerRect.width / 2 + btnRect.width / 2
    nav.scrollBy({ left: offset, behavior: "smooth" })
  }, [])

  useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]

    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id
            setActive(id)
            scrollToTab(id)
            break
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    )

    sections.forEach((s) => observerRef.current!.observe(s))
    return () => observerRef.current?.disconnect()
  }, [sectionIds, scrollToTab])

  return (
    <div className="sticky top-0 z-30 border-b border-border bg-primary/10 backdrop-blur-xl">
      <div className="relative">
        <div
          ref={navRef}
          className="mx-auto scrollbar-hide flex max-w-7xl flex-nowrap gap-1 overflow-x-auto py-3"
        >
          {sectionIds.map((id) => {
            const Icon = iconMap[id] ?? HelpCircle
            const label = labelMap[id] ?? id
            const isActive = active === id
            return (
              <a
                key={id}
                href={`#${id}`}
                data-tab={id}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
                  setActive(id)
                  scrollToTab(id)
                }}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-navy text-white"
                    : "text-navy hover:bg-muted hover:text-navy"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </a>
            )
          })}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
          <div className="h-6 w-6 animate-pulse rounded-full bg-muted text-muted-foreground grid place-items-center">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
