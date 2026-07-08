"use client"

import { Download } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.walkthroughnepal.com"

export function DownloadItineraryButton({
  title,
  slug,
}: {
  title: string
  slug: string
}) {
  const handleDownload = async () => {
    try {
      const res = await fetch(`${API}/api/v1/pdf/trip/${slug}`)
      if (!res.ok) return
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-itinerary.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      // silent
    }
  }

  return (
    <button onClick={handleDownload} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-navy transition-colors">
      <Download className="h-4 w-4" /> Download Itinerary
    </button>
  )
}
