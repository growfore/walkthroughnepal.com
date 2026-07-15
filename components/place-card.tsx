"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Info, X } from "lucide-react"

function parseAlt(alt: string): { title: string; description: string } {
  const idx = alt.indexOf("::")
  if (idx === -1) return { title: alt, description: "" }
  return {
    title: alt.slice(0, idx).trim(),
    description: alt.slice(idx + 2).trim(),
  }
}

interface PlaceCardProps {
  image: string
  alt: string
  className?: string
}

export function PlaceCard({ image, alt, className }: PlaceCardProps) {
  const [open, setOpen] = useState(false)
  const { title, description } = parseAlt(alt)
  const hasInfo = description.length > 0

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <>
      <div className={className}>
        <div className="group relative w-full overflow-hidden rounded-2xl">
          <div className="relative aspect-[4/3] sm:aspect-video">
            <Image
              src={image}
              alt={alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 66vw"
            />
          </div>

          {/* Gradient scrim */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Bottom content */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 sm:p-6">
            <h3 className="max-w-[65%] font-heading text-xl font-bold leading-tight text-white sm:text-2xl">
              {title}
            </h3>

            {hasInfo && (
              <button
                onClick={() => setOpen(true)}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:px-4 sm:py-2"
              >
                <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Info
              </button>
            )}
          </div>
        </div>
      </div>

      {hasInfo && (
        <>
          {/* Desktop: centered dialog */}
          <div
            className={`fixed inset-0 z-50 pointer-events-none items-center justify-center p-4 ${
              open ? "hidden md:flex" : "hidden"
            }`}
          >
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
              onClick={() => setOpen(false)}
            />
            <div
              className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-900 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-gray-600 transition-colors hover:bg-black/20 hover:text-gray-900 dark:bg-white/10 dark:text-gray-400 dark:hover:bg-white/20 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="pr-10 font-sans text-base leading-relaxed text-gray-700 dark:text-gray-300">
                {description}
              </p>
            </div>
          </div>

          {/* Mobile: drawer from bottom */}
          <div
            className={`fixed inset-0 z-50 pointer-events-none md:hidden ${
              open ? "flex items-end" : "hidden"
            }`}
          >
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
              onClick={() => setOpen(false)}
            />
            <div
              className="relative z-10 w-full rounded-t-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex justify-center">
                <div className="h-1 w-10 rounded-full bg-gray-300" />
              </div>
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-gray-600 transition-colors hover:bg-black/20 hover:text-gray-900 dark:bg-white/10 dark:text-gray-400 dark:hover:bg-white/20 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="pr-10 font-sans text-base leading-relaxed text-gray-700 dark:text-gray-300">
                {description}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  )
}
