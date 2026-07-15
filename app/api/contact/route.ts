import { NextResponse } from "next/server"

const API = process.env.API_URL ?? "https://api.walkthroughnepal.com"
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY!

async function verifyTurnstile(token: string): Promise<boolean> {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: token }),
  })
  const data = await res.json()
  return data.success === true
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, phone, subject, message, "cf-turnstile-response": token } = body
  if (!name || !email || !message) {
    return NextResponse.json({ error: "name, email, and message required" }, { status: 400 })
  }
  if (!token || !(await verifyTurnstile(token))) {
    return NextResponse.json({ error: "Turnstile verification failed" }, { status: 403 })
  }

  const payload = {
    from: email,
    to: "info@walkthroughnepal.com",
    subject: subject || `Contact Inquiry from ${name}`,
    text: [
      `Name:    ${name}`,
      `Email:   ${email}`,
      `Phone:   ${phone || "Not provided"}`,
      ``,
      `Message:`,
      message,
    ].join("\n"),
  }

  try {
    const res = await fetch(`${API}/api/v1/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    console.log("Contact payload:", payload)
    return NextResponse.json({ message: "Message received (fallback)" })
  }
}
