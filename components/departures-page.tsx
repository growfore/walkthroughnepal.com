"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Calendar, Users, Loader2 } from "lucide-react"
import type { Slot } from "@/lib/types"

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.walkthroughnepal.com"

type Activity = { id: string; slug: string; title: string }
type SlotRaw = {
  id: number; departureDate: string; price: string; remainingSeats: number; visible: boolean
  days: number; maxGroupSize: number
  activity: { id: number; title: string; slug: string }
}
type FilterMeta = { years: string[]; activityIds: number[]; months: number[]; days: number[] }

export function DeparturesPage({
  activities, filterMeta, initialSlots, totalCount,
}: {
  activities: Activity[]; filterMeta: FilterMeta; initialSlots: SlotRaw[]; totalCount: number
}) {
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedActivityId, setSelectedActivityId] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedDays, setSelectedDays] = useState<string | null>(null)

  const [slots, setSlots] = useState<SlotRaw[]>(initialSlots)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(totalCount)
  const loadingRef = useRef(false)

  const fetchSlots = useCallback(async (pageNum: number, append: boolean) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedYear) params.set("year", selectedYear)
      if (selectedActivityId) params.set("activityId", selectedActivityId)
      if (selectedMonth) params.set("month", selectedMonth)
      if (selectedDays) params.set("days", selectedDays)
      params.set("page", String(pageNum))
      params.set("limit", "12")

      const res = await fetch(`${API}/api/v1/slot?${params}`)
      const json = await res.json()
      const newSlots: SlotRaw[] = (json.data?.slots ?? []).filter((s: SlotRaw) => s.visible)
      setSlots(prev => append ? [...prev, ...newSlots] : newSlots)
      setTotal(json.data?.pagination?.total ?? 0)
      setPage(pageNum)
    } catch {
      // silent
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [selectedYear, selectedActivityId, selectedMonth, selectedDays])

  // Reset and re-fetch when filters change
  useEffect(() => {
    fetchSlots(1, false)
  }, [fetchSlots])

  const hasMore = slots.length < total

  const activitiesWithSlots = useMemo(() => {
    const ids = new Set(filterMeta.activityIds)
    return activities.filter(a => ids.has(Number(a.id)))
  }, [activities, filterMeta.activityIds])

  const monthName = (m: number) =>
    new Date(2000, m, 1).toLocaleDateString("en-US", { month: "long" })

  return (
    <div className="space-y-8">
      {/* Year filter */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-navy">Year</label>
        <div className="flex flex-wrap gap-2">
          {filterMeta.years.map(y => (
            <button
              key={y}
              onClick={() => { setSelectedYear(y); setSelectedMonth("") }}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
                selectedYear === y ? "bg-navy text-navy-foreground" : "border border-border text-navy hover:bg-muted"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Destination */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-navy">Travel Destination</label>
        <div className="flex flex-wrap gap-2">
          {activitiesWithSlots.map(a => {
            const active = selectedActivityId === a.id
            return (
              <button
                key={a.id}
                onClick={() => setSelectedActivityId(active ? "" : a.id)}
                className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
                  active ? "bg-navy text-navy-foreground" : "border border-border text-navy hover:bg-muted"
                }`}
              >
                {a.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* Month filter */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-navy">Month</label>
        <div className="flex flex-wrap gap-2">
          {filterMeta.months.map(m => (
            <button
              key={m}
              onClick={() => setSelectedMonth(selectedMonth === m.toString() ? "" : m.toString())}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
                selectedMonth === m.toString() ? "bg-navy text-navy-foreground" : "border border-border text-navy hover:bg-muted"
              }`}
            >
              {monthName(m)}
            </button>
          ))}
        </div>
      </div>

      {/* Days filter */}
      {filterMeta.days.length > 0 && (
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy">Duration</label>
          <div className="flex flex-wrap gap-2">
            {filterMeta.days.map(d => {
              const active = selectedDays === String(d)
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDays(active ? null : String(d))}
                  className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
                    active ? "bg-navy text-navy-foreground" : "border border-border text-navy hover:bg-muted"
                  }`}
                >
                  {d} days
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Departure list */}
      <div>
        <h2 className="text-lg font-bold text-navy">
          {loading ? "Loading..." : `${total} departure${total !== 1 ? "s" : ""} found`}
        </h2>
        <div className="mt-4 space-y-2">
          {slots.map(slot => {
            const d = new Date(slot.departureDate)
            const slotTyped: Slot = {
              id: slot.id,
              activityId: slot.activity.id,
              days: slot.days,
              departureDate: slot.departureDate,
              maxGroupSize: slot.maxGroupSize,
              remainingSeats: slot.remainingSeats,
              price: slot.price,
              visible: slot.visible,
            }
            return (
              <div
                key={slot.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-navy/30 hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy/5">
                    <Calendar className="h-5 w-5 text-navy" />
                  </div>
                  <div>
                    <div className="font-semibold text-navy">
                      {d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
                    </div>
                    <div className="mt-0.5 text-sm text-muted-foreground">
                      {slot.activity.title}
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-sm text-muted-foreground">
                      <span>${slot.price} / person</span>
                      <span>{slot.days} days</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {slot.remainingSeats} {slot.remainingSeats === 1 ? "seat" : "seats"}</span>
                    </div>
                  </div>
                </div>
                {slot.remainingSeats < 1 ? (
                  <span className="inline-flex items-center rounded-lg bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground cursor-not-allowed">Full</span>
                ) : (
                  <Link
                    href={`/booking?trip=${slot.activity.slug}&slot=${slot.id}`}
                    className="inline-flex items-center rounded-lg bg-orange px-4 py-2 text-sm font-semibold text-orange-foreground transition-all hover:opacity-90 hover:shadow-md"
                  >
                    Book Now
                  </Link>
                )}
              </div>
            )
          })}
          {!loading && total > 0 && hasMore && (
            <div className="pt-4 text-center">
              <button
                onClick={() => fetchSlots(page + 1, true)}
                className="rounded-lg border border-border px-8 py-3 text-sm font-semibold text-navy hover:bg-muted transition-colors"
              >
                Show More ({total - slots.length} remaining)
              </button>
            </div>
          )}
          {!loading && total === 0 && (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Calendar className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 font-medium text-navy">No departures found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
