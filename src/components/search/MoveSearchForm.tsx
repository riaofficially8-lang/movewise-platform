import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, MapPin, Navigation, Search } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MoveSearchValues {
  pickup: string;
  destination: string;
  date: string;
}

/** Field shell used by every location/date/search control in the product. */
export function FieldShell({
  label,
  icon,
  children,
  className,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "group flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-card px-4 py-3 text-left transition-colors duration-200 focus-within:bg-card md:rounded-none md:bg-transparent md:px-5",
        className,
      )}
    >
      <span className="text-muted-foreground transition-colors group-focus-within:text-primary">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground">
          {label}
        </span>
        {children}
      </span>
    </label>
  );
}

const inputClass =
  "w-full border-0 bg-transparent p-0 text-[0.9375rem] font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground";

export function MoveSearchForm({
  defaultValues,
  className,
  secondaryAction,
}: {
  defaultValues?: Partial<MoveSearchValues>;
  className?: string;
  secondaryAction?: ReactNode;
}) {
  const navigate = useNavigate();
  const [values, setValues] = useState<MoveSearchValues>({
    pickup: defaultValues?.pickup ?? "",
    destination: defaultValues?.destination ?? "",
    date: defaultValues?.date ?? "",
  });

  const set = (key: keyof MoveSearchValues) => (event: { target: { value: string } }) =>
    setValues((prev) => ({ ...prev, [key]: event.target.value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate({
          to: "/plan-move",
          search: {
            pickup: values.pickup || undefined,
            destination: values.destination || undefined,
            date: values.date || undefined,
            time: undefined,
          },
        });
      }}
      className={cn(
        "rounded-3xl border border-border bg-card p-2 shadow-[var(--shadow-e3)]",
        className,
      )}
    >
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-0 md:divide-x md:divide-border">
        <FieldShell label="Pickup" icon={<MapPin className="size-[1.15rem]" aria-hidden="true" />}>
          <input
            className={inputClass}
            placeholder="Where are you moving from?"
            value={values.pickup}
            onChange={set("pickup")}
          />
        </FieldShell>
        <FieldShell
          label="Destination"
          icon={<Navigation className="size-[1.15rem]" aria-hidden="true" />}
        >
          <input
            className={inputClass}
            placeholder="Where are you moving to?"
            value={values.destination}
            onChange={set("destination")}
          />
        </FieldShell>
        <FieldShell
          label="Moving date"
          icon={<CalendarDays className="size-[1.15rem]" aria-hidden="true" />}
          className="md:max-w-[13rem]"
        >
          <input
            type="date"
            className={cn(inputClass, "[color-scheme:light]")}
            value={values.date}
            onChange={set("date")}
          />
        </FieldShell>
        <div className="p-1 md:pl-4">
          <Button type="submit" size="lg" className="w-full md:w-auto">
            <Search aria-hidden="true" />
            Get started
          </Button>
        </div>
      </div>
      {secondaryAction && (
        <div className="flex justify-center px-3 pb-1 pt-2 md:justify-start md:px-5">
          {secondaryAction}
        </div>
      )}
    </form>
  );
}

/** Compact single-field search used inside discovery and the app header. */
export function ProviderSearchField({
  value,
  onChange,
  placeholder = "Search movers by name or service",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2.5 shadow-[var(--shadow-e1)] transition-colors focus-within:border-primary/40",
        className,
      )}
    >
      <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full border-0 bg-transparent p-0 text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
