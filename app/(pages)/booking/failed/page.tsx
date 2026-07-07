import type { Metadata } from "next"
import Link from "next/link"
import { XCircle } from "lucide-react"

export const metadata: Metadata = { title: "Payment Failed" }

export default function BookingFailed() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-4 text-3xl font-bold text-navy">Payment Failed</h1>
        <p className="mt-3 text-muted-foreground">
          The payment was not completed. Your booking has been cancelled and any held seats released.
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
