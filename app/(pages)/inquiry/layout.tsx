import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Send Us an Inquiry",
  description:
    "Have a question or want to customize your Nepal trek? Send an inquiry to Walk Through Nepal and our travel experts will get back to you within 24 hours.",
  alternates: { canonical: "/inquiry" },
  openGraph: {
    title: "Send Us an Inquiry | Walk Through Nepal",
    description:
      "Have a question or want to customize your Nepal trek? Our travel experts are here to help.",
  },
}

export default function InquiryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
