"use client"

import { useEffect } from "react"
import { formatMessage, type Messages } from "@/lib/messages"
import { localizedPath, type LocaleCode } from "@/lib/locales"

const ATTRIBUTES = ["aria-label", "placeholder", "title"] as const

function replaceText(node: Text, messages: Messages) {
  const value = node.textContent ?? ""
  const source = value.trim()
  const count = /^Showing (\d+) of (\d+) trips$/.exec(source)
  const translated = count
    ? formatMessage(messages, "Showing {shown} of {total} trips", { shown: count[1], total: count[2] })
    : messages[source]
  if (translated && translated !== source) node.textContent = value.replace(source, translated)
}

function translateElement(element: Element, messages: Messages, locale: LocaleCode) {
  if (element.closest('[translate="no"]')) return
  for (const attribute of ATTRIBUTES) {
    const source = element.getAttribute(attribute)
    const translated = source ? messages[source] : undefined
    if (translated) element.setAttribute(attribute, translated)
  }
  const links = element.matches("a[href]") ? [element] : Array.from(element.querySelectorAll("a[href]"))
  for (const link of links) {
    const href = link.getAttribute("href")
    if (href?.startsWith("/")) link.setAttribute("href", localizedPath(href, locale))
  }

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      return parent && !parent.closest('[translate="no"]') && !["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(parent.tagName)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT
    },
  })
  let node: Node | null
  while ((node = walker.nextNode())) replaceText(node as Text, messages)
}

export function ClientTranslate({ locale, messages }: { locale: LocaleCode; messages: Messages }) {
  useEffect(() => {
    if (!Object.keys(messages).length) return
    translateElement(document.body, messages, locale)

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") replaceText(mutation.target as Text, messages)
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.TEXT_NODE) replaceText(node as Text, messages)
          else if (node instanceof Element) translateElement(node, messages, locale)
        }
      }
    })
    observer.observe(document.body, { childList: true, characterData: true, subtree: true })
    return () => observer.disconnect()
  }, [locale, messages])

  return null
}
