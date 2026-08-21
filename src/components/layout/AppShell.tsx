import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bookmark,
  Building2,
  Home,
  MessageSquare,
  PackageSearch,
  Search,
  Truck,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/Logo";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const CUSTOMER_NAV = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/find-movers", label: "Find movers", icon: Search, exact: false },
  { to: "/my-move", label: "My move", icon: PackageSearch, exact: false },
  { to: "/messages", label: "Messages", icon: MessageSquare, exact: false },
  { to: "/saved", label: "Saved", icon: Bookmark, exact: false },
] as const;

const MOBILE_NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/find-movers", label: "Find", icon: Search },
  { to: "/my-move", label: "My move", icon: PackageSearch },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/profile", label: "Profile", icon: UserRound },
] as const;

export function AppShell({
  children,
  fullBleed = false,
}: {
  children: ReactNode;
  /** Discovery pages manage their own scroll/viewport instead of page flow. */
  fullBleed?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[110rem] items-center gap-3 px-4 sm:px-6 lg:h-[4.5rem] lg:px-10">
          <Link to="/" aria-label="MoveGrid home" className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Main" className="ml-6 hidden items-center gap-1 lg:flex">
            {CUSTOMER_NAV.map(({ to, label, icon: Icon, exact }) => {
              const active = exact ? pathname === to : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                    active
                      ? "bg-primary-soft text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden text-muted-foreground md:inline-flex"
            >
              <Link to="/for-moving-companies">
                <Building2 aria-hidden="true" />
                For moving companies
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex lg:hidden">
              <Link to="/find-movers">
                <Search aria-hidden="true" />
                Find movers
              </Link>
            </Button>
            <AccountMenu />
          </div>
        </div>
      </header>

      <main className={cn("flex-1", fullBleed ? "flex min-h-0 flex-col" : "pb-20 lg:pb-0")}>
        {children}
      </main>

      {!fullBleed && <SiteFooter />}

      {/* Mobile tab bar */}
      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
          {MOBILE_NAV.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <li key={to} className="flex-1">
                <Link
                  to={to}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[0.6875rem] font-medium transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-[110rem] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            MoveGrid connects people who are moving with vetted moving providers, and gives those
            providers the tools to run crews, vehicles and jobs.
          </p>
        </div>
        <div>
          <p className="text-label text-muted-foreground">For customers</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/find-movers" className="text-muted-foreground hover:text-foreground">
                Find movers
              </Link>
            </li>
            <li>
              <Link to="/my-move" className="text-muted-foreground hover:text-foreground">
                My move
              </Link>
            </li>
            <li>
              <Link to="/saved" className="text-muted-foreground hover:text-foreground">
                Saved providers
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-label text-muted-foreground">For providers</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link
                to="/for-moving-companies"
                className="text-muted-foreground hover:text-foreground"
              >
                Join as a provider
              </Link>
            </li>
            <li>
              <Link to="/provider" className="text-muted-foreground hover:text-foreground">
                Provider console
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[110rem] flex-wrap items-center justify-between gap-3 px-4 py-6 text-caption text-muted-foreground sm:px-6 lg:px-10">
          <p className="inline-flex items-center gap-2">
            <Truck className="size-4" aria-hidden="true" />© {new Date().getFullYear()} MoveGrid
          </p>
          <p>Foundation build — marketplace and operations platform</p>
        </div>
      </div>
    </footer>
  );
}
