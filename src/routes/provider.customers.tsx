import { createFileRoute } from "@tanstack/react-router";

import { ConsolePlaceholder } from "@/components/provider/ConsoleSection";

export const Route = createFileRoute("/provider/customers")({
  component: () => (
    <ConsolePlaceholder
      title="Customers"
      description="The households and businesses you have moved, with their job history and repeat rate."
      emptyTitle="No customers yet"
      emptyDescription="Customers appear once you complete your first move through MoveGrid."
      illustration="house"
    />
  ),
});
