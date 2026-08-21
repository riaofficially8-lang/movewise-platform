import { cn } from "@/lib/utils";

/**
 * House visual language: simple, geometric, friendly line + flat-fill scenes
 * built from moving primitives (trucks, boxes, houses, routes, pins).
 * Colors come from design tokens only.
 */

type Props = { className?: string };

export function TruckWaitingIllustration({ className }: Props) {
  return (
    <svg viewBox="0 0 200 130" aria-hidden="true" className={cn("w-40", className)}>
      <ellipse cx="100" cy="116" rx="66" ry="7" className="fill-muted" />
      <rect x="24" y="52" width="84" height="46" rx="8" className="fill-primary" />
      <path
        d="M108 66h30l20 22v10h-50V66Z"
        className="fill-primary-soft stroke-primary"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="116" y="72" width="20" height="13" rx="3" className="fill-card" />
      <rect x="36" y="62" width="26" height="18" rx="4" className="fill-primary-foreground" opacity="0.35" />
      <circle cx="52" cy="100" r="11" className="fill-foreground" />
      <circle cx="52" cy="100" r="4" className="fill-card" />
      <circle cx="138" cy="100" r="11" className="fill-foreground" />
      <circle cx="138" cy="100" r="4" className="fill-card" />
      <rect x="150" y="82" width="22" height="16" rx="3" className="fill-accent" />
      <path d="M150 90h22" className="stroke-accent-foreground" strokeWidth="2" opacity="0.5" />
      <path d="M30 40c6-8 16-8 22 0" className="stroke-border-strong" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function BoxesIllustration({ className }: Props) {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true" className={cn("w-36", className)}>
      <ellipse cx="80" cy="108" rx="54" ry="6" className="fill-muted" />
      <rect x="26" y="60" width="46" height="42" rx="6" className="fill-accent-soft stroke-accent" strokeWidth="3" />
      <path d="M49 60v42" className="stroke-accent" strokeWidth="3" />
      <rect x="80" y="44" width="52" height="58" rx="6" className="fill-primary-soft stroke-primary" strokeWidth="3" />
      <path d="M106 44v58M80 66h52" className="stroke-primary" strokeWidth="3" />
      <rect x="52" y="26" width="38" height="30" rx="6" className="fill-card stroke-border-strong" strokeWidth="3" />
      <path d="M71 26v30" className="stroke-border-strong" strokeWidth="3" />
    </svg>
  );
}

export function RouteIllustration({ className }: Props) {
  return (
    <svg viewBox="0 0 200 120" aria-hidden="true" className={cn("w-44", className)}>
      <path
        d="M26 92c34 0 26-58 62-58s34 58 84 44"
        className="stroke-border-strong"
        strokeWidth="3"
        strokeDasharray="7 8"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M18 92h16" className="stroke-primary" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M26 40c8 0 14 6 14 14 0 10-14 22-14 22s-14-12-14-22c0-8 6-14 14-14Z"
        className="fill-primary"
        transform="translate(0 24) scale(0.9)"
      />
      <path
        d="M172 30c9 0 16 7 16 16 0 12-16 26-16 26s-16-14-16-26c0-9 7-16 16-16Z"
        className="fill-accent"
        transform="translate(0 8) scale(0.9)"
      />
      <rect x="86" y="34" width="34" height="24" rx="5" className="fill-card stroke-border-strong" strokeWidth="3" />
      <path d="M103 34v24" className="stroke-border-strong" strokeWidth="3" />
    </svg>
  );
}

export function HouseIllustration({ className }: Props) {
  return (
    <svg viewBox="0 0 160 130" aria-hidden="true" className={cn("w-36", className)}>
      <ellipse cx="80" cy="116" rx="56" ry="6" className="fill-muted" />
      <path d="M80 24 138 66H22L80 24Z" className="fill-primary" />
      <rect x="36" y="66" width="88" height="48" rx="6" className="fill-primary-soft stroke-primary" strokeWidth="3" />
      <rect x="68" y="82" width="24" height="32" rx="4" className="fill-card stroke-primary" strokeWidth="3" />
      <rect x="46" y="80" width="14" height="14" rx="3" className="fill-card" />
      <rect x="100" y="80" width="14" height="14" rx="3" className="fill-card" />
      <rect x="102" y="30" width="12" height="20" rx="3" className="fill-accent" />
    </svg>
  );
}
