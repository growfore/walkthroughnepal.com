"use client"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { decodeHtmlEntities } from "@/lib/html-decoder"

type FAQ = { question: string; answer: string }

export function FAQSection({
  items,
  title = "Frequently Asked Questions",
  prose = false,
  className = "",
  ...props
}: {
  items: FAQ[]
  title?: string
  prose?: boolean
  className?: string
  id?: string
}) {
  if (items.length === 0) return null

  return (
    <section className={className} {...props}>
      <h2 className="text-2xl font-bold text-navy">{title}</h2>
      <Accordion type="multiple" className="mt-4 space-y-3">
        {items.map((faq, i) => (
          <AccordionItem
            key={i}
            value={String(i)}
            className="rounded-lg border border-border not-last:border-b"
          >
            <AccordionTrigger className="px-4 py-4 text-base font-semibold text-navy hover:no-underline focus-visible:ring-0 [&[data-open]>svg]:rotate-0">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent forceMount className="data-[state=closed]:hidden">
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
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
