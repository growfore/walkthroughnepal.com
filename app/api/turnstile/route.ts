import { NextResponse } from "next/server"

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY!
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export async function POST(req: Request) {
  const body = await req.json()
  const token = body.token ?? body["cf-turnstile-response"]
  if (!token) {
    return NextResponse.json({ success: false, error: "Missing turnstile token" }, { status: 400 })
  }

  const res = await fetch(SITEVERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: token }),
  })

  const data = await res.json()
  return NextResponse.json({ success: data.success, errorCodes: data["error-codes"] })
}
