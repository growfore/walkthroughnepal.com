"use client"

import { useRef, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function HorizontalScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  function scroll(dir: number) {
    ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" })
  }

  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-md text-navy hover:bg-border"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-md text-navy hover:bg-border"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div
        ref={ref}
        className="flex gap-5 overflow-x-auto [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
    </div>
  )
}
