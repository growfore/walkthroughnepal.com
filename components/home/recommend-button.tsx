import Link from "next/link"
import { Sparkles } from "lucide-react"

export function RecommendButton() {
  return (
    <Link
      href="/recommend"
      className="group fixed bottom-6 right-6 z-90 flex h-10 w-10 items-center justify-center rounded-full bg-orange text-white shadow-sm transition-all hover:bg-orange/90 hover:text-white"
    >
      <Sparkles className="h-5 w-5" />
      <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        Find Your Perfect Adventure
      </span>
    </Link>
  )
}
