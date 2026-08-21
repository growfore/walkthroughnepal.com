import Link from "next/link"
import Image from "next/image"
import { Clock, MapPin, Mountain } from "lucide-react"
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
    maximumAltitude?: string
    regionName?: string | null
  }
  compact?: boolean
}) {
  const a = activity
  const imageUrl = img(a.images?.[0]) ?? "/images/trek-everest.jpg"

  const difficultyLabel = a.difficultyLevel
    ?.replace(/_/g, " ")
    .replace(/\b\w/g, (l: string) => l.toUpperCase()) ?? "Moderate"

  const level = a.difficultyLevel?.toLowerCase() ?? ""
  // ponytail: fixed fill widths/colors, map properly when levels are numeric
  const levelFill = level.includes("easy") ? "40%"
    : level.includes("moderate") ? "60%"
    : level.includes("hard") || level.includes("strenuous") ? "85%"
    : "70%"
  const levelColor = level.includes("easy") ? "from-emerald-400 to-emerald-500"
    : level.includes("moderate") ? "from-orange-400 to-orange-500"
    : "from-red-400 to-red-500"

  return (
    <Link
      href={`/trip/${a.slug}`}
      className={`group relative block overflow-hidden rounded-lg shadow-md hover:shadow-lg ${
        compact ? "h-[480px] min-w-72 shrink-0" : "h-[600px]"
      } transition-shadow duration-500`}
    >
      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
        <Image
          src={imageUrl}
          alt={a.title}
          fill
          sizes={compact ? "(max-width: 768px) 100vw, 288px" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent" />
      </div>

      <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-orange/90 px-3 py-1.5 font-mono text-xs font-bold text-orange-foreground shadow-sm backdrop-blur-sm">
        <Clock className="h-3 w-3" /> {a.duration}
      </span>

      <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
        <h3 className={`font-extrabold tracking-tight ${compact ? "" : "text-lg"}`}>
          {a.title}
        </h3>

        <div className="mt-1 flex items-baseline gap-2 text-sm">
          <span className="opacity-75">{a.duration} from</span>
          <span className="text-xl font-extrabold text-orange">${a.price}</span>
        </div>

        <div className="mt-3 flex items-center gap-3 text-sm">
          <span className="opacity-80">{difficultyLabel}</span>
          <div className="h-1 w-24 overflow-hidden rounded-full bg-white/30">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${levelColor}`}
              style={{ width: levelFill }}
            />
          </div>
        </div>

        {(a.regionName || a.maximumAltitude) && (
          <div className="mt-2 flex items-center gap-4 text-xs opacity-80">
            {a.regionName && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {a.regionName}
              </span>
            )}
            {a.maximumAltitude && (
              <span className="flex items-center gap-1">
                <Mountain className="h-3 w-3" /> {a.maximumAltitude.split(" / ")[0]}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
