import Link from "next/link"
import { ArrowUpRight, MessageCircle } from "lucide-react"
import { siteConfig } from "@/lib/siteConfig"

export function ConsultantSection() {
  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
        <div className="flex justify-center">
          <div className="relative">
            <div className="h-100 w-80 overflow-hidden  border-8 border-white shadow-xl">
              <img
                src="/manaslu-view.webp"
                alt="Travel Consultant"
                width={700}
                height={700}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
        <div>
          <p className="flex items-center gap-2 font-mono text-sm font-semibold text-orange">
            Looking for a Private Trip?
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-navy md:text-4xl">
            Say Hello to your Travel Consultant
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
            Planning your holiday? Our travel experts are here to craft the perfect
            personalized package just for you! Whether you have questions or need guidance,
            don&apos;t hesitate to reach out &mdash; we&apos;re ready to assist you every step
            of the way.
          </p>
          <p className="mt-6 font-bold text-navy">Need Assistance? Call Us.</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <a
              href={`tel:${siteConfig.phoneNumbers[0].tel ?? siteConfig.whatsAppNumber}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-6 py-3 font-bold text-navy hover:border-[#25D366]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]">
                <MessageCircle className="h-4 w-4 text-white" />
              </span>
              {siteConfig.phoneNumbers[0].phone}
            </a>
            <Link
              href="/design-your-trip"
              className="flex items-center gap-2 rounded-lg border border-navy bg-card px-6 py-3 font-bold text-navy hover:bg-navy hover:text-white transition-colors"
            >
              Plan Your Trip <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
