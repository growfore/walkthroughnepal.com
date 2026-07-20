import { test, expect } from "@playwright/test"

test("top bar shows phone and email from siteConfig", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })

  // Phone number should match siteConfig pattern (not hardcoded +977 984 123 4567)
  const phoneLink = page.locator('a[href^="tel:"]').first()
  await expect(phoneLink).toBeVisible()
  const phoneText = await phoneLink.textContent()
  expect(phoneText).toContain("+977")
  expect(phoneText).not.toContain("984 123 4567") // the fake hardcoded number

  // Email
  const emailLink = page.locator('a[href^="mailto:"]').first()
  await expect(emailLink).toBeVisible()
  await expect(emailLink).toContainText("info@walkthroughnepal.com")
})

test("nav links render and are clickable", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })

  // Desktop nav links should be visible
  const navLinks = page.locator("nav").first().locator("a")
  const count = await navLinks.count()
  expect(count).toBeGreaterThan(3)

  // Click "About" link
  const aboutLink = page.locator('a[href="/about"]').first()
  if (await aboutLink.isVisible()) {
    await aboutLink.click()
    await expect(page).toHaveURL(/\/about/)
  }
})

test("logo links to home", async ({ page }) => {
  await page.goto("/about", { waitUntil: "domcontentloaded" })

  const logo = page.locator('a[href="/"]').first()
  await expect(logo).toBeVisible()
})

test("footer renders with contact info", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })

  const footer = page.locator("footer")
  await expect(footer).toBeVisible()

  // Footer should have contact info (email listed as text)
  await expect(footer.locator("text=@")).toBeVisible()
})

test("mobile hamburger opens menu", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto("/", { waitUntil: "domcontentloaded" })

  // Hamburger button should be visible
  const hamburger = page.locator('button[aria-label*="menu"]').first()
  await expect(hamburger).toBeVisible()

  // Click to open
  await hamburger.click()
  await page.waitForTimeout(300)

  // Mobile menu dialog should appear
  const mobileDialog = page.getByRole("dialog", { name: "Navigation menu" })
  await expect(mobileDialog).toBeVisible()
})
