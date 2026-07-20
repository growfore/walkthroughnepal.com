"use client"

import { useEffect, useState } from "react"
import { ChevronUp } from "lucide-react"

export function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-all hover:bg-muted hover:text-navy bottom-6 left-6 max-lg:left-auto max-lg:right-6 max-lg:bottom-24 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  )
}
