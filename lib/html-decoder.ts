export function decodeHtmlEntities(html: string): string {
  if (typeof window === "undefined") {
    return html
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  } else {
    const textarea = document.createElement("textarea")
    textarea.innerHTML = html.replace(/&nbsp;/g, " ")
    return textarea.value.replace(/\u00A0/g, " ")
  }
}

export function renderRichText(html: string): string {
  let out = decodeHtmlEntities(html)
    .replace(/<pre><code>/gi, '<div class="not-prose">')
    .replace(/<\/code><\/pre>/gi, "</div>")
    .replace(/<table/gi, '<table class="cms-table"')
    .replace(/<th([^>]*)>/gi, '<th$1 style="background:#f3f4f6;padding:6px 8px;font-weight:700">')
    .replace(/<td([^>]*)>/gi, '<td$1 style="padding:6px 8px;border:1px solid var(--primary)">')
  // Style first-row td like th when no <th> in first row
  out = out.replace(/(<table[^>]*>)([\s\S]*?<tr[^>]*>)([\s\S]*?)(<\/tr>)/i, (m, tbl, openTr, cells, closeTr) => {
    if (/<th[\s>]/i.test(cells)) return m
    return tbl + openTr + cells.replace(/<td([^>]*)>/gi, '<td$1 style="background:#f3f4f6;padding:6px 8px;font-weight:700">') + closeTr
  })
  return out
}
