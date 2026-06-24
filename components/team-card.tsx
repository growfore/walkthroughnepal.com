import { img } from "@/lib/api"
import type { TeamMember } from "@/lib/types"

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex w-72 shrink-0 snap-start flex-col items-center rounded-xl border border-border bg-card p-6 text-center shadow-sm transition hover:shadow-md">
      <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-orange/20">
        {member.image ? (
          <img src={img(member.image)} alt={member.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-navy text-xl font-bold text-navy-foreground">
            {member.name.split(" ").map((n) => n[0]).join("")}
          </div>
        )}
      </div>
      <h4 className="mt-4 text-lg font-bold text-navy">{member.name}</h4>
      {member.designation && (
        <span className="mt-1 inline-block rounded-full bg-orange/10 px-3 py-0.5 text-xs font-semibold text-orange">
          {member.designation}
        </span>
      )}
      {member.about && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">{member.about}</p>
      )}
      <a
        href={`/design-your-trip?expert=${member.name}`}
        className="mt-auto inline-flex items-center gap-1.5 rounded-full border border-orange px-5 py-1.5 text-xs font-semibold text-orange transition hover:bg-orange hover:text-orange-foreground"
      >
        Meet {member.name.split(" ")[0]}
      </a>
    </div>
  )
}
