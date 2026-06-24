"use client"

import { useState, useEffect, type ReactNode } from "react"

export function StickyWrapper({ children, className, offset = 104 }: { children: ReactNode; className?: string; offset?: number }) {
  const [navVisible, setNavVisible] = useState(true)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setNavVisible(y <= 80 || y < lastY)
      lastY = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={className}
      style={{ top: navVisible ? offset : 0 }}
    >
      {children}
    </div>
  )
}
