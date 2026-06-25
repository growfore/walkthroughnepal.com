import { getTeamMembers, img } from "@/lib/api"
import type { TeamMember } from "@/lib/types"
import { PageHero } from "@/components/page-hero"
import { Mail } from "lucide-react"

export default async function OurTeamPage() {
  let departments: { name: string; members: TeamMember[] }[] = []

  try {
    const res = await getTeamMembers()
    const grouped = res.data
    if (grouped && typeof grouped === "object") {
      departments = Object.values(grouped as Record<string, TeamMember[]>).map((members) => ({
        name: members[0]?.department?.name ?? "Other",
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
            <div className="mx-auto max-w-5xl px-4">
              <div className="mb-8">
                <h2 className="inline-block text-2xl font-bold text-navy md:text-3xl">{dept.name}</h2>
                <span className="mt-2 block h-1 w-12 rounded-full bg-orange" />
              </div>

              <div className="space-y-6">
                {dept.members.map((m) => (
                  <div key={m.id} className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md md:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start">
                      <div className="mx-auto h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#14b8a6]/20 md:mx-0 md:h-24 md:w-24">
                        {m.image ? (
                          <img src={img(m.image)} alt={m.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-navy text-xl font-bold text-navy-foreground">
                            {m.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
                        <h3 className="text-xl font-bold text-navy">{m.name}</h3>
                        <div className="mt-2 flex flex-wrap justify-center gap-2 md:justify-start">
                          {m.designation && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#ccfbf1] px-3 py-1 text-xs font-semibold text-[#0f766e]">
                              {m.designation}
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <a
                            href={`/design-your-trip?expert=${m.name}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#0f766e] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#115e59]"
                          >
                            About {m.name.split(" ")[0]}
                          </a>
                          <a
                            href={`mailto:info@walkthroughnepal.com?subject=Inquiry about ${m.name}`}
                            className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#0f766e] px-4 py-2 text-xs font-semibold text-[#0f766e] transition hover:bg-[#0f766e] hover:text-white"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            Contact
                          </a>
                        </div>
                      </div>
                    </div>
                    {m.about && (
                      <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground md:mt-5 md:pt-5">
                        {m.about}
                      </p>
                    )}
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
