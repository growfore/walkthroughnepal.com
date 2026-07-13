"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw } from "lucide-react"
import { QuizStep } from "@/components/recommend/quiz-step"
import { TripResultCard } from "@/components/recommend/trip-result-card"
import { LeadForm } from "@/components/recommend/lead-form"
import type { QuizAnswers, RecommendationResult, TravelerType, Interest, DurationBucket, ActivityLevel, BudgetStyle, Season } from "@/lib/types"

const STORAGE_KEY = "wn-recommend-quiz"

const STEPS = [
  { key: "travelerType", title: "Who is traveling?", subtitle: "Select your group type" },
  { key: "interests", title: "What excites you most?", subtitle: "Pick all that apply", multiple: true },
  { key: "duration", title: "How long is your trip?", subtitle: "Select your preferred duration" },
  { key: "activityLevel", title: "Activity level?", subtitle: "How active do you want to be" },
  { key: "budget", title: "Budget range?", subtitle: "Per person, approximate" },
  { key: "season", title: "When are you traveling?", subtitle: "Select your preferred season" },
] as const

const TRAVELER_OPTIONS = [
  { value: "solo", label: "Solo", icon: "🧭" },
  { value: "couple", label: "Couple", icon: "💑" },
  { value: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
  { value: "friends", label: "Friends", icon: "🤝" },
]

const INTEREST_OPTIONS = [
  { value: "trekking", label: "Trekking", icon: "🏔️", description: "Himalayan trails" },
  { value: "culture", label: "Culture", icon: "🛕", description: "Temples & heritage" },
  { value: "wildlife", label: "Wildlife", icon: "🐘", description: "Jungle safaris" },
  { value: "photography", label: "Photography", icon: "📸", description: "Scenic vistas" },
  { value: "luxury", label: "Luxury", icon: "✨", description: "Premium comfort" },
  { value: "wellness", label: "Wellness", icon: "🧘", description: "Yoga & relaxation" },
]

const DURATION_OPTIONS = [
  { value: "short", label: "5–7 Days", icon: "⚡", description: "Quick getaway" },
  { value: "medium", label: "8–12 Days", icon: "🗓️", description: "Classic trip" },
  { value: "long", label: "13–18 Days", icon: "🌄", description: "Deep exploration" },
  { value: "extended", label: "19+ Days", icon: "🌍", description: "Extended adventure" },
]

const ACTIVITY_OPTIONS = [
  { value: "easy", label: "Easy", icon: "🌿", description: "Relaxed pace" },
  { value: "moderate", label: "Moderate", icon: "🥾", description: "Some fitness needed" },
  { value: "challenging", label: "Challenging", icon: "💪", description: "For active travelers" },
]

const BUDGET_OPTIONS = [
  { value: "budget", label: "Budget", icon: "🎒", description: "Under $1,500" },
  { value: "comfort", label: "Comfort", icon: "🏨", description: "$1,500–$3,000" },
  { value: "premium", label: "Premium", icon: "⭐", description: "$3,000–$5,000" },
  { value: "luxury", label: "Luxury", icon: "👑", description: "$5,000+" },
]

const SEASON_OPTIONS = [
  { value: "spring", label: "Spring", icon: "🌸", description: "Mar–May" },
  { value: "summer", label: "Summer", icon: "☀️", description: "Jun–Aug" },
  { value: "autumn", label: "Autumn", icon: "🍂", description: "Sep–Nov" },
  { value: "winter", label: "Winter", icon: "❄️", description: "Dec–Feb" },
]

const STEP_OPTIONS = [TRAVELER_OPTIONS, INTEREST_OPTIONS, DURATION_OPTIONS, ACTIVITY_OPTIONS, BUDGET_OPTIONS, SEASON_OPTIONS]

const DEFAULT_ANSWERS: QuizAnswers = {
  travelerType: "" as TravelerType,
  interests: [],
  duration: "" as DurationBucket,
  activityLevel: "" as ActivityLevel,
  budget: "" as BudgetStyle,
  season: "" as Season,
}

function canAdvance(step: number, answers: QuizAnswers): boolean {
  const key = STEPS[step].key
  const val = answers[key]
  if (Array.isArray(val)) return val.length > 0
  return !!val
}

function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= current ? "bg-orange" : "bg-border"}`} />
      ))}
    </div>
  )
}

export default function RecommendPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) return JSON.parse(saved)
      } catch { /* ignore */ }
    }
    return DEFAULT_ANSWERS
  })
  const [results, setResults] = useState<{ top: RecommendationResult[]; alternatives: RecommendationResult[] } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  }, [answers])

  function updateAnswer(key: string, value: unknown) {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  async function getRecommendations() {
    setLoading(true)
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      })
      const data = await res.json()
      setResults(data)
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  function handleNext() {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else getRecommendations()
  }

  function handleBack() {
    if (step > 0) setStep(s => s - 1)
  }

  function reset() {
    setStep(0)
    setAnswers(DEFAULT_ANSWERS)
    setResults(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  function setAnswersFromIndex(idx: number, val: unknown) {
    updateAnswer(STEPS[idx].key, val)
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange border-t-transparent" />
        <p className="text-lg font-semibold text-navy">Finding your perfect trip...</p>
        <p className="text-sm text-muted-foreground">Analyzing {">"}200 trips to match your preferences</p>
      </div>
    )
  }

  if (results) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="text-center">
          <Sparkles className="mx-auto h-10 w-10 text-orange" />
          <h1 className="mt-4 text-3xl font-bold text-navy md:text-4xl">Your Perfect Nepal Adventures</h1>
          <p className="mt-2 text-muted-foreground">Based on your preferences, here are our top recommendations</p>
        </div>

        {results.top.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {results.top.map((r, i) => (
              <TripResultCard key={r.activity.id} activity={r.activity} reasons={r.reasons} rank={i + 1} />
            ))}
          </div>
        )}

        {results.top[0] && (
          <div className="mx-auto mt-10 max-w-md">
            <LeadForm tripTitle={results.top[0].activity.title} />
          </div>
        )}

        {results.alternatives.length > 0 && (
          <div className="mt-12">
            <h2 className="text-center text-xl font-bold text-navy">More Great Options</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {results.alternatives.map((r, i) => (
                <TripResultCard key={r.activity.id} activity={r.activity} reasons={r.reasons} rank={i + 4} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-navy transition hover:bg-muted">
            <RotateCcw className="h-4 w-4" /> Start Over
          </button>
        </div>
      </div>
    )
  }

  const currentKey = STEPS[step].key
  const currentVal = answers[currentKey]
  const isMultiple = "multiple" in STEPS[step] && STEPS[step].multiple

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <Progress current={step} total={STEPS.length} />
        <p className="mt-2 text-right text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</p>
      </div>

      <QuizStep
        title={STEPS[step].title}
        subtitle={STEPS[step].subtitle}
        options={STEP_OPTIONS[step]}
        selected={currentVal as string | string[]}
        onSelect={(val) => setAnswersFromIndex(step, val)}
        multiple={isMultiple}
      />

      <div className="mt-10 flex justify-between">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-muted disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canAdvance(step, answers)}
          className="inline-flex items-center gap-2 rounded-full bg-orange px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
        >
          {step === STEPS.length - 1 ? "Find My Trip" : "Next"}
          {step < STEPS.length - 1 && <ArrowRight className="h-4 w-4" />}
          {step === STEPS.length - 1 && <Sparkles className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
