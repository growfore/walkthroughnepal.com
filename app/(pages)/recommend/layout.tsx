import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Find Your Perfect Nepal Trip",
  description:
    "Answer a few quick questions and Walk Through Nepal will recommend the ideal Himalayan adventure based on your interests, budget, and travel style.",
  alternates: { canonical: "/recommend" },
  openGraph: {
    title: "Find Your Perfect Nepal Trip | Walk Through Nepal",
    description:
      "Answer a few quick questions and get personalized Nepal trip recommendations.",
  },
}

export default function RecommendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
