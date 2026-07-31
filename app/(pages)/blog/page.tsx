import type { Metadata } from "next"
import { getPublishedPosts, img } from "@/lib/api"
import Link from "next/link"
import { PageHero } from "@/components/page-hero"
import { BlogCard } from "@/components/blog-card"
import { Search, X } from "lucide-react"
import { BreadcrumbJsonLd } from "@/components/json-ld"

export const metadata: Metadata = {
  title: "Travel Blog",
  description:
    "Trekking tips, travel stories, and insider insights from Nepal. Read about Himalayan adventures, culture, and off-the-beaten-path destinations.",
  keywords: ["Nepal travel blog", "trekking tips", "Himalayan stories", "Nepal culture", "adventure travel blog"],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Travel Blog | Walk Through Nepal",
    description:
      "Trekking tips, travel stories, and insider insights from Nepal.",
    url: "https://walkthroughnepal.com/blog",
  },
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ""
  const { posts, pagination } = await getPublishedPosts(page, 12, search)

  return (
    <div className="min-h-screen">
      <BreadcrumbJsonLd items={[{ label: "Blog" }]} />
      <PageHero title="Travel Blog" description="Trekking tips, travel stories & insights from Nepal" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <form
            method="GET"
            action="/blog"
            className="mb-10 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  name="search"
                  type="text"
                  defaultValue={search}
                  placeholder="Search posts…"
                  className="h-10 w-full max-w-sm rounded-md border border-border bg-card pl-9 pr-3 text-sm text-navy outline-none focus:border-orange"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-md bg-orange px-4 text-sm font-semibold text-orange-foreground hover:opacity-90"
              >
                Filter
              </button>
              {search && (
                <Link
                  href="/blog"
                  className="inline-flex h-10 items-center gap-1 rounded-md border border-border px-3 text-sm text-muted-foreground hover:bg-border"
                >
                  <X className="h-4 w-4" /> Clear
                </Link>
              )}
            </div>
          </form>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                slug={post.slug}
                image={img(post.coverImage)}
                tag={post.category?.name?.toUpperCase() ?? "TRAVEL"}
                title={post.title}
                description={post.metaDescription?.slice(0, 150) ?? ""}
                date={new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {page > 1 && (
                <Link href={`/blog?page=${page - 1}`} className="inline-flex h-10 min-w-[88px] items-center justify-center rounded-md border border-border px-3 text-sm font-medium text-navy hover:bg-border">
                  Previous
                </Link>
              )}
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === pagination.totalPages)
                .map((p, i, arr) => (
                  <span key={p} className="flex items-center">
                    {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1 text-muted-foreground">...</span>}
                    <Link
                      href={`/blog?page=${p}`}
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium ${p === page ? "bg-orange text-orange-foreground" : "border border-border text-navy hover:bg-border"}`}
                    >
                      {p}
                    </Link>
                  </span>
                ))}
              {page < pagination.totalPages && (
                <Link href={`/blog?page=${page + 1}`} className="inline-flex h-10 min-w-[88px] items-center justify-center rounded-md border border-border px-3 text-sm font-medium text-navy hover:bg-border">
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
