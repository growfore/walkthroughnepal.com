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
    textarea.innerHTML = html
    return textarea.value
  }
}
