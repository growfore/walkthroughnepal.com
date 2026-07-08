"use client"

import Link from "next/link"
import { XCircle } from "lucide-react"

export default function BookingFailed() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-4 text-3xl font-bold text-navy">Payment Cancelled</h1>
        <p className="mt-3 text-muted-foreground">
          You cancelled the payment. No charges were made and no booking was created. You can try booking again whenever you&apos;re ready.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-block rounded-md bg-orange px-6 py-3 font-semibold text-orange-foreground hover:opacity-90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
