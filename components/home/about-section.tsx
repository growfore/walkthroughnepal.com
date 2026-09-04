import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { siteConfig } from "@/lib/siteConfig"
import { getI18n } from "@/lib/server-locale"

const stats = [
  { icon: "/icons/map-location.png", value: "Local Expertise", label: "Travel Nepal with people who know it from the inside." },
  { icon: "/icons/destination.png", value: "15+ Destinations", label: "Discover Nepal’s iconic places and hidden gems." },
  { icon: "/icons/journey.png", value: "Tailor Made Journeys", label: "Your interests. Your pace. Your Nepal." },
  { icon: "/icons/customer-support.png", value: "Personalized Support", label: "From your first inquiry to your final goodbye." },
]

export async function AboutSection() {
  const { t } = await getI18n()
  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
        <div className="flex justify-center">
          <div className="relative flex gap-1">
            <div className="h-100 w-80 overflow-hidden border-8 border-white shadow-xl left-2">
              <img
                src="/narphu-trek.webp"
                alt="Trekking in the Nar Phu Valley, Nepal"
                width={700}
                height={700}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
        <div>
          <p className="font-mono text-sm font-semibold uppercase text-orange">
            About Walk Through Nepal
          </p>
          <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
            Local Experts. Authentic Himalayan Adventures.
          </h2>
          <p className="mt-5 max-w-xl text-muted-foreground">
            {t("Founded by local trekking guides, we've spent {years} leading adventurers through the Himalayas — from the bustling streets of Kathmandu to the remote trails of the Nar Phu Valley. Every journey is designed to immerse you in Nepal's rich culture, breathtaking landscapes, and warm hospitality.", { years: siteConfig.experience })}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center rounded-sm  p-4">
                <img src={s.icon} alt="" width={48} height={48} className="mx-auto  object-contain" />
                <p className="mt-2 text-md font-bold ">{s.value}</p>
              </div>
            ))}
          </div>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-1 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-orange-foreground hover:opacity-90"
          >
            More About Us <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
