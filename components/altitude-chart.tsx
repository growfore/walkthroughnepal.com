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
      <div className="mb-3 justify-end ">
        <div className="inline-flex rounded-lg bg-transparent p-0.5 justify-end">
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
      <div className="h-90 min-w-[720px] p-1">
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
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)", angle: -50, textAnchor: "end" }}
              tickLine={false}
              axisLine={false}
              interval={0}
              height={80}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              unit={` ${unit}`}
              width={100}
            />
              <Tooltip
              wrapperStyle={{ width: "fit" }}
                contentStyle={{
                  borderRadius: "0.5rem",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-background)",
                  fontSize: "12px",
                  padding: "6px 10px",
                }}
                formatter={(v) => [`${v} ${unit}`, "Altitude"]}
              />
            <Area
              type="monotone"
              dataKey="altitude"
              stroke="var(--color-orange)"
              fill="url(#altGrad)"
              strokeWidth={2}
              dot={{ r: 4, fill: "var(--color-orange)", stroke: "white", strokeWidth: 2 }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              // label={(props: any) => {
              //   const { x, y, value } = props
              //   if (x == null || y == null || value == null) return null
              //   return (
              //     <text x={x} y={Number(y) - 8} textAnchor="middle" fontSize={10} fill="var(--color-navy)" fontWeight={600}>
              //       {value} {unit}
              //     </text>
              //   )
              // }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
