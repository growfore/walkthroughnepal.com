import Link from "next/link"
import Image from "next/image"
import { Calendar } from "lucide-react"
import { img } from "@/lib/api"
import type { CMSPost } from "@/lib/types"

export function PostEmbedCard({ post }: { post: CMSPost }) {
  const date = new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-md">
        <Image
          src={img(post.coverImage)}
          alt={post.title}
          fill
          sizes="160px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-orange">
          {post.category?.name ?? "Travel"}
        </span>
        <h4 className="mt-0.5 line-clamp-2 font-bold text-navy group-hover:underline">
          {post.title}
        </h4>
        {post.metaDescription && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {post.metaDescription}
          </p>
        )}
        <span className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {date}
        </span>
      </div>
    </Link>
  )
}
