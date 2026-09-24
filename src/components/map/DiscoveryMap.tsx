import { Minus, Plus, LocateFixed } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { availabilityTone } from "@/domain/availability";
import type { GeoPoint, Provider } from "@/domain/types";
import { cn } from "@/lib/utils";

/**
 * Discovery map foundation.
 *
 * Deliberately renders provider SERVICE AREAS, not precise live positions:
 * public users must never receive real-time provider locations. Live tracking
 * belongs to an authorized active job later on.
 *
 * The rendering surface is an SVG canvas today so the interaction model
 * (select → focus → open details without losing map context) can be built and
 * validated before a tiled map provider is wired in.
 */

const BOUNDS = { minLat: 51.82, maxLat: 52.52, minLng: 4.35, maxLng: 5.35 };
const VIEW = { w: 1000, h: 700 };

function project(point: GeoPoint) {
  const x = ((point.lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * VIEW.w;
  const y = ((BOUNDS.maxLat - point.lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * VIEW.h;
  return { x, y };
}

function kmToUnits(km: number) {
  const latSpanKm = (BOUNDS.maxLat - BOUNDS.minLat) * 111;
  return (km / latSpanKm) * VIEW.h;
}

const MARKER_TONE_STYLES = {
  available: { fill: "var(--color-success)", text: "var(--color-success-foreground)" },
  limited: { fill: "var(--color-warning)", text: "var(--color-warning-foreground)" },
  busy: { fill: "var(--color-destructive)", text: "var(--color-destructive-foreground)" },
  offline: { fill: "var(--color-muted-foreground)", text: "var(--color-background)" },
} as const;

export interface DiscoveryMapProps {
  providers: Provider[];
  selectedId?: string | undefined;
  onSelect?: (provider: Provider) => void;
  userLocation?: GeoPoint;
  className?: string;
}

export function DiscoveryMap({
  providers,
  selectedId,
  onSelect,
  userLocation = { lat: 52.33, lng: 4.9 },
  className,
}: DiscoveryMapProps) {
  const selected = providers.find((p) => p.id === selectedId);

  const [zoom, setZoom] = useState(1);
  const [recenter, setRecenter] = useState(false);
  useEffect(() => {
    setZoom(1);
    setRecenter(false);
  }, [selectedId]);

  /** Selecting a provider focuses the canvas on its service area. */
  const viewBox = useMemo(() => {
    const base = selected && !recenter ? 0.52 : 1;
    const f = Math.min(Math.max(base / zoom, 0.25), 1);
    const center = recenter
      ? project(userLocation)
      : selected
        ? project(selected.serviceArea.center)
        : { x: VIEW.w / 2, y: VIEW.h / 2 };
    const w = VIEW.w * f;
    const h = VIEW.h * f;
    const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
    return `${clamp(center.x - w / 2, 0, VIEW.w - w)} ${clamp(center.y - h / 2, 0, VIEW.h - h)} ${w} ${h}`;
  }, [selected, zoom, recenter, userLocation]);

  const user = project(userLocation);

  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-map-land", className)}>
      <svg
        viewBox={viewBox}
        role="img"
        aria-label="Map of moving providers and their service areas"
        preserveAspectRatio="xMidYMid slice"
        className="size-full transition-[view-box] duration-700 ease-[var(--ease-out-soft)]"
        style={{ transitionProperty: "all" }}
      >
        <rect x="0" y="0" width={VIEW.w} height={VIEW.h} className="fill-map-land" />

        {/* water + parks */}
        <path
          d="M-20 470 C 180 430, 300 540, 470 520 S 760 430, 1020 470 L1020 720 L-20 720Z"
          className="fill-map-water"
          opacity="0.65"
        />
        <ellipse cx="250" cy="180" rx="120" ry="70" className="fill-map-park" opacity="0.7" />
        <ellipse cx="760" cy="230" rx="90" ry="55" className="fill-map-park" opacity="0.6" />

        {/* block grid */}
        <g className="fill-map-block" opacity="0.75">
          {Array.from({ length: 9 }).map((_, r) =>
            Array.from({ length: 13 }).map((_, c) => (
              <rect
                key={`${r}-${c}`}
                x={c * 78 + 10}
                y={r * 78 + 8}
                width={62}
                height={60}
                rx={9}
                opacity={(r * 13 + c) % 5 === 0 ? 0.45 : 0.85}
              />
            )),
          )}
        </g>

        {/* arterial roads */}
        <g className="stroke-map-road" strokeLinecap="round" fill="none">
          <path d="M0 240 H1000" strokeWidth="10" />
          <path d="M0 520 H1000" strokeWidth="8" />
          <path d="M320 0 V700" strokeWidth="9" />
          <path d="M700 0 V700" strokeWidth="7" />
          <path d="M60 700 C 260 480, 520 420, 980 120" strokeWidth="8" />
        </g>

        {/* service areas */}
        {providers.map((p) => {
          const { x, y } = project(p.serviceArea.center);
          const r = kmToUnits(p.serviceArea.radiusKm);
          const isSelected = p.id === selectedId;
          return (
            <circle
              key={`${p.id}-area`}
              cx={x}
              cy={y}
              r={r}
              className={cn(
                "transition-opacity duration-500",
                isSelected ? "fill-primary/12 stroke-primary/45" : "fill-primary/5 stroke-primary/15",
              )}
              strokeWidth={isSelected ? 2.5 : 1.5}
              strokeDasharray="6 8"
            />
          );
        })}

        {/* user location */}
        <g>
          <circle cx={user.x} cy={user.y} r="22" className="fill-info/20 animate-pulse-ring" />
          <circle cx={user.x} cy={user.y} r="9" className="fill-info stroke-background" strokeWidth="3" />
        </g>

        {/* provider markers */}
        {providers.map((p) => {
          const { x, y } = project(p.serviceArea.center);
          const tone = availabilityTone(
            p.availability.vehiclesAvailable,
            p.availability.vehiclesTotal,
          );
          const style = MARKER_TONE_STYLES[tone];
          const isSelected = p.id === selectedId;
          const scale = isSelected ? 1.18 : 1;
          return (
            <g
              key={p.id}
              transform={`translate(${x} ${y}) scale(${scale})`}
              onClick={() => onSelect?.(p)}
              className="cursor-pointer transition-transform duration-500 ease-[var(--ease-out-soft)]"
              tabIndex={0}
              role="button"
              aria-label={`${p.name}, rated ${p.performance.rating}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect?.(p);
              }}
            >
              <ellipse cx="0" cy="6" rx="16" ry="5" fill="oklch(0.3 0.03 240 / 0.18)" />
              <path
                d="M0-44c11.6 0 21 9.4 21 21 0 6-3.4 11.9-8.2 17.2C8.2-.9 2.6 3.6 0 6c-2.6-2.4-8.2-6.9-12.8-11.8C-17.6-11.1-21-17-21-23c0-11.6 9.4-21 21-21Z"
                fill={style.fill}
                stroke="var(--color-background)"
                strokeWidth="3"
              />
              <g transform="translate(-11 -31)">
                <rect x="0" y="3" width="13" height="10" rx="2.5" fill={style.text} opacity="0.95" />
                <path d="M13 6h5l4 4v3h-9V6Z" fill={style.text} opacity="0.7" />
                <circle cx="5" cy="14.5" r="2.4" fill={style.text} />
                <circle cx="17" cy="14.5" r="2.4" fill={style.text} />
              </g>
              {isSelected && (
                <circle r="30" cy="-23" fill="none" stroke={style.fill} strokeWidth="2" opacity="0.35" />
              )}
            </g>
          );
        })}
      </svg>

      {/* map controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
        <div className="pointer-events-auto rounded-2xl border border-border bg-card/92 px-3.5 py-2.5 text-caption shadow-[var(--shadow-e2)] backdrop-blur">
          <p className="font-semibold text-foreground">Service-area discovery</p>
          <p className="text-muted-foreground">
            Live crew positions stay private until a move is booked.
          </p>
        </div>
        <div className="pointer-events-auto flex flex-col gap-2">
          <Button variant="outline" size="icon" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(z * 1.4, 4))} className="bg-card/92 backdrop-blur">
            <Plus aria-hidden="true" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(z / 1.4, 0.5))} className="bg-card/92 backdrop-blur">
            <Minus aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Center on my location"
            onClick={() => {
              setRecenter(true);
              setZoom(1.8);
            }}
            className="bg-card/92 backdrop-blur"
          >
            <LocateFixed aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
