"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { siteConfig } from "@/lib/siteConfig"

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.walkthroughnepal.com"

type Activity = { id: number; slug: string; title: string }

function InquiryForm() {
  const searchParams = useSearchParams()
  const tripSlug = searchParams.get("trip")

  const [activities, setActivities] = useState<Activity[]>([])
  const [activitiesLoading, setActivitiesLoading] = useState(true)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedTrip, setSelectedTrip] = useState("")
  const [groupSize, setGroupSize] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`${API}/api/v1/activity?page=1&limit=100`)
      .then((r) => r.json())
      .then((json) => {
        const items: Activity[] = (json.data ?? []).map((a: Activity) => ({
          id: a.id, slug: a.slug, title: a.title,
        })).sort((a: Activity, b: Activity) => a.title.localeCompare(b.title))
        setActivities(items)
        if (tripSlug) {
          const match = items.find((a) => a.slug === tripSlug)
          if (match) setSelectedTrip(match.title)
        }
      })
      .catch(() => {})
      .finally(() => setActivitiesLoading(false))
  }, [tripSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, destination: selectedTrip, groupSize, message }),
      })
      if (!res.ok) throw new Error("Failed to send inquiry")
      setSent(true)
    } catch {
      setError("Something went wrong. Please try again or email us directly.")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-lg px-4 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
          <h2 className="mt-6 text-2xl font-bold text-navy">Thank You!</h2>
          <p className="mt-3 text-muted-foreground">
            Your inquiry has been received. Our team will review it and get back to you within 24 hours.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-5xl gap-12 px-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-navy">Full Name <span className="text-orange">*</span></label>
                  <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20" placeholder="Your name" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-navy">Email <span className="text-orange">*</span></label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20" placeholder="your@email.com" />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-navy">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20" placeholder="+977 ..." />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-navy">Trip</label>
                  <select
                    value={selectedTrip}
                    onChange={(e) => setSelectedTrip(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
                  >
                    <option value="">{activitiesLoading ? "Loading..." : "Select a trip..."}</option>
                    {activities.map((a) => (
                      <option key={a.id} value={a.title}>{a.title}</option>
                    ))}
                    <option value="__other">Other (not listed)</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-navy">Group Size</label>
                  <select value={groupSize} onChange={(e) => setGroupSize(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20">
                    <option value="">Select...</option>
                    <option value="1">1 (Solo)</option>
                    <option value="2">2</option>
                    <option value="3-5">3–5</option>
                    <option value="6-10">6–10</option>
                    <option value="11+">11+</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-navy">Message <span className="text-orange">*</span></label>
                <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20" placeholder="Tell us about your trip ideas..." />
              </div>
              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange px-6 py-3 text-sm font-semibold text-orange-foreground transition-all hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <><Send className="h-4 w-4" /> Send Inquiry</>}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-8 lg:col-span-2">
          <div>
            <h3 className="text-lg font-bold text-navy">Contact Information</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                <div>
                  <p className="text-sm font-semibold text-navy">Email</p>
                  <p className="text-sm text-muted-foreground">{siteConfig.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                <div>
                  <p className="text-sm font-semibold text-navy">Phone</p>
                  <p className="text-sm text-muted-foreground">{siteConfig.phoneNumbers?.[0]?.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                <div>
                  <p className="text-sm font-semibold text-navy">Location</p>
                  <p className="text-sm text-muted-foreground">{siteConfig.fullAddress}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h4 className="text-sm font-bold text-navy">Why Book With Us?</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                Authentic local expertise
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                Handcrafted itineraries
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                Best price guarantee
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                24/7 support during your trip
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function InquiryPage() {
  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="Send Us an Inquiry"
        description="Have a question or want to customize your trip? We're here to help."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Inquiry" }]}
      />
      <Suspense fallback={
        <section className="py-20">
          <div className="mx-auto max-w-lg px-4 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </section>
      }>
        <InquiryForm />
      </Suspense>
    </main>
  )
}
