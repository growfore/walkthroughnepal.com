"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  LucideMail,
  LucideMapPin,
  LucidePhone,
  LucideSend,
  LucideCheckCircle2,
  LucidePlus,
  LucideTrash2,
  LucideCompass,
  LucideUsers,
  LucideUtensils,
  LucideBed,
  LucideStar,
  LucideMap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { toast } from "react-toastify"
import { siteConfig } from "@/lib/siteConfig"

const DURATION_VALUES = [
  "1–3 days",
  "4–7 days",
  "8–10 days",
  "11–14 days",
  "15–20 days",
  "21+ days",
] as const

const INCLUSIONS = [
  { id: "guide", label: "Licensed Guide" },
  { id: "porter", label: "Porter Service" },
  { id: "permits", label: "Trekking Permits & TIMS" },
  { id: "transport", label: "Airport Transfers" },
  { id: "firstaid", label: "First Aid / Medical Kit" },
  { id: "sleeping-bag", label: "Sleeping Bag & Equipment" },
  { id: "helicopter", label: "Helicopter Rescue Cover" },
] as const

const ACCOMMODATION = [
  { value: "teahouse", label: "Teahouse / Guesthouse" },
  { value: "lodge", label: "Comfortable Lodge" },
  { value: "luxury-lodge", label: "Luxury Lodge" },
  { value: "camping", label: "Camping" },
  { value: "hotel", label: "Hotel (city nights)" },
  { value: "mix", label: "Mix (flexible)" },
] as const

const FOOD_PREFS = [
  { value: "local", label: "Local Nepali Cuisine" },
  { value: "continental", label: "Continental" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "halal", label: "Halal" },
  { value: "flexible", label: "Flexible / No Preference" },
] as const

const GROUP_OPTIONS = [
  { value: "solo", label: "Solo" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
] as const

const locationSchema = z.object({
  name: z.string().optional(),
  days: z.string().optional(),
})

const itineraryFormSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    duration: z.enum(DURATION_VALUES, { message: "Please select a duration" }),
    experienceType: z.string().min(1, "Please select an experience type"),
    startDate: z.string().min(1, "Please select a start date"),
    letUsChooseLocations: z.boolean(),
    locations: z.array(locationSchema),
    groupType: z.enum(
      GROUP_OPTIONS.map((o) => o.value) as [string, ...string[]],
      { message: "Please select a group type" },
    ),
    numberOfTravellers: z.string().min(1, "Please select number of travellers"),
    inclusions: z.array(z.string()).default([]),
    accommodationPreferences: z
      .array(z.string())
      .min(1, "Please select at least one accommodation preference"),
    foodPreferences: z
      .array(z.string())
      .min(1, "Please select at least one food preference"),
    otherMentions: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.letUsChooseLocations) {
      data.locations.forEach((location, index) => {
        if (!location.name || location.name.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Location name is required",
            path: ["locations", index, "name"],
          })
        }
        const dayNum = Number(location.days)
        if (!location.days || isNaN(dayNum) || dayNum <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Must be at least 1 day",
            path: ["locations", index, "days"],
          })
        }
      })
    }
  })

type ItineraryFormValues = z.infer<typeof itineraryFormSchema>

const STEPS = [
  { label: "Trip Basics", icon: LucideCompass },
  { label: "Locations", icon: LucideMap },
  { label: "Group", icon: LucideUsers },
  { label: "Preferences", icon: LucideStar },
  { label: "Contact", icon: LucideMail },
] as const

const STEP_FIELDS: Record<number, (keyof ItineraryFormValues)[]> = {
  0: ["duration", "experienceType", "startDate"],
  1: ["letUsChooseLocations", "locations"],
  2: ["groupType", "numberOfTravellers"],
  3: ["inclusions", "accommodationPreferences", "foodPreferences", "otherMentions"],
  4: ["fullName", "email", "phone"],
}

function toggleArrayItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item]
}

const categories = [
  "Treks in Nepal",
  "Tours in Nepal",
  "Classic Trek",
  "High Altitude Expedition",
  "Cultural and Heritage Tour",
  "Wildlife and Nature Safari",
  "Luxury Trek",
  "Adventure and Extreme Sports",
  "Pilgrimage Tour",
  "Photography Tour",
  "Family Friendly Trek",
  "Off-the-beaten Path",
  "Honeymoon Package",
  "Yoga and Meditation Retreat",
]

export default function DesignYourTrip() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [step, setStep] = useState(0)

  const form = useForm<ItineraryFormValues>({
    resolver: zodResolver(itineraryFormSchema) as never,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      duration: undefined,
      experienceType: "",
      startDate: "",
      letUsChooseLocations: false,
      locations: [{ name: "", days: "" }],
      groupType: undefined,
      numberOfTravellers: "",
      inclusions: [],
      accommodationPreferences: [],
      foodPreferences: [],
      otherMentions: "",
    },
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "locations",
  })

  const letUsChoose = form.watch("letUsChooseLocations")
  const today = new Date().toISOString().split("T")[0]

  const onSubmit = async (data: ItineraryFormValues) => {
    setIsSubmitting(true)
    try {
      const locationsSummary = data.letUsChooseLocations
        ? "Let the team choose"
        : data.locations
            .map(
              (l) =>
                `${l.name} (${l.days} day${Number(l.days) > 1 ? "s" : ""})`,
            )
            .join(", ")

      const inclusionLabels = data.inclusions
        .map((id) => INCLUSIONS.find((i) => i.id === id)?.label ?? id)
        .join(", ")

      const res = await fetch(`https://api.walkthroughnepal.com/api/v1/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: data.email,
          to: siteConfig.email,
          subject: `Custom Itinerary Request from ${data.fullName} — ${data.experienceType}`,
          text: [
            `── Personal Info ──`,
            `Name:                  ${data.fullName}`,
            `Email:                 ${data.email}`,
            `Phone:                 ${data.phone || "Not provided"}`,
            ``,
            `── Trip Details ──`,
            `Duration:              ${data.duration}`,
            `Experience Type:       ${data.experienceType}`,
            `Start Date:            ${data.startDate}`,
            ``,
            `── Locations ──`,
            `Locations:             ${locationsSummary}`,
            ``,
            `── Group ──`,
            `Group Type:            ${data.groupType}`,
            `No. of Travellers:     ${data.numberOfTravellers}`,
            ``,
            `── Preferences ──`,
            `Inclusions:            ${inclusionLabels || "None selected"}`,
            `Accommodation:         ${data.accommodationPreferences.join(", ")}`,
            `Food Preference:       ${data.foodPreferences.join(", ")}`,
            ``,
            `── Other Mentions ──`,
            data.otherMentions || "None",
          ].join("\n"),
        }),
        cache: "no-store",
      })
      if (!res.ok) throw new Error(`API returned ${res.status}`)

      setSubmitSuccess(true)
      form.reset()
      setStep(0)
      setTimeout(() => setSubmitSuccess(false), 6000)
    } catch {
      toast.error("Something went wrong. Please try again or contact us directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const goNext = async () => {
    const valid = await form.trigger(
      STEP_FIELDS[step] as (keyof ItineraryFormValues)[],
    )
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const goPrev = () => setStep((s) => Math.max(s - 1, 0))

  return (
    <main className="bg-canvas min-h-screen">
      <section className="bg-navy py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-navy-foreground leading-tight mb-3">
            Plan Your Custom Itinerary
          </h1>
          <p className="text-navy-foreground/80 text-base max-w-lg">
            Tell us your dream adventure and we&apos;ll craft a personalised
            trek just for you — dates, pace, locations, and every detail.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-0 mb-10 overflow-x-auto pb-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const isActive = i === step
              const isDone = i < step
              return (
                <div key={s.label} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => isDone && setStep(i)}
                    className={`flex flex-col items-center gap-1 px-3 transition-opacity ${
                      i > step ? "opacity-40 cursor-default" : "cursor-pointer"
                    }`}
                  >
                    <div
                      className={`size-9 rounded-full flex items-center justify-center transition-colors border-2 ${
                        isActive
                          ? "bg-primary border-primary text-primary-foreground"
                          : isDone
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-canvas-soft border-hairline text-mute"
                      }`}
                    >
                      {isDone ? (
                        <LucideCheckCircle2 className="size-4" />
                      ) : (
                        <Icon className="size-4" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium whitespace-nowrap ${
                        isActive ? "text-primary" : "text-mute"
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`h-px w-8 md:w-12 mb-5 shrink-0 transition-colors ${
                        i < step ? "bg-primary" : "bg-hairline"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {step === 0 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold text-ink mb-1">
                      Trip Basics
                    </h2>
                    <p className="text-sm text-body mb-6">
                      Let&apos;s start with the fundamentals of your adventure.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-ink font-semibold text-sm">
                          Total Duration *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="How many days?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DURATION_VALUES.map((d) => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experienceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-ink font-semibold text-sm">
                          Experience / Trek Type *
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select an experience type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-ink font-semibold text-sm">
                          Preferred Start Date *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            min={today}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold text-ink mb-1">
                      Locations
                    </h2>
                    <p className="text-sm text-body mb-6">
                      Add your desired destinations with planned days at each,
                      or let our experts curate the perfect route.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="letUsChooseLocations"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked)
                              if (checked) form.clearErrors("locations")
                            }}
                          />
                        </FormControl>
                        <div>
                          <FormLabel className="text-ink font-semibold text-sm cursor-pointer">
                            Let us choose the best locations for you
                          </FormLabel>
                          <p className="text-xs text-mute mt-0.5">
                            Our expert team will design the optimal route based
                            on your duration and experience type.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {!letUsChoose && (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-ink">
                        Your Locations
                      </p>
                      {fields.map((fieldItem, index) => (
                        <div
                          key={fieldItem.id}
                          className="flex items-start gap-3 p-4 border border-hairline rounded-lg bg-canvas-soft"
                        >
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                              <FormField
                                control={form.control}
                                name={`locations.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs text-mute font-medium">
                                      Location
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="e.g. Pokhara"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div>
                              <FormField
                                control={form.control}
                                name={`locations.${index}.days`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs text-mute font-medium">
                                      Days
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min="1"
                                        placeholder="3"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="mt-6 p-1.5 rounded-md text-mute hover:text-error hover:bg-error-soft transition-colors"
                            >
                              <LucideTrash2 className="size-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ name: "", days: "" })}
                      >
                        <LucidePlus className="size-4" />
                        Add Another Location
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold text-ink mb-1">
                      Your Group
                    </h2>
                    <p className="text-sm text-body mb-6">
                      Help us tailor the itinerary to your group&apos;s
                      dynamics.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="groupType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-ink font-semibold text-sm">
                          Group Type *
                        </FormLabel>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                          {GROUP_OPTIONS.map((opt) => (
                            <button
                              type="button"
                              key={opt.value}
                              onClick={() => field.onChange(opt.value)}
                              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all text-sm font-medium ${
                                field.value === opt.value
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-hairline text-body hover:border-hairline-strong"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numberOfTravellers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-ink font-semibold text-sm">
                          Number of Travellers *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="How many people?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["1", "2", "3", "4", "5–7", "8–10", "11–15", "16+"].map((n) => (
                              <SelectItem key={n} value={n}>
                                {n} {n === "1" ? "person" : "people"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-ink mb-1">
                      Preferences
                    </h2>
                    <p className="text-sm text-body mb-6">
                      Customise every detail of your experience. You can select
                      multiple options where applicable.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="inclusions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-ink font-semibold text-sm mb-3 block">
                          Pick Your Inclusions
                        </FormLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {INCLUSIONS.map((item) => {
                            const checked = field.value.includes(item.id)
                            return (
                              <label
                                key={item.id}
                                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                                  checked
                                    ? "border-primary/40 bg-primary/5"
                                    : "border-hairline hover:bg-canvas-soft"
                                }`}
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={() =>
                                    field.onChange(
                                      toggleArrayItem(field.value, item.id),
                                    )
                                  }
                                />
                                <span className="text-sm text-body">
                                  {item.label}
                                </span>
                              </label>
                            )
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accommodationPreferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-ink font-semibold text-sm flex items-center gap-2 mb-2">
                          <LucideBed className="size-4 text-primary" />
                          Stay / Accommodation Preferences *
                          <span className="text-xs font-normal text-mute ml-1">
                            (select all that apply)
                          </span>
                        </FormLabel>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {ACCOMMODATION.map((opt) => {
                            const checked = field.value.includes(opt.value)
                            return (
                              <button
                                type="button"
                                key={opt.value}
                                onClick={() =>
                                  field.onChange(
                                    toggleArrayItem(field.value, opt.value),
                                  )
                                }
                                className={`text-left px-3 py-2.5 rounded-lg border-2 text-sm transition-all ${
                                  checked
                                    ? "border-primary bg-primary/5 text-primary font-medium"
                                    : "border-hairline text-body hover:border-hairline-strong"
                                }`}
                              >
                                {opt.label}
                              </button>
                            )
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="foodPreferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-ink font-semibold text-sm flex items-center gap-2 mb-2">
                          <LucideUtensils className="size-4 text-primary" />
                          Food Preferences *
                          <span className="text-xs font-normal text-mute ml-1">
                            (select all that apply)
                          </span>
                        </FormLabel>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {FOOD_PREFS.map((opt) => {
                            const checked = field.value.includes(opt.value)
                            return (
                              <button
                                type="button"
                                key={opt.value}
                                onClick={() =>
                                  field.onChange(
                                    toggleArrayItem(field.value, opt.value),
                                  )
                                }
                                className={`text-left px-3 py-2.5 rounded-lg border-2 text-sm transition-all ${
                                  checked
                                    ? "border-primary bg-primary/5 text-primary font-medium"
                                    : "border-hairline text-body hover:border-hairline-strong"
                                }`}
                              >
                                {opt.label}
                              </button>
                            )
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="otherMentions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-ink font-semibold text-sm">
                          Other Mentions / Special Requests
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Dietary restrictions, health conditions, birthday celebrations, special requirements…"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold text-ink mb-1">
                      Contact Details
                    </h2>
                    <p className="text-sm text-body mb-6">
                      Almost done! We&apos;ll use this info to send you your
                      custom itinerary proposal.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-ink font-semibold text-sm">
                            Full Name *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-ink font-semibold text-sm">
                            Email *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-ink font-semibold text-sm">
                          Phone (optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+977 9800000000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="rounded-lg border border-hairline bg-canvas-soft p-4 space-y-2 text-sm">
                    <p className="font-semibold text-ink mb-3">
                      Your Itinerary Summary
                    </p>
                    {(
                      [
                        ["Duration", form.watch("duration")],
                        ["Experience", form.watch("experienceType")],
                        ["Start Date", form.watch("startDate")],
                        [
                          "Locations",
                          form.watch("letUsChooseLocations")
                            ? "Team will choose"
                            : form
                                .watch("locations")
                                .filter((l) => l.name)
                                .map((l) => l.name)
                                .join(", ") || undefined,
                        ],
                        ["Group Type", form.watch("groupType")],
                        ["Travellers", form.watch("numberOfTravellers")],
                        [
                          "Stay",
                          form
                            .watch("accommodationPreferences")
                            .join(", ") || undefined,
                        ],
                        [
                          "Food",
                          form
                            .watch("foodPreferences")
                            .join(", ") || undefined,
                        ],
                      ] as [string, string | undefined][]
                    )
                      .filter(([, v]) => Boolean(v))
                      .map(([label, value]) => (
                        <div key={label} className="flex gap-2 text-body">
                          <span className="font-medium text-ink w-28 shrink-0">
                            {label}:
                          </span>
                          <span className="capitalize">{value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-hairline">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goPrev}
                  disabled={step === 0}
                >
                  Back
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button type="button" onClick={goNext}>
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    <LucideSend className="size-4" />
                    {isSubmitting ? "Sending…" : "Send My Request"}
                  </Button>
                )}
              </div>

              {submitSuccess && (
                <div className="flex items-center gap-3 rounded-md bg-success/10 border border-success/20 px-4 py-3 text-sm text-success font-medium mt-4">
                  <LucideCheckCircle2 className="size-4 text-success shrink-0" />
                  Request sent! Our team will craft your custom itinerary within
                  24 hours.
                </div>
              )}
            </form>
          </Form>
        </div>

        <div className="space-y-10 lg:sticky lg:top-10">
          <div>
            <h3 className="text-xl font-bold text-ink mb-6">
              Other Ways to Reach Us
            </h3>
            <div className="space-y-5">
              {([
                { icon: LucideMail, label: "Email", value: siteConfig.email },
                {
                  icon: LucidePhone,
                  label: "Phone",
                  value: siteConfig.phoneNumbers[0]?.phone,
                },
                {
                  icon: LucideMapPin,
                  label: "Location",
                  value: siteConfig.fullAddress,
                },
              ] as const).map(({ icon: Icon, label, value }) => (
                <div key={label}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="size-4 text-primary" />
                    <span className="text-xs font-semibold text-mute uppercase tracking-wider">
                      {label}
                    </span>
                  </div>
                  <p className="text-sm text-ink">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-hairline bg-canvas-soft p-6">
            <h4 className="font-semibold text-ink text-sm mb-2">
              Why Book With Us?
            </h4>
            <ul className="space-y-2 text-sm text-body">
              <li className="flex items-start gap-2">
                <LucideCheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                Authentic local expertise
              </li>
              <li className="flex items-start gap-2">
                <LucideCheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                Handcrafted itineraries
              </li>
              <li className="flex items-start gap-2">
                <LucideCheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                Best price guarantee
              </li>
              <li className="flex items-start gap-2">
                <LucideCheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                24/7 support during your trip
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
