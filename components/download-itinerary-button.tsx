"use client"

import { Download } from "lucide-react"
import html2pdf from "html2pdf.js"

type ItineraryDay = { day: number; title: string; description: string }
type FAQ = { question: string; answer: string }
type AdditionalInfo = { title: string; description: string }

function nbs(s: string) {
  return s.replace(/&nbsp;/gi, " ")
}

export function DownloadItineraryButton({
  title,
  itinerary,
  duration,
  difficulty,
  maxAltitude,
  bestSeason,
  accommodations,
  meals,
  groupSize,
  transportation,
  meetingPoint,
  dropOffPoint,
  shortDescription,
  fullDescription,
  highlights,
  additionalInfo,
  faqs,
}: {
  title: string
  slug: string
  itinerary: ItineraryDay[]
  duration: string
  difficulty: string
  maxAltitude: string
  bestSeason: string
  accommodations: string
  meals: string
  groupSize: string
  transportation: string
  meetingPoint: string
  dropOffPoint: string
  shortDescription?: string
  fullDescription?: string
  highlights?: string[]
  additionalInfo?: AdditionalInfo[]
  faqs?: FAQ[]
}) {
  const handleDownload = async () => {
    const facts = [
      ["Duration", duration],
      ["Difficulty", difficulty],
      ["Max Altitude", maxAltitude],
      ["Best Season", bestSeason],
      ["Accommodation", accommodations],
      ["Meals", meals],
      ["Group Size", groupSize],
      ["Transportation", transportation],
      ["Meeting Point", meetingPoint],
      ["Drop Off", dropOffPoint],
    ].filter(([, v]) => v && v !== "N/A")

    const factsHtml = facts.map(([k, v]) =>
      `<tr><td style="font-weight:600;color:#023047;padding:4px 0;width:160px">${k}</td><td style="padding:4px 0;color:#555">${v}</td></tr>`
    ).join("")

    const daysHtml = itinerary.map((d) => `
      <tr style="page-break-inside:avoid">
        <td style="width:60px;vertical-align:top;padding:8px 0;font-weight:700;color:#023047">Day ${d.day}</td>
        <td style="vertical-align:top;padding:8px 0">
          <div style="font-weight:600;color:#023047;margin-bottom:4px">${d.title}</div>
          <div class="desc">${nbs(d.description)}</div>
        </td>
      </tr>`
    ).join("")

    const prose = (s: string) => `<div style="font-size:13px;line-height:1.6;color:#555">${nbs(s)}</div>`

    const overviewHtml = shortDescription
      ? `<div class="section"><h2>Overview</h2>${prose(shortDescription)}</div>`
      : ""

    const fullDescHtml = fullDescription && fullDescription !== shortDescription
      ? `<div class="section"><h2>Full Description</h2>${prose(fullDescription)}</div>`
      : ""

    const hlItems = highlights ?? []
    const highlightsHtml = hlItems.length > 0
      ? `<div class="section"><h2>Trip Highlights</h2>${hlItems.map((h) => `<div class="prose">${nbs(h)}</div>`).join("")}</div>`
      : ""

    const infoItems = additionalInfo ?? []
    const infoHtml = infoItems.length > 0
      ? `<div class="section"><h2>Useful Information</h2>${infoItems.map((i) => `<div class="info-block"><h3>${i.title}</h3><div class="prose">${nbs(i.description)}</div></div>`).join("")}</div>`
      : ""

    const faqItems = faqs ?? []
    const faqsHtml = faqItems.length > 0
      ? `<div class="section"><h2>Frequently Asked Questions</h2>${faqItems.map((f) => `<div class="faq"><strong>${f.question}</strong><div class="prose">${nbs(f.answer)}</div></div>`).join("")}</div>`
      : ""

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title} - Itinerary</title>
<style>
  @page { margin: 20mm 15mm; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:Georgia,serif; font-size:14px; line-height:1.6; color:#333; padding:40px 30px; max-width:800px; margin:0 auto; }
  .header { text-align:center; border-bottom:2px solid #023047; padding-bottom:20px; margin-bottom:24px; }
  .header img { height:50px; margin-bottom:12px; }
  .header h1 { font-size:24px; color:#023047; margin:0; }
  .section { margin-bottom:24px; }
  .section h2 { font-size:18px; color:#023047; margin-bottom:8px; border-bottom:1px solid #ddd; padding-bottom:4px; }
  .section h3 { font-size:14px; color:#023047; margin-bottom:4px; margin-top:12px; }
  table { width:100%; border-collapse:collapse; }
  .desc { font-size:13px; line-height:1.6; color:#555; }
  .desc p { margin-bottom:6px; }
  .desc ul, .desc ol { margin:4px 0 6px 16px; padding:0; }
  .desc li { margin-bottom:2px; }
  .desc strong { font-weight:600; color:#333; }
  .desc br { display:block; content:""; margin:4px 0; }
  .prose { font-size:13px; line-height:1.6; color:#555; }
  .prose p { margin-bottom:6px; }
  .prose ul, .prose ol { margin:4px 0 6px 16px; padding:0; }
  .prose li { margin-bottom:2px; }
  .prose strong { font-weight:600; color:#333; }
  .prose br { display:block; content:""; margin:4px 0; }
  .info-block { margin-bottom:12px; }
  .faq { margin-bottom:12px; page-break-inside:avoid; }
  .faq strong { display:block; font-size:13px; color:#023047; margin-bottom:2px; }
  .footer { margin-top:32px; padding-top:16px; border-top:2px solid #023047; text-align:center; font-size:13px; color:#555; }
  .footer strong { color:#023047; }
</style></head>
<body>
  <div class="header">
    <img src="${window.location.origin}/walkthrough-nepal-logo.png" alt="Walk Through Nepal" />
    <h1>${title}</h1>
  </div>
  <div class="section">
    <h2>Trip Facts</h2>
    <table>${factsHtml}</table>
  </div>
  ${overviewHtml}
  ${highlightsHtml}
  ${fullDescHtml}
  <div class="section">
    <h2>Itinerary</h2>
    <table>${daysHtml}</table>
  </div>
  ${infoHtml}
  ${faqsHtml}
  <div class="footer">
    <p><strong>Walk Through Nepal</strong> &mdash; Thamel, Kathmandu, Nepal</p>
    <p>Phone: +977 984 123 4567 &nbsp;|&nbsp; Email: info@walkthroughnepal.com</p>
    <p style="margin-top:4px;font-size:12px">&copy; ${new Date().getFullYear()} Walk Through Nepal. All rights reserved.</p>
  </div>
</body></html>`

    const iframe = document.createElement("iframe")
    iframe.style.position = "fixed"
    iframe.style.top = "0"
    iframe.style.left = "-9999px"
    iframe.style.width = "210mm"
    iframe.style.border = "none"
    iframe.style.opacity = "0.01"
    iframe.style.pointerEvents = "none"
    document.body.appendChild(iframe)

    const loaded = new Promise<void>((r) => { iframe.onload = () => r() })
    const doc = iframe.contentDocument!
    doc.open()
    doc.write(html)
    doc.close()
    await loaded

    const filename = `${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-itinerary.pdf`
    await html2pdf()
      .set({
        filename,
        margin: [15, 15, 15, 15],
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: null },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(doc.body)
      .save()

    document.body.removeChild(iframe)
  }

  return (
    <button onClick={handleDownload} className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-border py-3 font-semibold text-navy hover:bg-secondary">
      <Download className="h-4 w-4" /> Download Itinerary
    </button>
  )
}
