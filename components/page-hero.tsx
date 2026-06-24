import { Award, ShieldCheck, Headphones } from "lucide-react"
import { img } from "@/lib/api"

const DEFAULT_HERO = "/manaslu-view.webp"

const valueProps = [
  { icon: Award, text: "Local trekking experts" },
  { icon: ShieldCheck, text: "Free cancellation up to 8 weeks" },
  { icon: Headphones, text: "Personal trip advice" },
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
      <div className="relative border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-4">
          {valueProps.map((vp) => (
            <div key={vp.text} className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange/20 text-orange">
                <vp.icon className="h-3.5 w-3.5" />
              </span>
              {vp.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
