import { useSyncExternalStore } from "react";

import type { AccessDetails, MoveRequirements, ServiceKind } from "./types";

/**
 * Customer move-request draft.
 *
 * This is the customer's in-progress request before any backend exists. It is
 * intentionally a thin client store shaped like the domain `MoveRequirements`
 * contract, so it can later be persisted through a server function without
 * changing any UI code.
 */

export type MoveTypeOption = "apartment" | "house" | "office" | "other";

export type MoveSizeOption =
  | "studio"
  | "1_bed"
  | "2_bed"
  | "3_bed"
  | "4_plus"
  | "large_house"
  | "office";

export type AccessOption =
  | "stairs"
  | "elevator"
  | "parking_restricted"
  | "long_carry"
  | "narrow_access";

export type ItemOption =
  | "furniture"
  | "boxes"
  | "appliances"
  | "fragile"
  | "piano"
  | "artwork"
  | "garden"
  | "safe";

export const MOVE_TYPE_LABELS: Record<MoveTypeOption, string> = {
  apartment: "Apartment",
  house: "House",
  office: "Office",
  other: "Something else",
};

export const MOVE_SIZE_LABELS: Record<MoveSizeOption, string> = {
  studio: "Studio",
  "1_bed": "1 bedroom",
  "2_bed": "2 bedrooms",
  "3_bed": "3 bedrooms",
  "4_plus": "4+ bedrooms",
  large_house: "Large house",
  office: "Office / business",
};

export const MOVE_SIZE_HINTS: Record<MoveSizeOption, string> = {
  studio: "~10 m³ · 1 van",
  "1_bed": "~15 m³ · 1 van",
  "2_bed": "~25 m³ · box truck",
  "3_bed": "~35 m³ · box truck",
  "4_plus": "~50 m³ · large truck",
  large_house: "~70 m³ · 2 vehicles",
  office: "Scoped per site visit",
};

export const ITEM_LABELS: Record<ItemOption, string> = {
  furniture: "Furniture",
  boxes: "Boxes",
  appliances: "Appliances",
  fragile: "Fragile items",
  piano: "Piano",
  artwork: "Artwork",
  garden: "Garden / outdoor",
  safe: "Safe or heavy item",
};

export const REQUESTABLE_SERVICES: ServiceKind[] = [
  "loading",
  "moving",
  "unloading",
  "packing",
  "unpacking",
  "assembly",
  "disassembly",
];

export const ACCESS_LABELS: Record<AccessOption, string> = {
  stairs: "Stairs",
  elevator: "Elevator",
  parking_restricted: "Parking restrictions",
  long_carry: "Long carry",
  narrow_access: "Narrow access",
};

export const TIME_WINDOWS = [
  { value: "morning", label: "Morning", hint: "08:00 – 12:00" },
  { value: "afternoon", label: "Afternoon", hint: "12:00 – 17:00" },
  { value: "evening", label: "Evening", hint: "17:00 – 21:00" },
  { value: "flexible", label: "Flexible", hint: "Any time that day" },
] as const;

export type TimeWindowOption = (typeof TIME_WINDOWS)[number]["value"];

export interface MoveRequestDraft {
  pickup: string;
  destination: string;
  date: string;
  time: string;
  moveType?: MoveTypeOption;
  size?: MoveSizeOption;
  items: ItemOption[];
  services: ServiceKind[];
  pickupAccess: AccessOption[];
  destinationAccess: AccessOption[];
  notes: string;
  completedAt?: string;
}

export const EMPTY_DRAFT: MoveRequestDraft = {
  pickup: "",
  destination: "",
  date: "",
  time: "",
  items: [],
  services: ["loading", "moving", "unloading"],
  pickupAccess: [],
  destinationAccess: [],
  notes: "",
};

const STORAGE_KEY = "movegrid.move-request.v1";

let draft: MoveRequestDraft = EMPTY_DRAFT;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) draft = { ...EMPTY_DRAFT, ...(JSON.parse(raw) as Partial<MoveRequestDraft>) };
  } catch {
    /* corrupted draft is simply ignored */
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* storage may be unavailable; the draft still lives in memory */
  }
}

export function updateMoveDraft(patch: Partial<MoveRequestDraft>) {
  hydrate();
  draft = { ...draft, ...patch };
  persist();
  emit();
}

export function resetMoveDraft() {
  draft = EMPTY_DRAFT;
  persist();
  emit();
}

export function getMoveDraft(): MoveRequestDraft {
  hydrate();
  return draft;
}

export function useMoveDraft(): MoveRequestDraft {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getMoveDraft,
    () => EMPTY_DRAFT,
  );
}

/** Maps the draft onto the domain contract used by jobs. */
export function toMoveRequirements(d: MoveRequestDraft): MoveRequirements {
  const access = (list: AccessOption[]): AccessDetails => ({
    stairs: list.includes("stairs"),
    hasElevator: list.includes("elevator"),
    parkingRestricted: list.includes("parking_restricted"),
    narrowAccess: list.includes("narrow_access"),
    ...(list.includes("long_carry") ? { longCarryMeters: 30 } : {}),
  });
  return {
    ...(d.moveType ? { moveType: d.moveType === "house" ? "home" : d.moveType } : {}),
    ...(d.size ? { size: d.size === "large_house" || d.size === "office" ? "house" : d.size } : {}),
    inventory: {
      furniture: d.items.includes("furniture"),
      appliances: d.items.includes("appliances"),
      specialItems: d.items.filter((i) => ["piano", "artwork", "safe"].includes(i)),
    },
    services: d.services,
    pickupAccess: access(d.pickupAccess),
    destinationAccess: access(d.destinationAccess),
    notes: d.notes,
  };
}

export function draftSummaryChips(d: MoveRequestDraft): string[] {
  const chips: string[] = [];
  if (d.moveType) chips.push(MOVE_TYPE_LABELS[d.moveType]);
  if (d.size) chips.push(MOVE_SIZE_LABELS[d.size]);
  if (d.time) {
    const w = TIME_WINDOWS.find((t) => t.value === d.time);
    if (w) chips.push(w.label);
  }
  if (d.services.length) chips.push(`${d.services.length} services`);
  return chips;
}

/* ------------------------------------------------------ submitted requests */

/**
 * A request sent to a provider. It is NOT a booking: nothing is scheduled and
 * no vehicle or crew is reserved until the provider responds with a quote.
 */
export interface SubmittedMoveRequest {
  id: string;
  reference: string;
  providerSlug: string;
  providerName: string;
  status: "requested";
  submittedAt: string;
  draft: MoveRequestDraft;
}

const REQUESTS_KEY = "movegrid.move-requests.v1";
let requests: SubmittedMoveRequest[] = [];
let requestsHydrated = false;
const EMPTY_REQUESTS: SubmittedMoveRequest[] = [];

function getRequests(): SubmittedMoveRequest[] {
  if (!requestsHydrated && typeof window !== "undefined") {
    requestsHydrated = true;
    try {
      const raw = window.localStorage.getItem(REQUESTS_KEY);
      if (raw) requests = JSON.parse(raw) as SubmittedMoveRequest[];
    } catch {
      /* ignore */
    }
  }
  return requests;
}

export function submitMoveRequest(providerSlug: string, providerName: string): SubmittedMoveRequest {
  const req: SubmittedMoveRequest = {
    id: `req_${Date.now().toString(36)}`,
    reference: `MG-${Math.floor(100000 + Math.random() * 900000)}`,
    providerSlug,
    providerName,
    status: "requested",
    submittedAt: new Date().toISOString(),
    draft: getMoveDraft(),
  };
  requests = [req, ...getRequests()];
  try {
    window.localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  } catch {
    /* ignore */
  }
  emit();
  return req;
}

export function useMoveRequests(): SubmittedMoveRequest[] {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getRequests,
    () => EMPTY_REQUESTS,
  );
}

export function timeWindowLabel(value: string): string | undefined {
  const w = TIME_WINDOWS.find((t) => t.value === value);
  return w ? `${w.label} · ${w.hint}` : undefined;
}
