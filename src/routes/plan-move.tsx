import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  CalendarDays,
  Check,
  Clock3,
  Home,
  MapPin,
  Navigation,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { TruckWaitingIllustration } from "@/components/illustrations/Illustrations";
import { AppShell } from "@/components/layout/AppShell";
import { FieldShell } from "@/components/search/MoveSearchForm";
import { StatusBadge } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { SERVICE_LABELS } from "@/domain/mock-data";
import {
  ACCESS_LABELS,
  ITEM_LABELS,
  MOVE_SIZE_HINTS,
  MOVE_SIZE_LABELS,
  MOVE_TYPE_LABELS,
  REQUESTABLE_SERVICES,
  TIME_WINDOWS,
  updateMoveDraft,
  useMoveDraft,
  type AccessOption,
  type ItemOption,
  type MoveSizeOption,
  type MoveTypeOption,
} from "@/domain/move-request";
import type { ServiceKind } from "@/domain/types";
import { cn } from "@/lib/utils";

interface PlanSearch {
  pickup?: string | undefined;
  destination?: string | undefined;
  date?: string | undefined;
  time?: string | undefined;
}

export const Route = createFileRoute("/plan-move")({
  validateSearch: (search: Record<string, unknown>): PlanSearch => {
    const str = (k: string) =>
      typeof search[k] === "string" && search[k] ? (search[k] as string) : undefined;
    return {
      pickup: str("pickup"),
      destination: str("destination"),
      date: str("date"),
      time: str("time"),
    };
  },
  head: () => ({
    meta: [
      { title: "Plan your move — MoveGrid" },
      {
        name: "description",
        content:
          "Answer a few simple questions about your move — locations, date, size, services and access — and we'll show movers who can actually take the job.",
      },
      { property: "og:title", content: "Plan your move — MoveGrid" },
      {
        property: "og:description",
        content: "A few calm questions, then a shortlist of movers who fit your date and volume.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlanMovePage,
});

const STEPS = [
  { title: "Your route", hint: "Where and when" },
  { title: "Your home", hint: "Type and size" },
  { title: "Your things", hint: "Items and services" },
  { title: "Access", hint: "Anything tricky" },
] as const;

/* -------------------------------------------------------------- selectables */

function Chip({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-[var(--ease-out-soft)]",
        selected
          ? "border-primary/45 bg-primary-soft text-primary shadow-[var(--shadow-e1)]"
          : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
        className,
      )}
    >
      {selected && <Check className="size-3.5" aria-hidden="true" />}
      {children}
    </button>
  );
}

function OptionCard({
  selected,
  onClick,
  title,
  hint,
  icon,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "surface-card flex items-start gap-3 p-4 text-left transition-all duration-200 ease-[var(--ease-out-soft)]",
        selected
          ? "border-primary/45 ring-1 ring-primary/25"
          : "hover:-translate-y-0.5 hover:border-border-strong",
      )}
    >
      {icon && (
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl",
            selected ? "bg-primary-soft text-primary" : "bg-surface text-muted-foreground",
          )}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0">
        <span className="block font-display text-[0.95rem] font-semibold text-foreground">
          {title}
        </span>
        {hint && <span className="mt-0.5 block text-caption text-muted-foreground">{hint}</span>}
      </span>
    </button>
  );
}

const inputClass =
  "w-full border-0 bg-transparent p-0 text-[0.9375rem] font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground";

/* -------------------------------------------------------------------- page */

function PlanMovePage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const draft = useMoveDraft();
  const [step, setStep] = useState(0);

  /* Prefill from the home search without clobbering an existing draft. */
  useEffect(() => {
    const patch: Record<string, string> = {};
    if (search.pickup) patch['pickup'] = search.pickup;
    if (search.destination) patch['destination'] = search.destination;
    if (search.date) patch['date'] = search.date;
    if (search.time) patch['time'] = search.time;
    if (Object.keys(patch).length) updateMoveDraft(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const canContinue =
    step === 0
      ? Boolean(draft.pickup && draft.destination && draft.date)
      : step === 1
        ? Boolean(draft.moveType && draft.size)
        : true;

  const finish = () => {
    updateMoveDraft({ completedAt: new Date().toISOString() });
    navigate({
      to: "/find-movers",
      search: {
        pickup: draft.pickup || undefined,
        destination: draft.destination || undefined,
        date: draft.date || undefined,
        q: undefined,
        provider: undefined,
      },
    });
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[64rem] px-4 py-10 sm:px-6 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <StatusBadge tone="brand" dot>
              <Sparkles className="size-3.5" aria-hidden="true" />
              Takes about a minute
            </StatusBadge>
            <h1 className="text-h1 mt-4 text-foreground">Let's plan your move</h1>
            <p className="mt-2 max-w-xl text-body-lg text-muted-foreground">
              A few simple questions so movers can quote properly — no long forms, and you can
              change anything later.
            </p>
          </div>
          <TruckWaitingIllustration className="hidden w-40 sm:block" />
        </div>

        {/* Step rail */}
        <ol className="mt-9 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STEPS.map((s, i) => {
            const state = i === step ? "current" : i < step ? "done" : "todo";
            return (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => i <= step && setStep(i)}
                  disabled={i > step}
                  className={cn(
                    "w-full rounded-2xl border px-4 py-3 text-left transition-colors duration-200",
                    state === "current" && "border-primary/45 bg-primary-soft",
                    state === "done" && "border-border bg-surface",
                    state === "todo" && "border-dashed border-border",
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center gap-2 text-caption font-semibold",
                      state === "current" ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {state === "done" ? (
                      <Check className="size-3.5" aria-hidden="true" />
                    ) : (
                      <span className="tabular-nums">0{i + 1}</span>
                    )}
                    {s.hint}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block font-display text-sm font-semibold",
                      state === "todo" ? "text-muted-foreground" : "text-foreground",
                    )}
                  >
                    {s.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Step body */}
        <div key={step} className="surface-card animate-rise mt-6 p-6 sm:p-8">
          {step === 0 && (
            <div className="space-y-6">
              <StepHeading
                title="Where are you moving?"
                description="Street, neighbourhood or city — a rough area is enough to start."
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card">
                  <FieldShell
                    label="Where are you moving from?"
                    icon={<MapPin className="size-[1.15rem]" aria-hidden="true" />}
                  >
                    <input
                      className={inputClass}
                      placeholder="Pickup location"
                      value={draft.pickup}
                      onChange={(e) => updateMoveDraft({ pickup: e.target.value })}
                    />
                  </FieldShell>
                </div>
                <div className="rounded-2xl border border-border bg-card">
                  <FieldShell
                    label="Where are you moving to?"
                    icon={<Navigation className="size-[1.15rem]" aria-hidden="true" />}
                  >
                    <input
                      className={inputClass}
                      placeholder="Destination"
                      value={draft.destination}
                      onChange={(e) => updateMoveDraft({ destination: e.target.value })}
                    />
                  </FieldShell>
                </div>
                <div className="rounded-2xl border border-border bg-card">
                  <FieldShell
                    label="When?"
                    icon={<CalendarDays className="size-[1.15rem]" aria-hidden="true" />}
                  >
                    <input
                      type="date"
                      className={cn(inputClass, "[color-scheme:light]")}
                      value={draft.date}
                      onChange={(e) => updateMoveDraft({ date: e.target.value })}
                    />
                  </FieldShell>
                </div>
                <div className="rounded-2xl border border-border bg-card px-4 py-3">
                  <p className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground">
                    <Clock3 className="size-3.5" aria-hidden="true" />
                    Preferred time
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {TIME_WINDOWS.map((t) => (
                      <Chip
                        key={t.value}
                        selected={draft.time === t.value}
                        onClick={() => updateMoveDraft({ time: t.value })}
                        className="px-3 py-1.5 text-caption"
                      >
                        {t.label}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <StepHeading title="What kind of move is it?" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {(Object.keys(MOVE_TYPE_LABELS) as MoveTypeOption[]).map((t) => (
                    <OptionCard
                      key={t}
                      selected={draft.moveType === t}
                      onClick={() => updateMoveDraft({ moveType: t })}
                      title={MOVE_TYPE_LABELS[t]}
                      icon={<Home className="size-4" aria-hidden="true" />}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <StepHeading
                  title="Roughly how big?"
                  description="An estimate is fine — movers confirm the volume with you."
                />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(Object.keys(MOVE_SIZE_LABELS) as MoveSizeOption[]).map((s) => (
                    <OptionCard
                      key={s}
                      selected={draft.size === s}
                      onClick={() => updateMoveDraft({ size: s })}
                      title={MOVE_SIZE_LABELS[s]}
                      hint={MOVE_SIZE_HINTS[s]}
                      icon={<Boxes className="size-4" aria-hidden="true" />}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <StepHeading
                  title="What's coming with you?"
                  description="Pick anything that applies — special items help movers bring the right kit."
                />
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(ITEM_LABELS) as ItemOption[]).map((i) => (
                    <Chip
                      key={i}
                      selected={draft.items.includes(i)}
                      onClick={() => updateMoveDraft({ items: toggle(draft.items, i) })}
                    >
                      {ITEM_LABELS[i]}
                    </Chip>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <StepHeading
                  title="Which services do you need?"
                  description="Crews and vehicles are scheduled separately, so you can mix and match."
                />
                <div className="flex flex-wrap gap-2">
                  {REQUESTABLE_SERVICES.map((s: ServiceKind) => (
                    <Chip
                      key={s}
                      selected={draft.services.includes(s)}
                      onClick={() => updateMoveDraft({ services: toggle(draft.services, s) })}
                    >
                      {SERVICE_LABELS[s]}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <StepHeading title="Access at pickup" />
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(ACCESS_LABELS) as AccessOption[]).map((a) => (
                      <Chip
                        key={a}
                        selected={draft.pickupAccess.includes(a)}
                        onClick={() =>
                          updateMoveDraft({ pickupAccess: toggle(draft.pickupAccess, a) })
                        }
                      >
                        {ACCESS_LABELS[a]}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <StepHeading title="Access at destination" />
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(ACCESS_LABELS) as AccessOption[]).map((a) => (
                      <Chip
                        key={a}
                        selected={draft.destinationAccess.includes(a)}
                        onClick={() =>
                          updateMoveDraft({
                            destinationAccess: toggle(draft.destinationAccess, a),
                          })
                        }
                      >
                        {ACCESS_LABELS[a]}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <StepHeading title="Anything else movers should know?" />
                <textarea
                  rows={4}
                  value={draft.notes}
                  onChange={(e) => updateMoveDraft({ notes: e.target.value })}
                  placeholder="A narrow staircase, a cat that hates boxes, a lift that must be booked…"
                  className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
            <Button
              variant="ghost"
              onClick={() => (step === 0 ? navigate({ to: "/" }) : setStep(step - 1))}
            >
              <ArrowLeft aria-hidden="true" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              {step > 0 && step < STEPS.length - 1 && (
                <Button variant="ghost" onClick={() => setStep(step + 1)}>
                  Skip
                </Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button size="lg" disabled={!canContinue} onClick={() => setStep(step + 1)}>
                  Continue
                  <ArrowRight aria-hidden="true" />
                </Button>
              ) : (
                <Button size="lg" onClick={finish}>
                  Find movers
                  <ArrowRight aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-caption text-muted-foreground">
          Nothing is booked yet — you'll compare movers before anything is sent.
        </p>
      </div>
    </AppShell>
  );
}

function StepHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h2 className="text-h3 text-foreground">{title}</h2>
      {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
