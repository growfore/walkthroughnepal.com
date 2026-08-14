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
  whatsAppNumber: "9779866266688",
  phoneNumbers: [{ phone: "+977-9866266688" }],
  email: "info@walkthroughnepal.com",
  openHours: "Sun - Fri: 9AM - 6PM, Sat: Closed",
  fullAddress: "New Road -11, Pokhara, Kaski, Nepal",
  socials: {
    instagram: "https://www.instagram.com/walkthroughnepal/",
    facebook: "https://www.facebook.com/walkthroughnepal/"
  },
}
