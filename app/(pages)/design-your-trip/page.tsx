"use client"

import { LucideMail, LucidePhone, LucideMapPin, LucideCheckCircle2 } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { DesignTripForm } from "@/components/design-trip-form"
import { siteConfig } from "@/lib/siteConfig"

export default function DesignYourTrip() {
  return (
    <main className="bg-canvas min-h-screen">
      <PageHero
        title="Plan Your Custom Itinerary"
        description="Tell us your dream adventure and we'll craft a personalised trek just for you — dates, pace, locations, and every detail."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Design Your Trip" }]}
      />

      <section className="max-w-6xl mx-auto px-6 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
        <div className="lg:col-span-2">
          <DesignTripForm />
        </div>

        <div className="space-y-10 lg:sticky lg:top-10">
          <div>
            <h3 className="text-xl font-bold text-ink mb-6">
              Other Ways to Reach Us
            </h3>
            <div className="space-y-5">
              {([
                { icon: LucideMail, label: "Email", value: siteConfig.email },
                {
                  icon: LucidePhone,
                  label: "Phone",
                  value: siteConfig.phoneNumbers[0]?.phone,
                },
                {
                  icon: LucideMapPin,
                  label: "Location",
                  value: siteConfig.fullAddress,
                },
              ] as const).map(({ icon: Icon, label, value }) => (
                <div key={label}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="size-4 text-primary" />
                    <span className="text-xs font-semibold text-mute uppercase tracking-wider">
                      {label}
                    </span>
                  </div>
                  <p className="text-sm text-ink">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-hairline bg-canvas-soft p-6">
            <h4 className="font-semibold text-ink text-sm mb-2">
              Why Book With Us?
            </h4>
            <ul className="space-y-2 text-sm text-body">
              <li className="flex items-start gap-2">
                <LucideCheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                Authentic local expertise
              </li>
              <li className="flex items-start gap-2">
                <LucideCheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                Handcrafted itineraries
              </li>
              <li className="flex items-start gap-2">
                <LucideCheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                Best price guarantee
              </li>
              <li className="flex items-start gap-2">
                <LucideCheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                24/7 support during your trip
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
