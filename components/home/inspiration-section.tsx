import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { BlogCard } from "@/components/blog-card"
import { SectionHeader } from "@/components/section-header"
import type { HomeBlog } from "@/lib/home-data"

export function InspirationSection({ posts }: { posts: HomeBlog[] }) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader title="Travel Inspiration" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((b) => (
            <BlogCard key={b.slug} {...b} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 rounded-full border border-orange px-6 py-3 text-sm font-semibold text-orange hover:bg-orange hover:text-orange-foreground transition-colors"
          >
            Visit Our Blog <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
