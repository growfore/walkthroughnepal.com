import { NextResponse } from "next/server"
import { API_BASE } from "@/lib/api"
import { escapeHtml } from "@/lib/escape-html"

export async function POST(req: Request) {
  const body = await req.json()
  const { fullName, email, phone, destination, groupSize, startDate, experienceLevel, message } = body
  if (!fullName || !email || !message) {
    return NextResponse.json({ error: "fullName, email, and message required" }, { status: 400 })
  }

  const text = [
    `Name:              ${fullName}`,
    `Email:             ${email}`,
    `Phone:             ${phone || "Not provided"}`,
    `Destination:       ${destination || "Not specified"}`,
    `Start Date:        ${startDate || "Not specified"}`,
    `Group Size:        ${groupSize || "Not specified"}`,
    `Experience Level:  ${experienceLevel || "Not specified"}`,
    ``,
    `Message:`,
    message,
  ].join("\n")

  const html = `
    <h2>Booking Inquiry from ${escapeHtml(fullName)}</h2>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
    <p><strong>Destination:</strong> ${escapeHtml(destination || "Not specified")}</p>
    <p><strong>Start Date:</strong> ${escapeHtml(startDate || "Not specified")}</p>
    <p><strong>Group Size:</strong> ${escapeHtml(groupSize || "Not specified")}</p>
    <p><strong>Experience Level:</strong> ${escapeHtml(experienceLevel || "Not specified")}</p>
    <hr/>
    <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
  `

  const payload = {
    from: "noreply@walkthroughnepal.com",
    to: "info@walkthroughnepal.com",
    subject: `New Booking Inquiry from ${fullName} — ${destination || "Not specified"}`,
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
    return NextResponse.json({ error: "Failed to send inquiry. Please try again." }, { status: 502 })
  }
}
