import Link from "next/link"
import { HelpCircle } from "lucide-react"

export function CustomizeTripCTA({ slug }: { slug: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-navy p-6 text-white">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-orange">
          <HelpCircle className="h-6 w-6" />
        </div>
        <div>
          <div className="font-black">Couldn&apos;t find what you&apos;re after?</div>
          <div className="text-sm text-white/80">Reach out to our travel experts.</div>
        </div>
      </div>
      <Link
        href={`/design-your-trip?trip=${slug}`}
        className="rounded-md bg-white px-5 py-2.5 text-sm font-black text-navy hover:bg-slate-100"
      >
        CUSTOMIZE TRIP
      </Link>
    </div>
  )
}
