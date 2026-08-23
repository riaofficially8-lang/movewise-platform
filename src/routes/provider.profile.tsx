import { createFileRoute } from "@tanstack/react-router";

import { ConsolePlaceholder } from "@/components/provider/ConsoleSection";

export const Route = createFileRoute("/provider/profile")({
  component: () => (
    <ConsolePlaceholder
      title="Provider profile"
      description="What customers see: your description, services, verification, fleet, crews and service area."
      emptyTitle="Profile editing coming next"
      emptyDescription="Profile editing, verification and service-area management arrive in the next build."
      illustration="boxes"
    />
  ),
});
