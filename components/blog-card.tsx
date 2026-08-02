import Link from "next/link"
import Image from "next/image"

type BlogCardProps = {
  slug: string
  image: string
  tag: string
  title: string
  description: string | null
  date: string
}

export function BlogCard({ slug, image, tag, title, description, date }: BlogCardProps) {
  const parsed = new Date(date)
  const formatted = isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

  return (
    <Link
      href={`/blog/${slug}`}
      className="group relative block overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-lg h-[480px]"
    >
      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
        <h3 className="font-extrabold tracking-tight text-lg">{title}</h3>
        <p className="mt-2 text-sm text-white/80 line-clamp-2">{description}</p>
        <div className="mt-3 text-xs text-white/60">{formatted}</div>
      </div>
    </Link>
  )
}
