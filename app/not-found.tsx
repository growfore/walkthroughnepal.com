import Link from "next/link"
import { Mountain, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <Mountain className="mx-auto h-16 w-16 text-muted-foreground/30" />
        <h1 className="mt-6 text-7xl font-bold text-navy">404</h1>
        <p className="mt-2 text-xl font-semibold text-foreground">Page not found</p>
        <p className="mt-2 text-muted-foreground max-w-md">
          The page you are looking for does not exist or has been moved. It might have been eaten by a yeti.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-navy-foreground hover:opacity-90 transition-opacity"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-navy hover:bg-muted transition-colors"
          >
            Explore Trips
          </Link>
        </div>
      </div>
    </div>
  )
}
