"use client"

import { renderRichText } from "@/lib/html-decoder"
import { resolveContentImages, API_BASE } from "@/lib/api"
import { parseListItems } from "@/lib/forms"
import { siteConfig } from "@/lib/siteConfig"
import { AltitudeChart } from "@/components/altitude-chart"
import type { Activity, ItineraryVariant } from "@/lib/types"

function stripStyles(html: string): string {
  // Remove all inline styles and class attributes
  let out = html.replace(/\s*style="[^"]*"/gi, "")
  out = out.replace(/\s*class="[^"]*"/gi, "")
  // Add table borders and padding directly on elements
  out = out.replace(/<table/gi, '<table style="width:100%;border-collapse:collapse;border:1px solid #000;color:#000;margin:8px 0"')
  out = out.replace(/<th/gi, '<th style="border:1px solid #000;padding:8px;color:#000;font-weight:700;text-align:left"')
  out = out.replace(/<td/gi, '<td style="border:1px solid #000;padding:8px;color:#000"')
  // Restore list styling
  out = out.replace(/<ul/gi, '<ul style="list-style-type:disc;padding-left:1.5rem;margin:8px 0"')
  out = out.replace(/<ol/gi, '<ol style="list-style-type:decimal;padding-left:1.5rem;margin:8px 0"')
  out = out.replace(/<li/gi, '<li style="margin-bottom:4px"')
  // Ensure paragraphs have consistent spacing
  out = out.replace(/<p/gi, '<p style="margin:0 0 0.75em 0"')
  return out
}

interface TripPrintPageProps {
  pkg: Activity
  itineraryVariants: ItineraryVariant[]
}

export function TripPrintPage({ pkg, itineraryVariants }: TripPrintPageProps) {
  const API = API_BASE
  const difficulty = pkg.difficultyLevel?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ?? "Moderate"

  return (
    <div className="mx-auto max-w-[900px] px-4 py-8">
      {/* Print Button */}
      <div className="no-print mb-6 text-center">
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-orange px-6 py-3 text-sm font-bold text-orange-foreground hover:opacity-90"
        >
          Print this page
        </button>
      </div>

      {/* Hero Image */}
      {pkg.images?.[0] && (
        <img
          src={`${API}${pkg.images[0]}`}
          alt={pkg.title}
          className="w-full rounded-lg object-cover"
          style={{ maxHeight: "400px" }}
        />
      )}

      {/* Title */}
      <h1 className="mt-6 text-2xl font-bold text-navy uppercase">
        {pkg.title} – {pkg.duration}
      </h1>

      {/* Trip Facts Table */}
      <h2 className="mt-8 text-xl font-bold text-navy uppercase border-b border-navy pb-2">
        Trip Overview
      </h2>
      <table className="mt-4 w-full border-collapse border border-black">
        <tbody>
          <FactRow label="Country" value="Nepal" />
          <FactRow label="Duration" value={pkg.duration} />
          <FactRow label="Difficulty" value={difficulty} />
          <FactRow label="Max Altitude" value={pkg.maximumAltitude} />
          <FactRow label="Meals" value={pkg.meals} />
          <FactRow label="Accommodation" value={pkg.accommodations?.join(", ") || "Tea House"} />
          <FactRow label="Best Season" value={pkg.bestSeason} />
        </tbody>
      </table>

      {/* Trip Highlights */}
      {pkg.highlights?.length > 0 && (
        <Section title="Trip Highlights">
          <ul className="list-disc pl-5 space-y-2">
            {pkg.highlights.flatMap((h) => parseListItems(renderRichText(h))).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </Section>
      )}

      {/* Full Description */}
      {pkg.fullDescription && (
        <Section title="Trip Description">
          <div
            className="mt-4 text-base leading-relaxed text-black print-plain"
            dangerouslySetInnerHTML={{
              __html: stripStyles(resolveContentImages(renderRichText(pkg.fullDescription))),
            }}
          />
        </Section>
      )}

      {/* Itinerary */}
      <Section title="Detailed Itinerary">
        {itineraryVariants.map((variant) => (
          <div key={variant.id}>
            {variant.name !== "Standard" && (
              <h3 className="text-lg font-bold text-navy mt-6 mb-2">{variant.name}</h3>
            )}
            {variant.days.map((day) => (
              <div key={day.day} className="border-b border-gray-200 py-4 last:border-b-0">
                <h4 className="font-bold text-navy text-base">
                  Day {day.day} – {day.title}
                </h4>
                <table className="mt-2 w-full border-collapse border border-black">
                  <tbody>
                    {day.ascent && <FactRow label="Ascent" value={day.ascent} />}
                    {day.descent && <FactRow label="Descent" value={day.descent} />}
                    {day.distance && <FactRow label="Distance" value={day.distance} />}
                    {day.duration && <FactRow label="Duration" value={day.duration} />}
                    {day.accommodations?.length > 0 && (
                      <FactRow label="Accommodation" value={day.accommodations.join(", ")} />
                    )}
                    {day.meals?.length > 0 && (
                      <FactRow label="Meals" value={day.meals.join(", ")} />
                    )}
                  </tbody>
                </table>
                <div
                  className="mt-2 text-base leading-relaxed text-black print-plain"
                  dangerouslySetInnerHTML={{
                    __html: stripStyles(resolveContentImages(renderRichText(day.description))),
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </Section>

      {/* Price Includes */}
      {pkg.inclusions?.length > 0 && (
        <Section title="Price Includes">
          <ul className="list-disc pl-5 space-y-2">
            {pkg.inclusions.flatMap((h) => parseListItems(renderRichText(h))).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: resolveContentImages(item) }} />
            ))}
          </ul>
        </Section>
      )}

      {/* Price Excludes */}
      {pkg.exclusions?.length > 0 && (
        <Section title="Price Excludes">
          <ul className="list-disc pl-5 space-y-2">
            {pkg.exclusions.flatMap((h) => parseListItems(renderRichText(h))).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: resolveContentImages(item) }} />
            ))}
          </ul>
        </Section>
      )}

      {/* Map */}
      {pkg.map && (
        <Section title="Trip Map">
          <div
            className="mt-4 mb-8 text-base text-black"
            dangerouslySetInnerHTML={{
              __html: stripStyles(resolveContentImages(renderRichText(pkg.map))),
            }}
          />
        </Section>
      )}

      {/* Altitude Profile */}
      {pkg.altitudeChart?.length > 0 && (
        <Section title="Altitude Profile">
          <div className="mt-4 overflow-hidden">
            <div className="min-w-0 w-full [&_div]:!min-w-0 [&_div]:!w-full">
              <AltitudeChart data={pkg.altitudeChart} />
            </div>
          </div>
        </Section>
      )}

      {/* FAQs */}
      {pkg.faqs?.length > 0 && (
        <Section title="Frequently Asked Questions">
          {pkg.faqs.map((group, gi) => (
            <div key={gi}>
              {group.faqs.map((faq, fi) => (
                <div key={fi} className="mb-4">
                  <h4 className="font-bold text-navy">{faq.question}</h4>
                  <div
                    className="mt-1 text-base leading-relaxed text-black"
                    dangerouslySetInnerHTML={{
                      __html: stripStyles(resolveContentImages(renderRichText(faq.answer))),
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </Section>
      )}

      {/* Contact Info */}
      <Section title="Contact Us">
        <div className="space-y-2">
          <p><strong>{siteConfig.name}</strong></p>
          <p>{siteConfig.fullAddress}</p>
          <p>Phone: {siteConfig.phoneNumbers[0].phone}</p>
          <p>Email: {siteConfig.email}</p>
          <p>Hours: {siteConfig.openHours}</p>
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-navy uppercase border-b border-navy pb-2">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td className="py-2 px-2 font-bold text-black whitespace-nowrap border border-black">{label}</td>
      <td className="py-2 px-2 text-black border border-black">{value}</td>
    </tr>
  )
}
