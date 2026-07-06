"use client"

import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useRef } from "react"

export function ReviewsCarousel({ items }: { items: { author: string; content: string }[] }) {
  const ref = useRef<HTMLDivElement>(null)

  function scroll(dir: number) {
    ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" })
  }

  if (!items.length) return null

  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-3 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-md text-navy hover:bg-border"
        aria-label="Previous reviews"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-3 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-md text-navy hover:bg-border"
        aria-label="Next reviews"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((t, i) => (
          <div
            key={i}
            className="w-72 shrink-0 snap-start rounded-lg border border-border bg-card p-4"
          >
            <div className="flex text-orange">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-4">
              &ldquo;{t.content}&rdquo;
            </p>
            <div className="mt-3 text-sm font-semibold text-navy">– {t.author}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
