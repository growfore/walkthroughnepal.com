"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, Shield, CreditCard, ArrowRight, Check } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.walkthroughnepal.com"

type Package = { id: string; slug: string; title: string }
type Slot = {
  id: number; departureDate: string; price: string
  remainingSeats: number; visible: boolean
}

export default function BookingForm({ packages }: { packages: Package[] }) {
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Step 1 state
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Step 2 state
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  // Step 3 state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [groupSize, setGroupSize] = useState(1)
  const [paymentType, setPaymentType] = useState<"DEPOSIT" | "FULL">("DEPOSIT")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!selectedPkg) return
    fetch(`${API}/api/v1/slot?activityId=${selectedPkg.id}`)
      .then(r => r.json())
      .then(d => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const upcoming = (d.data?.slots ?? []).filter(
          (s: Slot) => s.visible && new Date(s.departureDate) >= today
        ).sort(
          (a: Slot, b: Slot) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
        )
        setSlots(upcoming)
      })
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false))
  }, [selectedPkg])

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot || !selectedPkg) return
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API}/api/v1/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: Number(selectedPkg.id),
          slotId: selectedSlot.id,
          groupSize,
          totalPrice: Number(selectedSlot.price) * groupSize,
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

  const total = selectedSlot ? Number(selectedSlot.price) * groupSize : 0
  const deposit = Math.round(total * 0.3)

  const reset = () => { setStep(1); setSelectedPkg(null); setSelectedSlot(null); setSlots([]); setError("") }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Steps indicator */}
      <div className="mb-10 flex items-center justify-center gap-2 sm:gap-4">
        {[{ n: 1, label: "Trip" }, { n: 2, label: "Date" }, { n: 3, label: "Details" }].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2 sm:gap-4">
            <div className={`flex items-center gap-2 ${step === s.n ? "text-navy" : step > s.n ? "text-success" : "text-muted-foreground"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold sm:h-9 sm:w-9 sm:text-base ${step > s.n ? "bg-success text-white" : step === s.n ? "bg-navy text-navy-foreground" : "bg-muted text-muted-foreground"}`}>
                {step > s.n ? <Check className="h-4 w-4" /> : s.n}
              </div>
              <span className="hidden text-sm font-semibold sm:inline">{s.label}</span>
            </div>
            {i < 2 && <div className={`h-px w-8 sm:w-16 ${step > s.n ? "bg-success" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Step 1: Select a trip */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">Choose Your Adventure</h2>
          <p className="mt-1 text-sm text-muted-foreground">Select a trek or tour package</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => { setSelectedPkg(pkg); setStep(2) }}
                className={`group rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${selectedPkg?.id === pkg.id ? "border-navy bg-navy/5" : "border-border hover:border-navy/30"}`}
              >
                <div className="font-semibold text-navy group-hover:text-navy">{pkg.title}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Select a departure date */}
      {step === 2 && selectedPkg && (
        <div>
          <div className="flex items-center gap-2">
            <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-navy transition-colors">&larr; Back</button>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium text-navy">{selectedPkg.title}</span>
          </div>
          <h2 className="mt-4 text-xl font-bold text-navy sm:text-2xl">Select Departure Date</h2>
          <p className="mt-1 text-sm text-muted-foreground">Pick your preferred travel date</p>

          {loadingSlots ? (
            <div className="mt-6 flex items-center justify-center py-12 text-sm text-muted-foreground">Loading available dates...</div>
          ) : slots.length === 0 ? (
            <div className="mt-6 rounded-lg border border-border bg-card p-8 text-center">
              <Calendar className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 font-medium text-navy">No upcoming departures</p>
              <p className="mt-1 text-sm text-muted-foreground">Check back soon for new dates</p>
              <button onClick={() => setStep(1)} className="mt-4 text-sm text-orange hover:underline">Choose another trip</button>
            </div>
          ) : (
            <div className="mt-6 space-y-2">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => { setSelectedSlot(slot); setStep(3) }}
                  disabled={slot.remainingSeats < 1}
                  className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 ${selectedSlot?.id === slot.id ? "border-navy bg-navy/5" : "border-border hover:border-navy/30"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy/5">
                      <Calendar className="h-5 w-5 text-navy" />
                    </div>
                    <div>
                      <div className="font-semibold text-navy">
                        {new Date(slot.departureDate).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-sm text-muted-foreground">
                        <span>${slot.price} / person</span>
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {slot.remainingSeats} {slot.remainingSeats === 1 ? "seat" : "seats"}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-navy" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Guest details */}
      {step === 3 && selectedSlot && selectedPkg && (
        <div>
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => setStep(2)} className="text-muted-foreground hover:text-navy transition-colors">&larr; Back</button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-navy">{selectedPkg.title}</span>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-5">
            {/* Form */}
            <form onSubmit={handleBook} className="lg:col-span-3 space-y-5">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">Your Details</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-navy">Full Name <span className="text-orange">*</span></label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-navy">Email <span className="text-orange">*</span></label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-navy">Phone <span className="text-orange">*</span></label>
                  <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+977 ..." className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-navy">Group Size <span className="text-orange">*</span></label>
                  <input required type="number" min={1} max={selectedSlot.remainingSeats || 10} value={groupSize} onChange={(e) => setGroupSize(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-navy">Payment Type</label>
                <div className="space-y-2">
                  <label className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3.5 text-sm transition-all ${paymentType === "DEPOSIT" ? "border-navy bg-navy/5" : "border-border"}`}>
                    <input type="radio" name="paymentType" checked={paymentType === "DEPOSIT"} onChange={() => setPaymentType("DEPOSIT")} className="accent-navy" />
                    <div>
                      <div className="font-semibold text-navy">Pay Deposit (30%)</div>
                      <div className="mt-0.5 text-sm text-muted-foreground">Pay ${deposit} now, balance due before departure</div>
                    </div>
                  </label>
                  <label className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3.5 text-sm transition-all ${paymentType === "FULL" ? "border-navy bg-navy/5" : "border-border"}`}>
                    <input type="radio" name="paymentType" checked={paymentType === "FULL"} onChange={() => setPaymentType("FULL")} className="accent-navy" />
                    <div>
                      <div className="font-semibold text-navy">Pay Full Amount</div>
                      <div className="mt-0.5 text-sm text-muted-foreground">Pay ${total} now</div>
                    </div>
                  </label>
                </div>
              </div>

              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3 text-base font-semibold text-navy-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? "Processing..." : <>Pay ${paymentType === "DEPOSIT" ? deposit : total} <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>

            {/* Summary sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-xl border border-border bg-card p-5 shadow-sm">
                <h3 className="font-bold text-navy">Booking Summary</h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Trip</div>
                    <div className="mt-0.5 font-medium text-navy">{selectedPkg.title}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Departure</div>
                    <div className="mt-0.5 font-medium text-navy">{new Date(selectedSlot.departureDate).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Travelers</div>
                    <div className="mt-0.5 font-medium text-navy">{groupSize} {groupSize === 1 ? "person" : "people"}</div>
                  </div>

                  <hr className="border-border" />

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">${selectedSlot.price} x {groupSize}</span>
                    <span className="font-medium text-navy">${total.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Payment</span>
                    <span className="font-medium text-navy">{paymentType === "DEPOSIT" ? `Deposit (30%)` : "Full"}</span>
                  </div>

                  <hr className="border-border" />

                  <div className="flex items-center justify-between text-base">
                    <span className="font-bold text-navy">Due now</span>
                    <span className="text-xl font-bold text-navy">${paymentType === "DEPOSIT" ? deposit.toLocaleString() : total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 shrink-0 text-success" /> Secure payment via Stripe
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 shrink-0 text-success" /> Visa, Mastercard, Amex accepted
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer action */}
      {step > 1 && (
        <div className="mt-8 text-center">
          <button onClick={reset} className="text-sm text-muted-foreground hover:text-navy transition-colors underline underline-offset-2">
            Start over
          </button>
        </div>
      )}
    </div>
  )
}
