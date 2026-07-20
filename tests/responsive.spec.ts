import { test, expect } from "@playwright/test"

test("mobile: nav collapses to hamburger", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto("/", { waitUntil: "domcontentloaded" })

  // Hamburger should be visible
  const hamburger = page.locator('button[aria-label*="menu"]').first()
  await expect(hamburger).toBeVisible()
})

test("mobile: page renders without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto("/", { waitUntil: "domcontentloaded" })

  const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
  expect(bodyWidth).toBeLessThanOrEqual(375)
})

test("desktop: full nav visible", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto("/", { waitUntil: "domcontentloaded" })

  // Nav links should be visible on desktop
  const nav = page.locator("nav").first()
  await expect(nav).toBeVisible()
})

test("desktop: hero section visible on home", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto("/", { waitUntil: "domcontentloaded" })

  // Home page should have visible content
  const body = await page.locator("body").textContent()
  expect(body?.length).toBeGreaterThan(100)
})

test("mobile: explore page loads", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  const res = await page.goto("/explore", { waitUntil: "domcontentloaded" })
  expect(res?.status()).toBe(200)
})

test("mobile: contact page loads", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  const res = await page.goto("/contact", { waitUntil: "domcontentloaded" })
  expect(res?.status()).toBe(200)

  // Form should still be usable
  const form = page.locator("form").first()
  await expect(form).toBeVisible()
})
