"use client"

import { X } from "lucide-react"
import { useEffect, useState } from "react"

export function Lightbox({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open])

  return (
    <>
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover cursor-pointer" onClick={() => setOpen(true)} />
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setOpen(false)}>
          <button onClick={() => setOpen(false)} className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"><X className="h-8 w-8" /></button>
          <img src={src} alt={alt} className="max-h-full max-w-full object-contain p-4" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}
