import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/AppShell";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/my-move")({
  head: () => ({
    meta: [
      { title: "My move — MoveGrid" },
      {
        name: "description",
        content: "Track your move requests, quotes and booked jobs in one place on MoveGrid.",
      },
      { property: "og:title", content: "My move — MoveGrid" },
      { property: "og:description", content: "Your move requests, quotes and booked jobs." },
    ],
  }),
  component: () => (
    <AppShell>
      <PlaceholderPage
        eyebrow="Your move"
        title="My move"
        description="Every request, quote, booking and job timeline will live here — including live progress on moving day once your provider assigns a crew and vehicle."
        emptyTitle="No moves yet"
        emptyDescription="Start by telling us where you're moving. Requests you send to providers appear here with their quotes and status."
        illustration="boxes"
        action={
          <Button asChild size="lg">
            <Link to="/find-movers">Find movers</Link>
          </Button>
        }
      />
    </AppShell>
  ),
});
