import { Boxes, Truck, UserRound } from "lucide-react";

import { resourceStateLabel, resourceStateTone, StatusBadge } from "@/components/ui-kit/primitives";
import { SERVICE_LABELS } from "@/domain/mock-data";
import type { Crew, Vehicle } from "@/domain/types";
import { cn } from "@/lib/utils";

const VEHICLE_TYPE_LABELS: Record<Vehicle["type"], string> = {
  van: "Van",
  box_truck: "Box truck",
  large_truck: "Large truck",
  trailer: "Trailer",
};

export function VehicleCard({ vehicle, className }: { vehicle: Vehicle; className?: string }) {
  return (
    <div className={cn("surface-card p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Truck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-[0.95rem] font-semibold text-foreground">
              {vehicle.label}
            </p>
            <p className="text-caption text-muted-foreground">{VEHICLE_TYPE_LABELS[vehicle.type]}</p>
          </div>
        </div>
        <StatusBadge tone={resourceStateTone(vehicle.state)} dot>
          {resourceStateLabel(vehicle.state)}
        </StatusBadge>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-caption">
        <div className="rounded-xl bg-surface px-3 py-2">
          <dt className="text-muted-foreground">Capacity</dt>
          <dd className="font-semibold tabular-nums text-foreground">{vehicle.capacityM3} m³</dd>
        </div>
        <div className="rounded-xl bg-surface px-3 py-2">
          <dt className="text-muted-foreground">Max load</dt>
          <dd className="font-semibold tabular-nums text-foreground">
            {vehicle.maxLoadKg.toLocaleString()} kg
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function CrewCard({ crew, className }: { crew: Crew; className?: string }) {
  return (
    <div className={cn("surface-card p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent-foreground">
            <UserRound className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-[0.95rem] font-semibold text-foreground">{crew.name}</p>
            <p className="text-caption text-muted-foreground">
              {crew.members.length} movers · lead {crew.members[0]?.fullName.split(" ")[0] ?? "—"}
            </p>
          </div>
        </div>
        <StatusBadge tone={resourceStateTone(crew.state)} dot>
          {resourceStateLabel(crew.state)}
        </StatusBadge>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {crew.skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-caption text-muted-foreground"
          >
            <Boxes className="size-3" aria-hidden="true" />
            {SERVICE_LABELS[skill]}
          </span>
        ))}
      </div>
    </div>
  );
}
