import { NextResponse } from "next/server"
import { getActivities } from "@/lib/api"
import { scoreTrips } from "@/lib/recommendation-engine"
import type { QuizAnswers } from "@/lib/types"

export async function POST(req: Request) {
  try {
    const answers: QuizAnswers = await req.json()

    const { data: trips } = await getActivities({ limit: "200" })
    const results = scoreTrips(trips, answers)

    return NextResponse.json({
      top: results.slice(0, 3),
      alternatives: results.slice(3, 6),
    })
  } catch (err) {
    console.error("Recommendation error:", err)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
