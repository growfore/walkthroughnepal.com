"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import { SearchDialog } from "@/components/search-dialog"

export const HeroSection = () => {
  const router = useRouter()
  const [q, setQ] = useState("")

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    router.push(term ? `/explore?q=${encodeURIComponent(term)}` : "/explore")
  }

  return (
    <section className="relative min-h-[80vh] w-full">
      <Image
        src="/manaslu-view.webp"
        alt="Himalayan adventure"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-primary to-secondary p-6 opacity-10" />

      <div className="relative z-10 container mx-auto flex h-full flex-col items-center justify-center px-4 pt-24 text-center">
        <h1 className="max-w-5xl text-5xl font-black text-balance text-primary capitalize sm:text-5xl md:text-6xl">
          discover something unforgettable
        </h1>
        <p className="mt-6 mb-10 max-w-xl px-4 text-base text-balance md:mt-8 md:text-xl">
          Authentic treks and unforgettable journeys across Nepal — thoughtfully
          crafted by local experts who know every trail, village, and mountain.
        </p>
      </div>

      <div className="relative z-20 container mx-auto flex max-w-[1400px] items-center justify-center px-4 pb-10 md:pb-14">
        <SearchDialog />
      </div>
    </section>
  )
}

export default HeroSection
