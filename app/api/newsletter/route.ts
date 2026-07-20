import { NextResponse } from "next/server"
import { verifyTurnstile } from "@/lib/turnstile"
import { API_BASE } from "@/lib/api"

export async function POST(req: Request) {
  const body = await req.json()
  const { email, "cf-turnstile-response": token } = body
  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 })
  if (!token || !(await verifyTurnstile(token))) {
    return NextResponse.json({ error: "Turnstile verification failed" }, { status: 403 })
  }

  try {
    const res = await fetch(`${API_BASE}/api/v1/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 502 })
  }
}
