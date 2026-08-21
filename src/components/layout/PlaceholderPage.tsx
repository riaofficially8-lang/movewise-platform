import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui-kit/states";
import { StatusBadge } from "@/components/ui-kit/primitives";

/**
 * Shared shell for destinations whose functionality arrives in a later build.
 * We show an honest empty state instead of fabricated data.
 */
export function PlaceholderPage({
  eyebrow,
  title,
  description,
  emptyTitle,
  emptyDescription,
  illustration = "truck",
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  illustration?: "truck" | "boxes" | "route" | "house";
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <StatusBadge tone="brand">{eyebrow}</StatusBadge>
      <h1 className="text-h1 mt-4 text-foreground">{title}</h1>
      <p className="mt-3 max-w-2xl text-body-lg text-muted-foreground">{description}</p>
      <EmptyState
        className="mt-10"
        illustration={illustration}
        title={emptyTitle}
        description={emptyDescription}
        action={action}
      />
    </div>
  );
}
