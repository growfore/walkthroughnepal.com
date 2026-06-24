import { decodeHtmlEntities } from "@/lib/html-decoder"

export function BlogRenderer({ html }: { html: string }) {
  const markup = { __html: decodeHtmlEntities(html) }
  return (
    <div
      className="prose md:prose-lg max-w-none w-full
        wrap-break-word **:wrap-break-word
        prose-headings:foreground prose-headings:font-bold
        prose-h1:text-2xl md:prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
        prose-h2:text-xl md:prose-h2:text-3xl prose-h2:mt-6 prose-h2:mb-2
        prose-h3:text-base md:prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-1
        prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4 prose-p:mt-0
        prose-a:text-primary prose-a:underline
        prose-strong:text-foreground prose-strong:font-bold
        prose-ul:my-2 prose-ol:my-2
        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-foreground/80
        prose-img:rounded-lg prose-img:my-6
        prose-code:bg-accent prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
        prose-pre:bg-foreground prose-pre:text-foreground prose-pre:rounded-lg prose-pre:p-4"
      dangerouslySetInnerHTML={markup}
    />
  )
}
