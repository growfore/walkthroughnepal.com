import { getPublishedPosts, img } from "@/lib/api"
import Link from "next/link"
import { PageHero } from "@/components/page-hero"

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const { blogs, pagination } = await getPublishedPosts(page, 10)

  return (
    <div className="min-h-screen">
      <PageHero title="Travel Blog" description="Trekking tips, travel stories & insights from Nepal" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((post) => (
              <article key={post.slug} className="overflow-hidden rounded-lg border border-border bg-card transition hover:shadow-md">
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative h-48">
                    <img src={img(post.coverImage)} alt={post.title} loading="lazy" className="h-full w-full object-cover" />
                    {post.category && (
                      <span className="absolute left-3 top-3 rounded bg-navy px-2.5 py-1 text-[10px] font-bold text-navy-foreground">
                        {post.category.name.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-bold leading-snug text-navy">{post.title}</h2>
                    {post.metaDescription && (
                      <p className="mt-2 text-sm text-muted-foreground">{post.metaDescription.slice(0, 150)}</p>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {page > 1 && (
                <Link href={`/blog?page=${page - 1}`} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-navy hover:bg-border">
                  Previous
                </Link>
              )}
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === pagination.totalPages)
                .map((p, i, arr) => (
                  <span key={p}>
                    {i > 0 && arr[i - 1] !== p - 1 && <span className="px-2 text-muted-foreground">...</span>}
                    <Link
                      href={`/blog?page=${p}`}
                      className={`rounded-md px-4 py-2 text-sm font-medium ${p === page ? "bg-orange text-orange-foreground" : "border border-border text-navy hover:bg-border"}`}
                    >
                      {p}
                    </Link>
                  </span>
                ))}
              {page < pagination.totalPages && (
                <Link href={`/blog?page=${page + 1}`} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-navy hover:bg-border">
                  Next
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
