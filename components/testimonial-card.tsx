import { Star, Quote } from "lucide-react"

interface TestimonialCardProps {
  name: string
  country: string
  trip: string
  rating: number
  text: string
}

export function TestimonialCard({ name, country, trip, rating, text }: TestimonialCardProps) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <Quote className="h-8 w-8 text-orange/20" />
        <div className="flex gap-0.5">
          {Array.from({ length: rating }, (_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-orange text-orange" />
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">{text}</p>
      <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-navy">{name}</div>
          <div className="text-xs text-muted-foreground">{country} · {trip}</div>
        </div>
      </div>
    </div>
  )
}
