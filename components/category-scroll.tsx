"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { HorizontalScroll } from "@/components/horizontal-scroll"

export function CategoryScroll({ categories }: { categories: { img: string; title: string; sub: string; cta: string; handle: string }[] }) {
  return (
    <HorizontalScroll>
      {categories.map((c) => (
        <Link
          key={c.title}
          href={`/category/${c.handle}`}
          className="group relative h-72 w-72 shrink-0 snap-start overflow-hidden rounded-xl"
        >
          <img
            src={c.img}
            alt={c.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-6 text-white">
            <h3 className="text-lg font-bold">{c.title}</h3>
            <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-orange">
              {c.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      ))}
    </HorizontalScroll>
  )
}
