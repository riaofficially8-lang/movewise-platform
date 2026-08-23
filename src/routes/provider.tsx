import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  CalendarRange,
  Gauge,
  MessageSquare,
  PackageCheck,
  Settings2,
  Truck,
  UserRound,
  Users,
} from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { StatusBadge } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const PROVIDER_NAV = [
  { to: "/provider", label: "Overview", icon: Gauge, exact: true },
  { to: "/provider/jobs", label: "Jobs", icon: PackageCheck, exact: false },
  { to: "/provider/calendar", label: "Calendar", icon: CalendarRange, exact: false },
  { to: "/provider/fleet", label: "Fleet", icon: Truck, exact: false },
  { to: "/provider/crews", label: "Crews", icon: Users, exact: false },
  { to: "/provider/customers", label: "Customers", icon: UserRound, exact: false },
  { to: "/provider/messages", label: "Messages", icon: MessageSquare, exact: false },
  { to: "/provider/profile", label: "Profile", icon: Settings2, exact: false },
] as const;

export const Route = createFileRoute("/provider")({
  head: () => ({
    meta: [
      { title: "Provider console — MoveGrid" },
      {
        name: "description",
        content:
          "Operations console for moving providers: jobs, calendar, fleet, crews and business performance.",
      },
      { property: "og:title", content: "Provider console — MoveGrid" },
      { property: "og:description", content: "Run jobs, crews and vehicles from one console." },
    ],
  }),
  component: ProviderConsoleLayout,
});

function ProviderConsoleLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[110rem] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="MoveGrid home">
            <Logo />
          </Link>
          <StatusBadge tone="brand" className="hidden sm:inline-flex">
            Provider console
          </StatusBadge>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden text-muted-foreground md:inline-flex">
              <Link to="/find-movers">Customer view</Link>
            </Button>
            <AccountMenu />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[110rem] flex-1 gap-0 px-0 lg:gap-8 lg:px-8 lg:py-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav aria-label="Provider" className="sticky top-24 space-y-1">
            {PROVIDER_NAV.map(({ to, label, icon: Icon, exact }) => {
              const active = exact ? pathname === to : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200",
                    active
                      ? "bg-card text-primary shadow-[var(--shadow-e1)]"
                      : "text-muted-foreground hover:bg-card/70 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile console nav */}
        <nav
          aria-label="Provider sections"
          className="fixed inset-x-0 bottom-0 z-40 overflow-x-auto border-t border-border bg-background/95 px-2 py-2 backdrop-blur lg:hidden"
        >
          <ul className="flex gap-1">
            {PROVIDER_NAV.map(({ to, label, icon: Icon, exact }) => {
              const active = exact ? pathname === to : pathname.startsWith(to);
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={cn(
                      "flex min-h-12 min-w-16 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[0.6875rem] font-medium",
                      active ? "bg-primary-soft text-primary" : "text-muted-foreground",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
