import { Globe, ExternalLink, MapPinned, Phone, Mail, Clock, MapPin } from "lucide-react"
import Link from "next/link"

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <img src="/walkthrough-nepal-logo-white.png" alt="Walk Through Nepal" className="h-20 w-auto" />
    </Link>
  )
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-4 font-semibold">{title}</h4>
      <ul className="space-y-2 text-sm text-white/75">
        {items.map((i) => <li key={i}><a href="#" className="hover:text-orange">{i}</a></li>)}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-navy pt-14 text-navy-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 pb-10 md:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-white/70">
            Authentic adventures, meaningful connections and responsible travel experiences in Nepal.
          </p>
          <div className="mt-5 flex gap-3 text-white/80">
            <Globe className="h-4 w-4" /><ExternalLink className="h-4 w-4" /><MapPinned className="h-4 w-4" />
          </div>
        </div>
        <FooterCol title="Treks" items={["Everest Base Camp Trek", "Annapurna Circuit Trek", "Annapurna Base Camp Trek", "Langtang Valley Trek", "Manaslu Circuit Trek", "View All Treks"]} />
        <FooterCol title="Tours" items={["Kathmandu Valley Tour", "Pokhara Tour", "Chitwan Wildlife Safari", "Upper Mustang Tour", "Lumbini Tour", "View All Tours"]} />
        <FooterCol title="Travel Info" items={["Nepal Visa Information", "Best Time to Visit", "Trekking in Nepal", "Packing List", "Travel Insurance", "FAQs"]} />
        <FooterCol title="Company" items={["About Us", "Our Team", "Reviews", "Responsible Tourism", "Careers", "Contact Us"]} />
        <div>
          <h4 className="mb-4 font-semibold">Contact Us</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-orange" /> Thamel, Kathmandu, Nepal</li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-orange" /> +977 984 123 4567</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-orange" /> info@walkthroughnepal.com</li>
            <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 text-orange" /> Mon - Sat: 9AM - 6PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-4 py-5 text-xs text-white/60">
          <span>© 2024 Walk Through Nepal. All Rights Reserved.</span>
          <div className="flex gap-5"><a href="#">Privacy Policy</a><a href="#">Terms & Conditions</a><a href="#">Sitemap</a></div>
        </div>
      </div>
    </footer>
  )
}
