export type ShortcodeSegment =
  | { type: "html"; html: string }
  | { type: "trip"; slug: string }
  | { type: "featured"; tag: string; count: number }
  | { type: "post"; slug: string }

const SHORTCODE_RE =
  /<p\b[^>]*data-shortcode[^>]*>[\s\S]*?<\/p>|\[(trip|featured-trips|post)\b([^\]]*)\]/g

function dataAttrs(html: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  const re = /data-([a-z-]+)="([^"]*)"/g
  let m
  while ((m = re.exec(html))) attrs[m[1]] = m[2]
  return attrs
}

function parseAttrs(str: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  const re = /([a-z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s\]]+))/gi
  let m
  while ((m = re.exec(str))) attrs[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? ""
  return attrs
}

function normalizeSlug(raw: string, prefix: string): string {
  try {
    const url = new URL(raw)
    const path = url.pathname.replace(new RegExp(`^/${prefix}/`), "")
    return path || raw
  } catch {
    return raw.replace(new RegExp(`^/${prefix}/`), "")
  }
}

function toSegment(kind: string, attrs: Record<string, string>): ShortcodeSegment | null {
  switch (kind) {
    case "trip":
      return attrs.slug ? { type: "trip", slug: normalizeSlug(attrs.slug, "trip") } : null
    case "post":
      return attrs.slug ? { type: "post", slug: normalizeSlug(attrs.slug, "blog") } : null
    case "featured-trips": {
      const tag = attrs.tag
      if (!tag) return null
      const count = Math.min(Math.max(parseInt(attrs.count ?? "", 10) || 4, 1), 12)
      return { type: "featured", tag, count }
    }
    default:
      return null
  }
}

export function parseShortcodes(html: string): ShortcodeSegment[] {
  const segments: ShortcodeSegment[] = []
  let last = 0
  let m
  // ponytail: element form matched first so the CMS editor's <p data-shortcode> output
  // is consumed whole (its bracket text doesn't double-match). Greedy but deterministic —
  // the wrapper only ever wraps one shortcode.
  while ((m = SHORTCODE_RE.exec(html))) {
    const raw = m[0]
    if (m.index > last) segments.push({ type: "html", html: html.slice(last, m.index) })
    let seg: ShortcodeSegment | null = null
    if (raw.startsWith("<p")) {
      const attrs = dataAttrs(raw)
      seg = toSegment((attrs.shortcode || "").toLowerCase(), {
        slug: attrs.slug,
        tag: attrs.tag,
        count: attrs.count,
      })
    } else {
      seg = toSegment((m[1] || "").toLowerCase(), parseAttrs(m[2] || ""))
    }
    if (seg) segments.push(seg)
    last = m.index + raw.length
  }
  if (last < html.length) segments.push({ type: "html", html: html.slice(last) })
  return segments
}
