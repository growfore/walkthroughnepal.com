"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Loader2, XCircle, Calendar, Users } from "lucide-react"
import { PUBLIC_API_BASE } from "@/lib/api"

type BookingData = {
  id: number
  name: string
  email: string
  phone: string
  groupSize: number
  totalPrice: number
  status: string
  slot: { departureDate: string; days: number }
  activity: { id: number; title: string }
}

type PageState =
  | { phase: "verifying" }
  | { phase: "confirmed"; booking: BookingData }
  | { phase: "already-confirmed"; booking: BookingData }
  | { phase: "failed"; message: string }

export default function BookingSuccess() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [state, setState] = useState<PageState>(
    sessionId ? { phase: "verifying" } : { phase: "failed", message: "Missing session ID" },
  )

  useEffect(() => {
    if (!sessionId) return

    fetch(`${PUBLIC_API_BASE}/api/v1/stripe/verify-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.data?.booking) {
          setState({
            phase: data.message === "Booking already confirmed" ? "already-confirmed" : "confirmed",
            booking: data.data.booking,
          })
        } else {
          setState({ phase: "failed", message: data.message || "Payment verification failed" })
        }
      })
      .catch(() => setState({ phase: "failed", message: "Could not verify payment. Contact support." }))
  }, [sessionId])

  if (state.phase === "verifying") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-orange" />
          <p className="mt-4 text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (state.phase === "failed") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center max-w-md">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <h1 className="mt-4 text-3xl font-bold text-navy">Something went wrong</h1>
          <p className="mt-3 text-muted-foreground">{state.message}</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-md bg-orange px-6 py-3 font-semibold text-orange-foreground hover:opacity-90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const { booking } = state

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
          <h1 className="mt-4 text-3xl font-bold text-navy">Booking Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">
            {state.phase === "already-confirmed"
              ? "Your booking was already confirmed. Check your email for details."
              : "Check your email for the receipt and trip details."}
          </p>

          <div className="mt-8 space-y-4 border-t border-border pt-6 text-left">
            <h3 className="font-semibold text-navy text-lg">{booking.activity.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0 text-orange" />
              {new Date(booking.slot.departureDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              <span className="text-muted-foreground/50">·</span>
              {booking.slot.days} days
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 shrink-0 text-orange" />
              {booking.groupSize} {booking.groupSize === 1 ? "traveler" : "travelers"}
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total paid</span>
                <span className="font-bold text-navy">${Number(booking.totalPrice).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="mt-6 inline-block rounded-md bg-orange px-6 py-3 font-semibold text-orange-foreground hover:opacity-90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
