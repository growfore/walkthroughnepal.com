import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { ReactNode } from "react"

export function SectionHeader({
  title,
  description,
  descriptionClassName,
  link,
  align = "left",
  rightAction,
}: {
  title: string
  description?: string
  descriptionClassName?: string
  link?: { href: string; label: string }
  align?: "center" | "left"
  rightAction?: ReactNode
}) {
  return (
    <div className={`mb-6 ${align === "center" ? "text-center" : "flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between"}`}>
      <div>
        <h2 className="text-3xl font-bold text-navy">
          {title}
        </h2>
        {description && <div className={`mt-1 text-sm text-muted-foreground ${descriptionClassName ?? ""}`} dangerouslySetInnerHTML={{ __html: description }} />}
      </div>
      {rightAction ?? (
        link && (
          <Link href={link.href} className="flex items-center gap-1 text-sm font-medium text-orange shrink-0">
            {link.label} <ChevronRight className="h-4 w-4" />
          </Link>
        )
      )}
    </div>
  )
}
