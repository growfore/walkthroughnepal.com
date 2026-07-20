import { NextRequest, NextResponse } from "next/server"
import { API_BASE } from "@/lib/api"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const url = `${API_BASE}/api/v1/pdf/trip/${slug}`

  try {
    const res = await fetch(url)
    if (!res.ok) return NextResponse.json({ error: "PDF not found" }, { status: 404 })
    return new NextResponse(res.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${slug}-itinerary.pdf"`,
      },
    })
  } catch {
    return NextResponse.json({ error: "failed to fetch PDF" }, { status: 502 })
  }
}
