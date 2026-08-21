import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  ClipboardList,
  MapPinned,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { AppShell } from "@/components/layout/AppShell";
import { MoveSearchForm } from "@/components/search/MoveSearchForm";
import { ProviderCard } from "@/components/marketplace/ProviderCard";
import { SectionHeading, StatusBadge } from "@/components/ui-kit/primitives";
import { ErrorState } from "@/components/ui-kit/states";
import { Button } from "@/components/ui/button";
import {
  BoxesIllustration,
  HouseIllustration,
  RouteIllustration,
  TruckWaitingIllustration,
} from "@/components/illustrations/Illustrations";
import { providerSearchQueryOptions } from "@/domain/repository";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MoveGrid — Find movers for your next move" },
      {
        name: "description",
        content:
          "Tell us where you're moving and compare vetted movers with real availability, ratings and on-time performance. Explore providers near you on the map.",
      },
      { property: "og:title", content: "MoveGrid — Find movers for your next move" },
      {
        property: "og:description",
        content:
          "Compare vetted movers with real availability, ratings and on-time performance in one place.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(providerSearchQueryOptions({})),
  errorComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-24">
        <ErrorState />
      </div>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">Page not found.</div>
    </AppShell>
  ),
  component: HomePage,
});

function HomePage() {
  const { data: providers } = useSuspenseQuery(providerSearchQueryOptions({}));
  const featured = providers.slice(0, 3);

  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -right-24 -top-24 size-[28rem] rounded-full bg-primary-soft blur-3xl" />
          <div className="absolute -bottom-40 left-[-6rem] size-[24rem] rounded-full bg-accent-soft blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-[110rem] px-4 pb-14 pt-14 sm:px-6 lg:px-10 lg:pb-20 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="animate-rise">
              <StatusBadge tone="brand" dot>
                Moving marketplace · live availability
              </StatusBadge>
              <h1 className="text-display mt-5 text-foreground">Where are you moving?</h1>
              <p className="mt-5 max-w-xl text-body-lg text-muted-foreground">
                Tell us the basics and we'll show movers who can actually take your date — with real
                ratings, crew and vehicle availability, and on-time records you can check.
              </p>

              <MoveSearchForm
                className="mt-8 max-w-3xl"
                secondaryAction={
                  <Link
                    to="/find-movers"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    <MapPinned className="size-4" aria-hidden="true" />
                    Explore movers near you
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                }
              />

              <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-4">
                {[
                  { label: "Verified providers", value: "180+" },
                  { label: "Moves completed", value: "24,800" },
                  { label: "Median reply", value: "14 min" },
                ].map((s) => (
                  <div key={s.label}>
                    <dt className="text-caption text-muted-foreground">{s.label}</dt>
                    <dd className="font-display text-xl font-bold tracking-[-0.02em] text-foreground">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative hidden justify-center lg:flex">
              <div className="surface-card w-full max-w-md p-8 shadow-[var(--shadow-e3)]">
                <div className="flex items-center justify-between">
                  <p className="text-label text-muted-foreground">Your move</p>
                  <StatusBadge tone="available" dot>
                    3 movers available
                  </StatusBadge>
                </div>
                <RouteIllustration className="mx-auto mt-6 w-full max-w-xs" />
                <div className="mt-6 space-y-3">
                  {[
                    { icon: Truck, label: "Vehicles matched to your volume" },
                    { icon: Users, label: "Crews scheduled independently" },
                    { icon: CalendarCheck, label: "Availability for your exact date" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3">
                      <Icon className="size-4 text-primary" aria-hidden="true" />
                      <span className="text-sm text-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-[110rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <SectionHeading
          eyebrow="How it works"
          title="From “we're moving” to keys in the door"
          description="Four calm steps. No phone tag, no guessing whether a company is actually free on your date."
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: ClipboardList,
              title: "Tell us what you need",
              body: "Locations, date and a few details about the home. Skip it and browse if you prefer.",
            },
            {
              icon: MapPinned,
              title: "Discover movers",
              body: "See who covers your route on the map, with availability and reputation side by side.",
            },
            {
              icon: CalendarCheck,
              title: "Compare quotes",
              body: "Providers respond with a clear price breakdown. You choose — nothing is auto-booked.",
            },
            {
              icon: Truck,
              title: "Follow the move",
              body: "Crew and vehicles are assigned, and you can follow progress on the day itself.",
            },
          ].map((step, i) => (
            <li key={step.title} className="surface-card group p-6 transition-shadow hover:shadow-[var(--shadow-e2)]">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-display text-sm font-bold text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-h3 mt-5 text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Featured providers */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto w-full max-w-[110rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
          <SectionHeading
            eyebrow="Movers near you"
            title="Highly rated providers in your region"
            description="Availability shown here is derived from each provider's crew and vehicle schedules — not a manual switch someone forgot to flip."
            action={
              <Button asChild variant="outline">
                <Link to="/find-movers">
                  Open the map
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            }
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {featured.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto w-full max-w-[110rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Why MoveGrid"
              title="Reputation you can trace back to real jobs"
              description="Every rating, on-time percentage and response time comes from platform activity — timestamped job events, not self-reported claims."
            />
            <ul className="mt-8 space-y-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Verified providers",
                  body: "Business registration and insurance checks before a provider can receive requests.",
                },
                {
                  icon: CalendarCheck,
                  title: "Real availability",
                  body: "Crews and vehicles are scheduled separately, so “available” means available for your window.",
                },
                {
                  icon: MapPinned,
                  title: "Privacy by default",
                  body: "The public map shows service areas. Live crew positions are only shared for your booked move.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <item.icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="surface-card flex items-center justify-center p-8">
              <BoxesIllustration />
            </div>
            <div className="surface-card flex items-center justify-center p-8">
              <HouseIllustration />
            </div>
            <div className="surface-card col-span-2 flex items-center justify-center p-8">
              <TruckWaitingIllustration className="w-56" />
            </div>
          </div>
        </div>
      </section>

      {/* Provider entry */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-[110rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
          <div className="surface-card flex flex-col items-start justify-between gap-8 p-8 lg:flex-row lg:items-center lg:p-12">
            <div className="max-w-2xl">
              <StatusBadge tone="accent">
                <Building2 className="size-3.5" aria-hidden="true" />
                For moving companies
              </StatusBadge>
              <h2 className="text-h2 mt-4 text-foreground">
                Run your crews, fleet and jobs in one place
              </h2>
              <p className="mt-3 text-body-lg text-muted-foreground">
                Receive requests, quote fast, assign vehicles and crews independently, and build a
                reputation from real completed work.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/for-moving-companies">Join as a provider</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/provider">See the console</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
