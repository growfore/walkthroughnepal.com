import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { getInfoPageBySlug, getAllInfoPageSlugs, resolveContentImages } from "@/lib/api"

import { BlogRenderer } from "@/components/blog-renderer"
import { PageHero } from "@/components/page-hero"
import { BreadcrumbJsonLd } from "@/components/json-ld"
import { ChevronLeft } from "lucide-react"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllInfoPageSlugs().then((slugs) => slugs.map((slug) => ({ slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const h = await headers()
    const locale = h.get("x-locale") ?? "en"
    const { infoPage } = await getInfoPageBySlug(slug, locale)
    if (!infoPage || !infoPage.published) return {}
    const desc = infoPage.metaDescription || infoPage.content?.replace(/<[^>]*>/g, "").slice(0, 160) || undefined
    const imageUrl = infoPage.coverImage ? (infoPage.coverImage.startsWith("http") ? infoPage.coverImage : `https://walkthroughnepal.com${infoPage.coverImage}`) : "https://walkthroughnepal.com/opengraph-image"
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

export default async function InfoPage({ params }: Props) {
  const { slug } = await params
  const h = await headers()
  const locale = h.get("x-locale") ?? "en"

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
          <BlogRenderer html={contentHtml} />
        </article>

        <div className="mt-8 text-center ">
          <Link href="/" className="text-orange font-medium hover:underline"><ChevronLeft/> Back to Home</Link>
        </div>
      </section>
    </div>
  )
}
