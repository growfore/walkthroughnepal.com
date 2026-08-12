export const DURATION_VALUES = ["1–3 days", "4–7 days", "8–10 days", "11–14 days", "15–20 days", "21+ days"] as const

export const GROUP_OPTIONS = [
  { value: "solo", label: "Solo" },
  { value: "couple", label: "Couple" },
  { value: "custom", label: "Custom Group" },
] as const

export type RichSegment = { type: "prose" | "item"; html: string }

export function parseRichList(html: string): RichSegment[] {
  const segs: RichSegment[] = []
  const listRe = /<ul[\s\S]*?<\/ul>|<ol[\s\S]*?<\/ol>/gi
  let last = 0
  for (const m of html.matchAll(listRe)) {
    const before = html.slice(last, m.index)
    if (before.trim()) segs.push({ type: "prose", html: before })
    for (const li of m[0].match(/<li[\s\S]*?<\/li>/gi) ?? []) {
      segs.push({ type: "item", html: li.replace(/^<li[^>]*>/, "").replace(/<\/li>\s*$/, "") })
    }
    last = m.index + m[0].length
  }
  if (html.slice(last).trim()) segs.push({ type: "prose", html: html.slice(last) })
  return segs
}
