import Link from "next/link"

type BlogCardProps = {
  slug: string
  image: string
  tag: string
  title: string
  description: string
  date: string
}

export function BlogCard({ slug, image, tag, title, description, date }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <article className="group overflow-hidden rounded-lg border border-border bg-card transition hover:shadow-md">
        <div className="relative h-40 overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded bg-navy px-2.5 py-1 text-[10px] font-bold text-navy-foreground">
            {tag}
          </span>
        </div>
        <div className="p-4">
          <h3 className="leading-snug font-bold text-navy">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          <div className="mt-4 text-xs text-muted-foreground">{date}</div>
        </div>
      </article>
    </Link>
  )
}
