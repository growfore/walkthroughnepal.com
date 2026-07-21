"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, ChevronRight, Clock, Mountain, Tag, ChevronDown, Check, X } from "lucide-react"

type Category = {
  img: string
  title: string
  sub: string
  handle: string
}

const DURATIONS = [
  { label: "1–3 Days", value: "short" },
  { label: "4–7 Days", value: "medium" },
  { label: "8–14 Days", value: "long" },
  { label: "15+ Days", value: "extended" },
]

const DIFFICULTIES = [
  { label: "Easy", value: "easy" },
  { label: "Moderate", value: "moderate" },
  { label: "Challenging", value: "challenging" },
]

function Combobox({
  icon: Icon,
  placeholder,
  options,
  value,
  onChange,
}: {
  icon: typeof Clock
  placeholder: string
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selected = options.find((o) => o.value === value)

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )

  const close = useCallback(() => {
    setOpen(false)
    setSearch("")
  }, [])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [close])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  return (
    <div ref={ref} className="relative w-full sm:w-auto z-50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition sm:w-auto ${
          open
            ? "border-orange bg-orange/5 text-foreground"
            : "border-border bg-background text-muted-foreground hover:border-foreground/30"
        }`}
      >
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className={selected ? "text-foreground" : ""}>
          {selected ? selected.label : placeholder}
        </span>
        {selected && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange("")
            }}
            className="ml-1 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        )}
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-56 overflow-hidden rounded-lg border border-border bg-white shadow-xl">
          <div className="border-b border-border p-2">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-md bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-orange/50"
            />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value === value ? "" : opt.value)
                    close()
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition hover:bg-accent ${
                    opt.value === value ? "text-orange" : "text-foreground"
                  }`}
                >
                  <Check className={`h-4 w-4 shrink-0 ${opt.value === value ? "opacity-100" : "opacity-0"}`} />
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function SearchSection({ categories }: { categories: Category[] }) {
  const [query, setQuery] = useState("")
  const [selectedDuration, setSelectedDuration] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const categoryOptions = categories.map((c) => ({ label: c.title, value: c.handle }))

  function buildExploreUrl() {
    const params = new URLSearchParams()
    if (query.trim()) params.set("search", query.trim())
    if (selectedDuration) params.set("duration", selectedDuration)
    if (selectedDifficulty) params.set("difficulty", selectedDifficulty)
    if (selectedCategory) params.set("category", selectedCategory)
    return `/explore${params.toString() ? `?${params.toString()}` : ""}`
  }

  return (
    <section className="relative z-30 bg-navy py-16 text-white md:py-20">
      {/* Background pattern */}
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
            Search by name, pick a category, or filter by duration and difficulty.
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
                  if (e.key === "Enter") {
                    window.location.href = buildExploreUrl()
                  }
                }}
              />
            </div>
            <Link
              href={buildExploreUrl()}
              className="flex items-center justify-center gap-2 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange/90 sm:w-auto"
            >
              Search <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Combobox filters */}
          <div className="relative mt-3 flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center">
            <Combobox
              icon={Tag}
              placeholder="Category"
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
            <Combobox
              icon={Clock}
              placeholder="Duration"
              options={DURATIONS}
              value={selectedDuration}
              onChange={setSelectedDuration}
            />
            <Combobox
              icon={Mountain}
              placeholder="Difficulty"
              options={DIFFICULTIES}
              value={selectedDifficulty}
              onChange={setSelectedDifficulty}
            />
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
