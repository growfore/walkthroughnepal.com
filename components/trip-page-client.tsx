"use client"

import { useState } from "react"
import { TierPricingCards } from "@/components/tier-pricing-cards"
import { DeparturesSection } from "@/components/departures-section"
import type { Tier, Slot } from "@/lib/types"

export function TripPageClient({
  tiers,
  hasSlots,
  slots,
  slug,
  tripTitle,
}: {
  tiers: Tier[]
  hasSlots: boolean
  slots: Slot[]
  slug: string
  tripTitle: string
}) {
  // PONYTAIL: Departures tab disabled — payments API not active yet
  // const [tab, setTab] = useState<"departures" | "private">("departures")
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null)

  const privateTiers = tiers

  return (
    <>
      {tiers.length > 0 && (
        <div className="mt-12 scroll-mt-40">
          <TierPricingCards
            tiers={tiers}
            hasSlots={hasSlots}
            onSelect={(tier) => {
              // PONYTAIL: Departures tab disabled — payments API not active yet
              // setTab(newTab)
              if (tier) setSelectedTier(tier)
            }}
          />
        </div>
      )}

      <DeparturesSection
        slots={slots}
        slug={slug}
        tripTitle={tripTitle}
        // PONYTAIL: Departures tab disabled — payments API not active yet
        // tab={tab}
        // onTabChange={setTab}
        tiers={privateTiers}
        selectedTier={selectedTier}
      />
    </>
  )
}
