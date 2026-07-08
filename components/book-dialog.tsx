"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { X, Calendar, Users, Shield, CreditCard, Loader2, ArrowRight } from "lucide-react"
import type { Slot } from "@/lib/types"

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.walkthroughnepal.com"

export function BookDialog({ slot, activityId, activityTitle }: { slot: Slot; activityId: number; activityTitle: string }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [groupSize, setGroupSize] = useState(1)
  const [paymentType, setPaymentType] = useState<"DEPOSIT" | "FULL">("DEPOSIT")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [visible, setVisible] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  const total = Number(slot.price) * groupSize
  const deposit = Math.round(total * 0.3)
  const payAmount = paymentType === "DEPOSIT" ? deposit : total

  const close = useCallback(() => {
    setVisible(false)
    setTimeout(() => setOpen(false), 200)
  }, [])

  const openDialog = () => {
    setName(""); setEmail(""); setPhone(""); setGroupSize(1); setPaymentType("DEPOSIT"); setError("")
    setOpen(true)
    setTimeout(() => setVisible(true), 10)
  }

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, close])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${API}/api/v1/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId,
          slotId: slot.id,
          groupSize,
          totalPrice: total,
          name, email, phone, paymentType,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Booking failed")

      const checkoutRes = await fetch(`${API}/api/v1/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: data.data.booking.id }),
      })
      const checkoutData = await checkoutRes.json()
      if (!checkoutRes.ok) throw new Error(checkoutData.message || "Checkout failed")

      window.location.href = checkoutData.data.url
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={openDialog}
        disabled={slot.remainingSeats < 1}
        className="rounded-lg bg-orange px-4 py-2 text-sm font-semibold text-orange-foreground transition-all hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 shrink-0"
      >
        {slot.remainingSeats < 1 ? "Full" : "Book Now"}
      </button>

      {open && (
        <div
          ref={overlayRef}
          className={`fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 transition-opacity duration-200 sm:items-center sm:p-4 ${visible ? "opacity-100" : "opacity-0"}`}
          onClick={(e) => { if (e.target === overlayRef.current) close() }}
        >
          <div
            className={`flex w-full flex-col rounded-t-2xl bg-white shadow-2xl transition-all duration-200 sm:w-[80vw] sm:h-[80vh] sm:rounded-2xl ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 sm:translate-y-0"}`}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold text-navy">Book: {activityTitle}</h3>
                <p className="text-sm text-muted-foreground">{new Date(slot.departureDate).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}</p>
              </div>
              <button onClick={close} className="ml-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-navy shrink-0">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto sm:flex-row">
              {/* Form */}
              <div className="flex-1 px-6 py-4">
                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-navy">Full Name <span className="text-orange">*</span></label>
                      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-navy">Email <span className="text-orange">*</span></label>
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20" />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-navy">Phone <span className="text-orange">*</span></label>
                      <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+977 ..." className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-navy">Group Size <span className="text-orange">*</span></label>
                      <div className="flex items-center gap-0">
                        <button type="button" onClick={() => setGroupSize(Math.max(1, groupSize - 1))} disabled={groupSize <= 1} className="flex h-10 w-10 items-center justify-center rounded-l-lg border border-border bg-background text-lg font-medium text-navy transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30">&minus;</button>
                        <div className="flex h-10 w-14 items-center justify-center border-y border-border bg-background text-sm font-semibold text-navy">{groupSize}</div>
                        <button type="button" onClick={() => setGroupSize(Math.min(slot.remainingSeats || 10, groupSize + 1))} disabled={groupSize >= (slot.remainingSeats || 10)} className="flex h-10 w-10 items-center justify-center rounded-r-lg border border-border bg-background text-lg font-medium text-navy transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30">+</button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-navy">Payment</label>
                    <div className="space-y-2">
                      <label className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 text-sm transition-all ${paymentType === "DEPOSIT" ? "border-orange bg-orange/5" : "border-border hover:border-orange/30"}`}>
                        <input type="radio" name="paymentType" checked={paymentType === "DEPOSIT"} onChange={() => setPaymentType("DEPOSIT")} className="accent-orange" />
                        <div>
                          <div className="font-semibold text-navy">Pay Deposit (30%) &mdash; <span className="text-orange">${deposit}</span></div>
                          <div className="mt-0.5 text-muted-foreground">Balance due before departure</div>
                        </div>
                      </label>
                      <label className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 text-sm transition-all ${paymentType === "FULL" ? "border-orange bg-orange/5" : "border-border hover:border-orange/30"}`}>
                        <input type="radio" name="paymentType" checked={paymentType === "FULL"} onChange={() => setPaymentType("FULL")} className="accent-orange" />
                        <div>
                          <div className="font-semibold text-navy">Pay Full Amount &mdash; <span className="text-orange">${total}</span></div>
                          <div className="mt-0.5 text-muted-foreground">Pay everything now</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: "#635bff" }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                    ) : (
                      <><CreditCard className="h-4 w-4" /> Proceed to Checkout <ArrowRight className="h-4 w-4" /></>
                    )}
                  </button>
                </form>
              </div>

              {/* Summary sidebar */}
              <div className="border-t border-border bg-navy/[0.02] px-6 py-4 sm:w-72 sm:shrink-0 sm:border-l sm:border-t-0">
                <div className="space-y-4">
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
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 shrink-0 text-success" /> Secure payment via Stripe
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-3.5 w-3.5 shrink-0 text-success" /> Visa, Mastercard, Amex
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
