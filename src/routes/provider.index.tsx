import { createFileRoute } from "@tanstack/react-router";

import { ConsoleSection } from "@/components/provider/ConsoleSection";
import { CrewCard, VehicleCard } from "@/components/marketplace/ResourceCards";
import { Stat, StatusBadge } from "@/components/ui-kit/primitives";
import { EmptyState } from "@/components/ui-kit/states";
import { PROVIDER_BUNDLES } from "@/domain/mock-data";

export const Route = createFileRoute("/provider/")({
  component: ProviderOverview,
});

function ProviderOverview() {
  // Demo context: the signed-in business maps to the first provider bundle.
  const { provider, vehicles, crews } = PROVIDER_BUNDLES[0];
  const perf = provider.performance;

  return (
    <ConsoleSection
      title="Overview"
      description={`${provider.name} — resource availability and business performance at a glance.`}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Completed moves" value={perf.completedMoves.toLocaleString()} hint="All time" />
        <Stat label="Rating" value={perf.rating.toFixed(1)} hint={`${perf.reviewCount} reviews`} />
        <Stat label="On-time arrival" value={`${Math.round(perf.onTimeRate * 100)}%`} hint="From job events" />
        <Stat label="Median response" value={`${perf.medianResponseMinutes} min`} hint="Last 90 days" />
      </div>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-h2 text-foreground">Today's jobs</h2>
          <StatusBadge tone="neutral">Job workflow arrives in the next build</StatusBadge>
        </div>
        <EmptyState
          compact
          className="mt-5 bg-card/60"
          illustration="truck"
          title="No jobs scheduled today"
          description="Accepted move requests will appear here with their trips, tasks and assigned resources."
        />
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-h2 text-foreground">Fleet</h2>
          <StatusBadge tone="brand" dot>
            {provider.availability.vehiclesAvailable}/{provider.availability.vehiclesTotal} available
          </StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.slice(0, 3).map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-h2 text-foreground">Crews</h2>
          <StatusBadge tone="brand" dot>
            {provider.availability.moversAvailable}/{provider.availability.moversTotal} movers available
          </StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {crews.slice(0, 3).map((c) => (
            <CrewCard key={c.id} crew={c} />
          ))}
        </div>
      </section>
    </ConsoleSection>
  );
}
