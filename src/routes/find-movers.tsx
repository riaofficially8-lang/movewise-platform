import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ListFilter, Map as MapIcon, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { DiscoveryMap } from "@/components/map/DiscoveryMap";
import { ProviderCard } from "@/components/marketplace/ProviderCard";
import { ProviderSearchField } from "@/components/search/MoveSearchForm";
import { MoveSummaryCard } from "@/components/marketplace/MoveSummaryCard";
import { EmptyState, ErrorState, LoadingList } from "@/components/ui-kit/states";
import { Button } from "@/components/ui/button";
import { SERVICE_LABELS } from "@/domain/mock-data";
import { useMoveDraft } from "@/domain/move-request";
import { providerSearchQueryOptions } from "@/domain/repository";
import type { Provider, ServiceKind } from "@/domain/types";
import { cn } from "@/lib/utils";

interface DiscoverySearch {
  q?: string | undefined;
  pickup?: string | undefined;
  destination?: string | undefined;
  date?: string | undefined;
  provider?: string | undefined;
}

const FILTER_SERVICES: ServiceKind[] = ["moving", "packing", "assembly", "storage", "unpacking"];

export const Route = createFileRoute("/find-movers")({
  validateSearch: (search: Record<string, unknown>): DiscoverySearch => ({
    q: typeof search['q'] === "string" && search['q'] ? search['q'] : undefined,
    pickup: typeof search['pickup'] === "string" && search['pickup'] ? search['pickup'] : undefined,
    destination:
      typeof search['destination'] === "string" && search['destination'] ? search['destination'] : undefined,
    date: typeof search['date'] === "string" && search['date'] ? search['date'] : undefined,
    provider: typeof search['provider'] === "string" && search['provider'] ? search['provider'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Find movers near you — MoveGrid" },
      {
        name: "description",
        content:
          "Explore moving providers on the map, filter by service and compare availability, ratings and on-time performance before you request a quote.",
      },
      { property: "og:title", content: "Find movers near you — MoveGrid" },
      {
        property: "og:description",
        content: "Explore moving providers on the map and compare availability and ratings.",
      },
    ],
  }),
  errorComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-24">
        <ErrorState />
      </div>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">Nothing here.</div>
    </AppShell>
  ),
  component: FindMoversPage,
});

function FindMoversPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/find-movers" });
  const [text, setText] = useState(search['q'] ?? "");
  const [services, setServices] = useState<ServiceKind[]>([]);
  const draft = useMoveDraft();
  const [mobileView, setMobileView] = useState<"map" | "list">("map");

  const query = useMemo(
    () => ({ text: text || undefined, date: search['date'] || draft.date || undefined, services: services.length ? services : undefined }),
    [text, search['date'], draft.date, services],
  );

  const { data: providers, isPending, isError, refetch } = useQuery(providerSearchQueryOptions(query));
  const selected = providers?.find((p) => p.slug === search['provider']) ?? null;

  const selectProvider = (provider: Provider | null) =>
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, provider: provider?.slug }),
      replace: true,
    });

  const toggleService = (kind: ServiceKind) =>
    setServices((prev) => (prev.includes(kind) ? prev.filter((s) => s !== kind) : [...prev, kind]));

  const resultsPanel = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="space-y-3 border-b border-border bg-background/80 p-4 backdrop-blur lg:p-5">
        <ProviderSearchField value={text} onChange={setText} />
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            Services
          </span>
          {FILTER_SERVICES.map((kind) => {
            const active = services.includes(kind);
            return (
              <button
                key={kind}
                type="button"
                onClick={() => toggleService(kind)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-caption font-medium transition-colors duration-200",
                  active
                    ? "border-primary/40 bg-primary-soft text-primary"
                    : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
                )}
              >
                {SERVICE_LABELS[kind]}
              </button>
            );
          })}
        </div>
        <MoveSummaryCard draft={draft} compact />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 lg:p-5">
        {isPending && <LoadingList count={3} />}
        {isError && <ErrorState onRetry={() => refetch()} />}
        {!isPending && !isError && providers && providers.length === 0 && (
          <EmptyState
            compact
            illustration="truck"
            title="No movers match that search"
            description="Try removing a filter or searching a wider area — new providers join every week."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setText("");
                  setServices([]);
                }}
              >
                Reset filters
              </Button>
            }
          />
        )}
        {!isPending && !isError && providers && providers.length > 0 && (
          <>
            <p className="mb-3 text-caption text-muted-foreground">
              {providers.length} providers cover this region
            </p>
            <div className="space-y-4">
              {providers.map((p) => (
                <ProviderCard
                  key={p.id}
                  provider={p}
                  selected={selected?.id === p.id}
                  onSelect={(provider) => selectProvider(provider)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <AppShell fullBleed>
      <div className="grid min-h-0 flex-1 lg:h-[calc(100vh-4.5rem)] lg:grid-cols-[minmax(24rem,32rem)_1fr]">
        {/* Desktop results rail */}
        <aside className="hidden min-h-0 border-r border-border lg:block">{resultsPanel}</aside>

        {/* Map region */}
        <div className="relative min-h-[calc(100vh-9rem)] lg:min-h-0 lg:p-4">
          <DiscoveryMap
            providers={providers ?? []}
            selectedId={selected?.id}
            onSelect={(p) => selectProvider(p)}
            className="absolute inset-0 lg:static lg:size-full"
          />

          {selected && (
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center p-4 lg:justify-end lg:p-8">
              <div className="pointer-events-auto w-full max-w-sm animate-rise surface-card p-5 shadow-[var(--shadow-e3)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-h3 text-foreground">{selected.name}</h2>
                    <p className="mt-1 text-caption text-muted-foreground">
                      {selected.serviceArea.label} · {selected.serviceArea.radiusKm} km radius
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Close provider preview"
                    onClick={() => selectProvider(null)}
                  >
                    <X aria-hidden="true" />
                  </Button>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {selected.tagline}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-caption">
                  <div className="rounded-xl bg-surface px-3 py-2">
                    <span className="block text-muted-foreground">Vehicles free</span>
                    <span className="font-semibold tabular-nums text-foreground">
                      {selected.availability.vehiclesAvailable}/{selected.availability.vehiclesTotal}
                    </span>
                  </div>
                  <div className="rounded-xl bg-surface px-3 py-2">
                    <span className="block text-muted-foreground">Movers free</span>
                    <span className="font-semibold tabular-nums text-foreground">
                      {selected.availability.moversAvailable}/{selected.availability.moversTotal}
                    </span>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Button asChild variant="outline">
                    <Link to="/providers/$slug" params={{ slug: selected.slug }}>
                      View profile
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/request/$slug" params={{ slug: selected.slug }}>
                      Request move
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile: floating search + bottom sheet */}
          <div className="pointer-events-none absolute inset-x-0 top-0 p-4 lg:hidden">
            <div className="pointer-events-auto">
              <ProviderSearchField value={text} onChange={setText} />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-center lg:hidden">
            <Button
              className="pointer-events-auto shadow-[var(--shadow-e3)]"
              onClick={() => setMobileView(mobileView === "map" ? "list" : "map")}
            >
              {mobileView === "map" ? (
                <>
                  <ListFilter aria-hidden="true" /> Show {providers?.length ?? 0} movers
                </>
              ) : (
                <>
                  <MapIcon aria-hidden="true" /> Show map
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile bottom sheet */}
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-30 max-h-[78vh] rounded-t-3xl border-t border-border bg-background shadow-[var(--shadow-e3)] transition-transform duration-500 ease-[var(--ease-out-soft)] lg:hidden",
            mobileView === "list" ? "translate-y-0" : "translate-y-full",
          )}
          aria-hidden={mobileView !== "list"}
        >
          <div className="flex justify-center pb-1 pt-3">
            <span className="h-1.5 w-11 rounded-full bg-border-strong" />
          </div>
          <div className="max-h-[calc(78vh-2.5rem)] overflow-y-auto pb-24">{resultsPanel}</div>
        </div>
      </div>
    </AppShell>
  );
}
