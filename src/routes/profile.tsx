import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, UserRound } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui-kit/primitives";
import { EmptyState } from "@/components/ui-kit/states";
import { Button } from "@/components/ui/button";
import { useSession } from "@/domain/session";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — MoveGrid" },
      {
        name: "description",
        content:
          "Manage your MoveGrid account, personal details and switch between your personal and business contexts.",
      },
      { property: "og:title", content: "Your profile — MoveGrid" },
      { property: "og:description", content: "Manage your MoveGrid account and contexts." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { status, account, activeContext, signInAs, switchContext } = useSession();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <StatusBadge tone="brand">Account</StatusBadge>
        <h1 className="text-h1 mt-4 text-foreground">Profile</h1>
        <p className="mt-3 max-w-2xl text-body-lg text-muted-foreground">
          One account, two hats. Your personal moving history and any business you operate stay
          separate, and you can switch between them at any time.
        </p>

        {status === "guest" || !account ? (
          <EmptyState
            className="mt-10"
            illustration="house"
            title="You're browsing as a guest"
            description="Sign in to save providers, keep your move details and follow your booked jobs."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" onClick={() => signInAs("personal")}>
                  Continue as a customer
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/for-moving-companies">I run a moving company</Link>
                </Button>
              </div>
            }
          />
        ) : (
          <div className="mt-10 space-y-4">
            <div className="surface-card p-6">
              <p className="text-label text-muted-foreground">Signed in as</p>
              <p className="mt-2 font-display text-xl font-bold text-foreground">
                {account.displayName}
              </p>
              <p className="text-sm text-muted-foreground">{account.email}</p>
            </div>

            <div className="surface-card divide-y divide-border p-2">
              {account.contexts.map((ctx) => (
                <div key={ctx.id} className="flex items-center gap-4 p-4">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    {ctx.kind === "business" ? (
                      <Building2 className="size-5" aria-hidden="true" />
                    ) : (
                      <UserRound className="size-5" aria-hidden="true" />
                    )}
                  </span>
                  <div className="flex-1">
                    <p className="font-display font-semibold text-foreground">{ctx.label}</p>
                    <p className="text-caption capitalize text-muted-foreground">
                      {ctx.kind} · {ctx.role}
                    </p>
                  </div>
                  {ctx.id === activeContext?.id ? (
                    <StatusBadge tone="available" dot>
                      Active
                    </StatusBadge>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => switchContext(ctx.id)}>
                      Switch
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
