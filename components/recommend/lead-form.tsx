"use client"

import { useState } from "react"
import { Send, CheckCircle } from "lucide-react"

interface LeadFormProps {
  tripTitle: string
}

export function LeadForm({ tripTitle }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", country: "", travelDates: "" })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const el = e.currentTarget as HTMLFormElement
      const token = (el.elements.namedItem("cf-turnstile-response") as HTMLInputElement)?.value
      if (!token) throw new Error("Verification required")
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.name,
          email: form.email,
          phone: form.whatsapp,
          country: form.country,
          travelDates: form.travelDates,
          trip: tripTitle,
          message: `Recommended trip inquiry: ${tripTitle}`,
          source: "recommendation-engine",
          "cf-turnstile-response": token,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to send")
      }
      setSubmitted(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
        <h3 className="mt-4 text-xl font-bold text-navy">Thank You!</h3>
        <p className="mt-2 text-muted-foreground">Our team will reach out to you shortly with a personalized itinerary.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-lg font-bold text-navy">Get a Personalized Quote</h3>
      <p className="mt-1 text-sm text-muted-foreground">Our travel experts will create a custom plan for you.</p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input type="text" placeholder="Full Name *" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-orange" />
        <input type="email" placeholder="Email *" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-orange" />
        <div className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="WhatsApp" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-orange" />
          <input type="text" placeholder="Country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-orange" />
        </div>
        <input type="text" placeholder="Preferred travel dates" value={form.travelDates} onChange={e => setForm(f => ({ ...f, travelDates: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-orange" />
        <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50">
          <Send className="h-4 w-4" />
          {loading ? "Sending..." : "Send Inquiry"}
        </button>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY} />
      </form>
    </div>
  )
}
