"use client";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider, useAuthActions } from "@convex-dev/auth/react";
import { ReactNode, useEffect, useMemo } from "react";

// Un refresh token ilegible (p. ej. cookie del deployment local anterior en
// 127.0.0.1:3211) revienta como rechazo no manejado. Autocuramos: signOut
// (limpia la cookie) + recarga, máx. una vez cada 30s para no ciclar.
function AuthErrorRecovery() {
  const { signOut } = useAuthActions();
  useEffect(() => {
    const onReject = (event: PromiseRejectionEvent) => {
      const message = String(event.reason?.message ?? event.reason ?? "");
      if (!/refresh token/i.test(message)) return;
      event.preventDefault();
      const last = Number(sessionStorage.getItem("__auth_recovery") ?? 0);
      if (Date.now() - last < 30_000) return;
      sessionStorage.setItem("__auth_recovery", String(Date.now()));
      void Promise.resolve(signOut())
        .catch(() => {})
        .finally(() => window.location.reload());
    };
    window.addEventListener("unhandledrejection", onReject);
    return () => window.removeEventListener("unhandledrejection", onReject);
  }, [signOut]);
  return null;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convex = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      // Durante build sin env, usa URL dummy; en runtime real requiere env real
      return new ConvexReactClient("https://placeholder.convex.cloud");
    }
    return new ConvexReactClient(url);
  }, []);
  return (
    <ConvexAuthProvider client={convex}>
      <AuthErrorRecovery />
      {children}
    </ConvexAuthProvider>
  );
}
