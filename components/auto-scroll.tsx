"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"

export function AutoScroll({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let id: ReturnType<typeof requestAnimationFrame>
    let prev = performance.now()

    const tick = (now: number) => {
      if (!paused) {
        const e = ref.current
        if (!e) return
        e.scrollTop += (now - prev) * 0.04
        if (e.scrollTop >= e.scrollHeight - e.clientHeight) {
          e.scrollTop = 0
        }
      }
      prev = now
      id = requestAnimationFrame(tick)
    }

    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [paused])

  return (
    <div
      ref={ref}
      className={`scrollbar-hide ${className ?? ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {children}
    </div>
  )
}
