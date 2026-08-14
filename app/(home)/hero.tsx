"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SearchDialog } from "@/components/search-dialog"
import {
    CalendarDays,
  HeartHandshake,
  MapPin,
  Shield,
  Telescope,
  Users
} from "lucide-react";

export const HeroSection = () => {
  const router = useRouter()
  const [q, setQ] = useState("")
  const [place, setPlace] = useState(0)
  const places = ["Nepal", "Everest", "Annapurna", "Manaslu"]

  useEffect(() => {
    const id = setInterval(() => setPlace((p) => (p + 1) % places.length), 2000)
    return () => clearInterval(id)
  }, [])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    router.push(term ? `/explore?q=${encodeURIComponent(term)}` : "/explore")
  }

  const stats = [
    { icon: CalendarDays, value: "20+ Years of Experience", label: "Decades of local knowledge shaping unforgettable journeys." },
    { icon: MapPin, value: "50+ Destinations across Nepal", label: "From iconic trails to hidden villages across Nepal." },
    { icon: Telescope , value: "5,000+ Happy Travellers", label: "Thousands of travelers trust us for memorable adventures." },
    { icon: HeartHandshake, value: "100% Local Team", label: "Local guides who know Nepal firsthand, one trip at a time." },
  ]

  return (
    <section className="relative min-h-[90vh] w-full">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
        preload="metadata"
      >
        <source src="/hero-video-opt.webm" type="video/webm" />
        <source src="/hero-video-opt.mp4" type="video/mp4" />
      </video>
      {/*<div className="absolute inset-0 bg-white/40" />*/}

      <div className="relative z-10 container mx-auto flex h-full flex-col items-center justify-center px-4 pt-42 text-center">
        <p className="font-bold capitalize">Every Step, A New Story</p>
        <h1 className="max-w-5xl text-5xl font-black text-balance text-primary sm:text-5xl md:text-6xl uppercase">
          Walk beyond the trails<br/> discover{" "}
          <span
            key={place}
            className="inline-block animate-in fade-in slide-in-from-bottom-1 duration-500 text-orange"
          >
            {places[place]}
          </span>
        </h1>
      </div>

      <div className="relative z-20 container mx-auto flex max-w-[1400px] items-center justify-center px-4 pb-10 md:pb-14 mt-12">
        <SearchDialog />
      </div>

      {/* ── Selling Points ── */}
      <section className="relative  max-w-4xl py-4 text-navy-foreground mx-auto">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange/50">
                  <s.icon className="h-6 w-6" />
                </div>
                <p className="mt-2 text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white font-medium leading-normal">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  )
}

export default HeroSection
