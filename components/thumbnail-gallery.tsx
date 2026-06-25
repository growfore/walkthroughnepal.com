"use client"

import { useState } from "react"
import { GalleryLightbox } from "./gallery-lightbox"
import { img } from "@/lib/api"

export function ThumbnailGallery({ images, apiUrl }: { images: string[]; apiUrl: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const thumbnails = images.slice(0, 5)

  if (images.length === 0) return null

  return (
    <>
      <div className="bg-navy/95">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto scrollbar-hide px-4 py-3">
          {thumbnails.map((src, i) => (
            <button key={i} onClick={() => setOpenIdx(i)} className="flex-shrink-0">
              <img src={img(src, apiUrl)} alt="Trek photo" className="h-20 w-32 rounded object-cover cursor-pointer hover:opacity-80 transition-opacity" />
            </button>
          ))}
          {images.length > 5 && (
            <button onClick={() => setOpenIdx(0)} className="flex h-20 w-32 flex-shrink-0 flex-col items-center justify-center rounded bg-white/10 text-sm text-white hover:bg-white/20 transition-colors">
              <span className="font-semibold">+{images.length - 5}</span>
              <span className="text-xs text-white/70">View all photos</span>
            </button>
          )}
        </div>
      </div>

      {openIdx !== null && (
        <GalleryLightbox
          images={images.map((src) => ({ src: img(src, apiUrl), alt: "Trek photo" }))}
          index={openIdx}
          onClose={() => setOpenIdx(null)}
        />
      )}
    </>
  )
}
