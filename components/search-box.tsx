"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Mountain, FileText } from "lucide-react"

type Result = {
  title: string
  slug: string
  type: "trip" | "blog"
  image: string
  subtitle: string
}

export function SearchBox() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{ trips: Result[]; blogs: Result[] }>({ trips: [], blogs: [] })
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [idx, setIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const allResults = [...results.trips, ...results.blogs]

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults({ trips: [], blogs: [] })
      setOpen(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data)
      setOpen(data.trips.length > 0 || data.blogs.length > 0)
    } catch {
      setResults({ trips: [], blogs: [] })
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 250)
    return () => clearTimeout(timer)
  }, [query, doSearch])

  useEffect(() => {
    if (!open) setIdx(-1)
  }, [open])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  function onKeyDown(e: React.KeyboardEvent) {
    const total = allResults.length
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setIdx((p) => (p < total - 1 ? p + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setIdx((p) => (p > 0 ? p - 1 : total - 1))
    } else if (e.key === "Enter") {
      if (idx >= 0) {
        const item = allResults[idx]
        window.location.href = item.type === "trip" ? `/package/${item.slug}` : `/blog/${item.slug}`
      } else if (query.trim()) {
        window.location.href = `/explore?search=${encodeURIComponent(query.trim())}`
      }
    } else if (e.key === "Escape") {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  function section(label: string, items: Result[], icon: typeof Mountain) {
    if (!items.length) return null
    const Icon = icon
    return (
      <div>
        <div className="px-4 py-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
          <Icon className="h-3 w-3" /> {label}
        </div>
        {items.map((item, i) => {
          const globalIdx = allResults.indexOf(item)
          return (
            <Link
              key={`${item.type}-${item.slug}`}
              href={item.type === "trip" ? `/package/${item.slug}` : `/blog/${item.slug}`}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${globalIdx === idx ? "bg-accent/30" : "hover:bg-accent/20"}`}
              onMouseEnter={() => setIdx(globalIdx)}
            >
              <img src={item.image} alt="" className="h-9 w-9 shrink-0 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-navy">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.subtitle}</div>
              </div>
            </Link>
          )
        })}
      </div>
    )
  }

  function submitSearch() {
    if (query.trim()) {
      window.location.href = `/explore?search=${encodeURIComponent(query.trim())}`
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center rounded-full border-2 border-border bg-background/95 shadow-lg backdrop-blur-sm has-[input:focus]:border-orange has-[input:focus]:ring-4 has-[input:focus]:ring-orange/20">
        <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (allResults.length > 0) setOpen(true) }}
          onKeyDown={onKeyDown}
          placeholder="Where do you want to go?"
          className="w-full bg-transparent py-4 pl-14 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          onClick={submitSearch}
          className="mr-1.5 flex items-center gap-1.5 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-orange-foreground hover:opacity-90 transition shrink-0"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Search
        </button>
      </div>
      {open && (results.trips.length > 0 || results.blogs.length > 0) && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 max-h-80 overflow-y-auto rounded-lg border border-border bg-card shadow-xl">
          {section("Trips", results.trips, Mountain)}
          {section("Blogs", results.blogs, FileText)}
        </div>
      )}
    </div>
  )
}
