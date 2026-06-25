"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronDown, Mail, Phone, MapPin, Clock } from "lucide-react"
import { siteConfig } from "@/lib/siteConfig"

const groupSizes = [
  { value: "1", label: "Solo (1 person)" },
  { value: "2", label: "Couple (2 people)" },
  { value: "3-5", label: "Small group (3-5)" },
  { value: "6-10", label: "Medium group (6-10)" },
  { value: "10+", label: "Large group (10+)" },
]

const experienceLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
]

const faqs = [
  { q: "How do I know my booking is confirmed?", a: "Once you complete your booking, you'll receive a confirmation email with all trip details. Our team also follows up within 24 hours to ensure everything is in order." },
  { q: "What payment methods do you accept?", a: "We accept bank transfers, credit/debit cards (Visa, MasterCard, Amex), and PayPal. A 30% deposit secures your booking, with the balance due 30 days before departure." },
  { q: "Can I modify or cancel my booking?", a: "Yes — changes can be made up to 14 days before departure at no charge. Cancellations are free up to 8 weeks in advance. See our full cancellation policy on the booking page." },
  { q: "Do I need travel insurance?", a: "Yes, comprehensive travel insurance covering medical evacuation, trip cancellation, and high-altitude trekking (up to 6,000m) is mandatory for all treks." },
]

type TPackage = { id: string; slug: string; title: string }

function inputCls(error?: string) {
  return `w-full rounded-lg border ${error ? "border-red-400" : "border-border"} bg-background px-4 py-3 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20`
}

function FormInner({ packages }: { packages: TPackage[] }) {
  const searchParams = useSearchParams()
  const destParam = searchParams?.get("q") ?? ""

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", destination: destParam,
    groupSize: "", startDate: "", experienceLevel: "", message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    if (destParam) setForm((f) => ({ ...f, destination: destParam }))
  }, [destParam])

  const today = new Date().toISOString().split("T")[0]

  function validate() {
    const e: Record<string, string> = {}
    if (form.fullName.length < 2) e.fullName = "Name must be at least 2 characters"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address"
    if (!form.destination) e.destination = "Please select a destination"
    if (!form.groupSize) e.groupSize = "Please select a group size"
    if (!form.startDate) e.startDate = "Please select a start date"
    if (form.message.length < 10) e.message = "Message must be at least 10 characters"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(`API ${res.status}`)
      setSuccess(true)
      setForm({ fullName: "", email: "", phone: "", destination: "", groupSize: "", startDate: "", experienceLevel: "", message: "" })
      setTimeout(() => setSuccess(false), 5000)
    } catch {
      setErrors({ _form: "Something went wrong. Please try again or contact us directly." })
    } finally {
      setSubmitting(false)
    }
  }

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }

  if (success) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center max-w-xl mx-auto">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange/10 text-orange text-3xl font-bold">✓</div>
        <h2 className="mt-4 text-xl font-bold text-navy">Inquiry Sent!</h2>
        <p className="mt-2 text-sm text-muted-foreground">Thanks for reaching out. We&apos;ll get back to you within 24 hours.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="mb-1 block text-sm font-semibold text-navy">Full Name <span className="text-orange">*</span></label>
                <input id="fullName" required value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className={inputCls(errors.fullName)} placeholder="Your name" />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-semibold text-navy">Email <span className="text-orange">*</span></label>
                <input id="email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls(errors.email)} placeholder="your@email.com" />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-navy">Phone Number</label>
                <input id="phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls()} placeholder="+977 ..." />
              </div>
              <div>
                <label htmlFor="startDate" className="mb-1 block text-sm font-semibold text-navy">Start Date <span className="text-orange">*</span></label>
                <input id="startDate" type="date" required min={today} value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className={inputCls(errors.startDate)} />
                {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="destination" className="mb-1 block text-sm font-semibold text-navy">Desired Destination <span className="text-orange">*</span></label>
              <select id="destination" required value={form.destination} onChange={(e) => set("destination", e.target.value)} className={inputCls(errors.destination)}>
                <option value="">Select a destination</option>
                {packages.map((pkg) => (
                  <option key={pkg.slug} value={pkg.slug}>{pkg.title}</option>
                ))}
              </select>
              {errors.destination && <p className="mt-1 text-xs text-red-500">{errors.destination}</p>}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="groupSize" className="mb-1 block text-sm font-semibold text-navy">Group Size <span className="text-orange">*</span></label>
                <select id="groupSize" required value={form.groupSize} onChange={(e) => set("groupSize", e.target.value)} className={inputCls(errors.groupSize)}>
                  <option value="">Select group size</option>
                  {groupSizes.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {errors.groupSize && <p className="mt-1 text-xs text-red-500">{errors.groupSize}</p>}
              </div>
              <div>
                <label htmlFor="experienceLevel" className="mb-1 block text-sm font-semibold text-navy">Experience Level</label>
                <select id="experienceLevel" value={form.experienceLevel} onChange={(e) => set("experienceLevel", e.target.value)} className={inputCls()}>
                  <option value="">Select level</option>
                  {experienceLevels.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-semibold text-navy">Additional Details <span className="text-orange">*</span></label>
              <textarea id="message" required rows={5} value={form.message} onChange={(e) => set("message", e.target.value)} className={`${inputCls(errors.message)} resize-y`} placeholder="Tell us about your ideal trekking experience, special requirements, preferred dates, etc." />
              {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
            </div>

            {errors._form && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-200">{errors._form}</div>
            )}

            <button type="submit" disabled={submitting} className="rounded-full bg-orange px-8 py-3 font-semibold text-orange-foreground transition hover:opacity-90 disabled:opacity-50">
              {submitting ? "Sending..." : "Send Inquiry"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-bold text-navy">Company Info</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                <div>
                  <p className="text-sm font-semibold text-navy">Email</p>
                  <a href={`mailto:${siteConfig.email}`} className="text-sm text-muted-foreground hover:text-orange transition-colors">{siteConfig.email}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                <div>
                  <p className="text-sm font-semibold text-navy">Phone</p>
                  <a href={`tel:${siteConfig.phoneNumbers[0].phone}`} className="text-sm text-muted-foreground hover:text-orange transition-colors">{siteConfig.phoneNumbers[0].phone}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                <div>
                  <p className="text-sm font-semibold text-navy">Address</p>
                  <p className="text-sm text-muted-foreground">{siteConfig.fullAddress}</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-4 rounded-xl bg-orange p-6 text-orange-foreground">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5" />
              <h3 className="text-sm font-bold">Quick Response</h3>
            </div>
            <p className="text-sm text-orange-foreground/80 leading-relaxed">
              We typically respond to all inquiries within 24 hours during business days to help you plan your trip.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="mt-16">
        <h3 className="text-2xl font-bold text-navy text-center">Frequently Asked Questions</h3>
        <div className="mt-6 space-y-2 rounded-xl border border-border bg-card p-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-border pb-2 last:border-0">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-2 py-2 text-left text-sm font-semibold text-navy">
                {faq.q}
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && <p className="pb-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default function BookingForm({ packages }: { packages: TPackage[] }) {
  return (
    <Suspense fallback={<div className="text-center py-10 text-muted-foreground">Loading...</div>}>
      <FormInner packages={packages} />
    </Suspense>
  )
}
