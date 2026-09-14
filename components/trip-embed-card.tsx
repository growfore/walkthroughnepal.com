import Link from "next/link"
import { Clock } from "lucide-react"
import { img } from "@/lib/api"

export function TripEmbedCard({
  activity,
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
}) {
  const a = activity
  return (
    <Link
      href={`/trip/${a.slug}`}
      className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-32 w-48 shrink-0 overflow-hidden rounded-md">
        <img
          src={img(a.images?.[0]) ?? "/images/trek-everest.jpg"}
          alt={a.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-orange">
          {a.duration}
        </span>
        <h4 className="mt-0.5 line-clamp-2 font-bold text-navy group-hover:underline">
          {a.title}
        </h4>
        <span className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          From ${a.price}
        </span>
      </div>
    </Link>
  )
}
