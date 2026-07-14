"use client"

import { useState } from "react"
import Link from "next/link"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Calendar, Users, Plus, Trash2, MapPin, Utensils, Bed, Compass, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "react-toastify"
import { siteConfig } from "@/lib/siteConfig"
import type { Slot } from "@/lib/types"

const DURATION_VALUES = ["1–3 days", "4–7 days", "8–10 days", "11–14 days", "15–20 days", "21+ days"] as const
const GROUP_OPTIONS = [{ value: "solo", label: "Solo" }, { value: "couple", label: "Couple" }, { value: "family", label: "Family" }, { value: "friends", label: "Friends" }] as const
const CATEGORIES = ["Treks in Nepal", "Tours in Nepal", "Classic Trek", "High Altitude Expedition", "Cultural and Heritage Tour", "Wildlife and Nature Safari", "Luxury Trek", "Adventure and Extreme Sports", "Pilgrimage Tour", "Photography Tour", "Family Friendly Trek", "Off-the-beaten Path", "Honeymoon Package", "Yoga and Meditation Retreat"]
const INCLUSIONS = [{ id: "guide", label: "Licensed Guide" }, { id: "porter", label: "Porter Service" }, { id: "permits", label: "Trekking Permits & TIMS" }, { id: "transport", label: "Airport Transfers" }, { id: "firstaid", label: "First Aid / Medical Kit" }, { id: "sleeping-bag", label: "Sleeping Bag & Equipment" }, { id: "helicopter", label: "Helicopter Return" }]
const ACCOMMODATION = [{ value: "teahouse", label: "Teahouse / Guesthouse" }, { value: "lodge", label: "Comfortable Lodge" }, { value: "luxury-lodge", label: "Luxury Lodge" }, { value: "camping", label: "Camping" }, { value: "hotel", label: "Hotel (city nights)" }, { value: "mix", label: "Mix (flexible)" }]
const FOOD_PREFS = [{ value: "local", label: "Local Nepali Cuisine" }, { value: "continental", label: "Continental" }, { value: "vegetarian", label: "Vegetarian" }, { value: "vegan", label: "Vegan" }, { value: "halal", label: "Halal" }, { value: "flexible", label: "Flexible / No Preference" }]

const locationSchema = z.object({ name: z.string().optional(), days: z.string().optional() })

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  duration: z.enum(DURATION_VALUES, { message: "Please select a duration" }),
  experienceType: z.array(z.string()).min(1, "Select at least one experience type"),
  startDate: z.string().min(1, "Please select a start date"),
  letUsChooseLocations: z.boolean(),
  locations: z.array(locationSchema),
  groupType: z.enum(GROUP_OPTIONS.map((o) => o.value) as [string, ...string[]], { message: "Please select a group type" }),
  numberOfTravellers: z.string().optional(),
  inclusions: z.array(z.string()).default([]),
  accommodationPreferences: z.array(z.string()).min(1, "Select at least one"),
  foodPreferences: z.array(z.string()).min(1, "Select at least one"),
  otherMentions: z.string().optional(),
}).superRefine((data, ctx) => {
  if (!data.letUsChooseLocations) {
    data.locations.forEach((loc, i) => {
      if (!loc.name || loc.name.trim() === "") ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Location name required", path: ["locations", i, "name"] })
      const d = Number(loc.days)
      if (!loc.days || isNaN(d) || d <= 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must be at least 1 day", path: ["locations", i, "days"] })
    })
  }
  if ((data.groupType === "family" || data.groupType === "friends") && (!data.numberOfTravellers || data.numberOfTravellers.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select number of travellers", path: ["numberOfTravellers"] })
  }
})

type FormValues = z.infer<typeof formSchema>

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item]
}

export function DeparturesSection({ slots, slug, tripTitle }: { slots: Slot[]; slug: string; tripTitle: string }) {
  const [tab, setTab] = useState<"departures" | "private">("departures")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as never,
    defaultValues: {
      fullName: "", email: "", phone: "", duration: undefined, experienceType: [], startDate: "",
      letUsChooseLocations: false, locations: [{ name: "", days: "" }],
      groupType: undefined, numberOfTravellers: "", inclusions: [],
      accommodationPreferences: [], foodPreferences: [], otherMentions: "",
    },
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "locations" })
  const letUsChoose = form.watch("letUsChooseLocations")
  const groupType = form.watch("groupType")

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const locs = data.letUsChooseLocations ? "Let the team choose" : data.locations.map((l) => `${l.name} (${l.days}d)`).join(", ")
      const inclusions = data.inclusions.map((id) => INCLUSIONS.find((i) => i.id === id)?.label ?? id).join(", ")
      const res = await fetch("https://api.walkthroughnepal.com/api/v1/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: data.email, to: siteConfig.email,
          subject: `Private Tour Request: ${tripTitle} — ${data.fullName}`,
          text: [
            `── Personal Info ──`, `Name: ${data.fullName}`, `Email: ${data.email}`, `Phone: ${data.phone || "N/A"}`, ``,
            `── Trip Details ──`, `Trip: ${tripTitle}`, `Duration: ${data.duration}`, `Start: ${data.startDate}`,
            `Experience: ${data.experienceType.join(", ")}`, `Group: ${data.groupType}`, `Travellers: ${data.numberOfTravellers || "N/A"}`, ``,
            `── Locations ──`, locs, ``,
            `── Preferences ──`, `Inclusions: ${inclusions || "None"}`,
            `Accommodation: ${data.accommodationPreferences.join(", ")}`, `Food: ${data.foodPreferences.join(", ")}`, ``,
            `── Other ──`, data.otherMentions || "None",
          ].join("\n"),
        }),
        cache: "no-store",
      })
      if (!res.ok) throw new Error(`API ${res.status}`)
      setSubmitted(true)
      form.reset()
      setTimeout(() => setSubmitted(false), 6000)
    } catch { toast.error("Something went wrong. Please try again.") } finally { setIsSubmitting(false) }
  }

  return (
    <div id="departures" className="mt-16 scroll-mt-40">
      <h2 className="text-2xl font-bold text-navy md:text-3xl">{tab === "departures" ? "Upcoming Departures" : "Private Tour"}</h2>
      <p className="mt-2 text-muted-foreground">{tab === "departures" ? "Choose your preferred departure date" : "Customize this trip for your group — dates, pace, and every detail."}</p>

      {/* Tabs */}
      <div className="mt-6 flex gap-2">
        <button onClick={() => setTab("departures")} className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${tab === "departures" ? "bg-navy text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
          <Calendar className="h-4 w-4" /> Departures
        </button>
        <button onClick={() => setTab("private")} className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${tab === "private" ? "bg-navy text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
          <Users className="h-4 w-4" /> Private Tour
        </button>
      </div>

      {/* Departures Tab */}
      {tab === "departures" && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border shadow-sm">
          <table className="hidden w-full border-collapse sm:table">
            <thead><tr className="bg-muted/50">
              <th className="border border-border px-5 py-3.5 text-left text-sm font-semibold text-ink">Date</th>
              <th className="border border-border px-5 py-3.5 text-left text-sm font-semibold text-ink">Price</th>
              <th className="border border-border px-5 py-3.5 text-left text-sm font-semibold text-ink">Availability</th>
              <th className="border border-border px-5 py-3.5 text-left text-sm font-semibold text-ink">Action</th>
            </tr></thead>
            <tbody>
              {slots.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-muted/30">
                  <td className="border border-border px-5 py-4"><div className="flex items-center gap-2"><Calendar className="h-4 w-4 shrink-0 text-orange" /><span className="font-medium text-ink">{new Date(s.departureDate).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}</span></div></td>
                  <td className="border border-border px-5 py-4"><span className="text-lg font-bold text-ink">${Number(s.price).toLocaleString()}</span><span className="text-sm text-muted-foreground"> / person</span><span className="ml-2 rounded-md bg-orange/10 px-1.5 py-0.5 text-xs font-semibold text-orange">{s.days} {s.days === 1 ? "day" : "days"}</span></td>
                  <td className="border border-border px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.remainingSeats > 5 ? "bg-success-soft text-success" : s.remainingSeats > 0 ? "bg-warning-soft text-warning" : "bg-red-50 text-red-600"}`}><span className={`h-1.5 w-1.5 rounded-full ${s.remainingSeats > 5 ? "bg-success" : s.remainingSeats > 0 ? "bg-warning" : "bg-red-600"}`}/>{s.remainingSeats > 5 ? `${s.remainingSeats} seats` : s.remainingSeats > 0 ? `Only ${s.remainingSeats} left` : "Full"}</span></td>
                  <td className="border border-border px-5 py-4 text-left">{s.remainingSeats < 1 ? <span className="inline-block cursor-not-allowed rounded-lg bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground">Full</span> : <Link href={`/booking?trip=${slug}&slot=${s.id}`} className="inline-block rounded-lg bg-orange px-4 py-2 text-sm font-semibold text-orange-foreground transition-all hover:opacity-90 hover:shadow-md">Book Now</Link>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="divide-y divide-border sm:hidden">
            {slots.map((s) => (
              <div key={s.id} className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2"><Calendar className="h-4 w-4 shrink-0 text-orange" /><span className="text-sm font-medium text-navy">{new Date(s.departureDate).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}</span></div>
                  {s.remainingSeats < 1 ? <span className="inline-block cursor-not-allowed rounded-lg bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground">Full</span> : <Link href={`/booking?trip=${slug}&slot=${s.id}`} className="inline-block rounded-lg bg-orange px-4 py-2 text-sm font-semibold text-orange-foreground transition-all hover:opacity-90 hover:shadow-md">Book Now</Link>}
                </div>
                <div className="flex items-center gap-2"><span className="text-lg font-bold text-navy">${Number(s.price).toLocaleString()}</span><span className="text-sm text-muted-foreground">/ person</span></div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-orange/10 px-1.5 py-0.5 text-xs font-semibold text-orange">{s.days} {s.days === 1 ? "day" : "days"}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.remainingSeats > 5 ? "bg-success-soft text-success" : s.remainingSeats > 0 ? "bg-warning-soft text-warning" : "bg-red-50 text-red-600"}`}><span className={`h-1.5 w-1.5 rounded-full ${s.remainingSeats > 5 ? "bg-success" : s.remainingSeats > 0 ? "bg-warning" : "bg-red-600"}`}/>{s.remainingSeats > 5 ? `${s.remainingSeats} seats` : s.remainingSeats > 0 ? `Only ${s.remainingSeats} left` : "Full"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Private Tour Tab */}
      {tab === "private" && (
        <div className="mt-6 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          {submitted ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-soft"><CheckCircle2 className="h-7 w-7 text-success" /></div>
              <p className="text-lg font-bold text-navy">Request Sent!</p>
              <p className="mt-1 text-sm text-muted-foreground">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Contact */}
                <Section icon={<Compass className="h-4 w-4" />} title="Contact Details" desc="How can we reach you?">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm font-semibold text-ink">Full Name *</FormLabel><FormControl><Input placeholder="Your name" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm font-semibold text-ink">Email *</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm font-semibold text-ink">Phone</FormLabel><FormControl><Input placeholder="+1 234 567 890" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </Section>

                {/* Trip Basics */}
                <Section icon={<MapPin className="h-4 w-4" />} title="Trip Basics" desc="When and how long?">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="duration" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm font-semibold text-ink">Duration *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="How many days?" /></SelectTrigger></FormControl><SelectContent>{DURATION_VALUES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="startDate" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm font-semibold text-ink">Preferred Start Date *</FormLabel><FormControl><Input type="date" min={new Date().toISOString().split("T")[0]} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="experienceType" render={({ field }) => (
                    <FormItem><FormLabel className="text-sm font-semibold text-ink">Experience / Trek Type *</FormLabel><div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">{CATEGORIES.map((cat) => { const checked = (field.value as string[]).includes(cat); return (<label key={cat} className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors text-sm ${checked ? "border-orange/40 bg-orange/5 text-orange font-medium" : "border-border text-muted-foreground hover:bg-muted"}`}><Checkbox checked={checked} onCheckedChange={() => field.onChange(toggle(field.value as string[], cat))} /><span>{cat}</span></label>) })}</div><FormMessage /></FormItem>
                  )} />
                </Section>

                {/* Locations */}
                <Section icon={<MapPin className="h-4 w-4" />} title="Locations" desc="Where do you want to go?">
                  <FormField control={form.control} name="letUsChooseLocations" render={({ field }) => (
                    <FormItem className="flex items-start gap-3 rounded-lg border border-orange/20 bg-orange/5 p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={(c) => { field.onChange(c); if (c) form.clearErrors("locations") }} /></FormControl><div><FormLabel className="text-sm font-semibold text-ink cursor-pointer">Let us choose the best locations for you</FormLabel><p className="text-xs text-muted-foreground mt-0.5">Our experts will design the optimal route.</p></div></FormItem>
                  )} />
                  {!letUsChoose && (
                    <div className="space-y-3">
                      {fields.map((fieldItem, index) => (
                        <div key={fieldItem.id} className="flex items-start gap-3 p-4 border border-border rounded-lg bg-muted/30">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2"><FormField control={form.control} name={`locations.${index}.name`} render={({ field }) => (<FormItem><FormLabel className="text-xs text-muted-foreground font-medium">Location</FormLabel><FormControl><Input placeholder="e.g. Pokhara" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
                            <div><FormField control={form.control} name={`locations.${index}.days`} render={({ field }) => (<FormItem><FormLabel className="text-xs text-muted-foreground font-medium">Days</FormLabel><FormControl><Input type="number" min="1" placeholder="3" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
                          </div>
                          {fields.length > 1 && <button type="button" onClick={() => remove(index)} className="mt-6 p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="h-4 w-4" /></button>}
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", days: "" })}><Plus className="h-4 w-4 mr-1" /> Add Location</Button>
                    </div>
                  )}
                </Section>

                {/* Group */}
                <Section icon={<Users className="h-4 w-4" />} title="Your Group" desc="Who's going?">
                  <FormField control={form.control} name="groupType" render={({ field }) => (
                    <FormItem><FormLabel className="text-sm font-semibold text-ink">Group Type *</FormLabel><div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">{GROUP_OPTIONS.map((opt) => (<button type="button" key={opt.value} onClick={() => field.onChange(opt.value)} className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all text-sm font-medium ${field.value === opt.value ? "border-orange bg-orange/5 text-orange" : "border-border text-muted-foreground hover:border-border"}`}>{opt.label}</button>))}</div><FormMessage /></FormItem>
                  )} />
                  {(groupType === "family" || groupType === "friends") && (
                    <FormField control={form.control} name="numberOfTravellers" render={({ field }) => (
                      <FormItem><FormLabel className="text-sm font-semibold text-ink">Number of Travellers *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="How many people?" /></SelectTrigger></FormControl><SelectContent>{["1", "2", "3", "4", "5–7", "8–10", "11–15", "16+"].map((n) => <SelectItem key={n} value={n}>{n} {n === "1" ? "person" : "people"}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                  )}
                </Section>

                {/* Preferences */}
                <Section icon={<Bed className="h-4 w-4" />} title="Preferences" desc="Customize your experience.">
                  <FormField control={form.control} name="inclusions" render={({ field }) => (
                    <FormItem><FormLabel className="text-sm font-semibold text-ink mb-2 block">Pick Your Inclusions</FormLabel><div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{INCLUSIONS.map((item) => { const checked = field.value.includes(item.id); return (<label key={item.id} className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${checked ? "border-orange/40 bg-orange/5" : "border-border hover:bg-muted"}`}><Checkbox checked={checked} onCheckedChange={() => field.onChange(toggle(field.value, item.id))} /><span className="text-sm text-muted-foreground">{item.label}</span></label>) })}</div><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="accommodationPreferences" render={({ field }) => (
                    <FormItem><FormLabel className="text-sm font-semibold text-ink flex items-center gap-2 mb-2"><Bed className="h-4 w-4 text-orange" /> Accommodation *</FormLabel><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{ACCOMMODATION.map((opt) => { const checked = field.value.includes(opt.value); return (<button type="button" key={opt.value} onClick={() => field.onChange(toggle(field.value, opt.value))} className={`text-left px-3 py-2.5 rounded-lg border-2 text-sm transition-all ${checked ? "border-orange bg-orange/5 text-orange font-medium" : "border-border text-muted-foreground hover:border-border"}`}>{opt.label}</button>) })}</div><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="foodPreferences" render={({ field }) => (
                    <FormItem><FormLabel className="text-sm font-semibold text-ink flex items-center gap-2 mb-2"><Utensils className="h-4 w-4 text-orange" /> Food Preferences *</FormLabel><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{FOOD_PREFS.map((opt) => { const checked = field.value.includes(opt.value); return (<button type="button" key={opt.value} onClick={() => field.onChange(toggle(field.value, opt.value))} className={`text-left px-3 py-2.5 rounded-lg border-2 text-sm transition-all ${checked ? "border-orange bg-orange/5 text-orange font-medium" : "border-border text-muted-foreground hover:border-border"}`}>{opt.label}</button>) })}</div><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="otherMentions" render={({ field }) => (
                    <FormItem><FormLabel className="text-sm font-semibold text-ink">Special Requests</FormLabel><FormControl><Textarea rows={4} placeholder="Dietary restrictions, health conditions, celebrations..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </Section>

                <div className="px-6 pb-6 pt-2">
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-orange text-orange-foreground hover:bg-orange/90 py-6 text-base font-semibold">
                    {isSubmitting ? "Sending..." : "Send Private Tour Request"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      )}
    </div>
  )
}

function Section({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border px-6 py-6 last:border-b-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-orange">{icon}</span>
        <h3 className="text-base font-bold text-navy">{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">{desc}</p>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
