"use client"

import { useEffect } from "react"

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

export function GoogleTranslate() {
  useEffect(() => {
    if (document.getElementById("google_translate_element")?.firstChild) return

    window.googleTranslateElementInit = () => {
      new window.google!.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        "google_translate_element",
      )
    }

    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const s = document.createElement("script")
      s.type = "text/javascript"
      s.src = SCRIPT_SRC
      s.async = true
      document.body.appendChild(s)
    }
  }, [])

  return (
    <div className="fixed bottom-4 left-4 z-[200]">
      <div id="google_translate_element" />
    </div>
  )
}
