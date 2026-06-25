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
          className="group relative h-64 w-72 shrink-0 snap-start overflow-hidden rounded-lg"
        >
          <img
            src={c.img}
            alt={c.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
            <h3 className="text-xl font-bold">{c.title}</h3>
            <div className="mt-2 flex items-center gap-1 text-sm font-medium text-orange">
              {c.cta} <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      ))}
    </HorizontalScroll>
  )
}
