"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Mountain, FileText, Command } from "lucide-react"

type Result = {
  title: string
  slug: string
  type: "trip" | "blog"
  image: string
  subtitle: string
}

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{ trips: Result[]; blogs: Result[] }>({ trips: [], blogs: [] })
  const [loading, setLoading] = useState(false)
  const [idx, setIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const allResults = [...results.trips, ...results.blogs]

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults({ trips: [], blogs: [] })
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data)
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
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((p) => !p)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery("")
      setResults({ trips: [], blogs: [] })
      setIdx(-1)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

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
        window.location.href = item.type === "trip" ? `/trip/${item.slug}` : `/blog/${item.slug}`
      } else if (query.trim()) {
        window.location.href = `/explore?search=${encodeURIComponent(query.trim())}`
      }
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
        {items.map((item) => {
          const globalIdx = allResults.indexOf(item)
          return (
            <Link
              key={`${item.type}-${item.slug}`}
              href={item.type === "trip" ? `/trip/${item.slug}` : `/blog/${item.slug}`}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${globalIdx === idx ? "bg-accent/30" : "hover:bg-accent/20"}`}
              onMouseEnter={() => setIdx(globalIdx)}
              onClick={() => setOpen(false)}
            >
              <Image src={item.image} alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded object-cover" />
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

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-navy"
        aria-label="Search"
      >
        <span className="hidden lg:inline">Search</span>
        <kbd className="hidden lg:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative z-10 w-full max-w-xl rounded-xl border border-border bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIdx(-1) }}
            onKeyDown={onKeyDown}
            placeholder="Search trips, blogs..."
            className="w-full bg-transparent px-3 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {loading && (
            <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
          )}
          <kbd className="ml-2 flex h-5 shrink-0 items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            esc
          </kbd>
        </div>

        {(results.trips.length > 0 || results.blogs.length > 0) && (
          <div className="max-h-80 overflow-y-auto">
            {section("Trips", results.trips, Mountain)}
            {section("Blogs", results.blogs, FileText)}
          </div>
        )}

        {query.length >= 2 && !loading && allResults.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No results found for &ldquo;{query}&rdquo;
          </div>
        )}

        {query.length < 2 && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            Type to search trips and blogs...
          </div>
        )}
      </div>
    </div>
  )
}
