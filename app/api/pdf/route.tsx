import { NextRequest, NextResponse } from "next/server"
import { getSiteConfig } from "@/lib/api"

export const maxDuration = 30

// ponytail: browser wrapper — both playwright & puppeteer have the same page API
async function launchBrowser() {
  if (process.platform === "linux") {
    const puppeteer = await import("puppeteer-core")
    const chromium = (await import("@sparticuz/chromium")).default
    return puppeteer.default.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: "shell",
    })
  }
  const { chromium } = await import("playwright")
  return chromium.launch({ headless: true })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function newPage(browser: any) {
  const p = browser.newPage
    ? await browser.newPage()
    : await browser.newPage()
  return {
    goto: (url: string, opts?: Record<string, unknown>) => p.goto(url, opts),
    evaluate: <T,>(fn: (...args: unknown[]) => T, arg?: unknown) => p.evaluate(fn, arg),
    addStyleTag: (opts: { content: string }) => p.addStyleTag(opts),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdf: (opts?: Record<string, unknown>): Promise<any> => p.pdf(opts),
    close: () => p.close?.(),
  }
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 })

  const host = req.headers.get("host") || "new.walkthroughnepal.com"
  const protocol = host.includes("localhost") ? "http" : "https"
  const tripUrl = `${protocol}://${host}/trip/${slug}`

  let browser
  try {
    let address = "New Road -11, Pokhara, Kaski, Nepal"
    let phone = "+977-9856085151"
    try {
      const site = await getSiteConfig()
      if (site?.fullAddress) address = site.fullAddress
      if (site?.phoneNumbers?.[0]?.phone) phone = site.phoneNumbers[0].phone
    } catch {}

    browser = await launchBrowser()
    const page = await newPage(browser)

    await page.goto(tripUrl, { waitUntil: "networkidle", timeout: 30_000 })

    // Get trip title from page
    const tripTitle = await page.evaluate(() => {
      return document.title.split(":")[0]?.trim() || "Trip Itinerary"
    })

    // Expand ALL accordion items + click through all itinerary variant tabs
    await page.evaluate(async () => {
      const expandAll = () => {
        document.querySelectorAll("[data-state=closed]").forEach((el) => {
          el.setAttribute("data-state", "open")
        })
        document.querySelectorAll("[data-slot=accordion-content]").forEach((el) => {
          const h = el as HTMLElement
          h.style.height = "auto"
          h.style.overflow = "visible"
          h.style.maxHeight = "none"
          h.style.display = "block"
        })
      }

      expandAll()

      // Click through each variant tab to accumulate all days
      const itineraryEl = document.getElementById("itinerary")
      if (!itineraryEl) return

      // Variant buttons have text-sm + font-semibold; accordion triggers and Expand All do not
      const variantButtons = Array.from(itineraryEl.querySelectorAll("button")).filter(
        (btn) => btn.classList.contains("text-sm") && btn.classList.contains("font-semibold"),
      )
      if (variantButtons.length <= 1) return

      const allItems: Element[] = []
      for (let i = 0; i < variantButtons.length; i++) {
        ;(variantButtons[i] as HTMLElement).click()
        await new Promise((r) => setTimeout(r, 600))

        // Add variant heading
        const variantName = variantButtons[i]?.textContent?.trim()
        if (variantName) {
          const heading = document.createElement("h3")
          heading.textContent = variantName
          heading.className = "mt-8 mb-3 text-lg font-bold text-navy"
          allItems.push(heading)
        }

        // Clone all accordion items
        const accordion = itineraryEl.querySelector('[data-slot="accordion"]')
        if (accordion) {
          accordion.querySelectorAll('[data-slot="accordion-item"]').forEach((item) => {
            allItems.push(item.cloneNode(true) as Element)
          })
        }
      }

      // Replace the itinerary content with headings + all days
      const accordion = itineraryEl.querySelector('[data-slot="accordion"]')
      const container = accordion?.parentElement
      if (container) {
        container.innerHTML = ""
        allItems.forEach((item) => container.appendChild(item))
        expandAll()
      }
    })

    await page.addStyleTag({ content: PDF_CSS })

    // Whitelist: only show itinerary essentials, hide everything else
    await page.evaluate(() => {
      // Hide hero, sticky nav, fixed elements, mobile bar
      document.querySelectorAll('section[class*="-mt-"]').forEach((e) => (e as HTMLElement).style.display = "none")
      document.querySelectorAll('.sticky.top-0, [class*="sticky"][class*="top-0"]').forEach((e) => (e as HTMLElement).style.display = "none")
      document.querySelectorAll(".fixed").forEach((e) => (e as HTMLElement).style.display = "none")

      // Hide sidebar
      const grid = document.querySelector('[class*="lg\\:grid-cols-3"]')
      if (grid) {
        ;(grid as HTMLElement).style.display = "block"
        for (let i = 1; i < grid.children.length; i++) {
          ;(grid.children[i] as HTMLElement).style.display = "none"
        }
      }

      // Hide all scroll-mt-40 sections except the ones we want
      const keepIds = new Set(["overview", "highlights", "itinerary", "map", "includes", "excludes", "packing-list"])
      document.querySelectorAll(".scroll-mt-40").forEach((el) => {
        if (!el.id || !keepIds.has(el.id)) {
          ;(el as HTMLElement).style.display = "none"
        }
      })

      // Hide sections found by h2 text — avoid .closest("section") since that can match the main page wrapper
      const hideKeywords = ["altitude", "compare", "elevation", "pricing", "departure", "useful info", "video"]
      document.querySelectorAll("h2").forEach((h2) => {
        const text = h2.textContent?.trim().toLowerCase() || ""
        if (hideKeywords.some((kw) => text.includes(kw))) {
          const block = h2.closest(".scroll-mt-40") || h2.closest(".mt-12") || h2.parentElement
          if (block) (block as HTMLElement).style.display = "none"
        }
      })

      // Hide Customize CTA (last child of left column)
      const leftCol = document.querySelector('[class*="lg\\:col-span-2"]')
      if (leftCol && leftCol.lastElementChild) {
        ;(leftCol.lastElementChild as HTMLElement).style.display = "none"
      }

      // Page breaks before itinerary and map
      ;["itinerary", "map"].forEach((id) => {
        const el = document.getElementById(id)
        if (el?.parentNode) {
          const brk = document.createElement("div")
          brk.setAttribute("data-pdf-brk", "1")
          el.parentNode.insertBefore(brk, el)
        }
      })
    })

    const headerTemplate = `
      <div style="width:100%;padding:8px 0 4px 0;font-family:Inter,sans-serif;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0 14mm;padding-bottom:4px;border-bottom:2px solid #D4520C;">
          <img src="https://new.walkthroughnepal.com/logo-july-6.png" style="height:24px;" />
          <div style="font-size:9px;color:#5F6B72;">${tripTitle}</div>
        </div>
      </div>
    `
    const footerTemplate = `
      <div style="width:100%;padding:4px 0 0 0;font-family:Inter,sans-serif;">
        <div style="border-top:1px solid #E5E2DA;margin:0 14mm;padding-top:4px;display:flex;justify-content:space-between;font-size:8px;color:#5F6B72;">
          <span>${address}  |  ${phone}</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      </div>
    `

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: false,
      margin: { top: "20mm", bottom: "18mm", left: "14mm", right: "14mm" },
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
    })

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${slug}-itinerary.pdf"`,
      },
    })
  } catch (e) {
    console.error("PDF error:", e)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  } finally {
    await browser?.close()
  }
}

const PDF_CSS = `
  nav, header, footer { display: none !important; }
  .fixed { display: none !important; }
  [class*="lg:grid-cols-3"] { display: block !important; }
  [class*="lg:col-span-2"] { width: 100% !important; }
  aside, [class*="sticky"][class*="self-start"] { display: none !important; }
  section[class*="-mt-"] { display: none !important; }
  #reviews { display: none !important; }
  #price-card { display: none !important; }
  [class*="overflow-x-auto"][class*="snap-x"] {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 6px !important;
    overflow: visible !important;
  }
  [class*="overflow-x-auto"][class*="snap-x"] > button,
  [class*="overflow-x-auto"][class*="snap-x"] > div {
    flex: 0 0 48% !important;
    width: 48% !important;
    height: auto !important;
  }
  [class*="overflow-x-auto"][class*="snap-x"] img {
    height: 100px !important;
    width: 100% !important;
    object-fit: cover !important;
    border-radius: 4px !important;
  }
  [class*="pointer-events-none"][class*="backdrop-blur"] { display: none !important; }
  [data-slot="accordion-content"] {
    height: auto !important;
    overflow: visible !important;
    max-height: none !important;
    display: block !important;
  }
  [data-slot="accordion-trigger-icon"] { display: none !important; }
  body {
    font-size: 11px !important;
    line-height: 1.5 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .text-sm, .text-xs, [class*="text-sm"], [class*="text-xs"] { font-size: 11px !important; }
  .text-base, [class*="text-base"] { font-size: 11px !important; }
  .text-lg, [class*="text-lg"] { font-size: 12px !important; }
  .text-xl, [class*="text-xl"] { font-size: 13px !important; }
  .text-2xl, [class*="text-2xl"] { font-size: 15px !important; }
  .text-3xl, [class*="text-3xl"] { font-size: 17px !important; }
  .text-4xl, [class*="text-4xl"] { font-size: 19px !important; }
  .prose { font-size: 11px !important; }
  h1 { font-size: 19px !important; }
  h2 { font-size: 15px !important; }
  h3 { font-size: 13px !important; }
  .cms-table, table {
    display: table !important;
    width: 100% !important;
    font-size: 9px !important;
    break-inside: avoid;
  }
  table th, table td {
    padding: 4px 8px !important;
    white-space: normal !important;
    border: 1px solid #E5E2DA !important;
  }
  table th {
    background: #0F2B3D !important;
    color: white !important;
    font-weight: 600 !important;
  }
  [data-pdf-brk] { page-break-before: always; }
  h2 { page-break-after: avoid !important; }
  img { break-inside: avoid !important; max-width: 100% !important; }
  .line-clamp-4 { -webkit-line-clamp: unset !important; display: block !important; }
`
