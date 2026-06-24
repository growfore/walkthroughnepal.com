import { getPostBySlug, img, resolveContentImages } from "@/lib/api"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BlogRenderer } from "@/components/blog-renderer"
import { decodeHtmlEntities } from "@/lib/html-decoder"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let post
  try {
    post = await getPostBySlug(slug)
  } catch {
    notFound()
  }

  const contentHtml = resolveContentImages(decodeHtmlEntities(post.content))

  return (
    <div className="min-h-screen">
      <section className="relative h-[400px] overflow-hidden">
        <img src={img(post.coverImage)} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      </section>

      <section className="mx-auto max-w-3xl px-4 -mt-20 relative z-10 pb-16">
        <article className="rounded-lg bg-card p-8 shadow-sm border border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 flex-wrap">
            {post.category && (
              <span className="rounded bg-navy px-2.5 py-1 text-[10px] font-bold text-navy-foreground">
                {post.category.name.toUpperCase()}
              </span>
            )}
            <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            {post.writer && (
              <>
                <span>•</span>
                <span>By {post.writer.name}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl font-bold text-navy leading-tight mb-6">{post.title}</h1>

          <BlogRenderer html={contentHtml} />
        </article>

        <div className="mt-8 text-center">
          <Link href="/blog" className="text-orange font-medium hover:underline">← Back to Blog</Link>
        </div>
      </section>
    </div>
  )
}
