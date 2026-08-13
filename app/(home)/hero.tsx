"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import { SearchDialog } from "@/components/search-dialog"
import {
  ClipboardList,
  Heart,
  PhoneCall,
  Users
} from "lucide-react";

export const HeroSection = () => {
  const router = useRouter()
  const [q, setQ] = useState("")

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    router.push(term ? `/explore?q=${encodeURIComponent(term)}` : "/explore")
  }

  const reasons = [
    { icon: Users, title: "Local Experts", text: "Real Nepal based team with in-depth knowledge." },
    { icon: ClipboardList, title: "Flexible Itineraries", text: "Customize your trip to match your time and budget." },
    { icon: Heart, title: "Responsible Tourism", text: "We support local communities and sustainable travel." },
    { icon: PhoneCall, title: "24/7 Support", text: "We're with you before, during and after your trip." },
  ]

  return (
    <section className="relative min-h-[80vh] w-full">
      <Image
        src="/manaslu-view.webp"
        alt="Himalayan adventure"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-white/40" />

      <div className="relative z-10 container mx-auto flex h-full flex-col items-center justify-center px-4 pt-24 text-center">
        <p className="font-bold capitalize">Every Step, A New Story</p>
        <h1 className="max-w-5xl text-5xl font-black text-balance text-primary sm:text-5xl md:text-6xl uppercase">
          Walk beyond the trails discover Nepal
        </h1>
      </div>

      <div className="relative z-20 container mx-auto flex max-w-[1400px] items-center justify-center px-4 pb-10 md:pb-14">
        <SearchDialog />
      </div>

      {/* ── Selling Points ── */}
      <section className="relative  max-w-3xl py-4 text-navy-foreground mx-auto">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange/10 text-orange">
                  <r.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-bold text-navy">{r.title}</h3>
                <p className="mt-1 text-sm text-black font-medium">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  )
}

export default HeroSection
