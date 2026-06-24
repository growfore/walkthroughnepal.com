import { img } from "@/lib/api"
import type { TeamMember } from "@/lib/types"

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 text-center shadow-sm transition hover:shadow-md">
      <div className="mx-auto h-20 w-20 overflow-hidden rounded-full">
        {member.image ? (
          <img src={img(member.image)} alt={member.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-navy text-xl font-bold text-navy-foreground">
            {member.name.split(" ").map((n) => n[0]).join("")}
          </div>
        )}
      </div>
      <h4 className="mt-4 font-bold text-navy">{member.name}</h4>
      <p className="text-xs font-medium text-orange">{member.designation}</p>
      {member.about && <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{member.about}</p>}
    </div>
  )
}
