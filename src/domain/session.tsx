import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import type { Account, AccountContext, AccountRole } from "./types";

/**
 * Identity foundation.
 *
 * The session exposes an Account with one or more contexts (personal/customer,
 * business/provider, admin). Nothing in the UI assumes a single role, so the
 * "one human, two hats" model stays possible. Today the session is a local
 * mock; swapping in a real auth provider means replacing this module only.
 */

export interface SessionState {
  status: "authenticated" | "guest";
  account: Account | null;
  activeContext: AccountContext | null;
  signInAs: (kind: AccountContext["kind"]) => void;
  signOut: () => void;
  switchContext: (contextId: string) => void;
  hasRole: (role: AccountRole) => boolean;
}

const DEMO_ACCOUNT: Account = {
  id: "acc_demo",
  displayName: "John Bakker",
  email: "john@example.com",
  roles: ["customer", "provider"],
  activeContextId: "ctx_personal",
  contexts: [
    { id: "ctx_personal", kind: "personal", label: "Personal", role: "customer" },
    {
      id: "ctx_business",
      kind: "business",
      label: "John's Moving Co.",
      role: "provider",
      providerId: "prv_abc",
    },
  ],
};

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);

  const value = useMemo<SessionState>(() => {
    const activeContext =
      account?.contexts.find((c) => c.id === account.activeContextId) ?? account?.contexts[0] ?? null;

    return {
      status: account ? "authenticated" : "guest",
      account,
      activeContext,
      hasRole: (role) => Boolean(account?.roles.includes(role)),
      signInAs: (kind) =>
        setAccount({
          ...DEMO_ACCOUNT,
          activeContextId:
            DEMO_ACCOUNT.contexts.find((c) => c.kind === kind)?.id ?? DEMO_ACCOUNT.activeContextId,
        }),
      signOut: () => setAccount(null),
      switchContext: (contextId) =>
        setAccount((prev) => (prev ? { ...prev, activeContextId: contextId } : prev)),
    };
  }, [account]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}
