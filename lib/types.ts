export interface TripCategory {
  id: string
  categoryHandle: string
  categoryName: string
  categoryImage: string | null
}

export interface Activity {
  id: number
  title: string
  slug: string
  shortDescription: string
  fullDescription: string
  highlights: string[]
  images: string[]
  price: number
  duration: string
  difficultyLevel: string
  maximumAltitude: string
  itinerary: ItineraryDay[]
  inclusions: string[]
  exclusions: string[]
  whatToBring: string[]
  accommodations: string[]
  meetingPoint: string
  dropOffPoint: string
  guestCapacity: number
  isFeatured: boolean
  averageRating: number
  bookingsCount: number
  faqs: FAQ[]
  additionalInfo: AdditionalInfo[]
  canonicalPath: string
  locations: string[]
  reviewCount: number
  createdAt: string
  updatedAt: string
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
}

export interface FAQ {
  question: string
  answer: string
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
  published: boolean
  publishedAt: string
  views: number
  createdAt: string
  updatedAt: string
  metaTitle: string | null
  metaDescription: string | null
  category: { id: string; name: string; slug: string } | null
  writer: { id: string; name: string; username: string } | null
  tags: string
  canonicalUrl: string | null
  postType: string
}

export interface TeamMember {
  id: string
  name: string
  designation: string
  about: string
  image: string | null
  department: { id: string; name: string } | null
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}
