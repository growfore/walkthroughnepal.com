"use client"

import { useEffect, useId } from "react"

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

export function ClientTranslate({ locale = "en" }: { locale?: string }) {
  const id = useId().replace(/:/g, "")

  useEffect(() => {
    if (locale === "en") return
    const script = window.document.createElement("script")
    script.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`
    script.async = true

    window.googleTranslateElementInit = () => {
      const Ctor = window.google?.translate?.TranslateElement
      if (Ctor) {
        new Ctor(
          {
            pageLanguage: "en",
            includedLanguages: locale,
            autoDisplay: true,
          },
          `google_translate_element_${id}`,
        )
      }
    }

    window.document.body.appendChild(script)
    return () => {
      window.document.querySelector(`#google_translate_element_${id} select`)?.remove()
      script.remove()
    }
  }, [locale, id])

  if (locale === "en") return null

  return (
    <div
      id={`google_translate_element_${id}`}
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
      aria-hidden="true"
    />
  )
}