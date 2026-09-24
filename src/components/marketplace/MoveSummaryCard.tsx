import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, Navigation, Pencil } from "lucide-react";

import { StatusBadge } from "@/components/ui-kit/primitives";
import { SERVICE_LABELS } from "@/domain/mock-data";
import {
  ACCESS_LABELS,
  ITEM_LABELS,
  MOVE_SIZE_LABELS,
  MOVE_TYPE_LABELS,
  timeWindowLabel,
  type MoveRequestDraft,
} from "@/domain/move-request";
import { cn } from "@/lib/utils";

function formatDate(date: string) {
  if (!date) return "Date not set";
  const d = new Date(`${date}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? date
    : d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

/** The customer's move, shown consistently across discovery, request and My Move. */
export function MoveSummaryCard({
  draft,
  compact,
  editable = true,
  className,
}: {
  draft: MoveRequestDraft;
  compact?: boolean;
  editable?: boolean;
  className?: string;
}) {
  const hasRoute = draft.pickup || draft.destination;
  const details = [
    draft.moveType && MOVE_TYPE_LABELS[draft.moveType],
    draft.size && MOVE_SIZE_LABELS[draft.size],
  ].filter(Boolean) as string[];
  const access = [...new Set([...draft.pickupAccess, ...draft.destinationAccess])];

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-label text-muted-foreground">Your move</p>
        {editable && (
          <Link
            to="/plan-move"
            className="inline-flex items-center gap-1 text-caption font-semibold text-primary hover:underline"
          >
            <Pencil className="size-3" aria-hidden="true" />
            {hasRoute ? "Edit" : "Add details"}
          </Link>
        )}
      </div>

      {hasRoute ? (
        <div className="mt-3 space-y-2">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="truncate">{draft.pickup || "Pickup not set"}</span>
          </p>
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Navigation className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="truncate">{draft.destination || "Destination not set"}</span>
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
            {formatDate(draft.date)}
            {draft.time && <span>· {timeWindowLabel(draft.time)}</span>}
          </p>
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us where and when so movers can check availability for your date.
        </p>
      )}

      {(details.length > 0 || draft.services.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {details.map((d) => (
            <StatusBadge key={d} tone="brand">
              {d}
            </StatusBadge>
          ))}
          {!compact &&
            draft.services.map((s) => (
              <StatusBadge key={s} tone="neutral">
                {SERVICE_LABELS[s]}
              </StatusBadge>
            ))}
          {compact && draft.services.length > 0 && (
            <StatusBadge tone="neutral">{draft.services.length} services</StatusBadge>
          )}
        </div>
      )}

      {!compact && (draft.items.length > 0 || access.length > 0 || draft.notes) && (
        <dl className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
          {draft.items.length > 0 && (
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-muted-foreground">Items</dt>
              <dd className="text-foreground">{draft.items.map((i) => ITEM_LABELS[i]).join(", ")}</dd>
            </div>
          )}
          {access.length > 0 && (
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-muted-foreground">Access</dt>
              <dd className="text-foreground">{access.map((a) => ACCESS_LABELS[a]).join(", ")}</dd>
            </div>
          )}
          {draft.notes && (
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-muted-foreground">Notes</dt>
              <dd className="text-foreground">{draft.notes}</dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}
