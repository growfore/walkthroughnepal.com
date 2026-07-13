"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface Option {
  value: string
  label: string
  icon: ReactNode
  description?: string
}

interface QuizStepProps {
  title: string
  subtitle?: string
  options: Option[]
  selected: string | string[]
  onSelect: (value: string | string[]) => void
  multiple?: boolean
}

export function QuizStep({ title, subtitle, options, selected, onSelect, multiple }: QuizStepProps) {
  const selectedSet = new Set(Array.isArray(selected) ? selected : selected ? [selected] : [])

  function handleClick(value: string) {
    if (multiple) {
      const next = new Set(selectedSet)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      onSelect([...next])
    } else {
      onSelect(value)
    }
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-navy md:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      <div className={cn(
        "mt-8 grid gap-4",
        options.length <= 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3",
      )}>
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleClick(opt.value)}
            className={cn(
              "flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-center transition-all",
              "hover:border-orange hover:bg-orange/5",
              selectedSet.has(opt.value)
                ? "border-orange bg-orange/10 shadow-sm"
                : "border-border bg-card",
            )}
          >
            <div className="text-3xl">{opt.icon}</div>
            <div>
              <div className="font-semibold text-navy">{opt.label}</div>
              {opt.description && (
                <div className="mt-1 text-xs text-muted-foreground">{opt.description}</div>
              )}
            </div>
          </button>
        ))}
      </div>
      {multiple && selectedSet.size > 0 && (
        <p className="mt-4 text-sm text-muted-foreground">{selectedSet.size} selected</p>
      )}
    </div>
  )
}
