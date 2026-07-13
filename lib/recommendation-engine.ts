import type { Activity, QuizAnswers, RecommendationResult, Interest, DurationBucket, ActivityLevel, BudgetStyle, Season } from "./types"
import rules from "./recommendation-rules.json"

const w = rules.weights

function parseDays(duration: string): number {
  const m = duration.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

function getDurationBucket(days: number): DurationBucket {
  for (const [key, [min, max]] of Object.entries(rules.durationBuckets) as [string, number[]][]) {
    if (days >= min && days <= max) return key as DurationBucket
  }
  return "medium"
}

function getBudgetStyle(price: number): BudgetStyle {
  for (const [key, [min, max]] of Object.entries(rules.budgetRanges) as [string, number[]][]) {
    if (price >= min && price <= max) return key as BudgetStyle
  }
  return "comfort"
}

function inferInterests(trip: Activity): Interest[] {
  const interests = new Set<Interest>()
  const locs = (trip.locations ?? []).map(l => l.toLowerCase())
  const title = trip.title.toLowerCase()

  for (const [loc, tags] of Object.entries(rules.locationInterests) as [string, Interest[]][]) {
    if (locs.some(l => l.includes(loc)) || title.includes(loc)) {
      tags.forEach(t => interests.add(t))
    }
  }

  if (title.includes("trek") || title.includes("hike") || title.includes("base camp")) interests.add("trekking")
  if (title.includes("cultural") || title.includes("heritage") || title.includes("temple")) interests.add("culture")
  if (title.includes("safari") || title.includes("wildlife") || title.includes("jungle")) interests.add("wildlife")
  if (title.includes("luxury") || title.includes("premium")) interests.add("luxury")
  if (title.includes("photo")) interests.add("photography")
  if (title.includes("wellness") || title.includes("yoga") || title.includes("meditation")) interests.add("wellness")

  if (interests.size === 0) interests.add("trekking")
  return [...interests]
}

function getActivityLevel(difficulty: string): ActivityLevel {
  const map = rules.difficultyMap as Record<string, string>
  return (map[difficulty] ?? "moderate") as ActivityLevel
}

function getSeasons(seasonStr?: string): Season[] {
  if (!seasonStr) return []
  return seasonStr.split(",").map(s => s.trim().toLowerCase()) as Season[]
}

function getDurationText(bucket: DurationBucket): string {
  const ranges: number[] = rules.durationBuckets[bucket]
  return `${ranges[0]}–${ranges[1]} days`
}

function getBudgetText(style: BudgetStyle): string {
  const ranges: number[] = rules.budgetRanges[style]
  return `$${ranges[0].toLocaleString()}–$${ranges[1].toLocaleString()}`
}

export function scoreTrips(trips: Activity[], answers: QuizAnswers): RecommendationResult[] {
  const results: RecommendationResult[] = []

  for (const trip of trips) {
    let score = 0
    const reasons: string[] = []

    const days = parseDays(trip.duration)
    const tripDurationBucket = getDurationBucket(days)
    if (tripDurationBucket === answers.duration) {
      score += w.duration
      reasons.push(`Fits your ${getDurationText(answers.duration)} timeframe`)
    }

    const tripInterests = inferInterests(trip)
    const matchedInterests = answers.interests.filter(i => tripInterests.includes(i))
    if (matchedInterests.length > 0) {
      score += w.interest
      reasons.push(`Matches your interest in ${matchedInterests.join(", ")}`)
    }

    const tripLevel = getActivityLevel(trip.difficultyLevel)
    if (tripLevel === answers.activityLevel) {
      score += w.activityLevel
      reasons.push(`Right for your ${answers.activityLevel} fitness level`)
    }

    const tripSeasons = getSeasons(trip.bestSeason)
    if (tripSeasons.includes(answers.season)) {
      score += w.season
      reasons.push(`Best visited in ${trip.bestSeason.trim()}`)
    }

    const tripBudget = getBudgetStyle(trip.price)
    if (tripBudget === answers.budget) {
      score += w.budget
      reasons.push(`Within your ${answers.budget} budget (${getBudgetText(answers.budget)})`)
    }

    if (answers.travelerType === "solo" && trip.groupSize?.toLowerCase().includes("solo")) {
      score += w.travelerType
      reasons.push("Popular with solo travelers")
    } else if (answers.travelerType === "couple") {
      score += w.travelerType
      reasons.push("Great for couples")
    } else if (answers.travelerType === "family") {
      score += w.travelerType
      reasons.push("Family-friendly option")
    } else if (answers.travelerType === "friends") {
      score += w.travelerType
      reasons.push("Perfect for groups of friends")
    }

    if (trip.isFeatured) {
      score += w.featured
      reasons.push("Featured trip")
    }

    if (trip.averageRating >= 4.5) {
      score += w.rating
      reasons.push(`Highly rated (${trip.averageRating.toFixed(1)}★)`)
    }

    if (score > 0) {
      results.push({ activity: trip, score, reasons })
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results
}
