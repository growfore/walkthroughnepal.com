import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function SectionHeader({
  title,
  description,
  link,
  align = "left",
}: {
  title: string
  description?: string
  link?: { href: string; label: string }
  align?: "center" | "left"
}) {
  return (
    <div className={`mb-6 ${align === "center" ? "text-center" : "flex items-end justify-between"}`}>
      <div>
        <h2 className={`text-3xl font-bold text-navy ${align === "center" ? "relative inline-block" : ""}`}>
          {title}
          {align === "center" && <span className="mx-auto mt-2 block h-1 w-16 rounded-full bg-orange" />}
        </h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        {align === "left" && <span className="mt-2 block h-1 w-16 rounded-full bg-orange" />}
      </div>
      {link && (
        <Link href={link.href} className="flex items-center gap-1 text-sm font-medium text-orange shrink-0">
          {link.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
