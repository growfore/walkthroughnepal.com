"use client"

import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type Point = { id: string; altitude: number; location: string }

const M_TO_FT = 3.28084

export function AltitudeChart({ data }: { data: Point[] }) {
  const [unit, setUnit] = useState<"m" | "ft">("m")

  if (!data.length) return null

  const chartData =
    unit === "ft"
      ? data.map((d) => ({ ...d, altitude: Math.round(d.altitude * M_TO_FT) }))
      : data

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <div className="inline-flex rounded-lg border border-border bg-muted p-0.5">
          {(["m", "ft"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                unit === u
                  ? "bg-background text-navy shadow-sm"
                  : "text-muted-foreground hover:text-navy"
              }`}
            >
              {u === "m" ? "Meters" : "Feet"}
            </button>
          ))}
        </div>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
            <defs>
              <linearGradient id="altGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-orange)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-orange)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="location"
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)", angle: -40, textAnchor: "end" }}
              tickLine={false}
              axisLine={false}
              interval={0}
              height={80}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              unit={unit}
              width={55}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "0.5rem",
                border: "1px solid var(--color-border)",
                background: "var(--color-background)",
              }}
              formatter={(v) => [`${v}${unit}`, "Altitude"]}
            />
            <Area
              type="monotone"
              dataKey="altitude"
              stroke="var(--color-orange)"
              fill="url(#altGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
