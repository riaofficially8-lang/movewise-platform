import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarRange, ClipboardCheck, LineChart, Truck, Users, Wallet } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { SectionHeading, StatusBadge } from "@/components/ui-kit/primitives";
import { TruckWaitingIllustration } from "@/components/illustrations/Illustrations";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/for-moving-companies")({
  head: () => ({
    meta: [
      { title: "For moving companies — MoveGrid" },
      {
        name: "description",
        content:
          "Receive move requests, quote fast, and run crews, vehicles and jobs from one operations console built for moving providers.",
      },
      { property: "og:title", content: "For moving companies — MoveGrid" },
      {
        property: "og:description",
        content: "Get move requests and run crews, vehicles and jobs from one console.",
      },
    ],
  }),
  component: ForCompaniesPage,
});

const CAPABILITIES = [
  {
    icon: ClipboardCheck,
    title: "Requests and quotes",
    body: "Structured move requests with volume, access and services, so you can price without a phone call.",
  },
  {
    icon: Truck,
    title: "Fleet management",
    body: "Every vehicle has its own schedule, capacity and status — independent from your crews.",
  },
  {
    icon: Users,
    title: "Crew management",
    body: "Build crews, track skills, and assign people to jobs and tasks on their own timeline.",
  },
  {
    icon: CalendarRange,
    title: "Operational calendar",
    body: "See jobs, trips and tasks across resources, and spot conflicts before they happen.",
  },
  {
    icon: LineChart,
    title: "Performance you earn",
    body: "On-time rate, response time and completion rate calculated from real job events.",
  },
  {
    icon: Wallet,
    title: "Clean job records",
    body: "Quotes, bookings and completed work stay auditable — useful for disputes and accounting.",
  },
];

function ForCompaniesPage() {
  return (
    <AppShell>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid w-full max-w-[80rem] items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-24">
          <div>
            <StatusBadge tone="accent">For moving companies</StatusBadge>
            <h1 className="text-h1 mt-5 text-foreground">
              Fill your calendar, run your operation
            </h1>
            <p className="mt-5 max-w-xl text-body-lg text-muted-foreground">
              MoveGrid sends you real move requests from customers in your service area — and gives
              you the tooling to schedule crews and vehicles, assign resources per trip, and build a
              reputation from completed work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg">Create a provider account</Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/provider">Preview the console</Link>
              </Button>
            </div>
            <p className="mt-4 text-caption text-muted-foreground">
              Already have a personal MoveGrid account? You can add a business context to it.
            </p>
          </div>
          <div className="surface-card flex items-center justify-center p-10">
            <TruckWaitingIllustration className="w-full max-w-xs" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[80rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <SectionHeading
          eyebrow="The console"
          title="A professional operating environment"
          description="Not a lead inbox. A place to plan resources, run jobs and see how your business is actually performing."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="surface-card p-6">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <c.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-h3 mt-5 text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
