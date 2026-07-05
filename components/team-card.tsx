import { img } from "@/lib/api"
import type { TeamMember } from "@/lib/types"

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex w-72 shrink-0 snap-start flex-col items-center rounded-xl border border-border bg-card p-8 text-center shadow-sm transition hover:shadow-lg">
      <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-orange/15">
        {member.image ? (
          <img src={img(member.image)} alt={member.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-navy text-2xl font-bold text-navy-foreground">
            {member.name.split(" ").map((n) => n[0]).join("")}
          </div>
        )}
      </div>
      <h4 className="mt-5 text-lg font-bold text-navy">{member.name}</h4>
      {member.designation && (
        <span className="mt-1.5 inline-block rounded-full bg-orange/10 px-3.5 py-0.5 text-xs font-semibold text-orange">
          {member.designation}
        </span>
      )}
      {member.about && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{member.about}</p>
      )}
    </div>
  )
}
