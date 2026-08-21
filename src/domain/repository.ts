import { queryOptions } from "@tanstack/react-query";

import { PROVIDER_BUNDLES, type ProviderBundle } from "./mock-data";
import { summarizeAvailability } from "./availability";
import type { Provider, ProviderSearchQuery, TimeWindow } from "./types";

/**
 * Data-access layer. Today it resolves from in-memory mock content; later it
 * becomes server functions hitting the real database. Everything above this
 * file only ever sees domain types, never storage details.
 */

const LATENCY_MS = 260;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

function withDerivedAvailability(bundle: ProviderBundle, window?: TimeWindow): Provider {
  return {
    ...bundle.provider,
    availability: summarizeAvailability(bundle.vehicles, bundle.crews, window),
  };
}

function matches(bundle: ProviderBundle, query: ProviderSearchQuery): boolean {
  const { provider } = bundle;
  if (query.text) {
    const t = query.text.trim().toLowerCase();
    const haystack = [provider.name, provider.tagline, provider.baseCity, ...provider.serviceKinds]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(t)) return false;
  }
  if (query.services?.length) {
    if (!query.services.every((s) => provider.serviceKinds.includes(s))) return false;
  }
  if (query.minRating && provider.performance.rating < query.minRating) return false;
  return true;
}

export async function searchProviders(query: ProviderSearchQuery = {}): Promise<Provider[]> {
  const window = query.date
    ? { start: `${query.date}T08:00:00Z`, end: `${query.date}T18:00:00Z` }
    : undefined;
  const results = PROVIDER_BUNDLES.filter((b) => matches(b, query)).map((b) =>
    withDerivedAvailability(b, window),
  );
  return delay(results);
}

export interface ProviderDetail {
  provider: Provider;
  vehicles: ProviderBundle["vehicles"];
  crews: ProviderBundle["crews"];
  reviews: ProviderBundle["reviews"];
}

export async function getProviderBySlug(slug: string): Promise<ProviderDetail | null> {
  const bundle = PROVIDER_BUNDLES.find((b) => b.provider.slug === slug);
  if (!bundle) return delay(null);
  return delay({
    provider: withDerivedAvailability(bundle),
    vehicles: bundle.vehicles,
    crews: bundle.crews,
    reviews: bundle.reviews,
  });
}

export const providerSearchQueryOptions = (query: ProviderSearchQuery = {}) =>
  queryOptions({
    queryKey: ["providers", "search", query],
    queryFn: () => searchProviders(query),
    staleTime: 60_000,
  });

export const providerDetailQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["providers", "detail", slug],
    queryFn: () => getProviderBySlug(slug),
    staleTime: 60_000,
  });
