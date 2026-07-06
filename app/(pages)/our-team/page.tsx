import type { Metadata } from "next"
import { getTeamMembers, img } from "@/lib/api"
import type { TeamMember } from "@/lib/types"
import { PageHero } from "@/components/page-hero"

import { TeamCard } from "@/components/team-card"

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the passionate Nepal-based team behind Walk Through Nepal — local trekking experts dedicated to making your Himalayan adventure unforgettable.",
}

export default async function OurTeamPage() {
  let departments: { name: string; members: TeamMember[] }[] = []

  try {
    const res = await getTeamMembers()
    const grouped = res.data
    if (grouped && typeof grouped === "object") {
      departments = Object.values(grouped as Record<string, TeamMember[]>).map(
        (members) => ({
          name: members[0]?.department?.name ?? "Other",
          members: members.map((m) => ({ ...m, department: null })),
        })
      )
    }
  } catch {}

  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="Our Team"
        description="Meet the passionate people behind Walk Through Nepal — local experts dedicated to making your trek unforgettable."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Our Team" }]}
      />

      {departments.length === 0 ? (
        <section className="py-20 text-center">
          <p className="text-muted-foreground">Team information coming soon.</p>
        </section>
      ) : (
        departments.map((dept) => (
          <section key={dept.name} className="pb-8 last:pb-24">
            <div className="mx-auto max-w-4xl px-4">
              <div className="mb-10">
                <h2 className="inline-block pt-4 text-2xl font-bold text-navy md:text-3xl">
                  {dept.name}
                </h2>
                <span className="mt-2 block h-1 w-12 rounded-full bg-orange" />
              </div>

              <div className="space-y-8">
                {dept.members.map((m) => (
                  <TeamCard key={m.id} member={m} />
                ))}
              </div>
            </div>
          </section>
        ))
      )}
    </main>
  )
}
