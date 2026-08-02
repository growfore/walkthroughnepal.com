"use client"

import { useEffect, useState } from "react"

export function TocSidebar({ items }: { items: { id: string; text: string }[] }) {
  const [activeId, setActiveId] = useState("")

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null)
    if (!headings.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id)
        }
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
    )
    headings.forEach((h) => obs.observe(h))
    return () => obs.disconnect()
  }, [items])

  return (
    <nav className="not-prose sticky top-28 max-h-[calc(100vh-8rem)] overflow-auto">
      <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Table of Contents
      </h2>
      <ul className="mt-3 space-y-2 border-l border-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`-ml-px block border-l-2 pl-4 text-sm transition-colors ${
                activeId === item.id
                  ? "border-orange font-semibold text-orange"
                  : "border-transparent text-navy hover:border-orange hover:text-orange"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
