"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Calendar, Users, Shield, CreditCard, Loader2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { API_BASE } from "@/lib/api"
import type { Slot } from "@/lib/types"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  groupSize: z.number().min(1).max(20),
  paymentType: z.enum(["DEPOSIT", "FULL"]),
})

type FormValues = z.infer<typeof formSchema>

export function BookingForm({ slot, activityId, activityTitle }: { slot: Slot; activityId: number; activityTitle: string }) {
  const [error] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", groupSize: 1, paymentType: "DEPOSIT" },
  })

  const groupSize = form.watch("groupSize")
  const paymentType = form.watch("paymentType")
  const total = Number(slot.price) * groupSize
  const deposit = Math.round(total * 0.3)
  const payAmount = paymentType === "DEPOSIT" ? deposit : total

  // PONYTAIL: Stripe checkout disabled — payments API not active yet
  // Uncomment below to re-enable Stripe checkout
  //
  // const handleSubmit = async (data: FormValues) => {
  //   setError("")
  //   try {
  //     const formEl = document.querySelector("form")
  //     const token = (formEl?.elements.namedItem("cf-turnstile-response") as HTMLInputElement)?.value
  //     if (!token) throw new Error("Please complete the verification")
  //     const verify = await fetch("/api/turnstile", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ token }),
  //     })
  //     const verifyData = await verify.json()
  //     if (!verifyData.success) throw new Error("Verification failed. Please try again.")
  //     const res = await fetch(`${API_BASE}/api/v1/stripe/create-checkout-session`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ activityId, slotId: slot.id, ...data }),
  //     })
  //     const result = await res.json()
  //     if (!res.ok) throw new Error(result.message || "Checkout failed")
  //     window.location.href = result.data.url
  //   } catch (e: unknown) {
  //     setError(e instanceof Error ? e.message : "Something went wrong")
  //   }
  // }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto sm:flex-row">
          <div className="flex-1 px-6 py-6">
            <h2 className="text-xl font-bold text-navy">Complete your booking</h2>
            <p className="mt-1 text-sm text-muted-foreground">{activityTitle}</p>
            {error && <div className="mb-4 mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</div>}
            <Form {...form}>
              <form className="mt-6 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField control={form.control} name="name" render={({ field }) => (
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
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-navy">Phone <span className="text-orange">*</span></FormLabel>
                      <FormControl><Input type="tel" placeholder="+977 ..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="groupSize" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-navy">Group Size <span className="text-orange">*</span></FormLabel>
                      <div className="flex items-center gap-0">
                        <button type="button" onClick={() => field.onChange(Math.max(1, field.value - 1))} disabled={field.value <= 1} className="flex h-10 w-10 items-center justify-center rounded-l-lg border border-border bg-background text-lg font-medium text-navy transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30">&minus;</button>
                        <div className="flex h-10 w-14 items-center justify-center border-y border-border bg-background text-sm font-semibold text-navy">{field.value}</div>
                        <button type="button" onClick={() => field.onChange(Math.min(slot.remainingSeats || 10, field.value + 1))} disabled={field.value >= (slot.remainingSeats || 10)} className="flex h-10 w-10 items-center justify-center rounded-r-lg border border-border bg-background text-lg font-medium text-navy transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30">+</button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="paymentType" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-navy">Payment</FormLabel>
                    <div className="space-y-2">
                      <label className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 text-sm transition-all ${field.value === "DEPOSIT" ? "border-orange bg-orange/5" : "border-border hover:border-orange/30"}`}>
                        <input type="radio" className="accent-orange" checked={field.value === "DEPOSIT"} onChange={() => field.onChange("DEPOSIT")} />
                        <div>
                          <div className="font-semibold text-navy">Pay Deposit (30%) &mdash; <span className="text-orange">${deposit}</span></div>
                          <div className="mt-0.5 text-muted-foreground">Balance due before departure</div>
                        </div>
                      </label>
                      <label className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 text-sm transition-all ${field.value === "FULL" ? "border-orange bg-orange/5" : "border-border hover:border-orange/30"}`}>
                        <input type="radio" className="accent-orange" checked={field.value === "FULL"} onChange={() => field.onChange("FULL")} />
                        <div>
                          <div className="font-semibold text-navy">Pay Full Amount &mdash; <span className="text-orange">${total}</span></div>
                          <div className="mt-0.5 text-muted-foreground">Pay everything now</div>
                        </div>
                      </label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
                {/* PONYTAIL: Stripe checkout disabled — payments API not active yet */}
                {/* <Button type="submit" disabled={form.formState.isSubmitting} className="w-full bg-[#635bff] text-white hover:bg-[#635bff]/90 py-6">
                  {form.formState.isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : <><CreditCard className="h-4 w-4" /> Proceed to Checkout <ChevronRight className="h-4 w-4" /></>}
                </Button> */}
                <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY} />
              </form>
            </Form>
          </div>
          <div className="border-t border-border bg-navy/[0.02] px-6 py-6 sm:w-72 sm:shrink-0 sm:border-l sm:border-t-0">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trip</h4>
                <p className="text-sm font-medium text-navy">{activityTitle}</p>
              </div>
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Departure</h4>
                <div className="flex items-center gap-2 text-sm font-medium text-navy">
                  <Calendar className="h-4 w-4 shrink-0 text-orange" />
                  {new Date(slot.departureDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Travelers</h4>
                <div className="flex items-center gap-2 text-sm font-medium text-navy">
                  <Users className="h-4 w-4 shrink-0 text-orange" />
                  {groupSize} {groupSize === 1 ? "person" : "people"}
                </div>
              </div>
              <hr className="border-border" />
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price Breakdown</h4>
                <div className="space-y-1.5 text-sm">
                  <div><span className="text-muted-foreground">${slot.price} x {groupSize}</span> <span className="float-right font-medium text-navy">${total.toLocaleString()}</span></div>
                  <div><span className="text-muted-foreground">{paymentType === "DEPOSIT" ? "Deposit (30%)" : "Full payment"}</span></div>
                </div>
              </div>
              <hr className="border-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Due now</span>
                <span className="text-lg font-bold text-orange">${payAmount.toLocaleString()}</span>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 shrink-0 text-success" /> Secure payment via Stripe</div>
                <div className="flex items-center gap-2"><CreditCard className="h-3.5 w-3.5 shrink-0 text-success" /> Visa, Mastercard, Amex</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
