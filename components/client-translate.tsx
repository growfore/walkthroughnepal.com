"use client"

import { useEffect, useId } from "react"
import { LOCALES } from "@/lib/locales"

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: {
      translate?: {
        TranslateElement: new (
          options: Record<string, unknown>,
          id: string,
        ) => unknown
        TranslateElementInlinedLayout: unknown
      }
    }
  }
}

// Full in-scope language list so element.js renders a populated combo. A single-code
// `includedLanguages` produces an empty select — translation never fires.
const GT_LANGS = LOCALES.filter((l) => l.code !== "en")
  .map((l) => l.code)
  .join(",")

export function ClientTranslate({ locale = "en" }: { locale?: string }) {
  const id = useId().replace(/:/g, "")
  const nodeId = `google_translate_element_${id}`

  useEffect(() => {
    if (locale === "en") return

    window.googleTranslateElementInit = () => {
      const Ctor = window.google?.translate?.TranslateElement
      if (Ctor) new Ctor({ pageLanguage: "en", includedLanguages: GT_LANGS, autoDisplay: false }, nodeId)
    }

    const script = window.document.createElement("script")
    script.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`
    script.async = true
    window.document.body.appendChild(script)

    // Auto-translate after the combo is rendered. element.js boots asynchronously, so poll.
    let tries = 0
    const interval = window.setInterval(() => {
      const combo = window.document.querySelector(`#${nodeId} .goog-te-combo`) as HTMLSelectElement | null
      if (combo && combo.options.length > 0) {
        window.clearInterval(interval)
        combo.value = locale
        combo.dispatchEvent(new Event("change", { bubbles: true }))
      } else if (++tries > 30) {
        window.clearInterval(interval)
      }
    }, 600)

    return () => {
      window.clearInterval(interval)
      script.remove()
      window.document.querySelector(`#${nodeId} select`)?.remove()
    }
  }, [locale, id, nodeId])

  if (locale === "en") return null

  return (
    <div
      id={nodeId}
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
      aria-hidden="true"
    />
  )
}