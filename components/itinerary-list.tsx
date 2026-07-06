"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, Clock, Home, Route } from "lucide-react"
import { decodeHtmlEntities } from "@/lib/html-decoder"
import type { ItineraryDay } from "@/lib/types"

export function ItineraryList({ days }: { days: ItineraryDay[] }) {
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
        <h2 className="text-2xl font-bold text-navy md:text-3xl">Itinerary</h2>
        <button
          onClick={() => setOpen(allOpen ? new Set() : new Set(days.map((d) => d.day)))}
          className="rounded-md border border-border px-4 py-2 text-base font-semibold text-navy hover:bg-muted transition-colors sm:text-lg sm:px-5"
        >
          {allOpen ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="relative">
        <div className="absolute left-[7px] top-3 bottom-0 w-0.5 bg-navy/10 sm:left-[7px]" />

        <div className="space-y-3">
          {days.map((d) => {
            const isOpen = open.has(d.day)
            return (
              <div key={d.day} className="relative pl-8">
                <div className={`absolute left-0 top-3 z-10 h-3.5 w-3.5 rounded-full border-2 ${isOpen ? "border-navy bg-navy" : "border-navy/30 bg-card"}`} />

                <div className="border-b border-border pb-3">
                  <button
                    onClick={() => toggle(d.day)}
                    className="flex w-full items-center gap-2 p-1.5 pl-0 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-lg font-semibold text-navy">{d.title}</div>
                    </div>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="p-1.5 pt-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                        {d.ascent && (
                          <span className="inline-flex items-center gap-1">
                            ↑ {d.ascent}
                          </span>
                        )}
                        {d.descent && (
                          <span className="inline-flex items-center gap-1">
                            ↓ {d.descent}
                          </span>
                        )}
                        {d.distance && (
                          <span className="inline-flex items-center gap-1">
                            <Route className="h-3.5 w-3.5" /> {d.distance}
                          </span>
                        )}
                        {d.duration && (
                          <span className="inline-flex items-center gap-1 w-full">
                            <Clock className="h-3.5 w-3.5 shrink-0" /> {d.duration}
                          </span>
                        )}
                        {d.accommodations?.length > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <Home className="h-3.5 w-3.5" /> {d.accommodations.join(", ")}
                          </span>
                        )}
                        {d.meals?.length > 0 && (
                          <span className="flex items-center gap-1">
                            {d.meals.map((m, i) => (
                              <span key={i} className="rounded-full bg-orange/10 px-2.5 py-0.5 text-xs font-medium text-orange">{m}</span>
                            ))}
                          </span>
                        )}
                      </div>

                      <div className="prose prose-lg max-w-none w-full wrap-break-word **:wrap-break-word prose-p:m-0 prose-p:text-muted-foreground" dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(d.description) }} />

                      {d.dayFeaturedImages?.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {d.dayFeaturedImages.map((img, i) => (
                            <div key={i} className="overflow-hidden rounded-md">
                              <div className="relative aspect-video">
                                <Image src={img.image} alt={img.alt} fill className="object-cover" sizes="(max-width: 640px) 50vw, 33vw" />
                              </div>
                              {img.alt && <p className="mt-1 text-xs text-muted-foreground truncate">{img.alt}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
