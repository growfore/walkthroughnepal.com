"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, Search } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { siteConfig } from "@/lib/siteConfig"
import { API_BASE } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

type Activity = { id: number; slug: string; title: string }

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  destination: z.string().optional(),
  groupSize: z.string().optional(),
  startDate: z.string().optional(),
  experienceLevel: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type FormValues = z.infer<typeof formSchema>

function TripCombobox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [query, setQuery] = useState("")
  const [options, setOptions] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setOptions([]); return }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/v1/activity?search=${encodeURIComponent(q)}&limit=10`)
      const json = await res.json()
      setOptions((json.data ?? []).map((a: Activity) => ({ id: a.id, slug: a.slug, title: a.title })).sort((a: Activity, b: Activity) => a.title.localeCompare(b.title)))
    } catch { setOptions([]) }
    setLoading(false)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => search(query), 300)
    return () => clearTimeout(t)
  }, [query, search])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={value || query}
          onChange={(e) => { setQuery(e.target.value); if (value) onChange(""); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder="Search for a trip..."
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 pl-9 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
      </div>
      {open && options.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
          {options.map((a) => (
            <button
              key={a.id}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onChange(a.title); setQuery(""); setOpen(false) }}
              className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-accent/20 ${value === a.title ? "bg-accent/30 font-semibold text-navy" : "text-foreground"}`}
            >
              {a.title}
            </button>
          ))}
        </div>
      )}
      {open && query.length >= 2 && !loading && options.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground shadow-lg">
          No trips found. Try a different search.
        </div>
      )}
      {value && (
        <button type="button" onClick={() => { onChange(""); setQuery("") }} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-orange">
          Clear
        </button>
      )}
    </div>
  )
}

function InquiryForm() {
  const searchParams = useSearchParams()
  const tripSlug = searchParams.get("trip")
  const departureDate = searchParams.get("date")
  const departureDetails = searchParams.get("details")

  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: "", email: "", phone: "", destination: "", groupSize: "", startDate: "", experienceLevel: "", message: "" },
  })

  useEffect(() => {
    if (departureDate) form.setValue("startDate", departureDate)
    if (departureDetails) form.setValue("message", `Group Departure Details:\n${departureDetails}\n__________________`)
    if (!tripSlug) return
    fetch(`${API_BASE}/api/v1/activity/slug/${encodeURIComponent(tripSlug)}`)
      .then((r) => r.json())
      .then((json) => {
        const match = (json.data as Activity | undefined)
        if (match?.slug === tripSlug) form.setValue("destination", match.title)
      })
      .catch(() => {})
  }, [tripSlug, departureDate, departureDetails, form])

  async function onSubmit(data: FormValues) {
    setError("")
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to send inquiry")
      }
      setSent(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again or email us directly.")
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</div>
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-navy">Full Name <span className="text-orange">*</span></FormLabel>
                      <FormControl><Input placeholder="Your name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-navy">Email <span className="text-orange">*</span></FormLabel>
                      <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-navy">Phone</FormLabel>
                      <FormControl><Input type="tel" placeholder="+977 ..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="destination" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-navy">Trip</FormLabel>
                      <FormControl>
                        <TripCombobox value={field.value ?? ""} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="groupSize" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-navy">Group Size</FormLabel>
                    <FormControl>
                      <select value={field.value ?? ""} onChange={field.onChange} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20">
                        <option value="">Select...</option>
                        <option value="1">1 (Solo)</option>
                        <option value="2">2</option>
                        <option value="3-5">3–5</option>
                        <option value="6-10">6–10</option>
                        <option value="11+">11+</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField control={form.control} name="startDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-navy">Preferred Start Date</FormLabel>
                      <FormControl><Input type="date" min={new Date().toISOString().split("T")[0]} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="experienceLevel" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-navy">Experience Level</FormLabel>
                      <FormControl>
                        <select value={field.value ?? ""} onChange={field.onChange} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20">
                          <option value="">Select...</option>
                          <option value="beginner">Beginner — First time trekker</option>
                          <option value="intermediate">Intermediate — Some hiking experience</option>
                          <option value="advanced">Advanced — Regular trekker</option>
                          <option value="expert">Expert — Very experienced</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-navy">Message <span className="text-orange">*</span></FormLabel>
                    <FormControl><Textarea rows={4} placeholder="Tell us about your trip ideas..." className="resize-y" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full bg-orange text-orange-foreground hover:bg-orange/90">
                  {form.formState.isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <><Send className="h-4 w-4" /> Send Inquiry</>}
                </Button>
              </form>
            </Form>
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
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> Authentic local expertise</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> Handcrafted itineraries</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> Best price guarantee</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> 24/7 support during your trip</li>
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
