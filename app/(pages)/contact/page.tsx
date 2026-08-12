"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { FAQSection } from "@/components/faq-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { siteConfig } from "@/lib/siteConfig"
import { toast } from "react-toastify"

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
    a: "Yes — changes can be made up to 14 days before departure at no charge. Cancellations are free up to 8 weeks in advance. See our full cancellation policy on the departures page.",
  },
  {
    q: "Do I need travel insurance?",
    a: "Yes, comprehensive travel insurance covering medical evacuation, trip cancellation, and high-altitude trekking (up to 6,000m) is mandatory for all treks.",
  },
]

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type FormValues = z.infer<typeof formSchema>

export default function ContactPage() {
  const [error, setError] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  })

  const { handleSubmit, formState: { isSubmitting } } = form

  async function onSubmit(data: FormValues) {
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to send message")
      }
      toast.success("Message sent! We'll get back to you within 24 hours.")
      form.reset()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.")
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <PageHero title="Contact Us" description="Have a question about a trek, need help planning your trip, or just want to say hello? We'd love to hear from you." breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Form {...form}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {error && (
                      <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</div>
                    )}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-navy">Full Name <span className="text-orange">*</span></FormLabel>
                          <FormControl><Input placeholder="Your name" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-navy">Email <span className="text-orange">*</span></FormLabel>
                          <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-navy">Phone Number</FormLabel>
                          <FormControl><Input type="tel" placeholder="+977 ..." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="subject" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-navy">Subject</FormLabel>
                          <FormControl><Input placeholder="What is this about?" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-navy">Message <span className="text-orange">*</span></FormLabel>
                        <FormControl><Textarea rows={5} placeholder="Tell us about your dream trip..." className="resize-y" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" disabled={isSubmitting} className="rounded-full bg-orange px-8 py-3 font-semibold text-orange-foreground hover:bg-orange/90">
                      {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <><Send className="h-4 w-4" /> Send Message</>}
                    </Button>
                  </form>
                </Form>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold text-navy">Company Info</h3>
                <ul className="mt-4 space-y-4">
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                    <div>
                      <p className="text-sm font-semibold text-navy">Email</p>
                      <a href={`mailto:${siteConfig.email}`} className="text-sm text-muted-foreground hover:text-orange transition-colors">{siteConfig.email}</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                    <div>
                      <p className="text-sm font-semibold text-navy">Phone</p>
                      <a href={`tel:${siteConfig.phoneNumbers[0]?.tel ?? siteConfig.phoneNumbers[0]?.phone?.replace(/[^+\d]/g, "")}`} className="text-sm text-muted-foreground hover:text-orange transition-colors">{siteConfig.phoneNumbers[0]?.phone}</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                    <div>
                      <p className="text-sm font-semibold text-navy">Address</p>
                      <p className="text-sm text-muted-foreground">{siteConfig.fullAddress}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection
        groups={[{ category: "Booking & Payment", icon: "HelpCircle", faqs: faqs.map((f) => ({ question: f.q, answer: f.a })) }]}
        className="pb-20 max-w-3xl mx-auto px-4"
      />
    </main>
  )
}
