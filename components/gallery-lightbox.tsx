"use client"

import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

export function GalleryLightbox({ images, index, onClose }: { images: { src: string; alt: string }[]; index: number; onClose: () => void }) {
  const [idx, setIdx] = useState(index)

  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    document.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [onClose, prev, next])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <button onClick={onClose} className="absolute right-4 top-4 z-10 text-white/80 hover:text-white transition-colors"><X className="h-8 w-8" /></button>

      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"><ChevronLeft className="h-6 w-6" /></button>
          <button onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"><ChevronRight className="h-6 w-6" /></button>
        </>
      )}

      <img src={images[idx].src} alt={images[idx].alt} className="max-h-full max-w-full object-contain p-4" onClick={(e) => e.stopPropagation()} />

      {images.length > 1 && (
        <div className="absolute bottom-4 text-sm text-white/60">
          {idx + 1} / {images.length}
        </div>
      )}
    </div>
  )
}
