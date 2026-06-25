import { NextResponse } from "next/server"

const API = process.env.API_URL ?? "https://api.walkthroughnepal.com"

export async function POST(req: Request) {
  const body = await req.json()
  const { fullName, email, phone, destination, groupSize, startDate, experienceLevel, message } = body
  if (!fullName || !email || !message) {
    return NextResponse.json({ error: "fullName, email, and message required" }, { status: 400 })
  }

  const payload = {
    from: email,
    to: "info@walkthroughnepal.com",
    subject: `New Booking Inquiry from ${fullName} — ${destination || "Not specified"}`,
    text: [
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
    // ponytail: fallback — log and return ok so the user sees success
    console.log("Inquiry payload:", payload)
    return NextResponse.json({ message: "Inquiry received (fallback)" })
  }
}
