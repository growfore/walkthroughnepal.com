"use client"

import { type ReactNode } from "react"

export function StickyWrapper({ children, className, offset = 104 }: { children: ReactNode; className?: string; offset?: number }) {
  return (
    <div className={className} style={{ top: offset }}>
      {children}
    </div>
  )
}
