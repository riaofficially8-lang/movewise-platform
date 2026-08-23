import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BadgeCheck, Clock3, MapPin, MessageSquare, Share2, Star } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { CrewCard, VehicleCard } from "@/components/marketplace/ResourceCards";
import { DiscoveryMap } from "@/components/map/DiscoveryMap";
import { ProviderGlyph, Rating, Stat, StatusBadge } from "@/components/ui-kit/primitives";
import { EmptyState, ErrorState } from "@/components/ui-kit/states";
import { Button } from "@/components/ui/button";
import { SERVICE_LABELS } from "@/domain/mock-data";
import { providerDetailQueryOptions } from "@/domain/repository";

export const Route = createFileRoute("/providers/$slug")({
  loader: async ({ context, params }) => {
    const detail = await context.queryClient.ensureQueryData(providerDetailQueryOptions(params.slug));
    if (!detail) throw notFound();
    return { name: detail.provider.name, tagline: detail.provider.tagline };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Provider unavailable — MoveGrid" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} — mover profile on MoveGrid`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.tagline },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.tagline },
      ],
    };
  },
  errorComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-24">
        <ErrorState />
      </div>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          illustration="route"
          title="We couldn't find that provider"
          description="The profile may have been removed, or the link is out of date."
          action={
            <Button asChild>
              <Link to="/find-movers">Browse movers</Link>
            </Button>
          }
        />
      </div>
    </AppShell>
  ),
  component: ProviderProfilePage,
});

const SECTIONS = [
  { id: "services", label: "Services" },
  { id: "fleet", label: "Fleet" },
  { id: "crews", label: "Crews" },
  { id: "reviews", label: "Reviews" },
  { id: "updates", label: "Updates" },
  { id: "area", label: "Service area" },
];

function ProviderProfilePage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(providerDetailQueryOptions(slug));
  if (!data) return null;
  const { provider, vehicles, crews, reviews } = data;
  const perf = provider.performance;

  return (
    <AppShell>
      {/* Header */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto w-full max-w-[80rem] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-5">
              <ProviderGlyph
                name={provider.name}
                hue={provider.brandHue}
                className="size-16 rounded-3xl text-lg lg:size-20"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-h1 text-foreground">{provider.name}</h1>
                  {provider.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-caption font-semibold text-primary">
                      <BadgeCheck className="size-4" aria-hidden="true" />
                      Verified provider
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <Rating value={perf.rating} count={perf.reviewCount} size="lg" />
                  <span className="text-sm text-muted-foreground">
                    {perf.completedMoves.toLocaleString()} completed moves
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4" aria-hidden="true" />
                    {provider.baseCity}
                  </span>
                </div>
                <p className="mt-4 max-w-2xl text-body-lg text-muted-foreground">
                  {provider.description}
                </p>
              </div>
            </div>

            {/* Sticky CTA card — reachable without scrolling to the bottom */}
            <aside className="lg:sticky lg:top-28 lg:w-80 lg:shrink-0">
              <div className="surface-card p-6 shadow-[var(--shadow-e2)]">
                <p className="text-label text-muted-foreground">Ready when you are</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Send your move details and get a priced quote — no commitment.
                </p>
                <Button size="lg" className="mt-5 w-full">
                  Request a move
                </Button>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare aria-hidden="true" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 aria-hidden="true" />
                    Share
                  </Button>
                </div>
                <p className="mt-4 inline-flex items-center gap-1.5 text-caption text-muted-foreground">
                  <Clock3 className="size-3.5" aria-hidden="true" />
                  Typically replies in {perf.medianResponseMinutes} minutes
                </p>
              </div>
            </aside>
          </div>

          {/* Quick statistics */}
          <div className="mt-10 grid grid-cols-2 gap-3 lg:mr-[22rem] lg:grid-cols-4">
            <Stat label="Completed moves" value={perf.completedMoves.toLocaleString()} hint="Platform-verified" />
            <Stat label="Rating" value={perf.rating.toFixed(1)} hint={`${perf.reviewCount} reviews`} />
            <Stat label="On-time arrival" value={`${Math.round(perf.onTimeRate * 100)}%`} hint="From job events" />
            <Stat
              label="Response time"
              value={`${perf.medianResponseMinutes} min`}
              hint="Median, last 90 days"
            />
          </div>
        </div>
      </section>

      {/* Section nav */}
      <nav
        aria-label="Profile sections"
        className="sticky top-16 z-30 border-b border-border bg-background/90 backdrop-blur lg:top-[4.5rem]"
      >
        <div className="mx-auto flex w-full max-w-[80rem] gap-1 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-10">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto w-full max-w-[80rem] space-y-14 px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        {/* Services */}
        <section id="services" className="scroll-mt-32">
          <h2 className="text-h2 text-foreground">Services</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {provider.serviceKinds.map((kind) => (
              <div key={kind} className="surface-card p-5">
                <p className="font-display font-semibold text-foreground">{SERVICE_LABELS[kind]}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Offered across {provider.serviceArea.label}.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Fleet */}
        <section id="fleet" className="scroll-mt-32">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-h2 text-foreground">Fleet</h2>
            <StatusBadge tone="brand" dot>
              {provider.availability.vehiclesAvailable} of {provider.availability.vehiclesTotal} vehicles
              free today
            </StatusBadge>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Vehicles are scheduled independently from crews — a busy truck does not mean a busy team.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </section>

        {/* Crews */}
        <section id="crews" className="scroll-mt-32">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-h2 text-foreground">Crews</h2>
            <StatusBadge tone="brand" dot>
              {provider.availability.moversAvailable} of {provider.availability.moversTotal} movers free
              today
            </StatusBadge>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {crews.map((c) => (
              <CrewCard key={c.id} crew={c} />
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="scroll-mt-32">
          <h2 className="text-h2 text-foreground">Reviews</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Only customers with a completed move on MoveGrid can leave a review.
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {reviews.map((r) => (
              <article key={r.id} className="surface-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display font-semibold text-foreground">{r.authorName}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                    <Star className="size-4 fill-accent text-accent" aria-hidden="true" />
                    {r.rating.toFixed(1)}
                  </span>
                </div>
                {r.title && <p className="mt-3 font-medium text-foreground">{r.title}</p>}
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                <p className="mt-4 text-caption text-muted-foreground">
                  Verified move · {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Updates */}
        <section id="updates" className="scroll-mt-32">
          <h2 className="text-h2 text-foreground">Updates</h2>
          <EmptyState
            compact
            className="mt-6"
            illustration="boxes"
            title="No updates published yet"
            description="Providers will be able to post availability notes, new services and seasonal announcements here."
          />
        </section>

        {/* Service area */}
        <section id="area" className="scroll-mt-32">
          <h2 className="text-h2 text-foreground">Service area</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {provider.serviceArea.label} — approximately {provider.serviceArea.radiusKm} km around{" "}
            {provider.baseCity}. Precise crew locations are never shown publicly.
          </p>
          <DiscoveryMap
            providers={[provider]}
            selectedId={provider.id}
            className="mt-6 h-[24rem] w-full"
          />
        </section>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
        <Button size="lg" className="w-full">
          Request a move
        </Button>
      </div>
    </AppShell>
  );
}
