import { NextRequest, NextResponse } from "next/server"
import puppeteerCore from "puppeteer-core"
import chromium from "@sparticuz/chromium"
import { getSiteConfig } from "@/lib/api"

export const maxDuration = 30

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

    const execPath = process.env.CHROMIUM_PATH ?? await chromium.executablePath()
    browser = await puppeteerCore.launch({
      args: chromium.args,
      executablePath: execPath,
      headless: true,
    })

    const page = await browser.newPage()
    await page.goto(tripUrl, { waitUntil: "networkidle2", timeout: 30_000 })

    // 1) Expand ALL accordion items
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

    // 2) Inject styles
    await page.addStyleTag({ content: PDF_CSS })

    // 3) Build TOC + letterhead, hide junk
    await page.evaluate(({ addr, ph }) => {
      const title = document.title.split(":")[0]?.trim() || "Trip Itinerary"

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

      const headings = document.querySelectorAll("h2")
      const tocEntries: string[] = []
      headings.forEach((h) => {
        const text = h.textContent?.trim()
        if (text && text.length > 1 && text.length < 80) tocEntries.push(text)
      })

      if (tocEntries.length > 0) {
        const toc = document.createElement("div")
        toc.id = "pdf-toc"
        toc.innerHTML = `
          <div style="margin-bottom:16px;padding:12px 16px;background:#FAFAF8;border:1px solid #E5E2DA;border-radius:6px;">
            <div style="font-size:13px;font-weight:700;color:#0F2B3D;margin-bottom:8px;">Table of Contents</div>
            <div style="columns:2;column-gap:24px;font-size:10px;line-height:1.8;color:#162B38;">
              ${tocEntries.map((e) => `<div style="break-inside:avoid;">${e}</div>`).join("")}
            </div>
          </div>
        `
        const breadcrumb = document.querySelector("nav")
        if (breadcrumb?.parentNode) {
          breadcrumb.parentNode.insertBefore(toc, breadcrumb.nextSibling)
        } else {
          document.body.prepend(toc)
        }
      }

      const hdr = document.createElement("div")
      hdr.id = "pdf-header"
      hdr.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:6px;border-bottom:2px solid #D4520C;">
          <div style="font-size:13px;font-weight:700;color:#0F2B3D;">${title}</div>
        </div>
      `
      document.body.prepend(hdr)

      const ftr = document.createElement("div")
      ftr.id = "pdf-footer"
      ftr.innerHTML = `
        <div style="border-top:1px solid #E5E2DA;padding-top:6px;font-size:9px;color:#5F6B72;">
          ${addr} &nbsp;|&nbsp; ${ph}
        </div>
      `
      document.body.appendChild(ftr)
    }, { addr: address, ph: phone })

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "18mm", bottom: "18mm", left: "14mm", right: "14mm" },
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
  #pdf-toc { break-after: page; }
  #pdf-header {
    position: fixed;
    top: 0; left: 0; right: 0;
    padding: 8mm 14mm 4mm 14mm;
  }
  #pdf-footer {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    padding: 4mm 14mm 8mm 14mm;
  }
  h2 { break-after: avoid !important; }
  img { break-inside: avoid !important; max-width: 100% !important; }
  .line-clamp-4 { -webkit-line-clamp: unset !important; display: block !important; }
`
