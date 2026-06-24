import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { Metadata } from "next"
import { getInfoPageBySlug, img } from "@/lib/api"
import { resolveContentImages } from "@/lib/api"
import { decodeHtmlEntities } from "@/lib/html-decoder"

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden bg-navy pt-28">
        <div className="absolute inset-0">
          {infoPage.coverImage ? (
            <img src={img(infoPage.coverImage)} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-navy" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-10 text-center text-white">
          <nav className="mb-4 flex items-center justify-center gap-1.5 text-sm text-white/60">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/90">{infoPage.title}</span>
          </nav>
          <h1 className="text-4xl font-bold md:text-5xl">{infoPage.title}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <div
          className="prose prose-lg prose-gray max-w-none prose-headings:text-navy prose-a:text-primary prose-strong:text-navy"
          dangerouslySetInnerHTML={{ __html: resolveContentImages(decodeHtmlEntities(infoPage.content)) }}
        />
      </section>
    </div>
  )
}
