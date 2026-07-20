import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function Logo({ invert }: { invert: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo-july-6.png"
        alt="Walk Through Nepal"
        width={56}
        height={56}
        priority
        className={cn("h-14 w-auto", invert && "invert")}
      />
    </Link>
  )
}
