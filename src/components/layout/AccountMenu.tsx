import { Link } from "@tanstack/react-router";
import { Building2, Check, LogOut, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/domain/session";

export function AccountMenu() {
  const { status, account, activeContext, signInAs, signOut, switchContext } = useSession();

  if (status === "guest" || !account) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => signInAs("personal")}>
          Sign in
        </Button>
        <Button size="sm" asChild>
          <Link to="/find-movers">Get started</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 pl-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary-soft text-[0.6875rem] font-bold text-primary">
            {account.displayName
              .split(" ")
              .map((w) => w[0])
              .join("")}
          </span>
          <span className="hidden max-w-28 truncate sm:inline">{activeContext?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2">
        <DropdownMenuLabel className="px-2 py-1.5">
          <p className="text-sm font-semibold text-foreground">{account.displayName}</p>
          <p className="text-caption font-normal text-muted-foreground">{account.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-label px-2 text-muted-foreground">
          Switch context
        </DropdownMenuLabel>
        {account.contexts.map((ctx) => (
          <DropdownMenuItem
            key={ctx.id}
            onSelect={() => switchContext(ctx.id)}
            className="cursor-pointer gap-2.5 rounded-xl py-2"
          >
            {ctx.kind === "business" ? (
              <Building2 className="size-4 text-muted-foreground" aria-hidden="true" />
            ) : (
              <UserRound className="size-4 text-muted-foreground" aria-hidden="true" />
            )}
            <span className="flex-1">
              <span className="block text-sm">{ctx.label}</span>
              <span className="block text-caption capitalize text-muted-foreground">{ctx.role}</span>
            </span>
            {ctx.id === activeContext?.id && <Check className="size-4 text-primary" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer rounded-xl">
          <Link to="/profile">Profile & settings</Link>
        </DropdownMenuItem>
        {activeContext?.role === "provider" && (
          <DropdownMenuItem asChild className="cursor-pointer rounded-xl">
            <Link to="/provider">Provider console</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={signOut} className="cursor-pointer gap-2 rounded-xl">
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
