"use client"

import { useState } from "react"
import { X } from "lucide-react"
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

  const total = Number(slot.price) * groupSize
  const deposit = Math.round(total * 0.3)
  const payAmount = paymentType === "DEPOSIT" ? deposit : total

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
        onClick={() => { setName(""); setEmail(""); setPhone(""); setGroupSize(1); setPaymentType("DEPOSIT"); setError(""); setOpen(true) }}
        className="rounded bg-orange px-3 py-1.5 text-xs font-semibold text-orange-foreground hover:opacity-90 shrink-0"
        disabled={slot.remainingSeats < 1}
      >
        {slot.remainingSeats < 1 ? "Full" : "Book Now"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-navy">Book Your Trip</h3>
              <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{activityTitle}</p>
            <div className="rounded-md bg-gray-50 p-3 mb-4 text-sm">
              <div className="font-medium">{new Date(slot.departureDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
              <div className="text-muted-foreground">${slot.price} / person &middot; {slot.remainingSeats} seats available</div>
            </div>

            {error && <div className="rounded-md bg-red-50 p-3 mb-4 text-sm text-red-700">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Group Size</label>
                <input required type="number" min={1} max={slot.remainingSeats || 10} value={groupSize} onChange={(e) => setGroupSize(Number(e.target.value))} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment</label>
                <div className="space-y-2">
                  <label className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${paymentType === "DEPOSIT" ? "border-orange bg-orange/5" : "border-border"}`}>
                    <input type="radio" name="paymentType" checked={paymentType === "DEPOSIT"} onChange={() => setPaymentType("DEPOSIT")} className="accent-orange" />
                    <div>
                      <span className="font-medium text-navy">Pay Deposit (30%)</span>
                      <span className="ml-2 text-muted-foreground">${deposit}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">Pay 30% now, balance due before departure</p>
                    </div>
                  </label>
                  <label className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${paymentType === "FULL" ? "border-orange bg-orange/5" : "border-border"}`}>
                    <input type="radio" name="paymentType" checked={paymentType === "FULL"} onChange={() => setPaymentType("FULL")} className="accent-orange" />
                    <div>
                      <span className="font-medium text-navy">Pay Full Amount</span>
                      <span className="ml-2 text-muted-foreground">${total}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">Pay entire amount now</p>
                    </div>
                  </label>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full rounded-md bg-orange py-2.5 text-sm font-semibold text-orange-foreground hover:opacity-90 disabled:opacity-50">
                {loading ? "Processing..." : `Pay $${payAmount}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
