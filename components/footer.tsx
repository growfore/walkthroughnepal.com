import Link from "next/link"
import {
  Globe,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users, ClipboardList, Heart, PhoneCall
} from "lucide-react"
import { siteConfig, type SiteConfig } from "@/lib/siteConfig"
import { getFooterItems, getSiteConfig } from "@/lib/api"
import { Logo } from "./logo"
import { FooterNewsletter } from "./footer-newsletter"
import Image from "next/image";

type SocialIconProps = { url: string }

const reasons = [
  { icon: Users, title: "Local Experts", text: "Real Nepal based team with in-depth knowledge." },
  { icon: ClipboardList, title: "Flexible Itineraries", text: "Customize your trip to match your time and budget." },
  { icon: Heart, title: "Responsible Tourism", text: "We support local communities and sustainable travel." },
  { icon: PhoneCall, title: "24/7 Support", text: "We're with you before, during and after your trip." },
]


function SocialIcon({ url }: SocialIconProps) {
  const d = url.toLowerCase()
  if (d.includes("facebook"))
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    )
  if (d.includes("youtube"))
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6a3 3 0 0 0-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8" />
      </svg>
    )
  if (d.includes("tiktok"))
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.62-.02-.28-.04-.56 0-.84.21-2.07 1.42-3.97 3.2-5.01 1.29-.78 2.83-1.11 4.34-.95.01 1.45-.02 2.91-.02 4.36-.7-.2-1.48-.15-2.1.2-.66.35-1.13.97-1.39 1.66-.21.58-.15 1.22.07 1.79.3.72.99 1.3 1.76 1.47.72.14 1.5-.02 2.07-.49.55-.45.86-1.15.88-1.85.04-2.23.01-4.46.02-6.69 0-.35.08-.69.23-1 .55-1.14 1.55-2 2.72-2.42.71-.25 1.47-.32 2.22-.27Z" />
      </svg>
    )
  if (d.includes("instagram"))
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.7.07 7.05 0 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.35 2.63 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.63 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C21.73 2.7 19.3.27 14.95.07 13.67 0 13.26 0 12 0m0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32m0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.4-7.56a1.44 1.44 0 1 0 0-2.88 1.44 1.44 0 0 0 0 2.88" />
      </svg>
    )
  if (d.includes("twitter") || d.includes("x.com"))
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  return <Globe className="h-4 w-4" />
}

function SocialLinks({ socials }: { socials: Record<string, string> }) {
  const entries = Object.entries(socials).filter(([, v]) => v)
  if (entries.length === 0) return null
  return (
    <div className="flex gap-3 text-white/80">
      {entries.map(([name, url]) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
        >
          <SocialIcon url={url} />
        </a>
      ))}
    </div>
  )
}

export async function Footer() {
  const [apiConfig, footerItems] = await Promise.all([
    getSiteConfig(),
    getFooterItems(),
  ])

  const cfg: SiteConfig = apiConfig
    ? {
        ...siteConfig,
        ...Object.fromEntries(
          Object.entries(apiConfig).filter(([, v]) => v != null),
        ),
        phoneNumbers:
          apiConfig.phoneNumbers?.filter(Boolean).length
            ? apiConfig.phoneNumbers
            : siteConfig.phoneNumbers,
      }
    : siteConfig
  const items = footerItems.filter((i) => i.label && i.url)

  return (
    <footer
      className="bg-navy bg-cover bg-center text-navy-foreground"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15,43,61,.88), rgba(15,43,61,.88)), url('/footer-bg.png')",
      }}
    >
      {/* ── Selling Points ── */}
            <section className=" bg-navy py-16 text-navy-foreground">
              <div className="mx-auto max-w-7xl px-4">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {reasons.map((r) => (
                    <div key={r.title} className="text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange/10 text-orange">
                        <r.icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 font-bold">{r.title}</h3>
                      <p className="mt-1 text-sm text-white/70">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
      <FooterNewsletter />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pt-14 pb-10 md:grid-cols-3 lg:grid-cols-6">
        <div className="md:col-span-2">
          <a href={"/"}>
            <Image src={"/walkthrough-nepal-logo-white.svg"} height={200} width={200} alt="walk through nepal logo white"/>
          </a>
          <p className="mt-4 max-w-xs text-sm text-white/70">
            {cfg.description}
          </p>
          <div className="mt-5">
            <SocialLinks socials={cfg.socials} />
          </div>
        </div>
        {items.map((item) => (
          <div key={item.label}>
            <Link href={item.url}>
              <h4 className="mb-4 font-semibold">{item.label}</h4>
            </Link>
            {item.children && item.children.length > 0 && (
              <ul className="space-y-2 text-sm text-white/75">
                {item.children.map((sub) => (
                  <li key={sub.label}>
                    <Link
                      href={sub.url}
                      className="hover:text-orange transition-colors"
                    >
                      {sub.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <div>
          <h4 className="mb-4 font-semibold">Contact Us</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
              {cfg.fullAddress}
            </li>
            <li className="flex items-start gap-2">
              <Link href={`tel:${cfg.phoneNumbers[0]?.phone}`} className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                {cfg.phoneNumbers[0]?.phone}
              </Link>
            </li>
            <li className="flex items-start gap-2">
              <Link href={`mailto:${cfg.email}`} className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                {cfg.email}
              </Link>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
              {cfg.openHours}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-4 py-5 text-xs text-white/60">
          <span>
            &copy; {cfg.name}. {new Date().getFullYear()}. All rights reserved.
          </span>
          <div className="flex gap-2 items-center">
            Designed and Developed by
            <Link  href={"https://growfore.com/"} target="_blank" className="flex gap-1 items-center underline">
              <Image src={"https://growfore.com/wp-content/uploads/2025/08/cropped-growfore-rounded-blue-on-white.png"} height={200} width={200} alt="Grofore Solution Logo" className="size-6" /> Growfore Solution.
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
