import type { Metadata } from "next"
import { getPostBySlug, resolveContentImages, img } from "@/lib/api"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BlogRenderer } from "@/components/blog-renderer"
import { PageHero } from "@/components/page-hero"
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld"

import { Calendar } from "lucide-react"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const post = await getPostBySlug(slug)
    const desc = post.metaDescription || post.content?.replace(/<[^>]*>/g, "").slice(0, 160) || undefined
    const imageUrl = post.coverImage ? (post.coverImage.startsWith("http") ? post.coverImage : `https://walkthroughnepal.com${post.coverImage}`) : "https://walkthroughnepal.com/opengraph-image"
    return {
      title: post.metaTitle || post.title,
      description: desc,
      keywords: [post.title, post.category?.name, "Nepal travel blog", "trekking guide"].filter((k): k is string => Boolean(k)),
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        title: post.metaTitle || post.title,
        description: desc,
        url: `https://walkthroughnepal.com/blog/${slug}`,
        type: "article",
        publishedTime: post.publishedAt || post.createdAt,
        modifiedTime: post.updatedAt,
        authors: post.writer?.name ? [post.writer.name] : undefined,
        section: post.category?.name || undefined,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: post.metaTitle || post.title,
        description: desc,
        images: [imageUrl],
      },
    }
  } catch {
    return {}
  }
}

function extractToc(html: string): { id: string; text: string }[] {
  const toc: { id: string; text: string }[] = []
  const regex = /<h2\b[^>]*>(.*?)<\/h2>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, "").trim()
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    toc.push({ id, text })
  }
  return toc
}

function addIdsToHeadings(html: string): string {
  return html.replace(/<h([23])\b([^>]*)>(.*?)<\/h([23])>/gi, (m, level, attrs, content) => {
    const text = content.replace(/<[^>]*>/g, "").trim()
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    return `<h${level}${attrs} id="${id}">${content}</h${level}>`
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let post
  try {
    post = await getPostBySlug(slug)
  } catch {
    notFound()
  }

  const contentHtml = resolveContentImages(post.content)
  const contentWithIds = addIdsToHeadings(contentHtml)
  const toc = extractToc(contentHtml)
  const date = new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      <ArticleJsonLd
        title={post.title}
        description={post.metaDescription || post.content}
        image={post.coverImage ? img(post.coverImage) : "/opengraph-image"}
        slug={slug}
        publishedAt={post.publishedAt || post.createdAt}
        updatedAt={post.updatedAt}
        author={post.writer?.name}
        category={post.category?.name}
      />
      <BreadcrumbJsonLd items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
      <PageHero
        title={post.title}
        description={
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-white/70">
            {post.writer && (
              <span className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
                  {post.writer.name.charAt(0)}
                </span>
                {post.writer.name}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {date}
            </span>
          </div>
        }
        image={post.coverImage}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]}
      />

      <section className="mx-auto max-w-4xl px-4 pb-16 pt-8">
        <article className="prose prose-lg prose-gray max-w-none w-full wrap-break-word **:wrap-break-word">
          {toc.length > 0 && (
            <div className="not-prose mb-8">
              <h2 className="text-2xl font-bold text-navy mb-4">Contents</h2>
              <nav>
                <ul className="space-y-2 list-disc list-inside">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="text-navy hover:underline text-base">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
          <BlogRenderer html={contentWithIds} />
        </article>

        <div className="mt-8 text-center">
          <Link href="/blog" className="text-orange font-medium hover:underline">← Back to Blog</Link>
        </div>
      </section>
    </div>
  )
}
