import assert from "node:assert/strict"
import test from "node:test"

import { groupDiscountTable } from "../lib/group-discount.ts"

test("calculates group prices for percentage and flat discounts", () => {
  assert.deepEqual(
    groupDiscountTable(500, [
      { groupSize: 4, discount: 10, discountType: "PERCENTAGE" },
      { groupSize: 8, discount: 75, discountType: "FLAT" },
    ]),
    [
      { pax: "2-4 Pax", price: 450, discount: "10% Off", start: 2 },
      { pax: "5-8 Pax", price: 425, discount: "USD 75 Off", start: 5 },
    ]
  )
})

test("rounds discounted prices to nearest whole dollar", () => {
  assert.equal(
    groupDiscountTable(455, [
      { groupSize: 4, discount: 15, discountType: "PERCENTAGE" },
    ])?.[0].price,
    387,
  )
})
