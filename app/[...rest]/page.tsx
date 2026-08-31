import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { getInfoPageBySlug, resolveContentImages } from "@/lib/api"
import { isLocaleCode } from "@/lib/locales"
import { BlogRenderer } from "@/components/blog-renderer"
import { PageHero } from "@/components/page-hero"
import { BreadcrumbJsonLd } from "@/components/json-ld"
import { ChevronLeft } from "lucide-react"
import HomePage, { generateMetadataHome } from "@/app/(home)/page"
import * as TripMod from "@/app/(pages)/trip/[slug]/page"
import * as TripPrintMod from "@/app/(pages)/trip/[slug]/print/page"
import * as ActivityMod from "@/app/(pages)/activity/[slug]/page"
import * as CategoryMod from "@/app/(pages)/category/[slug]/page"
import * as BlogMod from "@/app/(pages)/blog/page"
import * as BlogPostMod from "@/app/(pages)/blog/[slug]/page"
import * as DepartureSuccessMod from "@/app/(pages)/departure/success/page"
import * as DepartureFailedMod from "@/app/(pages)/departure/failed/page"
import * as DepartureMod from "@/app/(pages)/departure/page"
import * as AboutMod from "@/app/(pages)/about/page"
import * as OurTeamMod from "@/app/(pages)/our-team/page"
import * as DytMod from "@/app/(pages)/design-your-trip/page"
import * as BookingMod from "@/app/(pages)/booking/page"
import * as ExploreMod from "@/app/(pages)/explore/page"
import * as RecommendMod from "@/app/(pages)/recommend/page"
import * as InquiryMod from "@/app/(pages)/inquiry/page"
import * as ContactMod from "@/app/(pages)/contact/page"

// One root catch-all dispatches everything — sibling single-segment dynamics (`[slug]` info
// + `[lang]`) are illegal in App Router, so the catch-all disambiguates by content:
//   - first segment is a locale code (`/de`, `/de/trip/x`, `/es/blog`) → locale routing
//   - single EN segment (`/about-us`, `/zzz`) → info page (404 when unknown)
//   - everything else stays plain Not Found. More specific routes (trip/[slug], about, blog, …)
//     win over the catch-all, so it only ever handles genuinely dynamic paths.
type Params = Promise<{ rest: string[] }>
type SearchParams = Promise<Record<string, string | string[] | undefined>>

// [path, idx] — idx: 0=no props, >0 = 1-based index of the real slug in `rest`, -2=searchParams
type Mod = { default: (props: Record<string, unknown>) => ReactNode; generateMetadata?: (p: unknown) => Promise<Metadata>; metadata?: Metadata }

const ROUTES: [string, number, Mod][] = [
  ["trip", 1, TripMod as unknown as Mod],
  ["trip/print", 1, TripPrintMod as unknown as Mod],
  ["activity", 1, ActivityMod as unknown as Mod],
  ["category", 1, CategoryMod as unknown as Mod],
  ["blog", -2, BlogMod as unknown as Mod],
  ["blog/post", 1, BlogPostMod as unknown as Mod],
  ["departure/success", 0, DepartureSuccessMod as unknown as Mod],
  ["departure/failed", 0, DepartureFailedMod as unknown as Mod],
  ["departure", 0, DepartureMod as unknown as Mod],
  ["about", 0, AboutMod as unknown as Mod],
  ["our-team", 0, OurTeamMod as unknown as Mod],
  ["design-your-trip", 0, DytMod as unknown as Mod],
  ["booking", 0, BookingMod as unknown as Mod],
  ["explore", -2, ExploreMod as unknown as Mod],
  ["recommend", 0, RecommendMod as unknown as Mod],
  ["inquiry", 0, InquiryMod as unknown as Mod],
  ["contact", 0, ContactMod as unknown as Mod],
]

// rest is relative to the locale code (already stripped) or to the EN root
function match(rest: string[]): [number, Mod] | "info" | null {
  for (const [p, idx, mod] of ROUTES) {
    if (p === "trip" && rest.length === 2 && rest[0] === "trip") return [idx, mod]
    if (p === "trip/print" && rest.length === 3 && rest[0] === "trip" && rest[2] === "print") return [idx, mod]
    if (p === "activity" && rest.length === 2 && rest[0] === "activity") return [idx, mod]
    if (p === "category" && rest.length === 2 && rest[0] === "category") return [idx, mod]
    if (p === "blog/post" && rest.length === 2 && rest[0] === "blog") return [idx, mod]
    if ((p === "blog" || p === "explore") && rest.length === 1 && rest[0] === p) return [idx, mod]
    if (rest.length === 1 && rest[0] === p) return [idx, mod]
  }
  if (rest.length === 1) return "info"
  return null
}

async function InfoPageEl({ slug, locale }: { slug: string; locale: string }) {
  let infoPage
  try {
    const res = await getInfoPageBySlug(slug, locale)
    infoPage = res.infoPage
    if (!infoPage || !infoPage.published) return notFound()
  } catch {
    return notFound()
  }

  const contentHtml = resolveContentImages(infoPage.content)

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={[{ label: infoPage.title }]} />
      <PageHero
        title={infoPage.title}
        image={infoPage.coverImage}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: infoPage.title }]}
      />

      <section className="mx-auto max-w-4xl px-4 pb-16 pt-8">
        <article className="prose prose-lg prose-gray max-w-none w-full wrap-break-word **:wrap-break-word">
          <BlogRenderer html={contentHtml} locale={locale} />
        </article>

        <div className="mt-8 text-center">
          <Link href="/" className="text-orange font-medium hover:underline"><ChevronLeft /> Back to Home</Link>
        </div>
      </section>
    </div>
  )
}

async function infoMeta(slug: string, locale: string): Promise<Metadata> {
  try {
    const { infoPage } = await getInfoPageBySlug(slug, locale)
    if (!infoPage || !infoPage.published) return {}
    const desc = infoPage.metaDescription || infoPage.content?.replace(/<[^>]*>/g, "").slice(0, 160) || undefined
    const imageUrl = infoPage.coverImage
      ? (infoPage.coverImage.startsWith("http") ? infoPage.coverImage : `https://walkthroughnepal.com${infoPage.coverImage}`)
      : "https://walkthroughnepal.com/opengraph-image"
    return {
      title: infoPage.metaTitle || infoPage.title,
      description: desc,
      alternates: { canonical: `/${slug}` },
      openGraph: {
        title: infoPage.metaTitle || infoPage.title,
        description: desc,
        url: `https://walkthroughnepal.com/${slug}`,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: infoPage.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: infoPage.metaTitle || infoPage.title,
        description: desc,
        images: [imageUrl],
      },
    }
  } catch {
    return {}
  }
}

function split(rest: string[]): { locale: string; inner: string[] } {
  return isLocaleCode(rest[0]) ? { locale: rest[0], inner: rest.slice(1) } : { locale: "en", inner: rest }
}

export default async function CatchAll({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const { rest } = await params
  const { locale, inner } = split(rest)

  // /de (and friends) route home; a locale must never silently be an EN info slug
  if (locale !== "en" && inner.length === 0) return <HomePage />

  const hit = match(inner)
  if (!hit) notFound()

  if (hit === "info") return <InfoPageEl slug={inner[0]} locale={locale} />

  const [idx, mod] = hit
  if (idx === 0) return <mod.default />
  if (idx === -2) return <mod.default searchParams={searchParams} />
  return <mod.default params={Promise.resolve({ slug: inner[idx] })} />
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { rest } = await params
  const { locale, inner } = split(rest)

  if (locale !== "en" && inner.length === 0) return generateMetadataHome()

  const hit = match(inner)
  if (!hit) return {}
  if (hit === "info") return infoMeta(inner[0], locale)

  const [idx, mod] = hit
  if (typeof mod.generateMetadata === "function") {
    return (await mod.generateMetadata({ params: Promise.resolve({ slug: inner[idx] }) })) ?? {}
  }
  return mod.metadata ?? {}
}