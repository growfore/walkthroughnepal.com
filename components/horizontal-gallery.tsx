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
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
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
