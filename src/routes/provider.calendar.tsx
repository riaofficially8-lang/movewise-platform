import { createFileRoute } from "@tanstack/react-router";

import { ConsolePlaceholder } from "@/components/provider/ConsoleSection";

export const Route = createFileRoute("/provider/calendar")({
  component: () => (
    <ConsolePlaceholder
      title="Calendar"
      description="Vehicles and crews are scheduled independently, so a busy truck never blocks an available team."
      emptyTitle="Nothing scheduled"
      emptyDescription="Assignments across jobs, trips and tasks will be plotted here per resource."
      illustration="route"
    />
  ),
});
