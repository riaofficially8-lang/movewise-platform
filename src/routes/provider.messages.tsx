import { createFileRoute } from "@tanstack/react-router";

import { ConsolePlaceholder } from "@/components/provider/ConsoleSection";

export const Route = createFileRoute("/provider/messages")({
  component: () => (
    <ConsolePlaceholder
      title="Messages"
      description="Conversations with customers, attached to the job they belong to."
      emptyTitle="No conversations"
      emptyDescription="Messages from customers about their move requests will show up here."
      illustration="route"
    />
  ),
});
