import { img } from "@/lib/api"

const DEFAULT_HERO = "/manaslu-view.webp"

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
      <div className="relative mx-auto max-w-3xl px-4 py-16 text-center text-white">
        <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
        {description && (
          <p className="mt-3 text-lg text-white/80">{description}</p>
        )}
      </div>
    </section>
  )
}
