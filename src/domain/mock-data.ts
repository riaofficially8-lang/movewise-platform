import type {
  Crew,
  Provider,
  Review,
  ServiceKind,
  Vehicle,
  ResourceAssignment,
} from "./types";

/**
 * Mock repository content. Shapes mirror the future backend exactly, so the
 * data source can be swapped without touching presentation code.
 */

const day = "2026-09-12";
const win = (from: string, to: string) => ({ start: `${day}T${from}:00Z`, end: `${day}T${to}:00Z` });

function assignment(
  i: number,
  providerId: string,
  resourceKind: "vehicle" | "crew",
  resourceId: string,
  window: { start: string; end: string },
): ResourceAssignment {
  return {
    id: `asg_${providerId}_${resourceKind}_${i}`,
    providerId,
    resourceKind,
    resourceId,
    jobId: `job_10${i}`,
    window,
    status: "confirmed",
  };
}

export interface ProviderBundle {
  provider: Provider;
  vehicles: Vehicle[];
  crews: Crew[];
  reviews: Review[];
}

function bundle(input: {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  city: string;
  lat: number;
  lng: number;
  radiusKm: number;
  verified: boolean;
  hue: number;
  priceBand: 1 | 2 | 3;
  services: ServiceKind[];
  rating: number;
  reviewCount: number;
  completedMoves: number;
  onTimeRate: number;
  responseMinutes: number;
  vehicles: { label: string; type: Vehicle["type"]; m3: number; kg: number; busy?: [string, string] }[];
  crews: { name: string; size: number; skills: ServiceKind[]; busy?: [string, string] }[];
  reviews: { author: string; rating: number; title: string; body: string; date: string }[];
}): ProviderBundle {
  const vehicles: Vehicle[] = input.vehicles.map((v, i) => {
    const schedule = v.busy ? [assignment(i, input.id, "vehicle", `${input.id}_veh_${i}`, win(v.busy[0], v.busy[1]))] : [];
    return {
      id: `${input.id}_veh_${i}`,
      providerId: input.id,
      label: v.label,
      type: v.type,
      capacityM3: v.m3,
      maxLoadKg: v.kg,
      features: v.type === "van" ? ["Tail lift", "City access"] : ["Tail lift", "Straps & blankets"],
      schedule,
      state: schedule.length ? "busy" : "available",
    };
  });

  const crews: Crew[] = input.crews.map((c, i) => {
    const schedule = c.busy ? [assignment(i, input.id, "crew", `${input.id}_crew_${i}`, win(c.busy[0], c.busy[1]))] : [];
    return {
      id: `${input.id}_crew_${i}`,
      providerId: input.id,
      name: c.name,
      skills: c.skills,
      members: Array.from({ length: c.size }, (_, m) => ({
        id: `${input.id}_crew_${i}_m${m}`,
        crewId: `${input.id}_crew_${i}`,
        fullName: `${c.name} member ${m + 1}`,
        role: m === 0 ? ("lead" as const) : m === 1 ? ("driver" as const) : ("mover" as const),
      })),
      schedule,
      state: schedule.length ? "busy" : "available",
    };
  });

  const moversTotal = crews.reduce((n, c) => n + c.members.length, 0);
  const moversAvailable = crews
    .filter((c) => c.state === "available")
    .reduce((n, c) => n + c.members.length, 0);

  const provider: Provider = {
    id: input.id,
    slug: input.slug,
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    verified: input.verified,
    yearFounded: 2012 + (input.hue % 8),
    baseCity: input.city,
    serviceArea: {
      id: `${input.id}_area`,
      providerId: input.id,
      center: { lat: input.lat, lng: input.lng },
      radiusKm: input.radiusKm,
      label: `${input.city} & surroundings`,
    },
    serviceKinds: input.services,
    performance: {
      rating: input.rating,
      reviewCount: input.reviewCount,
      completedMoves: input.completedMoves,
      onTimeRate: input.onTimeRate,
      completionRate: 0.98,
      cancellationRate: 0.02,
      medianResponseMinutes: input.responseMinutes,
      repeatCustomerRate: 0.24,
    },
    availability: {
      vehiclesTotal: vehicles.length,
      vehiclesAvailable: vehicles.filter((v) => v.state === "available").length,
      moversTotal,
      moversAvailable,
    },
    priceBand: input.priceBand,
    brandHue: input.hue,
  };

  const reviews: Review[] = input.reviews.map((r, i) => ({
    id: `${input.id}_rev_${i}`,
    jobId: `job_arch_${i}`,
    providerId: input.id,
    customerId: `cus_${i}`,
    authorName: r.author,
    rating: r.rating,
    title: r.title,
    body: r.body,
    createdAt: r.date,
    verified: true,
  }));

  return { provider, vehicles, crews, reviews };
}

export const PROVIDER_BUNDLES: ProviderBundle[] = [
  bundle({
    id: "prv_abc",
    slug: "abc-movers",
    name: "ABC Movers",
    tagline: "Full-service household moving, done calmly.",
    description:
      "A family-run moving company operating since 2014. We handle apartment and house moves end to end — packing, careful transport, assembly and a tidy hand-over. Every crew lead has at least five years on the road.",
    city: "Amsterdam",
    lat: 52.372,
    lng: 4.894,
    radiusKm: 32,
    verified: true,
    hue: 195,
    priceBand: 2,
    services: ["moving", "packing", "assembly", "loading", "unloading"],
    rating: 4.9,
    reviewCount: 412,
    completedMoves: 1284,
    onTimeRate: 0.97,
    responseMinutes: 12,
    vehicles: [
      { label: "Truck 01", type: "large_truck", m3: 42, kg: 6800 },
      { label: "Truck 02", type: "box_truck", m3: 28, kg: 3500, busy: ["10:00", "13:00"] },
      { label: "Truck 03", type: "box_truck", m3: 28, kg: 3500 },
      { label: "Van 04", type: "van", m3: 14, kg: 1400 },
      { label: "Van 05", type: "van", m3: 12, kg: 1200 },
      { label: "Trailer 06", type: "trailer", m3: 18, kg: 2200 },
    ],
    crews: [
      { name: "Crew A", size: 3, skills: ["moving", "loading", "unloading"], busy: ["10:00", "15:00"] },
      { name: "Crew B", size: 2, skills: ["moving", "packing"] },
      { name: "Crew C", size: 3, skills: ["assembly", "disassembly"] },
      { name: "Crew D", size: 2, skills: ["moving", "loading"] },
    ],
    reviews: [
      {
        author: "Marieke V.",
        rating: 5,
        title: "Calmest move we've ever had",
        body: "Three-bedroom apartment, third floor, no elevator. The crew arrived early, wrapped everything and were done before lunch. Nothing damaged, nothing rushed.",
        date: "2026-07-18",
      },
      {
        author: "Daniel R.",
        rating: 5,
        title: "Great with fragile items",
        body: "They packed a piano and a lot of glassware. Clear communication the whole way and the quote matched the invoice exactly.",
        date: "2026-06-30",
      },
      {
        author: "Priya S.",
        rating: 4,
        title: "Solid, slight delay",
        body: "Arrived about 25 minutes late because of traffic but let us know in advance. Work itself was excellent.",
        date: "2026-06-02",
      },
    ],
  }),
  bundle({
    id: "prv_north",
    slug: "northline-relocations",
    name: "Northline Relocations",
    tagline: "Office and business relocation specialists.",
    description:
      "We move companies. Weekend and night moves, IT equipment handling, structured labelling and a single coordinator per project so your team is back online Monday morning.",
    city: "Haarlem",
    lat: 52.381,
    lng: 4.637,
    radiusKm: 40,
    verified: true,
    hue: 245,
    priceBand: 3,
    services: ["moving", "packing", "unpacking", "disassembly", "assembly", "storage"],
    rating: 4.8,
    reviewCount: 268,
    completedMoves: 942,
    onTimeRate: 0.95,
    responseMinutes: 22,
    vehicles: [
      { label: "Truck 01", type: "large_truck", m3: 48, kg: 7500 },
      { label: "Truck 02", type: "large_truck", m3: 48, kg: 7500, busy: ["08:00", "17:00"] },
      { label: "Box 03", type: "box_truck", m3: 26, kg: 3300 },
      { label: "Van 04", type: "van", m3: 13, kg: 1300, busy: ["09:00", "12:00"] },
    ],
    crews: [
      { name: "Project crew 1", size: 4, skills: ["moving", "disassembly"], busy: ["08:00", "17:00"] },
      { name: "Project crew 2", size: 4, skills: ["moving", "assembly"] },
      { name: "IT team", size: 2, skills: ["packing", "unpacking"] },
    ],
    reviews: [
      {
        author: "Office manager, Kade B.V.",
        rating: 5,
        title: "40 desks over a weekend",
        body: "Everything labelled per team, all screens reconnected. We opened Monday like nothing happened.",
        date: "2026-05-21",
      },
      {
        author: "Tom K.",
        rating: 4,
        title: "Professional but premium priced",
        body: "You pay for the coordination — and it was worth it for us.",
        date: "2026-04-11",
      },
    ],
  }),
  bundle({
    id: "prv_kite",
    slug: "kite-co-movers",
    name: "Kite & Co. Movers",
    tagline: "Small moves, studios and single items.",
    description:
      "A compact two-van outfit for studios, student moves and single heavy items. Fast to respond, transparent hourly rates, no minimum-day charges.",
    city: "Utrecht",
    lat: 52.09,
    lng: 5.121,
    radiusKm: 25,
    verified: false,
    hue: 55,
    priceBand: 1,
    services: ["moving", "loading", "unloading", "assembly"],
    rating: 4.6,
    reviewCount: 96,
    completedMoves: 318,
    onTimeRate: 0.91,
    responseMinutes: 8,
    vehicles: [
      { label: "Van 01", type: "van", m3: 14, kg: 1400 },
      { label: "Van 02", type: "van", m3: 12, kg: 1200, busy: ["11:00", "14:00"] },
    ],
    crews: [
      { name: "Crew A", size: 2, skills: ["moving", "loading"] },
      { name: "Crew B", size: 2, skills: ["moving", "assembly"], busy: ["11:00", "16:00"] },
    ],
    reviews: [
      {
        author: "Sanne D.",
        rating: 5,
        title: "Perfect for a studio",
        body: "Booked in the morning, moved in the afternoon. Friendly and quick.",
        date: "2026-07-02",
      },
    ],
  }),
  bundle({
    id: "prv_harbor",
    slug: "harbor-freight-movers",
    name: "Harbor & Sons",
    tagline: "Heavy items, long distance, storage.",
    description:
      "Long-distance household transport and short-term storage. Specialised in heavy and awkward items: safes, pianos, workshop machinery.",
    city: "Rotterdam",
    lat: 51.924,
    lng: 4.478,
    radiusKm: 55,
    verified: true,
    hue: 155,
    priceBand: 2,
    services: ["moving", "storage", "loading", "unloading", "disassembly"],
    rating: 4.7,
    reviewCount: 187,
    completedMoves: 764,
    onTimeRate: 0.93,
    responseMinutes: 31,
    vehicles: [
      { label: "Truck 01", type: "large_truck", m3: 52, kg: 9000 },
      { label: "Truck 02", type: "large_truck", m3: 52, kg: 9000 },
      { label: "Box 03", type: "box_truck", m3: 30, kg: 3600, busy: ["07:00", "19:00"] },
      { label: "Trailer 04", type: "trailer", m3: 22, kg: 2600 },
      { label: "Van 05", type: "van", m3: 13, kg: 1300 },
    ],
    crews: [
      { name: "Heavy crew", size: 4, skills: ["moving", "disassembly"] },
      { name: "Crew B", size: 3, skills: ["moving", "loading"], busy: ["07:00", "19:00"] },
      { name: "Crew C", size: 3, skills: ["moving", "unloading"] },
    ],
    reviews: [
      {
        author: "Erik L.",
        rating: 5,
        title: "Moved a 400kg safe",
        body: "They planned the access route in advance and it took less time than estimated.",
        date: "2026-06-14",
      },
      {
        author: "Nina H.",
        rating: 4,
        title: "Good long-distance move",
        body: "Two-city move with one night of storage in between. Well handled.",
        date: "2026-03-08",
      },
    ],
  }),
  bundle({
    id: "prv_pack",
    slug: "packwise",
    name: "Packwise Movers",
    tagline: "Packing-first moving for busy households.",
    description:
      "We pack, move and unpack. If you would rather come home to a finished apartment than a wall of boxes, this is the service for that.",
    city: "Amstelveen",
    lat: 52.302,
    lng: 4.856,
    radiusKm: 28,
    verified: true,
    hue: 75,
    priceBand: 3,
    services: ["moving", "packing", "unpacking", "assembly", "cleaning"],
    rating: 4.8,
    reviewCount: 143,
    completedMoves: 511,
    onTimeRate: 0.96,
    responseMinutes: 17,
    vehicles: [
      { label: "Box 01", type: "box_truck", m3: 30, kg: 3600 },
      { label: "Box 02", type: "box_truck", m3: 28, kg: 3400, busy: ["12:00", "16:00"] },
      { label: "Van 03", type: "van", m3: 14, kg: 1400 },
    ],
    crews: [
      { name: "Pack team", size: 3, skills: ["packing", "unpacking"] },
      { name: "Move team", size: 3, skills: ["moving", "loading"], busy: ["12:00", "18:00"] },
      { name: "Finish team", size: 2, skills: ["assembly", "cleaning"] },
    ],
    reviews: [
      {
        author: "Laura M.",
        rating: 5,
        title: "Unpacked by dinner",
        body: "The kitchen was fully set up when we arrived. Worth every euro.",
        date: "2026-07-25",
      },
    ],
  }),
  bundle({
    id: "prv_swift",
    slug: "swiftbox",
    name: "SwiftBox Moving",
    tagline: "Same-week apartment moves across the region.",
    description:
      "Straightforward apartment moving with fast scheduling. Fixed price per move size, confirmed within the hour during business days.",
    city: "Almere",
    lat: 52.371,
    lng: 5.216,
    radiusKm: 45,
    verified: false,
    hue: 25,
    priceBand: 1,
    services: ["moving", "loading", "unloading"],
    rating: 4.4,
    reviewCount: 74,
    completedMoves: 289,
    onTimeRate: 0.88,
    responseMinutes: 41,
    vehicles: [
      { label: "Box 01", type: "box_truck", m3: 26, kg: 3300, busy: ["09:00", "18:00"] },
      { label: "Van 02", type: "van", m3: 13, kg: 1300 },
      { label: "Van 03", type: "van", m3: 13, kg: 1300, busy: ["09:00", "13:00"] },
    ],
    crews: [
      { name: "Crew A", size: 2, skills: ["moving"], busy: ["09:00", "18:00"] },
      { name: "Crew B", size: 2, skills: ["moving"], busy: ["09:00", "14:00"] },
      { name: "Crew C", size: 2, skills: ["loading", "unloading"] },
    ],
    reviews: [
      {
        author: "Joost P.",
        rating: 4,
        title: "Quick and cheap",
        body: "Nothing fancy, but they showed up and got it done in three hours.",
        date: "2026-05-05",
      },
    ],
  }),
];

export const SERVICE_LABELS: Record<ServiceKind, string> = {
  moving: "Moving",
  packing: "Packing",
  unpacking: "Unpacking",
  loading: "Loading",
  unloading: "Unloading",
  assembly: "Assembly",
  disassembly: "Disassembly",
  storage: "Storage",
  cleaning: "Cleaning",
};
