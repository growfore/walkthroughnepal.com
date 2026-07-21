"use client"

import { useRef, useState, useEffect, useCallback, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function HorizontalScroll({
  children,
  headerRight,
  id,
}: {
  children: ReactNode
  headerRight?: boolean
  id?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [canScroll, setCanScroll] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setCanScroll(el.scrollWidth > el.clientWidth))
    ro.observe(el)
    setCanScroll(el.scrollWidth > el.clientWidth)
    return () => ro.disconnect()
  }, [])

  function scroll(dir: number) {
    ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" })
  }

  const scrollLeft = useCallback(() => scroll(-1), [])
  const scrollRight = useCallback(() => scroll(1), [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { scroll(-1); e.preventDefault() }
      if (e.key === "ArrowRight") { scroll(1); e.preventDefault() }
    }
    el.addEventListener("keydown", handler)
    return () => el.removeEventListener("keydown", handler)
  }, [])

  if (headerRight && canScroll) {
    return (
      <div>
        <div className="mb-4 flex items-center justify-end gap-2">
          <button
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-sm text-navy hover:bg-border transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={scrollRight}
            aria-label="Scroll right"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-sm text-navy hover:bg-border transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div
          ref={ref}
          id={id}
          tabIndex={0}
          role="region"
          aria-label="Scrollable content"
          className="flex gap-5 overflow-x-auto [&::-webkit-scrollbar]:hidden snap-x snap-mandatory focus:outline-none focus:ring-2 focus:ring-orange/50 rounded-lg"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {canScroll && (
        <button
          onClick={scrollLeft}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-md text-navy hover:bg-border"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {canScroll && (
        <button
          onClick={scrollRight}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-md text-navy hover:bg-border"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
      <div
        ref={ref}
        id={id}
        tabIndex={0}
        role="region"
        aria-label="Scrollable content"
        className="flex gap-5 overflow-x-auto [&::-webkit-scrollbar]:hidden snap-x snap-mandatory focus:outline-none focus:ring-2 focus:ring-orange/50 rounded-lg"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
    </div>
  )
}
