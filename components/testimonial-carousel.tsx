"use client"

import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

type Testimonial = { name: string; country: string; text: string }

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [fading, setFading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const t = items[i]

  const go = useCallback(
    (dir: number) => {
      setFading(true)
      setTimeout(() => {
        setI((idx) => (idx + dir + items.length) % items.length)
        setFading(false)
      }, 150)
    },
    [items.length],
  )

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = undefined
    }
  }, [])

  const startTimer = useCallback(() => {
    clearTimer()
    if (items.length < 2 || paused) return
    timerRef.current = setInterval(() => setI((idx) => (idx + 1) % items.length), 5000)
  }, [clearTimer, items.length, paused])

  useEffect(() => {
    startTimer()
    return clearTimer
  }, [startTimer, clearTimer])

  useEffect(() => {
    if (!items.length) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1)
      if (e.key === "ArrowRight") go(1)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [go, items.length])

  if (!t) return null

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        setPaused(true)
        clearTimer()
      }}
      onMouseLeave={() => {
        setPaused(false)
      }}
    >
      <div className={`transition-opacity duration-150 ${fading ? "opacity-0" : "opacity-100"}`}>
        <span className="absolute -top-2 -left-2 text-5xl leading-none text-orange/30">&ldquo;</span>
        <p className="pl-6 text-lg leading-relaxed text-foreground/90 italic">
          {t.text}
        </p>
        <div className="mt-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange/30 font-bold text-base">
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
              <span className="text-xs text-muted-foreground">{t.country}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setI(idx)
                startTimer()
              }}
              className={`h-2 w-2 rounded-full transition-colors ${
                idx === i ? "bg-orange" : "bg-muted-foreground/30"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              go(-1)
              startTimer()
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              go(1)
              startTimer()
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
