import { Clock, MapPin, Users, Star } from "lucide-react"

const stats = [
  { icon: Clock, value: "15+", label: "Years Experience" },
  { icon: MapPin, value: "500+", label: "Trips Completed" },
  { icon: Users, value: "2,000+", label: "Happy Travelers" },
  { icon: Star, value: "4.9", label: "Average Rating" },
]

export function StatBar() {
  return (
    <section className="border-b border-border bg-white py-10">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center justify-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange/10">
              <s.icon className="h-5 w-5 text-orange" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-navy">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
