export interface TripCategory {
  id: string
  categoryHandle: string
  categoryName: string
  categoryImage: string | null
}

export interface TripType {
  id: string
  tripTypeHandle: string
  tripTypeName: string
  tripTypeImage: string | null
}

export interface Tier {
  id: string
  name: string
  price: string
  features: string[]
  bestValue: boolean
}

export interface Activity {
  id: number
  title: string
  slug: string
  locale?: string
  translated?: boolean
  shortDescription: string
  fullDescription: string
  highlights: string[]
  images: string[]
  price: number
  maxPrice: number
  duration: string
  difficultyLevel: string
  maximumAltitude: string
  regionName: string | null
  itinerary: ItineraryVariant[]
  inclusions: string[]
  exclusions: string[]
  whatToBring: {
    description: string
    categories: { icon: string; name: string; content: string[] }[]
  } | null
  accommodations: string[]
  meetingPoint: string
  dropOffPoint: string
  guestCapacity: number
  isFeatured: boolean
  averageRating: number
  bookingsCount: number
  faqs: FAQGroup[]
  additionalInfo: AdditionalInfo[]
  canonicalPath: string
  locations: string[]
  reviewCount: number
  bestSeason: string
  groupSize: string
  transportation: string
  meals: string
  priceBreakdown: string
  groupDiscount?: {
    groupSize: number
    discount: number
    discountType: "PERCENTAGE" | "FLAT"
  }[]
  showGroupDiscount?: boolean
  videoUrl: string
  map: string
  altitudeChart: { id: string; altitude: number; location: string }[]
  tier: Tier[]
  createdAt: string
  updatedAt: string
  seo: ActivitySeo | null
}

export interface ActivitySeo {
  id?: string
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  metaRobots: string | null
  metaAuthor: string | null
  featuredMedia: string | null
  schema: string | null
}

export interface ItineraryDay {
  day: number
  title: string
  description: string
  meals: string[]
  accommodations: string[]
  ascent: string
  descent: string
  distance: string
  duration: string
  dayFeaturedImages: { alt: string; image: string }[]
}

export interface ItineraryVariant {
  id: string
  name: string
  description?: string
  isDefault?: boolean
  days: ItineraryDay[]
}

export interface FAQ {
  question: string
  answer: string
}

export interface FAQGroup {
  category: string
  icon: string
  faqs: FAQ[]
}

export interface AdditionalInfo {
  title: string
  description: string
}

export interface Testimonial {
  id: string
  rating: number
  content: string
  author: string
  createdAt: string
}

export interface FeaturedTag {
  id: string
  slug: string
  name: string
  description?: string
  activity: Activity[]
}

export interface CMSPost {
  id: string
  title: string
  slug: string
  content: string
  coverImage: string
  publishedAt: string
  views: number
  createdAt: string
  updatedAt: string
  metaTitle: string | null
  metaDescription: string | null
  category: { id: string; name: string; slug: string } | null
  author: { id?: string; name: string; username: string; bio?: string; image?: string } | null
  tags: string
  canonicalUrl: string | null
  toc: { id: string; text: string; level: number }[]
}

export interface TeamMember {
  id: string
  name: string
  designation: string
  about: string
  image: string | null
  department: { id: string; name: string } | null
}

export interface InfoPage {
  id: string
  title: string
  slug: string
  content: string
  coverImage: string | null
  metaTitle: string | null
  metaDescription: string | null
  published: boolean
  locale?: string
  translated?: boolean
  createdAt: string
  updatedAt: string
  infoPageCategory: { id: string; categoryHandle: string; categoryName: string } | null
}

export interface Slot {
  id: number
  activityId: number
  days: number
  departureDate: string
  maxGroupSize: number
  remainingSeats: number
  price: string
  visible: boolean
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type TravelerType = "solo" | "couple" | "family" | "friends"
export type Interest = "trekking" | "culture" | "wildlife" | "luxury" | "photography" | "wellness"
export type DurationBucket = "short" | "medium" | "long" | "extended"
export type ActivityLevel = "easy" | "moderate" | "challenging"
export type BudgetStyle = "budget" | "comfort" | "premium" | "luxury"
export type Season = "spring" | "summer" | "autumn" | "winter"

export interface QuizAnswers {
  travelerType: TravelerType
  interests: Interest[]
  duration: DurationBucket
  activityLevel: ActivityLevel
  budget: BudgetStyle
  season: Season
}

export interface RecommendationResult {
  activity: Activity
  score: number
  reasons: string[]
}
