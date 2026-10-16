import { Suspense } from "react"
import type { Metadata } from "next"
import { Skeleton } from "@/components/skeleton"
import { WebSiteJsonLd } from "@/components/json-ld"
import { getI18n } from "@/lib/server-locale"
import { SearchSection } from "@/components/search-section"
import { FeaturedTrips } from "@/components/home/featured-trips"
import { CategorySection } from "@/components/home/category-section"
import { DestinationsSection } from "@/components/home/destinations-section"
import { UpcomingDepartures } from "@/components/home/upcoming-departures"
import { AboutSection } from "@/components/home/about-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { InspirationSection } from "@/components/home/inspiration-section"
import { ConsultantSection } from "@/components/home/consultant-section"
import { RecommendButton } from "@/components/home/recommend-button"
import {
  getHomeBlog,
  getHomeCategories,
  getHomeDepartures,
  getHomeDestinations,
  getHomeFeaturedTags,
  getHomeTestimonials,
} from "@/lib/home-data"
import HeroSection from "./hero"

export const metadata: Metadata = {
  title: {
    absolute: "Walk Through Nepal — Authentic Himalayan Adventures",
  },
  description:
    "Discover authentic treks, cultural journeys, wildlife adventures and local experiences across the Himalayas with Walk Through Nepal. 20+ years of local expertise, 50+ destinations, 5000+ happy travelers.",
  keywords: [
    "Nepal trekking",
    "Himalayan adventure",
    "Nepal travel agency",
    "trekking packages Nepal",
    "Nepal tour operator",
  ],
  openGraph: {
    title: "Walk Through Nepal — Authentic Himalayan Adventures",
    description:
      "Discover authentic treks, cultural journeys, wildlife adventures and local experiences across the Himalayas.",
    url: "https://walkthroughnepal.com",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Walk Through Nepal — Authentic Himalayan Adventures",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Walk Through Nepal — Authentic Himalayan Adventures",
    description:
      "Discover authentic treks, cultural journeys, wildlife adventures and local experiences across the Himalayas.",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "/" },
}

export async function generateMetadataHome(): Promise<Metadata> {
  const { t } = await getI18n()
  const title = t("Walk Through Nepal — Authentic Himalayan Adventures")
  const description = t("Discover authentic treks, cultural journeys, wildlife adventures and local experiences across the Himalayas with Walk Through Nepal. 20+ years of local expertise, 50+ destinations, 5000+ happy travelers.")
  const ogDescription = t("Discover authentic treks, cultural journeys, wildlife adventures and local experiences across the Himalayas.")
  return {
    title: { absolute: title },
    description,
    keywords: [
      "Nepal trekking",
      "Himalayan adventure",
      "Nepal travel agency",
      "trekking packages Nepal",
      "Nepal tour operator",
    ],
    openGraph: {
      title,
      description: ogDescription,
      url: "https://walkthroughnepal.com",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: ogDescription,
      images: ["/opengraph-image"],
    },
    alternates: { canonical: "/" },
  }
}

export const dynamic = "force-dynamic"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <WebSiteJsonLd />

      {/* Hero (LCP) renders immediately; API-backed sections stream in after */}
      <HeroSection />

      <Suspense fallback={<HomeSectionsSkeleton />}>
        <HomeSections />
      </Suspense>
    </div>
  )
}

async function HomeSections() {
  const { locale } = await getI18n()
  const [categories, featuredTags, blogList, testimonials, destinations, departures] =
    await Promise.all([
      getHomeCategories(locale),
      getHomeFeaturedTags(locale),
      getHomeBlog(),
      getHomeTestimonials(),
      getHomeDestinations(locale),
      getHomeDepartures(),
    ])

  return (
    <>
      <FeaturedTrips tags={featuredTags} />

      <CategorySection categories={categories} />

      <SearchSection categories={categories} />

      <DestinationsSection destinations={destinations} />

      <UpcomingDepartures {...departures} />

      <AboutSection />

      {/*<TestimonialsSection testimonials={testimonials} />*/}

      <InspirationSection posts={blogList} />

      <ConsultantSection />

      <RecommendButton />
    </>
  )
}

function HomeSectionsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      <div className="mb-10 flex justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
