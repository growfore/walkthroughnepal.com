export interface SiteConfig {
  name: string
  description: string
  experience: string
  established: string
  whatsAppNumber: string
  phoneNumbers: Array<{ phone: string; tel?: string; tel2?: string }>
  email: string
  openHours: string
  fullAddress: string
  socials: Record<string, string>
}

export const siteConfig: SiteConfig = {
  name: "Walk Through Nepal",
  description:
    "Authentic adventures, meaningful connections and responsible travel experiences in Nepal.",
  experience: "20+ years",
  established: "2004",
  whatsAppNumber: "9779841234567",
  phoneNumbers: [{ phone: "+977-9841234567" }],
  email: "info@walkthroughnepal.com",
  openHours: "Mon - Sat: 9AM - 6PM",
  fullAddress: "Thamel, Kathmandu, Nepal",
  socials: {},
}
