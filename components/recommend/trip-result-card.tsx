"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock, Mountain, Star, CheckCircle2, ChevronRight } from "lucide-react"
import { img } from "@/lib/api"
import { decodeHtmlEntities } from "@/lib/html-decoder"
import type { Activity } from "@/lib/types"

interface TripResultCardProps {
  activity: Activity
  reasons: string[]
  rank: number
}

export function TripResultCard({ activity, reasons, rank }: TripResultCardProps) {
  const isTop = rank === 1
  const price = activity.tier?.[0]?.price ?? activity.price

  return (
    <div className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md ${isTop ? "border-orange ring-2 ring-orange/20" : "border-border"}`}>
      {isTop && (
        <div className="absolute top-4 left-4 z-10 rounded-full bg-orange px-4 py-1.5 text-center text-sm font-bold text-white">
          Best Match For You
        </div>
      )}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={img(activity.images?.[0])}
          alt={activity.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute bottom-2 right-2 rounded-full bg-navy/90 px-3 py-1 text-xs font-bold text-white">
          #{rank}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold text-navy">{activity.title}</h3>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{activity.duration}</span>
          <span className="flex items-center gap-1"><Mountain className="h-3.5 w-3.5" />{activity.difficultyLevel}</span>
          {activity.averageRating > 0 && (
            <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-orange text-orange" />{activity.averageRating.toFixed(1)}</span>
          )}
        </div>

        <div className="mt-4 space-y-1.5 mb-4">
          {reasons.slice(0, 4).map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <span className="text-foreground/80">{r}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div>
            <span className="text-xs text-muted-foreground">From</span>
            <div className="text-xl font-bold text-navy">${Number(price).toLocaleString()}</div>
          </div>
          <Link
            href={`/trip/${activity.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            View Trip <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
