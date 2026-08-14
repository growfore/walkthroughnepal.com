import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function Logo() {
  return (
    <Link href="/" className="flex items-center md:-ml-4">
      <Image
        src="/walkthrough-nepal-color-logo.svg"
        alt="Walk Through Nepal"
        width={56}
        height={56}
        priority
        className={cn("h-14 w-auto")}
      />
    </Link>
  )
}
