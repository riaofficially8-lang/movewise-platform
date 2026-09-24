import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Info } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { MoveSummaryCard } from "@/components/marketplace/MoveSummaryCard";
import { StatusBadge } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { useMoveRequests } from "@/domain/move-request";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyMovePage,
});

function MyMovePage() {
  const requests = useMoveRequests();

  if (requests.length === 0) {
    return (
      <AppShell>
        <PlaceholderPage
          eyebrow="Your move"
          title="My move"
          description="Every request, quote and booking lives here."
          emptyTitle="No moves yet"
          emptyDescription="Start by telling us where you're moving. Requests you send to providers appear here with their status."
          illustration="boxes"
          action={
            <Button asChild size="lg">
              <Link to="/plan-move">Plan your move</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:py-16">
        <p className="text-label text-primary">Your move</p>
        <h1 className="text-h1 mt-2 text-foreground">My move</h1>
        <p className="mt-2 text-body-lg text-muted-foreground">
          Requests you've sent and where each one stands.
        </p>

        <div className="mt-8 space-y-5">
          {requests.map((r) => (
            <article key={r.id} className="surface-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-caption text-muted-foreground">
                    Ref {r.reference} · sent {new Date(r.submittedAt).toLocaleString()}
                  </p>
                  <h2 className="text-h3 mt-1 text-foreground">{r.providerName}</h2>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusBadge tone="brand" dot>
                    Request submitted
                  </StatusBadge>
                  <StatusBadge tone="limited">Awaiting provider response</StatusBadge>
                </div>
              </div>
              <MoveSummaryCard draft={r.draft} editable={false} className="mt-5 bg-surface" />
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
                  <Info className="size-3.5" aria-hidden="true" />
                  Not a booking yet — you'll get a quote to accept or decline.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/providers/$slug" params={{ slug: r.providerSlug }}>
                    View provider
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
