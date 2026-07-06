"use client"

import { useState } from "react"
import { GalleryLightbox } from "./gallery-lightbox"
import { img } from "@/lib/api"

export function ThumbnailGallery({ images, apiUrl }: { images: string[]; apiUrl: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const thumbnails = images.slice(0, 5)

  if (images.length === 0) return null

  function makeAlt(src: string, i: number) {
    const name = src.split("/").pop()?.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") || ""
    return `Photo ${i + 1}${name ? `: ${name}` : ""}`
  }

  return (
    <>
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 overflow-x-auto scrollbar-hide px-4">
        {thumbnails.map((src, i) => (
          <button key={i} onClick={() => setOpenIdx(i)} className="shrink-0">
            <img src={img(src, apiUrl)} alt={makeAlt(src, i)} className="h-16 w-24 rounded object-cover ring-2 ring-white/80 hover:ring-orange transition-all cursor-pointer" />
          </button>
        ))}
        {images.length > 5 && (
          <button onClick={() => setOpenIdx(0)} className="flex h-16 w-24 shrink-0 flex-col items-center justify-center rounded bg-black/50 text-sm text-white ring-2 ring-white/80 hover:ring-orange transition-all">
            <span className="font-semibold">+{images.length - 5}</span>
            <span className="text-xs text-white/70">Photos</span>
          </button>
        )}
      </div>

      {openIdx !== null && (
        <GalleryLightbox
          images={images.map((src, i) => ({ src: img(src, apiUrl), alt: makeAlt(src, i) }))}
          index={openIdx}
          onClose={() => setOpenIdx(null)}
        />
      )}
    </>
  )
}
