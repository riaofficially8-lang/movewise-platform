import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Clock3, Info, Send } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { MoveSummaryCard } from "@/components/marketplace/MoveSummaryCard";
import { ProviderGlyph, Rating, StatusBadge } from "@/components/ui-kit/primitives";
import { EmptyState } from "@/components/ui-kit/states";
import { Button } from "@/components/ui/button";
import {
  submitMoveRequest,
  useMoveDraft,
  type SubmittedMoveRequest,
} from "@/domain/move-request";
import { providerDetailQueryOptions } from "@/domain/repository";

export const Route = createFileRoute("/request/$slug")({
  loader: async ({ context, params }) => {
    const detail = await context.queryClient.ensureQueryData(providerDetailQueryOptions(params.slug));
    if (!detail) throw notFound();
    return { name: detail.provider.name };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `Request a move from ${loaderData.name} — MoveGrid` : "Request a move — MoveGrid";
    const description = "Review your move details and send a request. The provider replies with a quote — nothing is booked yet.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  notFoundComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          illustration="route"
          title="We couldn't find that provider"
          description="The link may be out of date."
          action={
            <Button asChild>
              <Link to="/find-movers">Browse movers</Link>
            </Button>
          }
        />
      </div>
    </AppShell>
  ),
  component: RequestPage,
});

function RequestPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(providerDetailQueryOptions(slug));
  const draft = useMoveDraft();
  const [submitted, setSubmitted] = useState<SubmittedMoveRequest | null>(null);
  if (!data) return null;
  const { provider } = data;
  const ready = Boolean(draft.pickup && draft.destination && draft.date);

  if (submitted) {
    return (
      <AppShell>
        <div className="mx-auto w-full max-w-2xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="surface-card animate-rise p-8 text-center sm:p-10">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
              <CheckCircle2 className="size-7" aria-hidden="true" />
            </span>
            <h1 className="text-h1 mt-5 text-foreground">Request submitted</h1>
            <p className="mx-auto mt-3 max-w-md text-body-lg text-muted-foreground">
              {provider.name} has your move details. You'll hear back with a quote — usually within{" "}
              {provider.performance.medianResponseMinutes} minutes.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <StatusBadge tone="limited" dot>
                Awaiting provider response
              </StatusBadge>
              <StatusBadge tone="neutral">Ref {submitted.reference}</StatusBadge>
            </div>
            <p className="mx-auto mt-6 flex max-w-md items-start gap-2 rounded-2xl bg-surface p-4 text-left text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              This is a request, not a booking. No vehicle or crew is reserved and nothing is charged
              until you accept a quote.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/my-move">Go to My move</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/find-movers">Compare more movers</Link>
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:py-16">
        <Link
          to="/providers/$slug"
          params={{ slug }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to {provider.name}
        </Link>
        <h1 className="text-h1 mt-4 text-foreground">Request a move</h1>
        <p className="mt-2 text-body-lg text-muted-foreground">
          Check your details, then send them to {provider.name} for a quote.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
          <MoveSummaryCard draft={draft} className="p-6" />

          <aside className="surface-card h-fit p-6">
            <div className="flex items-center gap-3">
              <ProviderGlyph name={provider.name} hue={provider.brandHue} className="size-12" />
              <div className="min-w-0">
                <p className="truncate font-display font-semibold text-foreground">{provider.name}</p>
                <Rating value={provider.performance.rating} count={provider.performance.reviewCount} />
              </div>
            </div>
            <p className="mt-4 inline-flex items-center gap-1.5 text-caption text-muted-foreground">
              <Clock3 className="size-3.5" aria-hidden="true" />
              Typically replies in {provider.performance.medianResponseMinutes} min
            </p>
            {ready ? (
              <Button
                size="lg"
                className="mt-5 w-full"
                onClick={() => setSubmitted(submitMoveRequest(provider.slug, provider.name))}
              >
                <Send aria-hidden="true" />
                Send request
              </Button>
            ) : (
              <>
                <p className="mt-5 text-sm text-muted-foreground">
                  Add pickup, destination and date first so {provider.name} can check availability.
                </p>
                <Button asChild size="lg" className="mt-4 w-full">
                  <Link to="/plan-move">Add move details</Link>
                </Button>
              </>
            )}
            <p className="mt-3 text-center text-caption text-muted-foreground">
              Free and no commitment — this isn't a booking.
            </p>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
