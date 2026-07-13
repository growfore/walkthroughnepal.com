import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface TravelTypeCardProps {
  icon: LucideIcon
  title: string
  description: string
  href: string
  image: string
}

export function TravelTypeCard({ icon: Icon, title, description, href, image }: TravelTypeCardProps) {
  return (
    <Link
      href={href}
      className="group relative block h-72 overflow-hidden rounded-xl"
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-orange/90">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-1 text-sm text-white/70 line-clamp-2">{description}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-orange">
          Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
