"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Clock, Home, Route } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { renderRichText } from "@/lib/html-decoder"
import { cn } from "@/lib/utils"
import type { ItineraryVariant } from "@/lib/types"

export function ItineraryList({ variants }: { variants: ItineraryVariant[] }) {
  const defaultIdx = variants.findIndex((v) => v.isDefault)
  const [activeIdx, setActiveIdx] = useState(defaultIdx >= 0 ? defaultIdx : 0)
  const activeVariant = variants[activeIdx]
  const days = activeVariant?.days ?? []
  const prefix = activeVariant?.id ?? "it"
  const [open, setOpen] = useState<string[]>([])
  const allOpen = open.length === days.length

  const dayValue = (idx: number) => `${prefix}-${idx}`

  const selectVariant = (idx: number) => {
    setActiveIdx(idx)
    setOpen([])
    window.location.hash = variants[idx]?.id ?? ""
  }

  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (hash) {
      const idx = variants.findIndex((v) => v.id === hash)
      if (idx >= 0) setActiveIdx(idx)
    }
  }, [variants])

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash) {
        const idx = variants.findIndex((v) => v.id === hash)
        if (idx >= 0) setActiveIdx(idx)
      }
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [variants])

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold text-navy md:text-3xl">Itinerary</h2>
        <button
          onClick={() => setOpen(allOpen ? [] : days.map((_, i) => dayValue(i)))}
          className="rounded-md border border-border px-4 py-2 text-base font-semibold text-navy hover:bg-muted transition-colors sm:text-lg sm:px-5"
        >
          {allOpen ? "Collapse All" : "Expand All"}
        </button>
      </div>

      {variants.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {variants.map((v, idx) => (
            <button
              key={v.id}
              onClick={() => selectVariant(idx)}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-semibold transition-colors",
                idx === activeIdx
                  ? "bg-navy text-white"
                  : "border border-border text-navy hover:bg-muted",
              )}
            >
              {v.name}
            </button>
          ))}
        </div>
      )}

      {days.length === 0 ? (
        <p className="text-muted-foreground">No itinerary details available for this variant.</p>
      ) : (
        <div key={prefix} className="relative">
          <div className="absolute left-[7px] top-3 bottom-0 w-0.5 bg-navy/10 sm:left-[7px]" />

          <Accordion type="multiple" value={open} onValueChange={setOpen} className="space-y-0">
            {days.map((d, i) => (
              <AccordionItem key={`${prefix}-${i}`} value={dayValue(i)} className="relative pl-8">
                <div className={`absolute -left-0.5 top-4 z-10 h-5 w-5 rounded-full border-[3px] transition-colors ${open.includes(dayValue(i)) ? "border-navy bg-navy" : "border-navy/30 bg-card"}`} />

                <AccordionTrigger className="flex w-full items-center gap-2 py-3 text-left hover:no-underline focus-visible:ring-0 [&[data-open]>svg]:rotate-180">
                  <div className="min-w-0 flex-1">
                    <div className="text-lg font-semibold text-navy">{d.title}</div>
                  </div>
                </AccordionTrigger>

                <AccordionContent forceMount className="data-[state=closed]:hidden">
                  <div className="p-1.5 pt-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                      {d.ascent && (
                        <span className="inline-flex items-center gap-1">↑ {d.ascent}</span>
                      )}
                      {d.descent && (
                        <span className="inline-flex items-center gap-1">↓ {d.descent}</span>
                      )}
                      {d.distance && (
                        <span className="inline-flex items-center gap-1"><Route className="h-3.5 w-3.5" /> {d.distance}</span>
                      )}
                      {d.duration && (
                        <span className="inline-flex items-center gap-1 w-full"><Clock className="h-3.5 w-3.5 shrink-0" /> {d.duration}</span>
                      )}
                      {d.accommodations?.length > 0 && (
                        <span className="inline-flex items-center gap-1"><Home className="h-3.5 w-3.5" /> {d.accommodations.join(", ")}</span>
                      )}
                      {d.meals?.length > 0 && (
                        <span className="flex items-center gap-1">
                          {d.meals.map((m, i) => (
                            <span key={i} className="rounded-full bg-orange/10 px-2.5 py-0.5 text-xs font-medium text-orange">{m}</span>
                          ))}
                        </span>
                      )}
                    </div>

                    <div className="prose prose-lg max-w-none w-full wrap-break-word **:wrap-break-word prose-p:m-0 prose-p:text-muted-foreground" dangerouslySetInnerHTML={{ __html: renderRichText(d.description) }} />

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
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  )
}
