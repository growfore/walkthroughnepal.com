"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import { ChevronDown, Tags, UsersRound, LucideCircleQuestionMark } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { groupDiscountTable } from "@/lib/group-discount"
import type { Activity, Tier } from "@/lib/types"

function UserRoundGroup({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M17 21a5 5 0 00-10 0" />
      <path d="M22 10.5a3.5 3.5 0 00-5.507-2.868" />
      <path d="M7.507 7.632A3.5 3.5 0 002 10.5" />
      <circle cx="12" cy="13" r="3" />
      <circle cx="18.5" cy="4.5" r="2.5" />
      <circle cx="5.5" cy="4.5" r="2.5" />
    </svg>
  )
}

function priceOf(raw: string) {
  const n = Number(String(raw).replace(/[^0-9.]/g, ""))
  return Number.isFinite(n) ? n : 0
}

const PriceCtx = createContext<{ price: number; setPrice: (p: number) => void } | null>(null)

export function PriceProvider({ defaultValue, children }: { defaultValue: number; children: ReactNode }) {
  const [price, setPrice] = useState(defaultValue)
  return <PriceCtx.Provider value={{ price, setPrice }}>{children}</PriceCtx.Provider>
}

function useSelectedPrice() {
  const ctx = useContext(PriceCtx)
  if (!ctx) throw new Error("useSelectedPrice must be used within PriceProvider")
  return ctx
}

export type PriceLabels = {
  people: string
  pricePerPerson: string
  inquireMore: string
  inquireMoreTooltip: string
  standard: string
}

export function PriceCard({
  slug,
  basePrice,
  maxPrice,
  tiers,
  groupDiscount,
  showGroupDiscount,
  maxPax,
  labels,
  children,
}: {
  slug: string
  basePrice: number
  maxPrice: number
  tiers: Tier[]
  groupDiscount?: Activity["groupDiscount"]
  showGroupDiscount: boolean
  maxPax: number
  labels: PriceLabels
  children?: ReactNode
}) {
  const { price, setPrice } = useSelectedPrice()
  const strike = maxPrice > 0 && maxPrice > price

  const options = useMemo(() => {
    const tierOptions = tiers.map((t) => ({
      id: t.id,
      label: t.name,
      value: priceOf(t.price),
      standard: priceOf(t.price) === basePrice,
    }))
    return tierOptions.some((o) => o.standard)
      ? tierOptions
      : [{ id: "standard", label: labels.standard, value: basePrice, standard: false }, ...tierOptions]
  }, [tiers, basePrice, labels.standard])

  const [selectedId, setSelectedId] = useState(
    () => options.find((o) => o.value === basePrice)?.id ?? options[0]?.id ?? "standard"
  )

  const selectOption = (id: string) => {
    setSelectedId(id)
    const option = options.find((o) => o.id === id)
    if (option) setPrice(option.value)
  }

  // ponytail: dropdown options share the same discount rules — only the base price feeds the table
  const groupDiscounts = useMemo(
    () => groupDiscountTable(price, groupDiscount),
    [price, groupDiscount]
  )

  const priceLine = (
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold text-navy">
        ${price.toLocaleString("en-US")}<span className="text-sm font-normal text-muted-foreground">/pp</span>
      </span>
      {strike && (
        <span className="text-sm text-muted-foreground line-through">
          ${maxPrice.toLocaleString("en-US")}
        </span>
      )}
    </div>
  )

  return (
    <div id="price-card" className="rounded-lg border border-border bg-card shadow-sm">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-3">
          {priceLine}
          {options.length > 1 && (
            <div className="flex w-full flex-col gap-2" role="radiogroup" aria-label="Select pricing option">
              {options.map((o) => (
                <label
                  key={o.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm transition-colors ${
                    o.id === selectedId
                      ? "border-primary bg-primary/5"
                      : "border-hairline hover:border-primary/40"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={slug}
                      value={o.id}
                      checked={o.id === selectedId}
                      onChange={() => selectOption(o.id)}
                      className="size-4 accent-primary"
                    />
                    <span className={o.id === selectedId ? "font-semibold" : ""}>{o.label}</span>
                    {o.standard && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                        {labels.standard}
                      </span>
                    )}
                  </span>
                  <span className="font-semibold text-navy">
                    ${o.value.toLocaleString("en-US")}<span className="text-xs font-normal text-muted-foreground">/pp</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {showGroupDiscount && groupDiscounts && (
          <details className="group mt-3" open>
            <summary className="flex w-full cursor-pointer list-none items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2 text-sm font-semibold text-navy [&::-webkit-details-marker]:hidden">
              Group booking discount
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-2 overflow-hidden rounded-md border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2">{labels.people}</th>
                    <th className="px-3 py-2 text-right">{labels.pricePerPerson}</th>
                  </tr>
                </thead>
                <tbody>
                  {groupDiscounts.map((row) => (
                    <tr key={row.pax} className="border-b border-border last:border-0">
                      <td className="px-3 py-2 text-navy">
                        <span className="inline-flex items-center gap-1.5">
                          {row.start >= 3 ? (
                            <UserRoundGroup className="h-4 w-4" />
                          ) : (
                            <UsersRound className="h-4 w-4" />
                          )}
                          {row.pax}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-navy">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-bold">
                            ${row.price.toLocaleString("en-US")}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-bold text-success">
                            <Tags className="h-3.5 w-3.5" />
                            {row.discount}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <span>{labels.inquireMore}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <LucideCircleQuestionMark className="h-4 w-4 shrink-0 cursor-pointer text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-42">
                  {labels.inquireMoreTooltip}
                </TooltipContent>
              </Tooltip>
            </div>
          </details>
        )}

        <Link
          href={`/inquiry?trip=${slug}`}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-orange px-4 py-3 font-semibold text-orange-foreground hover:opacity-90 underline text-lg"
        >
          Inquire Now
        </Link>
        <a
          href="#departures"
          className="mt-2 text-lg flex w-full items-center justify-center gap-2 rounded-lg border border-navy bg-transparent px-4 py-3  font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
        >
          Check Availability
        </a>
      </div>

      {children}
    </div>
  )
}

export function MobilePriceBar({ slug, maxPrice }: { slug: string; maxPrice: number }) {
  const { price } = useSelectedPrice()
  const showStrike = maxPrice > 0 && maxPrice > price

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background px-4 py-3 shadow-lg lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">From</div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-navy">
              ${price.toLocaleString("en-US")}
            </span>
            {showStrike && (
              <span className="text-xs text-muted-foreground line-through">
                ${maxPrice.toLocaleString("en-US")}
              </span>
            )}
            <span className="text-xs text-muted-foreground">/pp</span>
          </div>
        </div>
        <Link
          href={`/inquiry?trip=${slug}`}
          className="shrink-0 rounded-lg bg-orange px-6 py-3 text-sm font-bold text-orange-foreground hover:opacity-90"
        >
          Inquire Now
        </Link>
      </div>
    </div>
  )
}
