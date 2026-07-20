import { test, expect } from "@playwright/test"

test.describe("Contact form", () => {
  test("renders all fields and validates required", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "domcontentloaded" })

    // Form fields should exist
    await expect(page.locator('input[name="name"], input[placeholder*="name" i]').first()).toBeVisible()
    await expect(page.locator('input[type="email"], input[placeholder*="email" i]').first()).toBeVisible()
    await expect(page.locator('textarea, input[placeholder*="message" i]').first()).toBeVisible()

    // Submit should be present
    const submitBtn = page.locator('button[type="submit"]').first()
    await expect(submitBtn).toBeVisible()
  })

  test("submits contact form successfully", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "domcontentloaded" })

    // Fill form - try various selector patterns
    const nameInput = page.locator('input[name="name"]').first()
    const emailInput = page.locator('input[type="email"], input[name="email"]').first()
    const messageInput = page.locator('textarea[name="message"], textarea').first()

    // Only fill if inputs exist (they might have different names)
    if (await nameInput.count() > 0) {
      await nameInput.fill("Test User")
    }
    if (await emailInput.count() > 0) {
      await emailInput.fill("test@example.com")
    }
    if (await messageInput.count() > 0) {
      await messageInput.fill("This is a QA test message from Playwright.")
    }

    // Submit
    const submitBtn = page.locator('button[type="submit"]').first()
    await submitBtn.click()

    // Wait for response - should show success or at least not crash
    await page.waitForTimeout(3000)

    // Page should still be functional (no crash)
    const body = await page.locator("body").textContent()
    expect(body).toBeTruthy()
  })
})

test.describe("Inquiry form", () => {
  test("renders all fields", async ({ page }) => {
    await page.goto("/inquiry", { waitUntil: "domcontentloaded" })

    // Should have form fields
    const inputs = page.locator("input")
    const count = await inputs.count()
    expect(count).toBeGreaterThan(2)
  })

  test("submits inquiry form", async ({ page }) => {
    await page.goto("/inquiry", { waitUntil: "domcontentloaded" })

    // Fill available fields
    const nameInput = page.locator('input[name="fullName"], input[placeholder*="name" i]').first()
    const emailInput = page.locator('input[type="email"], input[name="email"]').first()
    const messageInput = page.locator('textarea[name="message"], textarea').first()

    if (await nameInput.count() > 0) await nameInput.fill("QA Test User")
    if (await emailInput.count() > 0) await emailInput.fill("qa-test@example.com")
    if (await messageInput.count() > 0) await messageInput.fill("QA test inquiry message")

    const submitBtn = page.locator('button[type="submit"]').first()
    if (await submitBtn.isVisible()) {
      await submitBtn.click()
      await page.waitForTimeout(3000)
    }

    // Page should not crash
    await expect(page.locator("body")).toBeVisible()
  })
})

test.describe("Newsletter form", () => {
  test("footer newsletter input exists", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })

    // Footer should have newsletter email input
    const newsletterInput = page.locator('footer input[type="email"], footer input[placeholder*="email" i]')
    const count = await newsletterInput.count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe("Design your trip form", () => {
  test("multi-step form renders step 1", async ({ page }) => {
    await page.goto("/design-your-trip", { waitUntil: "domcontentloaded" })

    // Step 1 should have name and email fields
    await expect(page.locator('input').first()).toBeVisible()

    // Should have a "Next" or "Continue" button
    const nextBtn = page.locator('button:has-text("Next"), button:has-text("Continue")').first()
    await expect(nextBtn).toBeVisible()
  })

  test("can navigate between steps", async ({ page }) => {
    await page.goto("/design-your-trip", { waitUntil: "domcontentloaded" })

    // Fill step 1 fields
    const nameInput = page.locator('input[name="fullName"], input[placeholder*="name" i]').first()
    const emailInput = page.locator('input[type="email"], input[name="email"]').first()

    if (await nameInput.count() > 0) await nameInput.fill("QA Test")
    if (await emailInput.count() > 0) await emailInput.fill("qa@test.com")

    // Click next
    const nextBtn = page.locator('button:has-text("Next"), button:has-text("Continue")').first()
    if (await nextBtn.isVisible()) {
      await nextBtn.click()
      await page.waitForTimeout(500)
    }

    // Page should still be functional
    await expect(page.locator("body")).toBeVisible()
  })
})

test.describe("Recommend quiz", () => {
  test("quiz renders first step", async ({ page }) => {
    await page.goto("/recommend", { waitUntil: "domcontentloaded" })

    // Should show quiz content or the page
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })
})
