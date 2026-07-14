"use client"

import { useState } from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { renderRichText } from "@/lib/html-decoder"
import type { FAQGroup } from "@/lib/types"
import {
  HelpCircle,
  MapPin,
  DollarSign,
  Calendar,
  Shield,
  Users,
  Mountain,
  Luggage,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  HelpCircle,
  MapPin,
  DollarSign,
  Calendar,
  Shield,
  Users,
  Mountain,
  Luggage,
}

function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? HelpCircle
}

export function FAQSection({
  groups,
  title = "Frequently Asked Questions",
  className = "",
  ...props
}: {
  groups: FAQGroup[]
  title?: string
  className?: string
  id?: string
}) {
  const [active, setActive] = useState(0)

  if (groups.length === 0) return null

  return (
    <section className={className} {...props}>
      <h2 className="text-2xl font-bold text-navy">{title}</h2>

      <div className="mt-6 flex flex-col gap-6 md:flex-row md:gap-8">
        {/* Left: group nav */}
        <nav className="flex flex-row gap-2 overflow-x-auto md:sticky md:top-24 md:flex-col md:overflow-visible">
          {groups.map((group, i) => {
            const Icon = getIcon(group.icon)
            return (
              <button
                key={i}
                onClick={() => {
                  setActive(i)
                  document.getElementById(`faq-group-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
                }}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                  active === i
                    ? "bg-navy text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{group.category}</span>
                <span className="ml-auto hidden text-xs opacity-60 md:inline">{group.faqs.length}</span>
              </button>
            )
          })}
        </nav>

        {/* Right: FAQ accordions per group */}
        <div className="min-w-0 flex-1 space-y-8">
          {groups.map((group, i) => (
            <div key={i} id={`faq-group-${i}`}>
              <h3 className="mb-3 text-lg font-bold text-navy">{group.category}</h3>
              <Accordion type="multiple" className="space-y-3">
                {group.faqs.map((faq, j) => (
                  <AccordionItem
                    key={j}
                    value={`${i}-${j}`}
                    className="rounded-lg border border-border not-last:border-b"
                  >
                    <AccordionTrigger className="px-4 py-4 text-base font-semibold text-navy hover:no-underline focus-visible:ring-0 [&[data-open]>svg]:rotate-0">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent forceMount className="data-[state=closed]:hidden">
                      <div
                        className="prose prose-lg w-full max-w-none border-t border-border px-4 py-3 wrap-break-word **:wrap-break-word prose-p:leading-relaxed prose-p:text-muted-foreground"
                        dangerouslySetInnerHTML={{
                          __html: renderRichText(faq.answer),
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
