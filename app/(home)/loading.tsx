function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-navy/10 rounded ${className ?? ""}`} />
}

function CardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="relative h-[480px] w-full">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl items-center px-4">
          <div className="w-full max-w-2xl space-y-4">
            <Skeleton className="h-12 w-96" />
            <Skeleton className="h-12 w-80" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-10 flex justify-center">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
