import { test, expect } from "@playwright/test"

const STATIC_PAGES = [
  { path: "/", name: "home" },
  { path: "/about", name: "about" },
  { path: "/our-team", name: "our-team" },
  { path: "/explore", name: "explore" },
  { path: "/blog", name: "blog" },
  { path: "/contact", name: "contact" },
  { path: "/design-your-trip", name: "design-your-trip" },
  { path: "/recommend", name: "recommend" },
  { path: "/departure", name: "departure" },
]

for (const { path, name } of STATIC_PAGES) {
  test(`page loads: ${name} (${path})`, async ({ page }) => {
    const errors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text())
    })
    page.on("pageerror", (err) => errors.push(err.message))

    const res = await page.goto(path, { waitUntil: "domcontentloaded" })
    expect(res?.status()).toBe(200)

    // Filter out known benign errors (favicon, etc.)
    const realErrors = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("Failed to load resource") &&
        !e.includes("404") &&
        !e.includes("net::ERR"),
    )
    expect(realErrors, `Console errors on ${path}: ${realErrors.join("; ")}`).toHaveLength(0)
  })
}

test("dynamic trip page loads", async ({ page }) => {
  // Fetch a real slug from the API
  const apiRes = await page.request.get(
    `${process.env.BASE_URL ?? "https://api.walkthroughnepal.com"}/api/v1/activity?limit=1`,
  )
  let slug = "annapurna-base-camp" // fallback
  if (apiRes.ok()) {
    const data = await apiRes.json()
    slug = data?.data?.[0]?.slug ?? slug
  }

  const res = await page.goto(`/trip/${slug}`, { waitUntil: "domcontentloaded" })
  expect(res?.status()).toBe(200)
})

test("dynamic blog page loads", async ({ page }) => {
  const apiRes = await page.request.get(
    `${process.env.BASE_URL ?? "https://api.walkthroughnepal.com"}/api/v1/blogs/published?limit=1`,
  )
  let slug = "" // will skip if no blogs
  if (apiRes.ok()) {
    const data = await apiRes.json()
    slug = data?.blogs?.[0]?.slug
  }
  if (!slug) return

  const res = await page.goto(`/blog/${slug}`, { waitUntil: "domcontentloaded" })
  expect(res?.status()).toBe(200)
})

test("404 page renders", async ({ page }) => {
  await page.goto("/this-page-does-not-exist-xyz", {
    waitUntil: "domcontentloaded",
  })
  await expect(page.locator("body")).toContainText("404")
})

test("API search returns results", async ({ page }) => {
  const res = await page.request.get("/api/search?q=everest")
  expect(res.status()).toBe(200)
  const data = await res.json()
  expect(data).toHaveProperty("trips")
  expect(data).toHaveProperty("blogs")
})
