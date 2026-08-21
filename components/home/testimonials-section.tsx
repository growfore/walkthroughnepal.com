import { Star } from "lucide-react"
import { TestimonialCard } from "@/components/testimonial-card"
import type { HomeTestimonial } from "@/lib/home-data"

export function TestimonialsSection({ testimonials }: { testimonials: HomeTestimonial[] }) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <p className="font-mono text-sm font-semibold tracking-widest uppercase text-orange">
            Testimonials
          </p>
          <h2 className="mt-2 text-3xl font-bold text-navy md:text-4xl">
            What Our Travelers Say
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex text-orange">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span>4.9/5 · Trusted by 2,000+ travelers</span>
          </div>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  )
}
