"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Users, CheckCircle2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Turnstile, getTurnstileToken } from "@/components/turnstile"
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
import Link from "next/link"
import { Calendar } from "lucide-react"
import type { Slot, Tier } from "@/lib/types"

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  tier: z.string().min(1, "Please select a package"),
  startDate: z.string().min(1, "Please select a start date"),
  groupType: z.string().optional(),
  numberOfTravellers: z.string().min(1, "Number of travellers is required"),
  otherMentions: z.string().min(1, "Notes are required"),
})

type FormValues = z.infer<typeof formSchema>

export function DeparturesSection({
  slots,
  slug,
  tripTitle,
  tab: tabProp,
  onTabChange,
  tiers = [],
  selectedTier,
}: {
  slots: Slot[]
  slug: string
  tripTitle: string
  tab?: "departures" | "private"
  onTabChange?: (tab: "departures" | "private") => void
  tiers?: Tier[]
  selectedTier?: Tier | null
}) {
  const [internalTab, setInternalTab] = useState<"departures" | "private">(
    slots.length > 0 ? "departures" : "private"
  )
  const hasDepartures = slots.length > 0
  const tab = hasDepartures ? (tabProp ?? internalTab) : "private"
  const setTab = onTabChange ?? setInternalTab
  const slotDetails = (s: Slot) =>
    [
      `Date: ${new Date(s.departureDate).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}`,
      `Duration: ${s.days} day${s.days === 1 ? "" : "s"}`,
      `Price: $${Number(s.price).toLocaleString()} / person`,
      `Availability: ${s.remainingSeats} seat${s.remainingSeats === 1 ? "" : "s"}`,
    ].join("\n")
  const inquiryHref = (s: Slot) =>
    `/inquiry?trip=${slug}&date=${s.departureDate.slice(0, 10)}&details=${encodeURIComponent(slotDetails(s))}`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as never,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      tier: "",
      startDate: "",
      groupType: "",
      numberOfTravellers: "",
      otherMentions: "",
    },
  })

  const watchedTier = form.watch("tier")

  useEffect(() => {
    if (selectedTier) {
      // ponytail: defer one tick — RHF setValue in the same commit as a fresh
      // Controller mount is dropped; setTimeout(0) lands after subscription
      setTimeout(() => form.setValue("tier", selectedTier.name), 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTier?.id])

  const packageName = watchedTier ? `${tripTitle} : ${watchedTier}` : ""

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const token = getTurnstileToken(formRef.current)
      if (!token) throw new Error("Please complete the verification")
      const res = await fetch("/api/private-tour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          tripTitle: packageName,
          startDate: data.startDate,
          groupType: data.groupType,
          numberOfTravellers: data.numberOfTravellers,
          otherMentions: data.otherMentions,
          "cf-turnstile-response": token,
        }),
      })
      if (!res.ok) throw new Error(`API ${res.status}`)
      setSubmitted(true)
      form.reset()
      setTimeout(() => setSubmitted(false), 6000)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div id="departures" className="mt-16 scroll-mt-40">
      <h2 className="text-2xl font-bold text-navy md:text-3xl">
        Book this Trip
      </h2>
      <p className="mt-2 text-muted-foreground">
        Tell us your preferences and we&apos;ll craft the perfect private tour
        for your group.
      </p>

      {/* Tabs */}
      {hasDepartures && (
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => setTab("departures")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${tab === "departures" ? "bg-navy text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            <Calendar className="h-4 w-4" /> Departures
          </button>
          <button
            onClick={() => setTab("private")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${tab === "private" ? "bg-navy text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            <Users className="h-4 w-4" /> Private Tour
          </button>
        </div>
      )}

      {/* Departures Tab */}
      {tab === "departures" && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border shadow-sm">
          {slots.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-10 text-center">
              <Calendar className="h-6 w-6 text-muted-foreground" />
              <p className="font-semibold text-navy">
                No group departures available
              </p>
              <p className="text-sm text-muted-foreground">
                Check back soon, or start a private tour for your preferred
                dates.
              </p>
            </div>
          ) : (
            <>
              <table className="hidden w-full border-collapse sm:table">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border px-5 py-3.5 text-left text-sm font-semibold text-ink">
                      Date
                    </th>
                    <th className="border border-border px-5 py-3.5 text-left text-sm font-semibold text-ink">
                      Price
                    </th>
                    <th className="border border-border px-5 py-3.5 text-left text-sm font-semibold text-ink">
                      Availability
                    </th>
                    <th className="border border-border px-5 py-3.5 text-left text-sm font-semibold text-ink">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((s) => (
                    <tr
                      key={s.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="border border-border px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 shrink-0 text-orange" />
                          <span className="font-medium text-ink">
                            {new Date(s.departureDate).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="border border-border px-5 py-4">
                        <span className="text-lg font-bold text-ink">
                          ${Number(s.price).toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {" "}
                          / person
                        </span>
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
                          <span className="inline-block cursor-not-allowed rounded-lg bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground">
                            Full
                          </span>
                        ) : (
                          <Link
                            href={inquiryHref(s)}
                            className="inline-block rounded-lg bg-orange px-4 py-2 text-sm font-semibold text-orange-foreground transition-all hover:opacity-90 hover:shadow-md"
                          >
                            Inquire Now
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="divide-y divide-border sm:hidden">
                {slots.map((s) => (
                  <div key={s.id} className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0 text-orange" />
                        <span className="text-sm font-medium text-navy">
                          {new Date(s.departureDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      {s.remainingSeats < 1 ? (
                        <span className="inline-block cursor-not-allowed rounded-lg bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground">
                          Full
                        </span>
                      ) : (
                        <Link
                          href={inquiryHref(s)}
                          className="inline-block rounded-lg bg-orange px-4 py-2 text-sm font-semibold text-orange-foreground transition-all hover:opacity-90 hover:shadow-md"
                        >
                          Inquire Now
                        </Link>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-navy">
                        ${Number(s.price).toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / person
                      </span>
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
            </>
          )}
        </div>
      )}

      {/* Private Tour Tab */}
      {tab === "private" && (
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {submitted ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-soft">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <p className="text-lg font-bold text-navy">Request Sent!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 p-4"
              >
                {packageName && (
                  <div className="flex items-center gap-2 rounded-lg bg-navy/5 px-3 py-2 text-sm text-navy">
                    <Package className="h-4 w-4 shrink-0" />
                    <span className="font-semibold">{packageName}</span>
                  </div>
                )}
                <div className="grid gap-3 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-ink">
                          Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-9 w-full text-sm"
                            placeholder="Your name"
                            {...field}
                          />
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
                        <FormLabel className="text-xs font-semibold text-ink">
                          Email *
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-9 w-full text-sm"
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                          />
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
                        <FormLabel className="text-xs font-semibold text-ink">
                          Phone *
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-9 w-full text-sm"
                            placeholder="+1 234 567 890"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="tier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-ink">
                        Package *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            size="sm"
                            className="w-full text-sm"
                          >
                            <SelectValue placeholder="Select package" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tiers.map((t) => (
                            <SelectItem key={t.id} value={t.name}>
                              {t.name} — {t.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-3 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-ink">
                          Start Date *
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-9 w-full text-sm [&::-webkit-calendar-picker-indicator]:py-1"
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numberOfTravellers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-ink">
                          Travellers *
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-9 w-full text-sm"
                            type="number"
                            min="1"
                            placeholder="Number of people"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="groupType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-ink">
                          Group Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger size="sm" className="w-full text-sm">
                              <SelectValue placeholder="Select group type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="solo">Solo</SelectItem>
                            <SelectItem value="couple">Couple</SelectItem>
                            <SelectItem value="family">Family</SelectItem>
                            <SelectItem value="friends">Friends</SelectItem>
                            <SelectItem value="corporate">Corporate</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="otherMentions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-ink">
                        Notes *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="w-full text-sm"
                          rows={2}
                          placeholder="Dietary restrictions, health conditions, celebrations..."
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
                  className="h-9 w-full bg-orange text-sm font-semibold text-orange-foreground hover:bg-orange/90"
                >
                  {isSubmitting ? "Sending..." : "Send Request"}
                </Button>
                <Turnstile />
              </form>
            </Form>
          )}
        </div>
      )}
    </div>
  )
}
