import { createFileRoute } from "@tanstack/react-router";

import { ConsoleSection } from "@/components/provider/ConsoleSection";
import { VehicleCard } from "@/components/marketplace/ResourceCards";
import { StatusBadge } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { PROVIDER_BUNDLES } from "@/domain/mock-data";

export const Route = createFileRoute("/provider/fleet")({
  component: FleetPage,
});

function FleetPage() {
  const { provider, vehicles } = PROVIDER_BUNDLES[0];

  return (
    <ConsoleSection
      title="Fleet"
      description="Each vehicle carries its own schedule and capacity. Vehicle availability is derived from assignments, never from a manual toggle."
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusBadge tone="brand" dot>
          {provider.availability.vehiclesAvailable} of {provider.availability.vehiclesTotal} available
          today
        </StatusBadge>
        <Button variant="outline" size="sm" disabled>
          Add vehicle
        </Button>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>
    </ConsoleSection>
  );
}
