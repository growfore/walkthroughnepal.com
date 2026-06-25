"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, ChevronDown } from "lucide-react"
import { PageHero } from "@/components/page-hero"

const faqs = [
  {
    q: "How do I know my booking is confirmed?",
    a: "Once you complete your booking, you'll receive a confirmation email with all trip details. Our team also follows up within 24 hours to ensure everything is in order.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept bank transfers, credit/debit cards (Visa, MasterCard, Amex), and PayPal. A 30% deposit secures your booking, with the balance due 30 days before departure.",
  },
  {
    q: "Can I modify or cancel my booking?",
    a: "Yes — changes can be made up to 14 days before departure at no charge. Cancellations are free up to 8 weeks in advance. See our full cancellation policy on the booking page.",
  },
  {
    q: "Do I need travel insurance?",
    a: "Yes, comprehensive travel insurance covering medical evacuation, trip cancellation, and high-altitude trekking (up to 6,000m) is mandatory for all treks.",
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // ponytail: mailto fallback, replace with API endpoint when backend exists
    window.location.href = `mailto:info@walkthroughnepal.com?subject=${encodeURIComponent(form.subject || "Inquiry from " + form.name)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`)}`
    setSent(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <PageHero title="Contact Us" description="Have a question about a trek, need help planning your trip, or just want to say hello? We'd love to hear from you." breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      {/* Form + Info */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              {sent ? (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange/10 text-orange text-3xl font-bold">
                    ✓
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-navy">Message Sent!</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1 block text-sm font-semibold text-navy">
                        Full Name <span className="text-orange">*</span>
                      </label>
                      <input
                        id="name"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1 block text-sm font-semibold text-navy">
                        Email <span className="text-orange">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-navy">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
                        placeholder="+977 ..."
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="mb-1 block text-sm font-semibold text-navy">
                        Subject
                      </label>
                      <input
                        id="subject"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
                        placeholder="What is this about?"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-1 block text-sm font-semibold text-navy">
                      Message <span className="text-orange">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20 resize-y"
                      placeholder="Tell us about your dream trip..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-full bg-orange px-8 py-3 font-semibold text-orange-foreground transition hover:opacity-90"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold text-navy">Company Info</h3>
                <ul className="mt-4 space-y-4">
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                    <div>
                      <p className="text-sm font-semibold text-navy">Email</p>
                      <a href="mailto:info@walkthroughnepal.com" className="text-sm text-muted-foreground hover:text-orange transition-colors">
                        info@walkthroughnepal.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                    <div>
                      <p className="text-sm font-semibold text-navy">Phone</p>
                      <a href="tel:+9779841234567" className="text-sm text-muted-foreground hover:text-orange transition-colors">
                        +977 984 123 4567
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                    <div>
                      <p className="text-sm font-semibold text-navy">Address</p>
                      <p className="text-sm text-muted-foreground">Kathmandu, Nepal</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="text-2xl font-bold text-navy text-center">Frequently Asked Questions</h3>
          <div className="mt-6 space-y-2 rounded-xl border border-border bg-card p-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-border pb-2 last:border-0">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-2 py-2 text-left text-sm font-semibold text-navy"
                >
                  {faq.q}
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <p className="pb-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
