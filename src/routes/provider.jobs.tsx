import { createFileRoute } from "@tanstack/react-router";

import { ConsolePlaceholder } from "@/components/provider/ConsoleSection";

export const Route = createFileRoute("/provider/jobs")({
  component: () => (
    <ConsolePlaceholder
      title="Jobs"
      description="Requests, quotes, booked moves and completed work — each job can span multiple trips, tasks, vehicles and crews."
      emptyTitle="No jobs yet"
      emptyDescription="Incoming move requests from customers in your service area will land here."
      illustration="truck"
    />
  ),
});
