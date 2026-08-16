"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        params: {
          sitekey: string
          appearance: "always" | "execute" | "interaction-only"
          theme?: "light" | "dark"
        },
      ) => string
      remove: (widgetId: string) => void
    }
  }
}

const SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY

export function Turnstile({ theme }: { theme?: "light" | "dark" }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !SITEKEY) return
    let cancelled = false
    let widgetId: string | undefined
    let poll: ReturnType<typeof setInterval> | undefined

    const render = () => {
      if (cancelled || !window.turnstile || widgetId) return
      widgetId = window.turnstile.render(container, {
        sitekey: SITEKEY,
        appearance: "always",
        ...(theme ? { theme } : {}),
      })
    }

    // api.js loads lazily in the layout; render explicitly once it's ready
    // (auto-render only scans the DOM once at script load, which misses
    // widgets mounted later, e.g. the last step of the design-trip form).
    if (window.turnstile) {
      render()
    } else {
      poll = setInterval(() => {
        if (window.turnstile) {
          if (poll) clearInterval(poll)
          render()
        }
      }, 150)
      setTimeout(() => poll && clearInterval(poll), 8000)
    }

    return () => {
      cancelled = true
      if (poll) clearInterval(poll)
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
    }
  }, [theme])

  return <div ref={containerRef} className="mt-4" />
}

export function getTurnstileToken(form: HTMLFormElement | null): string | undefined {
  const el = form?.elements.namedItem("cf-turnstile-response")
  return el instanceof HTMLInputElement && el.value ? el.value : undefined
}
