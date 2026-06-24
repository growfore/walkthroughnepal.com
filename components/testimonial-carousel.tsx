"use client"

import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

type Testimonial = { name: string; country: string; text: string }

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0)
  const t = items[i]
  if (!t) return null

  return (
    <div className="relative">
      <span className="absolute -top-2 -left-2 text-5xl leading-none text-orange/30">&ldquo;</span>
      <p className="pl-6 text-lg leading-relaxed text-white/90 italic">
        {t.text}
      </p>
      <div className="mt-5 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange/30 font-bold text-base">
          {t.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <div className="font-semibold">{t.name}</div>
          <div className="flex items-center gap-2">
            <div className="flex text-orange">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <span className="text-xs text-white/60">{t.country}</span>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-2 w-2 rounded-full transition-colors ${
                idx === i ? "bg-orange" : "bg-white/30"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setI((i - 1 + items.length) % items.length)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white/70 hover:border-white hover:text-white transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setI((i + 1) % items.length)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white/70 hover:border-white hover:text-white transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
