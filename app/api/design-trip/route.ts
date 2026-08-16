import { NextResponse } from "next/server"
import { verifyTurnstile } from "@/lib/turnstile"
import { API_BASE } from "@/lib/api"
import { escapeHtml } from "@/lib/escape-html"

export async function POST(req: Request) {
  const body = await req.json()
  const { fullName, email, phone, duration, experienceType, startDate, locations, groupType, numberOfTravellers, inclusions, accommodationPreferences, foodPreferences, otherMentions, "cf-turnstile-response": token } = body

  if (!fullName || !email) {
    return NextResponse.json({ error: "fullName and email required" }, { status: 400 })
  }
  if (!token || !(await verifyTurnstile(token))) {
    return NextResponse.json({ error: "Turnstile verification failed" }, { status: 403 })
  }

  const locationsSummary = Array.isArray(locations)
    ? locations.map((l: { name: string; days: string }) => `${l.name} (${l.days} day${Number(l.days) > 1 ? "s" : ""})`).join(", ")
    : "Not specified"

  const text = [
    `── Personal Info ──`,
    `Name:                  ${fullName}`,
    `Email:                 ${email}`,
    `Phone:                 ${phone || "Not provided"}`,
    ``,
    `── Trip Details ──`,
    `Duration:              ${duration || "Not specified"}`,
    `Experience Type:       ${(experienceType || []).join(", ")}`,
    `Start Date:            ${startDate || "Not specified"}`,
    ``,
    `── Locations ──`,
    `Locations:             ${locationsSummary}`,
    ``,
    `── Group ──`,
    `Group Type:            ${groupType || "Not specified"}`,
    `No. of Travellers:     ${numberOfTravellers || "N/A"}`,
    ``,
    `── Preferences ──`,
    `Inclusions:            ${(inclusions || []).join(", ") || "None selected"}`,
    `Accommodation:         ${(accommodationPreferences || []).join(", ")}`,
    `Food Preference:       ${(foodPreferences || []).join(", ")}`,
    ``,
    `── Other Mentions ──`,
    otherMentions || "None",
  ].join("\n")

  const html = `
    <h2>Custom Itinerary Request from ${escapeHtml(fullName)}</h2>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
    <p><strong>Duration:</strong> ${escapeHtml(duration || "Not specified")}</p>
    <p><strong>Experience:</strong> ${escapeHtml((experienceType || []).join(", "))}</p>
    <p><strong>Start Date:</strong> ${escapeHtml(startDate || "Not specified")}</p>
    <p><strong>Locations:</strong> ${escapeHtml(locationsSummary)}</p>
    <p><strong>Group Type:</strong> ${escapeHtml(groupType || "Not specified")}</p>
    <p><strong>Travellers:</strong> ${escapeHtml(String(numberOfTravellers || "N/A"))}</p>
    <p><strong>Inclusions:</strong> ${escapeHtml((inclusions || []).join(", ") || "None")}</p>
    <p><strong>Accommodation:</strong> ${escapeHtml((accommodationPreferences || []).join(", "))}</p>
    <p><strong>Food:</strong> ${escapeHtml((foodPreferences || []).join(", "))}</p>
    <hr/>
    <p>${escapeHtml(otherMentions || "None").replace(/\n/g, "<br/>")}</p>
  `

  const payload = {
    from: "noreply@walkthroughnepal.com",
    to: "info@walkthroughnepal.com",
    subject: `Custom Itinerary Request from ${fullName} — ${(experienceType || []).join(", ")}`,
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
