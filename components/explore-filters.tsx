"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { FilterSheet } from "@/components/filter-sheet"

type FilterValues = { category: string; type: string; min: string; max: string; search: string }

export function ExploreFilters({
  categories,
  tripTypes,
  active,
}: {
  categories: { handle: string; name: string }[]
  tripTypes: { handle: string; name: string }[]
  active: FilterValues
}) {
  const router = useRouter()
  const [query, setQuery] = useState(active.search)
  const [filterValues, setFilterValues] = useState({
    category: active.category,
    min: active.min,
    max: active.max,
  })

  function push(filters: Record<string, string>) {
    const p = new URLSearchParams()
    for (const [k, v] of Object.entries(filters)) {
      if (v) p.set(k, v)
    }
    p.set("page", "1")
    router.push(`/explore?${p.toString()}`)
  }

  function handleSearch() {
    const next: Record<string, string> = { category: active.category, type: active.type }
    if (query.trim()) next.search = query.trim()
    if (active.min) next.min = active.min
    if (active.max) next.max = active.max
    push(next)
  }

  function handleFilterSearch() {
    const next: Record<string, string> = { category: filterValues.category, type: active.type }
    if (filterValues.min) next.min = filterValues.min
    if (filterValues.max) next.max = filterValues.max
    if (active.search) next.search = active.search
    push(next)
  }

  function clearAll() {
    router.push("/explore")
  }

  const hasActive = active.category || active.type || active.min || active.max || active.search

  return (
    <div className="mb-8 space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trips..."
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange/30"
          />
        </div>
        <button
          onClick={handleSearch}
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-orange px-4 text-sm font-medium text-white hover:bg-orange/90 transition"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
        <FilterSheet
          categories={categories}
          values={filterValues}
          setValues={setFilterValues}
          onSearch={handleFilterSearch}
        />
      </div>

      {hasActive && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Active:</span>
          {active.search && (
            <span className="inline-flex items-center gap-1 rounded-full bg-navy/10 px-2.5 py-1 text-xs font-medium text-navy">
              &quot;{active.search}&quot;
              <button onClick={() => {
                const next: Record<string, string> = { category: active.category, type: active.type }
                if (active.min) next.min = active.min
                if (active.max) next.max = active.max
                push(next)
              }} className="ml-0.5 hover:text-navy/70">&times;</button>
            </span>
          )}
          {active.category && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange/10 px-2.5 py-1 text-xs font-medium text-orange">
              {categories.find((c) => c.handle === active.category)?.name ?? active.category}
              <button onClick={() => {
                const next: Record<string, string> = { type: active.type }
                if (active.min) next.min = active.min
                if (active.max) next.max = active.max
                if (active.search) next.search = active.search
                push(next)
              }} className="ml-0.5 hover:text-orange/70">&times;</button>
            </span>
          )}
          {active.type && (
            <span className="inline-flex items-center gap-1 rounded-full bg-navy/10 px-2.5 py-1 text-xs font-medium text-navy">
              {tripTypes.find((t) => t.handle === active.type)?.name ?? active.type}
              <button onClick={() => {
                const next: Record<string, string> = { category: active.category }
                if (active.min) next.min = active.min
                if (active.max) next.max = active.max
                if (active.search) next.search = active.search
                push(next)
              }} className="ml-0.5 hover:text-navy/70">&times;</button>
            </span>
          )}
          {(active.min || active.max) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
              ${active.min || "0"} – ${active.max || "∞"}
              <button onClick={() => {
                const next: Record<string, string> = { category: active.category, type: active.type }
                if (active.search) next.search = active.search
                push(next)
              }} className="ml-0.5 hover:text-success/70">&times;</button>
            </span>
          )}
          <button onClick={clearAll} className="ml-auto text-xs font-medium text-muted-foreground hover:text-navy">Clear all</button>
        </div>
      )}
    </div>
  )
}
