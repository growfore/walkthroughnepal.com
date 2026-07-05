function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-navy/10 rounded ${className ?? ""}`} />
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
