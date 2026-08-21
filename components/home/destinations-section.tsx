import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { HorizontalScroll } from "@/components/horizontal-scroll"
import { ScrollButtons } from "@/components/scroll-buttons"
import { SectionHeader } from "@/components/section-header"
import type { HomeDestination } from "@/lib/home-data"

export function DestinationsSection({ destinations }: { destinations: HomeDestination[] }) {
  if (destinations.length === 0) return null
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          title="Destinations"
          description="Explore our curated destinations across Nepal"
          rightAction={<ScrollButtons targetId="destinations-scroll" />}
        />
        <HorizontalScroll id="destinations-scroll" headerRight>
          {destinations.map((d) => (
            <Link
              key={d.handle}
              href={`/explore?city=${d.handle}`}
              className="group relative w-64 shrink-0 snap-start overflow-hidden rounded-xl"
            >
              <img
                src={d.img}
                alt={d.title}
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="font-semibold text-white">{d.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
                  View trips <ChevronRight className="h-4 w-4" />
                </p>
              </div>
            </Link>
          ))}
        </HorizontalScroll>
      </div>
    </section>
  )
}
