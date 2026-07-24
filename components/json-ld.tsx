import { siteConfig } from "@/lib/siteConfig"

const SITE_URL = "https://walkthroughnepal.com"

interface BreadcrumbItem {
  label: string
  href?: string
}

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteConfig.name,
    url: SITE_URL,
    logo: `${SITE_URL}/walkthrough-nepal-logo.png`,
    description: siteConfig.description,
    foundingDate: siteConfig.established,
    address: {
      "@type": "PostalAddress",
      streetAddress: "New Road -11",
      addressLocality: "Pokhara",
      addressRegion: "Kaski",
      addressCountry: "NP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.2096,
      longitude: 83.9856,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phoneNumbers[0]?.phone,
      contactType: "customer service",
      email: siteConfig.email,
      availableLanguage: "English",
    },
    sameAs: Object.values(siteConfig.socials).filter(Boolean),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/explore?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const allItems = [{ label: "Home", href: "/" }, ...items]
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface TouristTripProps {
  title: string
  description: string
  image: string
  price: number
  maxPrice?: number
  duration: string
  difficulty: string
  bestSeason: string
  slug: string
  provider?: string
}

export function TouristTripJsonLd({
  title,
  description,
  image,
  price,
  maxPrice,
  duration,
  difficulty,
  bestSeason,
  slug,
  provider = siteConfig.name,
}: TouristTripProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: title,
    description: description?.replace(/<[^>]*>/g, "").slice(0, 500),
    url: `${SITE_URL}/trip/${slug}`,
    image,
    touristType: "Traveler",
    itinerary: {
      "@type": "ItemList",
      numberOfItems: 1,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: title,
        },
      ],
    },
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/trip/${slug}`,
      ...(maxPrice && maxPrice !== price ? { priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", minPrice: price, maxPrice: maxPrice } } : {}),
    },
    provider: {
      "@type": "TravelAgency",
      name: provider,
      url: SITE_URL,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface ArticleProps {
  title: string
  description: string
  image: string
  slug: string
  publishedAt: string
  updatedAt?: string
  author?: string
  category?: string
}

export function ArticleJsonLd({
  title,
  description,
  image,
  slug,
  publishedAt,
  updatedAt,
  author = siteConfig.name,
  category,
}: ArticleProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description?.replace(/<[^>]*>/g, "").slice(0, 500),
    image,
    url: `${SITE_URL}/blog/${slug}`,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/walkthrough-nepal-logo.png`,
      },
    },
    ...(category ? { articleSection: category } : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface FAQItem {
  question: string
  answer: string
}

export function FAQPageJsonLd({ items }: { items: FAQItem[] }) {
  if (!items.length) return null

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer?.replace(/<[^>]*>/g, "").slice(0, 1000),
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
