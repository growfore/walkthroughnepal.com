"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown, Globe } from "lucide-react"
import { LOCALES, type LocaleCode } from "@/lib/locales"

const PREFIX_RE = /^\/(de|es|fr|it|pt)(\/|$)/

function currentFromPath(path: string): LocaleCode {
  const m = PREFIX_RE.exec(path)
  return (m?.[1] as LocaleCode) ?? "en"
}

// Derive the current locale from the real URL, not the prop — a stale/missing
// prop (e.g. SSR request headers) caused prefixes to accumulate (de -> /es/de/).
function buildSwitchUrl(target: LocaleCode): string {
  const path = typeof window === "undefined" ? "/" : window.location.pathname
  const cur = currentFromPath(path)
  if (target === cur) return path
  if (cur === "en") return `/${target}${path === "/" ? "/" : path}`
  const rest = path.slice(3)
  if (target === "en") return rest || "/"
  return `/${target}${rest || "/"}`
}

const COOKIE = "wt-locale"

function persistLocale(code: LocaleCode) {
  // selecting English clears persistence so "" (root) no longer bounces to /de/
  document.cookie =
    code === "en"
      ? `${COOKIE}=; path=/; max-age=0; samesite=lax`
      : `${COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`
}

export function LocaleSwitcher({
  current = "en",
  className = "",
}: {
  current?: LocaleCode
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-navy transition-colors hover:bg-muted"
      >
        <Globe className="size-4 text-muted-foreground" />
        {current.toUpperCase()}
        <ChevronDown size={14} className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute right-0 top-full z-[100] mt-1 min-w-[150px] rounded-xl border border-border bg-white py-1 shadow-lg"
        >
          {LOCALES.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === current}>
              <button
                type="button"
                onClick={() => {
                  if (l.code !== current) {
                    persistLocale(l.code)
                    window.location.href = buildSwitchUrl(l.code)
                  }
                }}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-sm transition-colors hover:bg-muted ${
                  l.code === current ? "font-semibold text-navy" : "text-muted-foreground"
                }`}
              >
                {l.name}
                {l.code === current && <Check className="size-4 text-orange" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}