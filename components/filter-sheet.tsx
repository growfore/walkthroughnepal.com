"use client"

import { useState, useEffect, type ReactNode } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { SearchableSelect } from "@/components/searchable-select"

type Category = { handle: string; name: string }

type FilterValues = {
  category: string
  min: string
  max: string
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(true)
  useEffect(() => {
    const m = window.matchMedia("(min-width: 640px)")
    if (m.matches !== desktop) setDesktop(m.matches)
    const h = (e: MediaQueryListEvent) => setDesktop(e.matches)
    m.addEventListener("change", h)
    return () => m.removeEventListener("change", h)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- correcting SSR default
  }, [])
  return desktop
}

function FilterBody({
  categories,
  values,
  setValues,
}: {
  categories: Category[]
  values: FilterValues
  setValues: (v: FilterValues) => void
}) {
  return (
    <>
      <SearchableSelect
        label="Category"
        placeholder="All Categories"
        options={categories.map((c) => ({ value: c.handle, label: c.name }))}
        value={values.category}
        onChange={(v) => setValues({ ...values, category: v })}
      />
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Price Range (USD)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={values.min}
            onChange={(e) => setValues({ ...values, min: e.target.value })}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange/30"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={values.max}
            onChange={(e) => setValues({ ...values, max: e.target.value })}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange/30"
          />
        </div>
      </div>
    </>
  )
}

export function FilterSheet({
  categories,
  values,
  setValues,
  onSearch,
  children,
}: {
  categories: Category[]
  values: FilterValues
  setValues: (v: FilterValues) => void
  onSearch: () => void
  children?: ReactNode
}) {
  const desktop = useIsDesktop()
  const [open, setOpen] = useState(false)

  const hasActive = values.category || values.min || values.max
  const activeCount = [values.category, values.min, values.max].filter(Boolean).length

  function handleSearch() {
    setOpen(false)
    onSearch()
  }

  function handleClear() {
    setValues({ category: "", min: "", max: "" })
    setOpen(false)
    onSearch()
  }

  const trigger = children ?? (
    <Button
      variant="outline"
      size="default"
      className="gap-1.5 border-navy/30 text-navy hover:bg-navy/10"
    >
      <SlidersHorizontal className="h-4 w-4" />
      Filters
      {activeCount > 0 && (
        <span className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange text-[10px] font-bold text-white">
          {activeCount}
        </span>
      )}
    </Button>
  )

  if (desktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-sm gap-5">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
            <DialogDescription>Narrow down your search</DialogDescription>
          </DialogHeader>
          <FilterBody categories={categories} values={values} setValues={setValues} />
          <DialogFooter>
            {hasActive && (
              <Button variant="ghost" onClick={handleClear}>Clear</Button>
            )}
            <Button onClick={handleSearch}>Search</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Narrow down your search</DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 px-4">
          <FilterBody categories={categories} values={values} setValues={setValues} />
        </div>
        <DrawerFooter>
          <div className="flex gap-2">
            {hasActive && (
              <Button variant="outline" className="flex-1" onClick={handleClear}>Clear</Button>
            )}
            <Button className="flex-1" onClick={handleSearch}>Search</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
