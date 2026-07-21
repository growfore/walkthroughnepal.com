"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

export function ScrollButtons({ targetId }: { targetId: string }) {
  function scroll(dir: number) {
    document.getElementById(targetId)?.scrollBy({ left: dir * 300, behavior: "smooth" })
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => scroll(-1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-sm text-navy hover:bg-border transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => scroll(1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-sm text-navy hover:bg-border transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
