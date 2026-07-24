import type { Metadata } from "next"
import { FAQPageJsonLd } from "@/components/json-ld"

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Walk Through Nepal. Have a question about a trek or need help planning your Himalayan adventure? We'd love to hear from you.",
  keywords: ["contact Walk Through Nepal", "Nepal trek inquiry", "Nepal travel agency contact", "trek booking Nepal"],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | Walk Through Nepal",
    description:
      "Get in touch with Walk Through Nepal. Have a question about a trek or need help planning your Himalayan adventure?",
    url: "https://walkthroughnepal.com/contact",
  },
}

const contactFaqs = [
  {
    question: "How do I know my booking is confirmed?",
    answer: "Once you complete your booking, you'll receive a confirmation email with all trip details. Our team also follows up within 24 hours to ensure everything is in order.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept bank transfers, credit/debit cards (Visa, MasterCard, Amex), and PayPal. A 30% deposit secures your booking, with the balance due 30 days before departure.",
  },
  {
    question: "Can I modify or cancel my booking?",
    answer: "Yes — changes can be made up to 14 days before departure at no charge. Cancellations are free up to 8 weeks in advance. See our full cancellation policy on the departures page.",
  },
  {
    question: "Do I need travel insurance?",
    answer: "Yes, comprehensive travel insurance is mandatory for all treks above 3,000m. We recommend coverage for trip cancellation, medical emergencies, and helicopter evacuation.",
  },
]

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <FAQPageJsonLd items={contactFaqs} />
      {children}
    </>
  )
}
