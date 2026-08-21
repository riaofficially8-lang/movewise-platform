import type {
  Crew,
  ResourceAssignment,
  ResourceAvailabilitySummary,
  ResourceState,
  TimeWindow,
  Vehicle,
} from "./types";

/**
 * Availability is DERIVED from resource assignments over a time window.
 * Vehicles and crews are evaluated independently — a busy vehicle never
 * implies a busy crew and vice versa.
 */

export function overlaps(a: TimeWindow, b: TimeWindow): boolean {
  return new Date(a.start) < new Date(b.end) && new Date(b.start) < new Date(a.end);
}

export function deriveResourceState(
  schedule: ResourceAssignment[],
  window?: TimeWindow,
): ResourceState {
  const active = schedule.filter((a) => a.status !== "cancelled" && a.status !== "released");
  if (!window) return active.length === 0 ? "available" : active.length > 1 ? "busy" : "limited";
  const conflicting = active.filter((a) => overlaps(a.window, window));
  if (conflicting.length === 0) return "available";
  return conflicting.length === 1 ? "limited" : "busy";
}

export function summarizeAvailability(
  vehicles: Vehicle[],
  crews: Crew[],
  window?: TimeWindow,
): ResourceAvailabilitySummary {
  const vehiclesAvailable = vehicles.filter(
    (v) => deriveResourceState(v.schedule, window) === "available",
  ).length;
  const availableCrews = crews.filter((c) => deriveResourceState(c.schedule, window) === "available");
  return {
    vehiclesTotal: vehicles.length,
    vehiclesAvailable,
    moversTotal: crews.reduce((n, c) => n + c.members.length, 0),
    moversAvailable: availableCrews.reduce((n, c) => n + c.members.length, 0),
    window,
  };
}

export function availabilityTone(available: number, total: number): ResourceState {
  if (total === 0) return "offline";
  const ratio = available / total;
  if (ratio >= 0.5) return "available";
  if (ratio > 0) return "limited";
  return "busy";
}
