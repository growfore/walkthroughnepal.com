import { NextResponse } from "next/server"
import { API_BASE } from "@/lib/api"
import { escapeHtml } from "@/lib/escape-html"

export async function POST(req: Request) {
  const body = await req.json()
  const { fullName, email, phone, tripTitle, duration, startDate, groupType, numberOfTravellers, otherMentions } = body

  if (!fullName || !email) {
    return NextResponse.json({ error: "fullName and email required" }, { status: 400 })
  }

  const text = [
    `── Personal Info ──`,
    `Name:        ${fullName}`,
    `Email:       ${email}`,
    `Phone:       ${phone || "N/A"}`,
    ``,
    `── Trip Details ──`,
    `Trip:        ${tripTitle}`,
    `Duration:    ${duration || "N/A"}`,
    `Start:       ${startDate || "N/A"}`,
    `Group:       ${groupType || "N/A"}`,
    `Travellers:  ${numberOfTravellers || "N/A"}`,
    ``,
    `── Other ──`,
    otherMentions || "None",
  ].join("\n")

  const html = `
    <h2>Private Tour Request: ${escapeHtml(tripTitle)}</h2>
    <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone || "N/A")}</p>
    <p><strong>Duration:</strong> ${escapeHtml(duration || "N/A")}</p>
    <p><strong>Start Date:</strong> ${escapeHtml(startDate || "N/A")}</p>
    <p><strong>Group Type:</strong> ${escapeHtml(groupType || "N/A")}</p>
    <p><strong>Travellers:</strong> ${escapeHtml(String(numberOfTravellers || "N/A"))}</p>
    <hr/>
    <p>${escapeHtml(otherMentions || "None").replace(/\n/g, "<br/>")}</p>
  `

  const payload = {
    from: "noreply@walkthroughnepal.com",
    to: "info@walkthroughnepal.com",
    subject: `Private Tour Request: ${tripTitle} — ${fullName}`,
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
    return NextResponse.json({ error: "Failed to send request. Please try again." }, { status: 502 })
  }
}
