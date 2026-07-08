import { img } from "@/lib/api"
import type { TeamMember } from "@/lib/types"

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex items-start gap-5 py-3">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl md:h-28 md:w-28">
        {member.image ? (
          <img
            src={img(member.image)}
            alt={member.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-navy text-xl font-bold text-navy-foreground">
            {member.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <h4 className="text-lg font-bold text-navy">{member.name}</h4>
        {member.designation && (
          <p className="mt-0.5 text-sm font-medium text-orange">
            {member.designation}
          </p>
        )}
        {member.about && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {member.about}
          </p>
        )}
      </div>
    </div>
  )
}
