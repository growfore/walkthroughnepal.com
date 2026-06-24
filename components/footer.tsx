"use client"

import { Globe, ExternalLink, MapPinned, Phone, Mail, Clock, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, FormEvent } from "react"

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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("loading")
    const form = e.currentTarget
    const email = new FormData(form).get("email") as string
    const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
    const data = await res.json()
    if (res.ok) {
      setStatus("success")
      setMessage("Thanks for subscribing!")
      form.reset()
    } else {
      setStatus("error")
      setMessage(data.error || data.message || "Something went wrong")
    }
  }

  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="sm:flex-1">
              <h3 className="text-xl font-bold">Subscribe to our newsletter</h3>
              <p className="mt-1 text-sm text-white/60">Get the latest trek updates and travel tips straight to your inbox.</p>
            </div>
            <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
              <input type="email" name="email" placeholder="Enter your email" required className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-orange focus:ring-1 focus:ring-orange disabled:opacity-50" disabled={status === "loading"} />
              <button type="submit" disabled={status === "loading"} className="shrink-0 rounded-lg bg-orange px-5 py-2.5 text-sm font-semibold text-orange-foreground hover:bg-orange/90 transition-colors disabled:opacity-50">
                {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
              </button>
            </form>
          </div>
          {status === "success" && <p className="mt-3 text-center text-sm text-green-400 sm:text-left">{message}</p>}
          {status === "error" && <p className="mt-3 text-center text-sm text-red-400 sm:text-left">{message}</p>}
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 pb-10 pt-14 md:grid-cols-3 lg:grid-cols-6">
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
