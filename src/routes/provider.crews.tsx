import { createFileRoute } from "@tanstack/react-router";

import { ConsoleSection } from "@/components/provider/ConsoleSection";
import { CrewCard } from "@/components/marketplace/ResourceCards";
import { StatusBadge } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { PROVIDER_BUNDLES } from "@/domain/mock-data";

export const Route = createFileRoute("/provider/crews")({
  component: CrewsPage,
});

function CrewsPage() {
  const { provider, crews } = PROVIDER_BUNDLES[0]!;

  return (
    <ConsoleSection
      title="Crews"
      description="Crews are scheduled independently from vehicles — a team can finish later than the truck it started with, and both stay bookable on their own timeline."
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusBadge tone="brand" dot>
          {provider.availability.moversAvailable} of {provider.availability.moversTotal} movers
          available today
        </StatusBadge>
        <Button variant="outline" size="sm" disabled>
          Add crew
        </Button>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {crews.map((c) => (
          <CrewCard key={c.id} crew={c} />
        ))}
      </div>
    </ConsoleSection>
  );
}
