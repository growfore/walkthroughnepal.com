import type { Activity } from "./types"

type GroupDiscountRule = NonNullable<Activity["groupDiscount"]>[number]

export function groupDiscountTable(
  basePrice: number,
  rules?: GroupDiscountRule[]
) {
  if (!rules?.length) return null

  const sorted = rules
    .filter((rule) => rule.groupSize >= 2 && rule.discount > 0)
    .sort((a, b) => a.groupSize - b.groupSize)
  if (!sorted.length) return null

  let start = 2
  return sorted.map((rule) => {
    const discountAmount =
      rule.discountType === "PERCENTAGE"
        ? basePrice * (rule.discount / 100)
        : rule.discount
    const row = {
      pax:
        start === rule.groupSize
          ? `${rule.groupSize} Pax`
          : `${start}-${rule.groupSize} Pax`,
      price: Math.round(Math.max(0, basePrice - discountAmount)),
      discount:
        rule.discountType === "PERCENTAGE"
          ? `${rule.discount}% Off`
          : `USD ${rule.discount.toLocaleString()} Off`,
      start,
    }
    start = rule.groupSize + 1
    return row
  })
}
