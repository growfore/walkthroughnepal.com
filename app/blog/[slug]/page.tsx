import { getPostBySlug, resolveContentImages } from "@/lib/api"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BlogRenderer } from "@/components/blog-renderer"
import { PageHero } from "@/components/page-hero"
import { decodeHtmlEntities } from "@/lib/html-decoder"
import { Calendar } from "lucide-react"

function extractToc(html: string): { id: string; text: string; level: number }[] {
  const toc: { id: string; text: string; level: number }[] = []
  const regex = /<h([23])\b[^>]*>(.*?)<\/h[23]>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const level = Number(match[1])
    const text = match[2].replace(/<[^>]*>/g, "").trim()
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    toc.push({ id, text, level })
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

  const contentHtml = resolveContentImages(decodeHtmlEntities(post.content))
  const contentWithIds = addIdsToHeadings(contentHtml)
  const toc = extractToc(contentHtml)
  const date = new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
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
        <article className="prose prose-lg prose-gray max-w-none">
          {toc.length > 0 && (
            <div className="not-prose mb-8 rounded-lg border border-border bg-muted/50 p-5">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-navy">Content</h2>
              <nav className="space-y-1">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm leading-relaxed text-muted-foreground hover:text-orange transition-colors ${item.level === 3 ? "pl-4" : ""}`}
                  >
                    {item.text}
                  </a>
                ))}
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
