import { Globe, ShieldCheck, MessageCircle, ChevronRight } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { img } from "@/lib/api"
import { Lightbox } from "@/components/lightbox"

const DEFAULT_HERO = "/manaslu-view.webp"

const valueProps = [
  { icon: Globe, text: "Trekking experts per destination" },
  { icon: ShieldCheck, text: "Free cancellation up to eight weeks in advance" },
  { icon: MessageCircle, text: "Quick personal advice" },
]

type Breadcrumb = { label: string; href?: string }

type PageHeroProps = {
  title: string
  description?: string | ReactNode
  image?: string | null
  breadcrumbs?: Breadcrumb[]
}

export function PageHero({ title, description, image, breadcrumbs }: PageHeroProps) {
  const src = image ? img(image) : DEFAULT_HERO

  return (
    <section className="relative overflow-hidden bg-navy pt-28">
      <div className="absolute inset-0">
        <Lightbox src={src} alt={title} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 pb-28 pt-16 text-center text-white">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4 flex items-center justify-center gap-1.5 text-sm text-white/60">
            {breadcrumbs.map((cr, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                {cr.href ? (
                  <Link href={cr.href} className="hover:text-white transition-colors">
                    {cr.label}
                  </Link>
                ) : (
                  <span className="text-white/90">{cr.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
        {description && (
          <p className="mt-3 text-lg text-white/80">{description}</p>
        )}
      </div>
      <div className="relative bg-[#dff0e6]">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-3">
          {valueProps.map((vp) => (
            <div key={vp.text} className="flex items-center gap-3 text-sm font-semibold text-[#1a4a3a]">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a4a3a]/10 text-[#1a4a3a]">
                <vp.icon className="h-4 w-4" />
              </span>
              {vp.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
