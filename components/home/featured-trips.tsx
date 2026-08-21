import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { FeaturedTag } from "@/lib/types"
import { TripCard } from "@/components/trip-card"
import { SectionHeader } from "@/components/section-header"

export function FeaturedTrips({ tags }: { tags: FeaturedTag[] }) {
  return (
    <>
      {tags
        .filter((t) => t.activity?.length)
        .map((tag) => (
          <section key={tag.slug} className="py-16">
            <div className="mx-auto max-w-7xl px-4">
              <SectionHeader
                title={tag.name.split("::")[0] || tag.name}
                description={tag.description}
                descriptionClassName="max-w-2xl"
                rightAction={
                  <Link
                    href="/explore"
                    className="hidden shrink-0 items-center gap-1 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-orange-foreground hover:opacity-90 sm:inline-flex"
                  >
                    Explore More <ArrowUpRight className="h-4 w-4" />
                  </Link>
                }
              />
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {tag.activity?.map((a) => <TripCard key={a.slug} activity={a} />)}
              </div>
              <div className="mt-8 text-center sm:hidden">
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-orange-foreground hover:opacity-90"
                >
                  Explore More <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        ))}
    </>
  )
}
