import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { getInfoPageBySlug, resolveContentImages } from "@/lib/api"
import { decodeHtmlEntities } from "@/lib/html-decoder"
import { BlogRenderer } from "@/components/blog-renderer"
import { PageHero } from "@/components/page-hero"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const { infoPage } = await getInfoPageBySlug(slug)
    if (!infoPage || !infoPage.published) return {}
    return {
      title: infoPage.metaTitle || infoPage.title,
      description: infoPage.metaDescription || undefined,
    }
  } catch {
    return {}
  }
}

export default async function InfoPage({ params }: Props) {
  const { slug } = await params

  let infoPage
  try {
    const res = await getInfoPageBySlug(slug)
    infoPage = res.infoPage
    if (!infoPage || !infoPage.published) return notFound()
  } catch {
    return notFound()
  }

  const contentHtml = resolveContentImages(decodeHtmlEntities(infoPage.content))

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title={infoPage.title}
        image={infoPage.coverImage}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: infoPage.title }]}
      />

      <section className="mx-auto max-w-4xl px-4 pb-16 pt-8">
        <article className="prose prose-lg prose-gray max-w-none w-full wrap-break-word **:wrap-break-word">
          <BlogRenderer html={contentHtml} />
        </article>

        <div className="mt-8 text-center">
          <Link href="/" className="text-orange font-medium hover:underline">← Back to Home</Link>
        </div>
      </section>
    </div>
  )
}
