import { Star } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { ResourceState } from "@/domain/types";

/* ------------------------------------------------------------ status badge */

const TONE_CLASSES = {
  available: "bg-success-soft text-success",
  limited: "bg-warning-soft text-warning-foreground",
  busy: "bg-destructive/10 text-destructive",
  offline: "bg-muted text-muted-foreground",
  neutral: "bg-muted text-muted-foreground",
  info: "bg-info-soft text-info",
  brand: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent-foreground",
} as const;

export type BadgeTone = keyof typeof TONE_CLASSES;

export function StatusBadge({
  tone = "neutral",
  children,
  dot = false,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-semibold leading-none",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function resourceStateTone(state: ResourceState): BadgeTone {
  return state === "available" ? "available" : state === "limited" ? "limited" : state === "busy" ? "busy" : "offline";
}

export function resourceStateLabel(state: ResourceState): string {
  return state === "available"
    ? "Available"
    : state === "limited"
      ? "Limited"
      : state === "busy"
        ? "Busy"
        : "Offline";
}

/* ----------------------------------------------------------------- ratings */

export function Rating({
  value,
  count,
  size = "sm",
  className,
}: {
  value: number;
  count?: number;
  size?: "sm" | "lg";
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <Star
        className={cn("fill-accent text-accent", size === "lg" ? "size-[1.1rem]" : "size-[0.95rem]")}
        aria-hidden="true"
      />
      <span
        className={cn(
          "font-semibold tabular-nums text-foreground",
          size === "lg" ? "text-base" : "text-sm",
        )}
      >
        {value.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-caption text-muted-foreground">({count.toLocaleString()})</span>
      )}
    </span>
  );
}

/* -------------------------------------------------------------------- stat */

export function Stat({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl bg-surface px-4 py-3.5", className)}>
      <p className="text-caption font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-[1.25rem] font-bold leading-none tracking-[-0.02em] tabular-nums text-foreground">
        {value}
      </p>
      {hint && <p className="mt-1.5 text-[0.75rem] text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* --------------------------------------------------------- section heading */

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="max-w-2xl">
        {eyebrow && <p className="text-label mb-2.5 text-primary">{eyebrow}</p>}
        <h2 className="text-h2 text-foreground">{title}</h2>
        {description && (
          <p className="mt-3 text-body-lg text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ---------------------------------------------------------- provider glyph */

export function ProviderGlyph({
  name,
  hue,
  className,
}: {
  name: string;
  hue: number;
  className?: string;
}) {
  const initials = name
    .replace(/[^\p{L}\s]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <span
      className={cn(
        "flex size-14 shrink-0 items-center justify-center rounded-2xl font-display text-base font-bold",
        className,
      )}
      style={{
        backgroundColor: `oklch(0.94 0.04 ${hue})`,
        color: `oklch(0.42 0.09 ${hue})`,
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
