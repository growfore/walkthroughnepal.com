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

function loadScript(): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      resolve()
      return
    }
    const s = document.createElement("script")
    s.type = "text/javascript"
    s.src = SCRIPT_SRC
    s.async = true
    s.onload = () => resolve()
    document.body.appendChild(s)
  })
}

export function GoogleTranslate() {
  useEffect(() => {
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        new window.google!.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element",
        )
      }
    }
    loadScript()
    window.googleTranslateElementInit()
    return () => {}
  }, [])

  return (
    <div className="fixed bottom-4 left-4 z-[200]">
      <div id="google_translate_element" />
    </div>
  )
}
