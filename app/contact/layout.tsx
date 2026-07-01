import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Walk Through Nepal. Have a question about a trek or need help planning your Himalayan adventure? We'd love to hear from you.",
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
