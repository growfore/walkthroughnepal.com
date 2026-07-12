import { NextRequest, NextResponse } from "next/server"
import { renderToStream } from "@react-pdf/renderer"
import { getActivityBySlug, getSiteConfig } from "@/lib/api"
import { TripPDFDocument } from "@/lib/pdf-trip"

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 })

  try {
    const [activityRes, site] = await Promise.all([
      getActivityBySlug(slug),
      getSiteConfig(),
    ])
    const pkg = activityRes.data

    const feBase =
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
        : process.env.NEXT_PUBLIC_API_URL ?? "https://walkthroughnepal.com"

    const logoUrl = `${feBase}/logo-july-6.png`
    const apiBase = process.env.API_URL ?? "https://api.walkthroughnepal.com"

    const address = site?.fullAddress ?? "Thamel, Kathmandu, Nepal"
    const phone = site?.phoneNumbers?.[0]?.phone ?? "+977-9841234567"

    const stream = await renderToStream(
      <TripPDFDocument pkg={pkg} logoUrl={logoUrl} address={address} phone={phone} apiBase={apiBase} />
    )

    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${slug}-itinerary.pdf"`,
      },
    })
  } catch (e) {
    console.error("PDF error:", e)
    return NextResponse.json({ error: "failed to generate PDF", detail: String(e) }, { status: 500 })
  }
}
