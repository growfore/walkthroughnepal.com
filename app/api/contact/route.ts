import { NextResponse } from "next/server"
import { API_BASE } from "@/lib/api"
import { escapeHtml } from "@/lib/escape-html"

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, phone, subject, message } = body
  if (!name || !email || !message) {
    return NextResponse.json({ error: "name, email, and message required" }, { status: 400 })
  }

  const text = [
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Phone:   ${phone || "Not provided"}`,
    ``,
    `Message:`,
    message,
  ].join("\n")

  const html = `
    <h2>Contact Inquiry from ${escapeHtml(name)}</h2>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
    <hr/>
    <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
  `

  const payload = {
    from: "noreply@walkthroughnepal.com",
    to: "info@walkthroughnepal.com",
    subject: subject || `Contact Inquiry from ${name}`,
    text,
    html,
  }

  try {
    const res = await fetch(`${API_BASE}/api/v1/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json(data, { status: res.status })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 502 })
  }
}
