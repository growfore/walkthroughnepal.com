import { getTeamMembers, img } from "@/lib/api"
import type { TeamMember } from "@/lib/types"
import { PageHero } from "@/components/page-hero"

export default async function OurTeamPage() {
  let departments: { name: string; members: TeamMember[] }[] = []

  try {
    const res = await getTeamMembers()
    const grouped = res.data
    if (grouped && typeof grouped === "object") {
      departments = Object.entries(grouped as Record<string, TeamMember[]>).map(([name, members]) => ({
        name,
        members: members.map((m) => ({ ...m, department: null })),
      }))
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
          <section key={dept.name} className="pb-16 first:pt-16 last:pb-24">
            <div className="mx-auto max-w-7xl px-4">
              <div className="mb-8">
                <h2 className="inline-block text-2xl font-bold text-navy md:text-3xl">{dept.name}</h2>
                <span className="mt-2 block h-1 w-12 rounded-full bg-orange" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {dept.members.map((m) => (
                  <div key={m.id} className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center shadow-sm transition hover:shadow-md">
                    <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-orange/20 md:h-28 md:w-28">
                      {m.image ? (
                        <img src={img(m.image)} alt={m.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-navy text-2xl font-bold text-navy-foreground">
                          {m.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                      )}
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-navy">{m.name}</h3>
                    {m.designation && (
                      <span className="mt-1 inline-block rounded-full bg-orange/10 px-3 py-0.5 text-xs font-semibold text-orange">
                        {m.designation}
                      </span>
                    )}
                    {m.about && (
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{m.about}</p>
                    )}
                    <a
                      href={`/design-your-trip?expert=${m.name}`}
                      className="mt-auto inline-flex items-center gap-1.5 rounded-full border border-orange px-5 py-1.5 text-xs font-semibold text-orange transition hover:bg-orange hover:text-orange-foreground"
                    >
                      Meet {m.name.split(" ")[0]}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))
      )}
    </main>
  )
}
