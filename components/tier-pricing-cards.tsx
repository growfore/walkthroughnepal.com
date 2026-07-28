"use client"

import { Check } from "lucide-react"
import type { Tier } from "@/lib/types"

export function TierPricingCards({ tiers, hasSlots, onSelect }: { tiers: Tier[]; hasSlots: boolean; onSelect?: (tier?: Tier) => void }) {
  if (!tiers.length) return null

  return (
    <section id="pricing" className="py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative flex flex-col gap-3 p-6 rounded-2xl border bg-card transition-shadow ${
              tier.bestValue
                ? "border-primary shadow-md"
                : "border-hairline shadow-sm hover:shadow-md"
            }`}
          >
            {tier.bestValue && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full">
                Best Value
              </span>
            )}
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {tier.name}
            </p>
            <p className="text-3xl font-bold tracking-tight text-ink">
              {tier.price}
            </p>
            <ul className="mt-2 space-y-2.5 text-sm">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="size-4 mt-0.5 shrink-0 text-success" />
                  <span className="text-body">{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="/inquiry"
              onClick={() => onSelect?.(tier)}
              className={`mt-3 block text-center py-2.5 px-5 rounded-lg text-sm font-semibold transition-shadow hover:shadow-md ${
                tier.bestValue
                  ? "bg-primary text-primary-foreground border border-primary"
                  : "bg-secondary text-secondary-foreground border border-hairline"
              }`}
            >
              Inquire Now
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
