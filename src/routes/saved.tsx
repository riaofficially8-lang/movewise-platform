import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/AppShell";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved movers — MoveGrid" },
      {
        name: "description",
        content: "Shortlist moving providers and compare them side by side before you request quotes.",
      },
      { property: "og:title", content: "Saved movers — MoveGrid" },
      { property: "og:description", content: "Your shortlist of moving providers." },
    ],
  }),
  component: () => (
    <AppShell>
      <PlaceholderPage
        eyebrow="Shortlist"
        title="Saved movers"
        description="Keep the providers you like in one place and compare their availability, services and reputation."
        emptyTitle="Nothing saved yet"
        emptyDescription="Tap the save action on any provider while browsing and they'll be waiting here."
        illustration="house"
        action={
          <Button asChild size="lg">
            <Link to="/find-movers">Explore movers</Link>
          </Button>
        }
      />
    </AppShell>
  ),
});
