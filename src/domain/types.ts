/**
 * MoveGrid domain model.
 *
 * These types are the contract between the presentation layer and whatever
 * data source backs it (currently an in-memory mock repository, later a real
 * backend). Presentation components must depend on these types only.
 *
 * Core architectural rules encoded here:
 *  - Vehicles and Crews are INDEPENDENT resources with independent schedules.
 *  - A Job may span multiple Trips, Tasks, Vehicles and Crews.
 *  - Availability is DERIVED from resource assignments over time windows,
 *    never from a manual "occupied" toggle.
 *  - Job progress is expressed as timestamped Job Events (auditable timeline).
 */

/* ----------------------------------------------------------------- identity */

export type AccountRole = "customer" | "provider" | "admin";

/** A human login. One Account can own several contexts (personal + business). */
export interface Account {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  roles: AccountRole[];
  contexts: AccountContext[];
  activeContextId: string;
}

/** The "hat" a person is currently wearing. */
export interface AccountContext {
  id: string;
  kind: "personal" | "business" | "admin";
  label: string;
  role: AccountRole;
  /** Set for business contexts. */
  providerId?: string;
}

export interface CustomerProfile {
  id: string;
  accountId: string;
  fullName: string;
  phone?: string;
  defaultLocationId?: string;
}

/* ----------------------------------------------------------------- location */

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Location {
  id: string;
  label: string;
  addressLine: string;
  city: string;
  postalCode?: string;
  country: string;
  point: GeoPoint;
  access?: AccessDetails;
}

export interface AccessDetails {
  floor?: number;
  hasElevator?: boolean;
  stairs?: boolean;
  longCarryMeters?: number;
  parkingRestricted?: boolean;
  narrowAccess?: boolean;
  notes?: string;
}

/** Public discovery geometry. Never a precise live provider position. */
export interface ServiceArea {
  id: string;
  providerId: string;
  center: GeoPoint;
  radiusKm: number;
  label: string;
}

/* ----------------------------------------------------------------- provider */

export type ServiceKind =
  | "moving"
  | "packing"
  | "unpacking"
  | "loading"
  | "unloading"
  | "assembly"
  | "disassembly"
  | "storage"
  | "cleaning";

export interface Service {
  id: string;
  providerId: string;
  kind: ServiceKind;
  name: string;
  description?: string;
}

export interface Provider {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  verified: boolean;
  yearFounded?: number;
  baseCity: string;
  serviceArea: ServiceArea;
  serviceKinds: ServiceKind[];
  /** Derived from real platform events once the backend exists. */
  performance: ProviderPerformance;
  /** Derived from resource assignments for the requested window. */
  availability: ResourceAvailabilitySummary;
  priceBand: 1 | 2 | 3;
  brandHue: number;
}

export interface ProviderPerformance {
  rating: number;
  reviewCount: number;
  completedMoves: number;
  onTimeRate: number;
  completionRate: number;
  cancellationRate: number;
  medianResponseMinutes: number;
  repeatCustomerRate: number;
  /** Nullable while a metric has too little real activity to be trustworthy. */
  customerSatisfaction?: number;
}

export interface ResourceAvailabilitySummary {
  vehiclesTotal: number;
  vehiclesAvailable: number;
  moversTotal: number;
  moversAvailable: number;
  /** Set only when a concrete requested window was evaluated. */
  window?: TimeWindow;
}

/* ---------------------------------------------------------------- resources */

export type ResourceKind = "vehicle" | "crew";

/** Derived state for a given time window — not a manual switch. */
export type ResourceState = "available" | "limited" | "busy" | "offline";

export interface TimeWindow {
  start: string;
  end: string;
}

export interface Vehicle {
  id: string;
  providerId: string;
  label: string;
  type: "van" | "box_truck" | "large_truck" | "trailer";
  capacityM3: number;
  maxLoadKg: number;
  features: string[];
  /** Independent of any crew schedule. */
  schedule: ResourceAssignment[];
  state: ResourceState;
}

export interface CrewMember {
  id: string;
  crewId: string;
  fullName: string;
  role: "lead" | "mover" | "driver" | "specialist";
}

export interface Crew {
  id: string;
  providerId: string;
  name: string;
  members: CrewMember[];
  skills: ServiceKind[];
  /** Independent of any vehicle schedule. */
  schedule: ResourceAssignment[];
  state: ResourceState;
}

/** Links a resource to a job/trip/task for a specific window. */
export interface ResourceAssignment {
  id: string;
  providerId: string;
  resourceKind: ResourceKind;
  resourceId: string;
  jobId: string;
  tripId?: string;
  taskId?: string;
  window: TimeWindow;
  status: "planned" | "confirmed" | "active" | "released" | "cancelled";
}

/* --------------------------------------------------------------------- jobs */

export type JobStatus =
  | "draft"
  | "requested"
  | "matching"
  | "quoted"
  | "accepted"
  | "booked"
  | "scheduled"
  | "resources_assigned"
  | "crew_en_route"
  | "arrived"
  | "loading"
  | "in_transit"
  | "at_destination"
  | "unloading"
  | "completed"
  | "cancelled"
  | "declined"
  | "expired"
  | "disputed"
  | "failed";

export const JOB_LIFECYCLE: JobStatus[] = [
  "draft",
  "requested",
  "matching",
  "quoted",
  "accepted",
  "booked",
  "scheduled",
  "resources_assigned",
  "crew_en_route",
  "arrived",
  "loading",
  "in_transit",
  "at_destination",
  "unloading",
  "completed",
];

export const JOB_TERMINAL_STATES: JobStatus[] = [
  "completed",
  "cancelled",
  "declined",
  "expired",
  "disputed",
  "failed",
];

export type MoveType = "home" | "apartment" | "office" | "business" | "other";
export type MoveSize = "studio" | "1_bed" | "2_bed" | "3_bed" | "4_plus" | "house";

export interface MoveRequirements {
  moveType?: MoveType;
  size?: MoveSize;
  inventory?: { furniture?: boolean; appliances?: boolean; boxes?: number; specialItems?: string[] };
  services?: ServiceKind[];
  pickupAccess?: AccessDetails;
  destinationAccess?: AccessDetails;
  notes?: string;
}

export interface Job {
  id: string;
  reference: string;
  customerId: string;
  providerId?: string;
  status: JobStatus;
  pickup: Location;
  destination: Location;
  requestedWindow: TimeWindow;
  requirements: MoveRequirements;
  trips: Trip[];
  tasks: Task[];
  assignments: ResourceAssignment[];
  events: JobEvent[];
  quoteIds: string[];
  bookingId?: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  jobId: string;
  sequence: number;
  from: Location;
  to: Location;
  plannedWindow: TimeWindow;
  vehicleIds: string[];
  crewIds: string[];
}

export interface Task {
  id: string;
  jobId: string;
  kind: ServiceKind;
  label: string;
  plannedWindow?: TimeWindow;
  crewIds: string[];
  status: "planned" | "active" | "done" | "skipped";
}

export type JobEventType =
  | "request_created"
  | "provider_notified"
  | "provider_responded"
  | "quote_submitted"
  | "quote_accepted"
  | "booking_confirmed"
  | "crew_assigned"
  | "vehicle_assigned"
  | "crew_departed"
  | "crew_arrived"
  | "loading_started"
  | "loading_completed"
  | "trip_started"
  | "destination_reached"
  | "unloading_started"
  | "unloading_completed"
  | "job_completed"
  | "job_cancelled";

/** Append-only audit record. Historical events are never edited in place. */
export interface JobEvent {
  id: string;
  jobId: string;
  type: JobEventType;
  occurredAt: string;
  actor: { kind: AccountRole | "system"; id?: string };
  metadata?: Record<string, string | number | boolean>;
}

/** Tracking is authorized per job, never exposed on the public map. */
export interface LocationUpdate {
  id: string;
  jobId: string;
  resourceKind: ResourceKind;
  resourceId: string;
  point: GeoPoint;
  recordedAt: string;
}

/* ------------------------------------------------------ commerce & feedback */

export interface Quote {
  id: string;
  jobId: string;
  providerId: string;
  currency: string;
  amountMinor: number;
  breakdown: { label: string; amountMinor: number }[];
  validUntil: string;
  status: "submitted" | "accepted" | "declined" | "expired";
}

export interface Booking {
  id: string;
  jobId: string;
  providerId: string;
  quoteId: string;
  confirmedAt: string;
}

export interface Review {
  id: string;
  jobId: string;
  providerId: string;
  customerId: string;
  authorName: string;
  rating: number;
  title?: string;
  body: string;
  createdAt: string;
  /** Only eligible completed jobs can produce a review. */
  verified: boolean;
}

export interface Payment {
  id: string;
  jobId: string;
  bookingId: string;
  currency: string;
  amountMinor: number;
  status: "pending" | "authorized" | "captured" | "refunded" | "failed";
}

export interface Message {
  id: string;
  threadId: string;
  jobId?: string;
  senderContextId: string;
  body: string;
  sentAt: string;
}

export interface Notification {
  id: string;
  accountId: string;
  kind: string;
  title: string;
  body: string;
  createdAt: string;
  readAt?: string;
}

/* ------------------------------------------------------------------ queries */

export interface ProviderSearchQuery {
  text?: string;
  pickup?: string;
  destination?: string;
  date?: string;
  services?: ServiceKind[];
  minRating?: number;
}
