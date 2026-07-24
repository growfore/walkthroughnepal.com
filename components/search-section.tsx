"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ChevronRight } from "lucide-react"
import { FilterSheet } from "@/components/filter-sheet"

type Category = {
  img: string
  title: string
  sub: string
  handle: string
}

export function SearchSection({ categories }: { categories: Category[] }) {
  const [query, setQuery] = useState("")
  const [filterValues, setFilterValues] = useState({ category: "", min: "", max: "" })

  const cats = categories.map((c) => ({ handle: c.handle, name: c.title }))

  function buildExploreUrl(overrides?: { category?: string; min?: string; max?: string }) {
    const f = overrides ?? filterValues
    const params = new URLSearchParams()
    if (query.trim()) params.set("search", query.trim())
    if (f.category) params.set("category", f.category)
    if (f.min) params.set("min", f.min)
    if (f.max) params.set("max", f.max)
    return `/explore${params.toString() ? `?${params.toString()}` : ""}`
  }

  function handleFilterSearch() {
    window.location.href = buildExploreUrl()
  }

  return (
    <section className="relative z-30 bg-navy py-16 text-white md:py-20">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      </div>

      <div className="relative mx-auto max-w-5xl px-4">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-widest uppercase text-orange">
            Find Your Adventure
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl lg:text-5xl">
            Where do you want to go?
          </h2>
          <p className="mt-3 text-white/60 max-w-lg mx-auto">
            Search by name or filter by category and price.
          </p>
        </div>

        {/* Search bar */}
        <div className="mt-10 rounded-2xl border border-border bg-white p-3 shadow-lg">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2">
              <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search treks, tours, destinations..."
                className="flex-1 bg-transparent px-2 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") window.location.href = buildExploreUrl()
                }}
              />
            </div>
            <FilterSheet
              categories={cats}
              values={filterValues}
              setValues={setFilterValues}
              onSearch={handleFilterSearch}
            />
            <Link
              href={buildExploreUrl()}
              className="flex items-center justify-center gap-2 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange/90 sm:w-auto"
            >
              Search <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-3 flex justify-center border-t border-border pt-3">
            <Link
              href="/design-your-trip"
              className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              Not sure where to go? <span className="font-semibold text-orange">Let us plan it for you</span> <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
