export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-navy/10 rounded ${className ?? ""}`} />
}
