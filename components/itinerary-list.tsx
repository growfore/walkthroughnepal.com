"use client"

import { useState } from "react"
import { ChevronDown, Home as HomeIcon, TrendingUp } from "lucide-react"
import { decodeHtmlEntities } from "@/lib/html-decoder"

type Day = {
  day: number
  title: string
  description: string
  meals: string[]
  accommodations: string[]
  ascent: string
  descent: string
  distance: string
  duration: string
}

export function ItineraryList({ days }: { days: Day[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set())
  const allOpen = open.size === days.length

  const toggle = (day: number) => {
    const next = new Set(open)
    if (next.has(day)) next.delete(day)
    else next.add(day)
    setOpen(next)
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold text-navy">Itinerary</h2>
        <button
          onClick={() => setOpen(allOpen ? new Set() : new Set(days.map((d) => d.day)))}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-navy hover:bg-muted transition-colors sm:text-sm sm:px-4"
        >
          {allOpen ? "Collapse All" : "Expand All"}
        </button>
      </div>
      <div className="space-y-3">
        {days.map((d) => {
          const isOpen = open.has(d.day)
          return (
            <div key={d.day} className="rounded-lg border border-border">
              <button
                onClick={() => toggle(d.day)}
                className="flex w-full items-center gap-3 p-3 sm:gap-4 sm:p-4 text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-navy/15 text-navy sm:h-12 sm:w-12">
                  <div className="text-center leading-tight">
                    <div className="text-[8px] font-semibold text-muted-foreground sm:text-[9px]">Day</div>
                    <div className="text-[11px] font-bold sm:text-sm">{String(d.day).padStart(2, "0")}</div>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-navy break-words sm:text-base">{d.title}</div>
                </div>
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="border-t border-border p-3 pt-2 sm:p-4 sm:pt-3 overflow-hidden">
                  <div className="prose prose-sm sm:prose-base max-w-none w-full prose-p:m-0 prose-p:text-muted-foreground wrap-break-word **:wrap-break-word" dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(d.description) }} />
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {d.ascent && <span><TrendingUp className="mr-1 inline h-3.5 w-3.5" />↑ {d.ascent}</span>}
                    {d.descent && <span><TrendingUp className="mr-1 inline h-3.5 w-3.5" />↓ {d.descent}</span>}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                    {d.accommodations?.length > 0 && (
                      <span><HomeIcon className="mr-1 inline h-3 w-3" /> {d.accommodations.join(", ")}</span>
                    )}
                    {d.meals?.length > 0 && (
                      <span className="font-medium">{d.meals.join(" • ")}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
