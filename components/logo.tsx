import { cn } from "@/lib/utils"
import Link from "next/link"

export function Logo({ invert }: { invert: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <img
        src="/logo-july-6.png"
        alt="Walk Through Nepal"
        className={cn("h-14 w-auto", invert && "invert")}
      />
    </Link>
  )
}
