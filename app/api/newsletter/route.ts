import { NextResponse } from "next/server"

const API = process.env.API_URL ?? "https://api.walkthroughnepal.com"

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 })

  const res = await fetch(`${API}/api/v1/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
