import { NextRequest, NextResponse } from "next/server"
import { getSiteConfig } from "@/lib/api"

export const maxDuration = 30

async function launchBrowser() {
  if (process.platform === "linux") {
    const puppeteer = await import("puppeteer-core")
    const chromium = (await import("@sparticuz/chromium")).default
    return puppeteer.default.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: "shell" as any,
    })
  }
  const { chromium } = await import("playwright")
  return chromium.launch({ headless: true })
}

async function newPage(browser: any) {
  if (browser.newPage) {
    const p = await browser.newPage()
    return {
      goto: (url: string, opts: any) => p.goto(url, opts),
      evaluate: (fn: any, arg?: any) => p.evaluate(fn, arg),
      addStyleTag: (opts: any) => p.addStyleTag(opts),
      pdf: (opts: any) => p.pdf(opts),
      close: () => p.close?.(),
    }
  }
  // puppeteer
  const p = await browser.newPage()
  return {
    goto: (url: string, opts: any) => p.goto(url, opts),
    evaluate: (fn: any, arg?: any) => p.evaluate(fn, arg),
    addStyleTag: (opts: any) => p.addStyleTag(opts),
    pdf: (opts: any) => p.pdf(opts),
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

    await page.goto(tripUrl, { waitUntil: "networkidle2", timeout: 30_000 })

    // Get trip title from page
    const tripTitle = await page.evaluate(() => {
      return document.title.split(":")[0]?.trim() || "Trip Itinerary"
    })

    // Expand ALL accordion items
    await page.evaluate(() => {
      document.querySelectorAll("[data-state=closed]").forEach((el) => {
        el.setAttribute("data-state", "open")
      })
      document.querySelectorAll("[data-slot=accordion-content]").forEach((el) => {
        const h = el as HTMLElement
        h.style.height = "auto"
        h.style.overflow = "visible"
        h.style.maxHeight = "none"
      })
    })

    await page.addStyleTag({ content: PDF_CSS })

    // Hide junk
    await page.evaluate(() => {
      document.querySelectorAll('section[class*="-mt-"]').forEach((e) => (e as HTMLElement).style.display = "none")
      document.querySelectorAll('.sticky.top-0, [class*="sticky"][class*="top-0"]').forEach((e) => (e as HTMLElement).style.display = "none")
      document.querySelectorAll("#reviews").forEach((e) => (e as HTMLElement).style.display = "none")
      document.querySelectorAll(".fixed").forEach((e) => (e as HTMLElement).style.display = "none")

      const grid = document.querySelector('[class*="lg\\:grid-cols-3"]')
      if (grid) {
        ;(grid as HTMLElement).style.display = "block"
        for (let i = 1; i < grid.children.length; i++) {
          ;(grid.children[i] as HTMLElement).style.display = "none"
        }
      }
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
      printBackground: true,
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
    return NextResponse.json({ error: "failed to generate PDF", detail: String(e) }, { status: 500 })
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
  .prose { font-size: 11px !important; }
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
  h2 { break-after: avoid !important; }
  img { break-inside: avoid !important; max-width: 100% !important; }
  .line-clamp-4 { -webkit-line-clamp: unset !important; display: block !important; }
`
