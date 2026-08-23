import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui-kit/states";

export function ConsoleSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-0">
      <header className="max-w-2xl">
        <h1 className="text-h1 text-foreground">{title}</h1>
        <p className="mt-3 text-body-lg text-muted-foreground">{description}</p>
      </header>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function ConsolePlaceholder({
  title,
  description,
  emptyTitle,
  emptyDescription,
  illustration = "truck",
}: {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  illustration?: "truck" | "boxes" | "route" | "house";
}) {
  return (
    <ConsoleSection title={title} description={description}>
      <EmptyState
        illustration={illustration}
        title={emptyTitle}
        description={emptyDescription}
        className="bg-card/60"
      />
    </ConsoleSection>
  );
}
