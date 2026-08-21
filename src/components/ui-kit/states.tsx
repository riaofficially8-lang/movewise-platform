import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  BoxesIllustration,
  HouseIllustration,
  RouteIllustration,
  TruckWaitingIllustration,
} from "@/components/illustrations/Illustrations";

const ILLUSTRATIONS = {
  truck: TruckWaitingIllustration,
  boxes: BoxesIllustration,
  route: RouteIllustration,
  house: HouseIllustration,
} as const;

export interface EmptyStateProps {
  illustration?: keyof typeof ILLUSTRATIONS;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  illustration = "truck",
  title,
  description,
  action,
  className,
  compact,
}: EmptyStateProps) {
  const Illustration = ILLUSTRATIONS[illustration];
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/60 px-6 text-center",
        compact ? "py-10" : "py-16",
        className,
      )}
    >
      <Illustration className={compact ? "w-28" : "w-40"} />
      <h3 className="mt-6 text-h3 text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Something didn't load",
  description = "We couldn't reach our servers just now. Give it another try.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-destructive/25 bg-destructive/5 px-6 py-14 text-center",
        className,
      )}
    >
      <RouteIllustration className="w-36 opacity-80" />
      <h3 className="mt-6 text-h3 text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button variant="outline" className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function ProviderCardSkeleton() {
  return (
    <div className="surface-card p-5">
      <div className="flex gap-4">
        <Skeleton className="size-14 rounded-2xl" />
        <div className="flex-1 space-y-2.5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
      </div>
    </div>
  );
}

export function LoadingList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <ProviderCardSkeleton key={i} />
      ))}
    </div>
  );
}
