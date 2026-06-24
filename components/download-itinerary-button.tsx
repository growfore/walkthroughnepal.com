"use client"

import { Download } from "lucide-react"

type ItineraryDay = { day: number; title: string; description: string }

export function DownloadItineraryButton({
  title,
  slug,
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
}) {
  const handleDownload = () => {
    const daysHtml = itinerary
      .map(
        (d) => `
      <tr style="page-break-inside:avoid">
        <td style="width:60px;vertical-align:top;padding:8px 0;font-weight:700;color:#023047">Day ${d.day}</td>
        <td style="vertical-align:top;padding:8px 0">
          <div style="font-weight:600;color:#023047;margin-bottom:4px">${d.title}</div>
          <div style="font-size:13px;line-height:1.6;color:#555">${d.description.replace(/<[^>]*>/g, "")}</div>
        </td>
      </tr>`
      )
      .join("")

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

    const factsHtml = facts.map(([k, v]) => `<tr><td style="font-weight:600;color:#023047;padding:4px 0;width:160px">${k}</td><td style="padding:4px 0;color:#555">${v}</td></tr>`).join("")

    const html = `<!DOCTYPE html>
<html>
<head><title>${title} - Itinerary</title>
<style>
  @page { margin: 20mm 15mm; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Helvetica', 'Arial', sans-serif; font-size:14px; line-height:1.5; color:#333; }
  .header { text-align:center; border-bottom:2px solid #023047; padding-bottom:20px; margin-bottom:24px; }
  .header img { height:60px; margin-bottom:12px; }
  .header h1 { font-size:24px; color:#023047; }
  .facts { margin-bottom:24px; }
  .facts h2 { font-size:18px; color:#023047; margin-bottom:8px; border-bottom:1px solid #ddd; padding-bottom:4px; }
  .itinerary h2 { font-size:18px; color:#023047; margin-bottom:8px; border-bottom:1px solid #ddd; padding-bottom:4px; }
  table { width:100%; border-collapse:collapse; }
  .footer { margin-top:32px; padding-top:16px; border-top:2px solid #023047; text-align:center; font-size:13px; color:#555; }
  .footer strong { color:#023047; }
</style></head>
<body>
  <div class="header">
    <img src="/walkthrough-nepal-logo.png" alt="Walk Through Nepal" style="height:50px" />
    <h1>${title}</h1>
  </div>

  <div class="facts">
    <h2>Trip Facts</h2>
    <table>${factsHtml}</table>
  </div>

  <div class="itinerary">
    <h2>Itinerary</h2>
    <table>${daysHtml}</table>
  </div>

  <div class="footer">
    <p><strong>Walk Through Nepal</strong> &mdash; Thamel, Kathmandu, Nepal</p>
    <p>Phone: +977 984 123 4567 &nbsp;|&nbsp; Email: info@walkthroughnepal.com</p>
    <p style="margin-top:4px;font-size:12px">&copy; ${new Date().getFullYear()} Walk Through Nepal. All rights reserved.</p>
  </div>

  <script>window.onload = function () { window.print(); window.close(); }</script>
</body></html>`

    const w = window.open("", "_blank")
    if (!w) { alert("Please allow popups to download the itinerary."); return }
    w.document.write(html)
    w.document.close()
  }

  return (
    <button onClick={handleDownload} className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-border py-3 font-semibold text-navy hover:bg-secondary">
      <Download className="h-4 w-4" /> Download Itinerary
    </button>
  )
}
