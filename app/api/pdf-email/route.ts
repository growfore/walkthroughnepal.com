import { NextResponse } from "next/server"
import { API_BASE } from "@/lib/api"

export async function POST(req: Request) {
  const body = await req.json()
  const { email, slug, tripTitle, subscribe } = body
  if (!email || !slug) {
    return NextResponse.json({ error: "email and slug required" }, { status: 400 })
  }

  try {
    const res = await fetch(`${API_BASE}/api/v1/pdf/generate-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, slug, tripTitle, subscribe }),
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json(data, { status: res.status })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 502 })
  }
}
