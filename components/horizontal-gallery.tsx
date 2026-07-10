"use client"

import { useState } from "react"
import { GalleryLightbox } from "./gallery-lightbox"
import { img } from "@/lib/api"

export function HorizontalGallery({
  images,
  apiUrl,
}: {
  images: string[]
  apiUrl: string
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  if (images.length === 0) return null

  function makeAlt(src: string, i: number) {
    const name =
      src
        .split("/")
        .pop()
        ?.replace(/\.[^.]+$/, "")
        .replace(/[-_]/g, " ") || ""
    return `Photo ${i + 1}${name ? `: ${name}` : ""}`
  }

  const allImages = images.map((src, i) => ({
    src: img(src, apiUrl),
    alt: makeAlt(src, i),
  }))

  return (
    <>
      <div className="relative">
        <div className="scrollbar-hide flex gap-1 overflow-x-auto snap-x snap-mandatory">
          {allImages.map((image, i) => (
            <button
              key={i}
              onClick={() => setOpenIdx(i)}
              className="snap-start shrink-0"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-[55vh] w-[80vw] md:h-[65vh] md:w-[55vw] object-cover"
              />
            </button>
          ))}
        </div>
        {allImages.length > 1 && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm pointer-events-none">
            <span>Swipe to explore</span>
            <svg className="h-3 w-3 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        )}
      </div>

      {openIdx !== null && (
        <GalleryLightbox
          images={allImages}
          index={openIdx}
          onClose={() => setOpenIdx(null)}
        />
      )}
    </>
  )
}
