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

const TH_STYLE = 'style="background:#374151;color:#fff;padding:6px 8px;font-weight:700"'

export function renderRichText(html: string): string {
  let out = decodeHtmlEntities(html)
    .replace(/<pre><code>/gi, '<div class="not-prose">')
    .replace(/<\/code><\/pre>/gi, "</div>")
    .replace(/<th([^>]*)>/gi, `<th$1 ${TH_STYLE}>`)
    .replace(/<table/gi, '<table class="cms-table"')
  // First <tr> with only <td> (no <th>) gets th-style
  out = out.replace(/(<table[^>]*>[\s\S]*?(?:<tbody>)?\s*<tr[^>]*>)([\s\S]*?)(<\/tr>)/i, (m, open, cells, close) => {
    if (/<th[\s>]/i.test(cells)) return m
    return open + cells.replace(/<td([^>]*)>/gi, `<td$1 ${TH_STYLE}>`) + close
  })
  return out
}
