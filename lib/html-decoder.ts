export function stripCodeBlock(html: string): string {
  return html.replace(/<\/?pre>/gi, "").replace(/<\/?code>/gi, "")
}

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
