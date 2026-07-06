"use client"

import { Plus, Minus } from "lucide-react"
import { decodeHtmlEntities } from "@/lib/html-decoder"

type FAQ = { question: string; answer: string }

export function FAQSection({
  items,
  title = "Frequently Asked Questions",
  prose = false,
  className = "",
}: {
  items: FAQ[]
  title?: string
  prose?: boolean
  className?: string
}) {
  if (items.length === 0) return null

  return (
    <section className={className}>
      <h2 className="text-2xl font-bold text-navy">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((faq, i) => (
          <details
            key={i}
            className="group rounded-lg border border-border"
          >
            <summary className="flex cursor-pointer items-center justify-between p-4 text-base font-semibold text-navy">
              {faq.question}
              <Plus className="h-4 w-4 shrink-0 group-open:hidden" />
              <Minus className="hidden h-4 w-4 shrink-0 group-open:block" />
            </summary>
            {prose ? (
              <div
                className="prose prose-lg w-full max-w-none border-t border-border px-4 py-3 wrap-break-word **:wrap-break-word prose-p:leading-relaxed prose-p:text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: decodeHtmlEntities(faq.answer),
                }}
              />
            ) : (
              <p className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            )}
          </details>
        ))}
      </div>
    </section>
  )
}
