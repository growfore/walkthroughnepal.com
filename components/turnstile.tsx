"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        params: {
          sitekey: string
          appearance: "always" | "execute" | "interaction-only"
          theme?: "light" | "dark"
          callback?: (token: string) => void
          "expired-callback"?: () => void
          "error-callback"?: () => void
        },
      ) => string
      remove: (widgetId: string) => void
    }
  }
}

const SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY

export function Turnstile({ theme }: { theme?: "light" | "dark" }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [token, setToken] = useState("")

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
        callback: (t) => {
          if (!cancelled) setToken(t)
        },
        "expired-callback": () => {
          if (!cancelled) setToken("")
        },
        "error-callback": () => {
          if (!cancelled) setToken("")
        },
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

  return (
    <>
      <div ref={containerRef} className="mt-4" />
      {/* Explicit render doesn't guarantee Turnstile's auto hidden input, so
          mirror the token here; forms read it via form.elements. */}
      <input type="hidden" name="cf-turnstile-response" value={token} />
    </>
  )
}

export function getTurnstileToken(form: HTMLFormElement | null): string | undefined {
  if (!form) return undefined
  const el = form.elements.namedItem("cf-turnstile-response")
  const inputs = el instanceof RadioNodeList ? Array.from(el) : [el]
  return inputs.find((i): i is HTMLInputElement => i instanceof HTMLInputElement && Boolean(i.value))?.value
}
