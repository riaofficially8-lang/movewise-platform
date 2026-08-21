import type { AccountContext } from "./types";

/**
 * Authorization foundation.
 *
 * These predicates express the intended rules so the UI never invents its own.
 * They are a convenience layer ONLY: the same rules must be enforced again in
 * the data layer (row-level security / server-side checks) once a backend
 * exists. Hiding a button is not access control.
 */

export type Action =
  | "customer.job.read"
  | "customer.job.write"
  | "provider.profile.write"
  | "provider.resources.write"
  | "provider.job.read"
  | "provider.job.write"
  | "job.tracking.read"
  | "admin.any";

export interface Subject {
  context: AccountContext | null;
  accountId?: string;
}

export interface ResourceRef {
  ownerAccountId?: string;
  providerId?: string;
  /** Set when a customer is authorized to follow a specific job live. */
  authorizedJobIds?: string[];
  jobId?: string;
}

export function can(subject: Subject, action: Action, resource: ResourceRef = {}): boolean {
  const ctx = subject.context;
  if (!ctx) return false;
  if (ctx.role === "admin") return true;

  switch (action) {
    case "customer.job.read":
    case "customer.job.write":
      return ctx.role === "customer" && resource.ownerAccountId === subject.accountId;

    case "provider.profile.write":
    case "provider.resources.write":
    case "provider.job.read":
    case "provider.job.write":
      return ctx.role === "provider" && Boolean(ctx.providerId) && ctx.providerId === resource.providerId;

    case "job.tracking.read":
      return Boolean(resource.jobId && resource.authorizedJobIds?.includes(resource.jobId));

    case "admin.any":
      return false;

    default:
      return false;
  }
}
