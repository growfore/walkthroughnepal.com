import { Globe, ShieldCheck, MessageCircle } from "lucide-react"
import { img } from "@/lib/api"

const DEFAULT_HERO = "/manaslu-view.webp"

const valueProps = [
  { icon: Globe, text: "Trekking experts per destination" },
  { icon: ShieldCheck, text: "Free cancellation up to eight weeks in advance" },
  { icon: MessageCircle, text: "Quick personal advice" },
]

type PageHeroProps = {
  title: string
  description?: string
  image?: string | null
}

export function PageHero({ title, description, image }: PageHeroProps) {
  const src = image ? img(image) : DEFAULT_HERO

  return (
    <section className="relative overflow-hidden bg-navy pt-28">
      <div className="absolute inset-0">
        <img src={src} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 pb-28 pt-16 text-center text-white">
        <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
        {description && (
          <p className="mt-3 text-lg text-white/80">{description}</p>
        )}
      </div>
      <div className="relative bg-secondary/15">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-3">
          {valueProps.map((vp) => (
            <div key={vp.text} className="flex items-center gap-3 text-sm font-semibold text-white">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
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
