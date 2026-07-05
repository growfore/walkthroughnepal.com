import Link from "next/link"
import {
  Clock,
  TrendingUp,
  ArrowRight,
  MapPin,
  Home,
  Gauge,
} from "lucide-react"
import { img } from "@/lib/api"

export function TripCard({
  activity,
  compact,
}: {
  activity: {
    slug: string
    images: string[]
    title: string
    duration: string
    difficultyLevel: string
    price: number
    locations?: string[]
  }
  compact?: boolean
}) {
  const a = activity
  return (
    <Link
      href={`/trip/${a.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:shadow-md"
    >
      <div
        className={`relative shrink-0 overflow-hidden ${compact ? "h-44" : "h-48"}`}
      >
        <img
          src={img(a.images?.[0]) ?? "/images/trek-everest.jpg"}
          alt={a.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-125"
        />
        <span className="absolute top-3 left-3 rounded bg-orange px-2.5 py-1 text-[10px] font-bold text-orange-foreground">
          {a.duration}
        </span>
      </div>
      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <h3
          className={`line-clamp-2 min-h-[3.5rem] leading-snug font-bold text-navy ${compact ? "" : "text-lg"}`}
        >
          {a.title}
        </h3>
        <div
          className={`flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground ${compact ? "mt-2" : "mt-3"}`}
        >
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {a.duration}
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="h-3 w-3" />{" "}
            {a.difficultyLevel
              ?.replace(/_/g, " ")
              .replace(/\b\w/g, (l: string) => l.toUpperCase()) ?? "Moderate"}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between border-border pt-3">
          <div>
            <div className="text-[10px] text-muted-foreground">From</div>
            <div className="text-lg font-bold text-navy">${a.price}</div>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-orange group-hover:underline">
            View Details <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
