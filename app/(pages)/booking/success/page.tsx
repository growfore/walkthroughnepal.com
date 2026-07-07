import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export const metadata: Metadata = { title: "Booking Confirmed" }

export default function BookingSuccess() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
        <h1 className="mt-4 text-3xl font-bold text-navy">Booking Confirmed!</h1>
        <p className="mt-3 text-muted-foreground">
          Your booking has been confirmed and paid. Check your email for the receipt and trip details.
        </p>
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
