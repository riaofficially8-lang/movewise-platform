import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/AppShell";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — MoveGrid" },
      {
        name: "description",
        content: "Conversations with your moving providers, tied to each move request.",
      },
      { property: "og:title", content: "Messages — MoveGrid" },
      { property: "og:description", content: "Talk to providers about your move in one thread." },
    ],
  }),
  component: () => (
    <AppShell>
      <PlaceholderPage
        eyebrow="Conversations"
        title="Messages"
        description="Threads are attached to a move, so questions about access, parking or timing stay with the job they belong to."
        emptyTitle="No conversations yet"
        emptyDescription="Once you contact a provider or receive a quote, the conversation will show up here."
        illustration="route"
        action={
          <Button asChild variant="outline">
            <Link to="/find-movers">Browse providers</Link>
          </Button>
        }
      />
    </AppShell>
  ),
});
