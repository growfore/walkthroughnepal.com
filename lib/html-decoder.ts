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
  let out = (html ?? "")
    .replace(/<pre><code>/gi, '<div class="not-prose">')
    .replace(/<\/code><\/pre>/gi, "</div>")
    .replace(/<table/gi, '<table class="cms-table"')
  // Inline-style first row cells: navy bg, white text, bold
  out = out.replace(
    /(<table[^>]*>)([\s\S]*?<tr[^>]*>)([\s\S]*?)(<\/tr>)/i,
    (m, tbl, openTr, cells, closeTr) => {
      const styled = cells
        .replace(/<th([^>]*)>/gi, '<th$1 style="background:#0F2B3D;color:white;font-weight:600">')
        .replace(/<td([^>]*)>/gi, '<td$1 style="background:#0F2B3D;color:white;font-weight:600">')
      return tbl + openTr + styled + closeTr
    },
  )
  return out
}
