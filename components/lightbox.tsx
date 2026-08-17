"use client"

import { X } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

export function Lightbox({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const prevFocus = useRef<HTMLElement | null>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    prevFocus.current = document.activeElement as HTMLElement
    closeRef.current?.focus()
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "Tab") {
        const focusable = closeRef.current
        if (focusable && !focusable.contains(document.activeElement)) {
          e.preventDefault()
          focusable.focus()
        }
      }
    }
    document.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
      prevFocus.current?.focus()
    }
  }, [open, close])

  return (
    <>
      <img src={src} alt={alt} sizes="100vw" className="w-full object-cover cursor-pointer" onClick={() => setOpen(true)} />
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={close} role="dialog" aria-modal="true" aria-label={alt}>
          <button ref={closeRef} onClick={close} className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors" aria-label="Close"><X className="h-8 w-8" /></button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="max-h-full max-w-full object-contain p-4" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}
