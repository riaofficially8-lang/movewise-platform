import { Link } from "@tanstack/react-router";
import { BadgeCheck, Clock3, Truck, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProviderGlyph, Rating, StatusBadge } from "@/components/ui-kit/primitives";
import { availabilityTone } from "@/domain/availability";
import { SERVICE_LABELS } from "@/domain/mock-data";
import type { Provider } from "@/domain/types";
import { cn } from "@/lib/utils";

export interface ProviderCardProps {
  provider: Provider;
  selected?: boolean;
  onSelect?: (provider: Provider) => void;
  className?: string;
}

/**
 * The marketplace's primary object card. Consumes domain data only, so real
 * backend records can replace the mock repository without changes here.
 */
export function ProviderCard({ provider, selected, onSelect, className }: ProviderCardProps) {
  const { performance: perf, availability: av } = provider;
  const vehicleTone = availabilityTone(av.vehiclesAvailable, av.vehiclesTotal);
  const moverTone = availabilityTone(av.moversAvailable, av.moversTotal);

  return (
    <article
      onClick={onSelect ? () => onSelect(provider) : undefined}
      aria-selected={selected}
      className={cn(
        "group surface-card relative p-5 transition-all duration-300 ease-[var(--ease-out-soft)]",
        onSelect && "cursor-pointer hover:-translate-y-0.5 hover:shadow-[var(--shadow-e2)]",
        selected
          ? "border-primary/60 bg-primary-soft/40 shadow-[var(--shadow-e2)] ring-2 ring-primary/30"
          : "hover:border-border-strong",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <ProviderGlyph name={provider.name} hue={provider.brandHue} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="text-h3 truncate text-foreground">{provider.name}</h3>
            {provider.verified && (
              <span className="inline-flex items-center gap-1 text-caption font-semibold text-primary">
                <BadgeCheck className="size-4" aria-hidden="true" />
                Verified
              </span>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <Rating value={perf.rating} count={perf.reviewCount} />
            <span className="text-caption text-muted-foreground">
              {perf.completedMoves.toLocaleString()} completed moves
            </span>
            <span className="text-caption text-muted-foreground">
              {Math.round(perf.onTimeRate * 100)}% on-time
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {provider.tagline}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <div className="flex items-center gap-2.5 rounded-xl bg-surface px-3 py-2.5">
          <Truck className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium tabular-nums text-foreground">
            {av.vehiclesAvailable}/{av.vehiclesTotal}
          </span>
          <span className="truncate text-caption text-muted-foreground">vehicles</span>
          <span className="ml-auto">
            <StatusBadge tone={vehicleTone} dot className="px-1.5 py-0.5 text-[0.6875rem]">
              {vehicleTone === "available" ? "Open" : vehicleTone === "limited" ? "Few" : "Full"}
            </StatusBadge>
          </span>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl bg-surface px-3 py-2.5">
          <Users className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium tabular-nums text-foreground">
            {av.moversAvailable}/{av.moversTotal}
          </span>
          <span className="truncate text-caption text-muted-foreground">movers</span>
          <span className="ml-auto">
            <StatusBadge tone={moverTone} dot className="px-1.5 py-0.5 text-[0.6875rem]">
              {moverTone === "available" ? "Open" : moverTone === "limited" ? "Few" : "Full"}
            </StatusBadge>
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {provider.serviceKinds.slice(0, 3).map((kind) => (
          <span
            key={kind}
            className="rounded-full border border-border px-2.5 py-1 text-caption text-muted-foreground"
          >
            {SERVICE_LABELS[kind]}
          </span>
        ))}
        {provider.serviceKinds.length > 3 && (
          <span className="text-caption text-muted-foreground">
            +{provider.serviceKinds.length - 3} more
          </span>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
        <span className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
          <Clock3 className="size-3.5" aria-hidden="true" />
          Replies in ~{perf.medianResponseMinutes} min
        </span>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button asChild size="sm" variant="outline">
            <Link to="/providers/$slug" params={{ slug: provider.slug }}>
              View profile
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/request/$slug" params={{ slug: provider.slug }}>
              Request move
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
