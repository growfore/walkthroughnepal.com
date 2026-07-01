"use client"

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-navy">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-orange px-6 py-3 font-semibold text-orange-foreground hover:opacity-90"
      >
        Try again
      </button>
    </div>
  )
}
