export const DURATION_VALUES = ["1–3 days", "4–7 days", "8–10 days", "11–14 days", "15–20 days", "21+ days"] as const

export const GROUP_OPTIONS = [
  { value: "solo", label: "Solo" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
] as const

export function parseListItems(html: string): string[] {
  const m = html.match(/<li>(.*?)<\/li>/gi)
  return m ? m.map((s) => s.replace(/<\/?li>/gi, "")) : [html]
}
