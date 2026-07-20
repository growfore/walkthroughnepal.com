import { NextResponse } from "next/server"
import { verifyTurnstile } from "@/lib/turnstile"

export async function POST(req: Request) {
  const body = await req.json()
  const token = body.token ?? body["cf-turnstile-response"]
  if (!token) {
    return NextResponse.json({ success: false, error: "Missing turnstile token" }, { status: 400 })
  }

  try {
    const success = await verifyTurnstile(token)
    return NextResponse.json({ success })
  } catch {
    return NextResponse.json({ success: false, error: "Verification service unavailable" }, { status: 502 })
  }
}
