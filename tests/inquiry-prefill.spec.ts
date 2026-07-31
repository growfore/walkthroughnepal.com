import { test, expect } from "@playwright/test"

test("inquiry page prefills trip, date, and departure details", async ({ page }) => {
  const details = encodeURIComponent(
    "Date: Wed, Oct 15 2026\nDuration: 9 days\nPrice: $849 / person\nAvailability: 7 seats",
  )
  await page.goto(`/inquiry?trip=annapurna-base-camp-trek&date=2026-10-15&details=${details}`)
  await expect(page.locator('input[placeholder="Search for a trip..."]')).toHaveValue(/Annapurna Base Camp Trek/)
  await expect(page.locator('input[type="date"]')).toHaveValue("2026-10-15")
  await expect(page.locator("textarea")).toHaveValue(/Group Departure Details:/)
})
