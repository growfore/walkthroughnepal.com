import { test, expect } from "@playwright/test"

let testSlug = "annapurna-base-camp" // fallback

test.beforeAll(async ({ request }) => {
  try {
    const res = await request.get(
      `${process.env.BASE_URL ?? "https://api.walkthroughnepal.com"}/api/v1/activity?limit=1`,
    )
    if (res.ok()) {
      const data = await res.json()
      testSlug = data?.data?.[0]?.slug ?? testSlug
    }
  } catch {
    // use fallback
  }
})

test("trip page loads with title", async ({ page }) => {
  const res = await page.goto(`/trip/${testSlug}`, { waitUntil: "domcontentloaded" })
  expect(res?.status()).toBe(200)

  // Page should have an h1 with the trip title
  const h1 = page.locator("h1").first()
  await expect(h1).toBeVisible()
  const title = await h1.textContent()
  expect(title?.length).toBeGreaterThan(3)
})

test("trip page sidebar shows siteConfig phone (not hardcoded)", async ({ page }) => {
  await page.goto(`/trip/${testSlug}`, { waitUntil: "domcontentloaded" })

  // Should NOT contain the old hardcoded number
  const content = await page.locator("body").textContent()
  expect(content).not.toContain("+977 984 123 4567")

  // Should contain a phone number from siteConfig
  const phoneLinks = page.locator('a[href^="tel:"]')
  const count = await phoneLinks.count()
  expect(count).toBeGreaterThan(0)
})

test("trip page has images", async ({ page }) => {
  await page.goto(`/trip/${testSlug}`, { waitUntil: "domcontentloaded" })

  // Should have at least one img or picture element
  const images = page.locator("img, picture img")
  const count = await images.count()
  expect(count).toBeGreaterThan(0)
})

test("trip page has itinerary section", async ({ page }) => {
  await page.goto(`/trip/${testSlug}`, { waitUntil: "domcontentloaded" })

  // Should have some content sections
  const headings = page.locator("h2")
  const count = await headings.count()
  expect(count).toBeGreaterThan(1)
})

test("trip page has departures section", async ({ page }) => {
  await page.goto(`/trip/${testSlug}`, { waitUntil: "domcontentloaded" })

  // Should have a link to the departures section (Check Availability)
  const departuresLink = page.locator('a[href="#departures"]').first()
  await expect(departuresLink).toBeVisible()
})
