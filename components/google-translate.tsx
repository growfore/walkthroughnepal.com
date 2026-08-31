"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { LOCALE_CODES, type LocaleCode } from "@/lib/locales"

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: {
      translate: {
        TranslateElement: new (options: Record<string, unknown>, el: string) => void
      }
    }
  }
}

const SCRIPT_SRC = "https://translate.google.com/translate_a/element.js"

function loadScript(): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      resolve()
      return
    }
    const s = document.createElement("script")
    s.src = SCRIPT_SRC
    s.async = true
    s.onload = () => resolve()
    document.body.appendChild(s)
  })
}

function setLanguage(code: LocaleCode) {
  const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null
  if (!select) return
  if (!Array.from(select.options).some((o) => o.value === code)) return
  select.value = code
  select.dispatchEvent(new Event("change"))
}

function ensureWidgetEl() {
  if (!document.getElementById("google_translate_element")) {
    const el = document.createElement("div")
    el.id = "google_translate_element"
    el.className = "hidden"
    document.body.appendChild(el)
  }
}

export function GoogleTranslate({ locale }: { locale: LocaleCode }) {
  const pathname = usePathname()
  const inited = useRef(false)

  useEffect(() => {
    if (locale === "en") return
    let cancelled = false

    loadScript().then(() => {
      if (cancelled) return
      ensureWidgetEl()

      if (!window.googleTranslateElementInit) {
        window.googleTranslateElementInit = () => {
          new window.google!.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: LOCALE_CODES.join(","),
              autoDisplay: false,
            },
            "google_translate_element",
          )
        }
      }
      if (!inited.current) {
        inited.current = true
        window.googleTranslateElementInit()
      }
      // wait for GT to build its <select>, then switch to the target locale
      setTimeout(() => setLanguage(locale), 100)
    })

    return () => {
      cancelled = true
    }
  }, [locale])

  // GT's classic widget does not follow App Router soft navigation — re-apply
  // after each route change so freshly rendered content gets translated.
  useEffect(() => {
    if (locale === "en") return
    const id = setTimeout(() => setLanguage(locale), 400)
    return () => clearTimeout(id)
  }, [pathname, locale])

  return null
}
