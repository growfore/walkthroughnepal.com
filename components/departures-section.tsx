"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Users } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

const DURATION_VALUES = [
  "1–3 days",
  "4–7 days",
  "8–10 days",
  "11–14 days",
  "15–20 days",
  "21+ days",
] as const

const GROUP_OPTIONS = [
  { value: "solo", label: "Solo" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
] as const

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  duration: z.enum(DURATION_VALUES, { message: "Please select a duration" }),
  startDate: z.string().min(1, "Please select a start date"),
  groupType: z.enum(
    GROUP_OPTIONS.map((o) => o.value) as [string, ...string[]],
    { message: "Please select a group type" },
  ),
  numberOfTravellers: z.string().optional(),
  specialRequests: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function DeparturesSection({
  slots,
  slug,
  tripTitle,
}: {
  slots: Slot[]
  slug: string
  tripTitle: string
}) {
  const [tab, setTab] = useState<"departures" | "private">("departures")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      duration: undefined,
      startDate: "",
      groupType: undefined,
      numberOfTravellers: "",
      specialRequests: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(
        "https://api.walkthroughnepal.com/api/v1/email/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from: data.email,
            to: siteConfig.email,
            subject: `Private Tour Request: ${tripTitle} — ${data.fullName}`,
            text: [
              `── Personal Info ──`,
              `Name:      ${data.fullName}`,
              `Email:     ${data.email}`,
              `Phone:     ${data.phone || "Not provided"}`,
              ``,
              `── Trip Details ──`,
              `Trip:      ${tripTitle}`,
              `Duration:  ${data.duration}`,
              `Start:     ${data.startDate}`,
              `Group:     ${data.groupType}`,
              `Travellers: ${data.numberOfTravellers || "Not specified"}`,
              ``,
              `── Special Requests ──`,
              data.specialRequests || "None",
            ].join("\n"),
          }),
          cache: "no-store",
        },
      )
      if (!res.ok) throw new Error(`API returned ${res.status}`)
      setSubmitted(true)
      form.reset()
      setTimeout(() => setSubmitted(false), 6000)
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div id="departures" className="mt-16 scroll-mt-40">
      <h2 className="text-2xl font-bold text-navy md:text-3xl">
        {tab === "departures" ? "Upcoming Departures" : "Private Tour"}
      </h2>
      <p className="mt-2 text-muted-foreground">
        {tab === "departures"
          ? "Choose your preferred departure date"
          : "Customize this trip for your group — pick your dates, pace, and preferences."}
      </p>

      {/* Tabs */}
      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setTab("departures")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
            tab === "departures"
              ? "bg-navy text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Calendar className="h-4 w-4" />
          Departures
        </button>
        <button
          onClick={() => setTab("private")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
            tab === "private"
              ? "bg-navy text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Users className="h-4 w-4" />
          Private Tour
        </button>
      </div>

      {/* Departures Tab */}
      {tab === "departures" && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border shadow-sm">
          {/* Desktop table */}
          <table className="hidden w-full border-collapse sm:table">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border px-5 py-3.5 text-left text-sm font-semibold text-ink">Date</th>
                <th className="border border-border px-5 py-3.5 text-left text-sm font-semibold text-ink">Price</th>
                <th className="border border-border px-5 py-3.5 text-left text-sm font-semibold text-ink">Availability</th>
                <th className="border border-border px-5 py-3.5 text-left text-sm font-semibold text-ink">Action</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-muted/30">
                  <td className="border border-border px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 shrink-0 text-orange" />
                      <span className="font-medium text-ink">
                        {new Date(s.departureDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="border border-border px-5 py-4">
                    <span className="text-lg font-bold text-ink">${Number(s.price).toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground"> / person</span>
                    <span className="ml-2 rounded-md bg-orange/10 px-1.5 py-0.5 text-xs font-semibold text-orange">
                      {s.days} {s.days === 1 ? "day" : "days"}
                    </span>
                  </td>
                  <td className="border border-border px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.remainingSeats > 5 ? "bg-success-soft text-success" : s.remainingSeats > 0 ? "bg-warning-soft text-warning" : "bg-red-50 text-red-600"}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${s.remainingSeats > 5 ? "bg-success" : s.remainingSeats > 0 ? "bg-warning" : "bg-red-600"}`}
                      />
                      {s.remainingSeats > 5
                        ? `${s.remainingSeats} seats`
                        : s.remainingSeats > 0
                          ? `Only ${s.remainingSeats} left`
                          : "Full"}
                    </span>
                  </td>
                  <td className="border border-border px-5 py-4 text-left">
                    {s.remainingSeats < 1 ? (
                      <span className="inline-block cursor-not-allowed rounded-lg bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground">Full</span>
                    ) : (
                      <Link
                        href={`/booking?trip=${slug}&slot=${s.id}`}
                        className="inline-block rounded-lg bg-orange px-4 py-2 text-sm font-semibold text-orange-foreground transition-all hover:opacity-90 hover:shadow-md"
                      >
                        Book Now
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="divide-y divide-border sm:hidden">
            {slots.map((s) => (
              <div key={s.id} className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-orange" />
                    <span className="text-sm font-medium text-navy">
                      {new Date(s.departureDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {s.remainingSeats < 1 ? (
                    <span className="inline-block cursor-not-allowed rounded-lg bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground">Full</span>
                  ) : (
                    <Link
                      href={`/booking?trip=${slug}&slot=${s.id}`}
                      className="inline-block rounded-lg bg-orange px-4 py-2 text-sm font-semibold text-orange-foreground transition-all hover:opacity-90 hover:shadow-md"
                    >
                      Book Now
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-navy">${Number(s.price).toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">/ person</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-orange/10 px-1.5 py-0.5 text-xs font-semibold text-orange">
                    {s.days} {s.days === 1 ? "day" : "days"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.remainingSeats > 5 ? "bg-success-soft text-success" : s.remainingSeats > 0 ? "bg-warning-soft text-warning" : "bg-red-50 text-red-600"}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${s.remainingSeats > 5 ? "bg-success" : s.remainingSeats > 0 ? "bg-warning" : "bg-red-600"}`}
                    />
                    {s.remainingSeats > 5
                      ? `${s.remainingSeats} seats`
                      : s.remainingSeats > 0
                        ? `Only ${s.remainingSeats} left`
                        : "Full"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Private Tour Tab */}
      {tab === "private" && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success-soft">
                <span className="text-xl text-success">✓</span>
              </div>
              <p className="text-lg font-semibold text-navy">Request Sent!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-ink">Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-ink">Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-ink">Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 234 567 890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-ink">Preferred Start Date *</FormLabel>
                        <FormControl>
                          <Input type="date" min={new Date().toISOString().split("T")[0]} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-ink">Duration *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DURATION_VALUES.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="groupType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-ink">Group Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {GROUP_OPTIONS.map((g) => (
                              <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numberOfTravellers"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-sm font-semibold text-ink">Number of Travellers</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={30} placeholder="e.g. 4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-ink">Special Requests</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Tell us about any dietary needs, accessibility requirements, extra activities, or anything else..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange text-orange-foreground hover:bg-orange/90"
                >
                  {isSubmitting ? "Sending..." : "Send Private Tour Request"}
                </Button>
              </form>
            </Form>
          )}
        </div>
      )}
    </div>
  )
}
