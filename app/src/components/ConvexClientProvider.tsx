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
      // En el navegador no hay excusa: sin env, Convex revienta con un
      // "Couldn't parse deployment name placeholder" que no dice qué falta.
      if (typeof window !== "undefined") {
        throw new Error(
          "Falta NEXT_PUBLIC_CONVEX_URL. Creá app/.env.local (ver .env.local.example) y reiniciá `npm run dev`: las variables NEXT_PUBLIC_* se inlinean al compilar.",
        );
      }
      // Durante build/prerender sin env, URL dummy para que el build no se caiga.
      return new ConvexReactClient("https://placeholder.convex.cloud");
    }
    return new ConvexReactClient(url);
  }, []);
  return (
    <ConvexAuthProvider
      client={convex}
      // En /signin manejamos el `code` del magic link nosotros mismos para
      // poder mostrar "verificando…" y avisar cuando el link expiró; el
      // provider solo lo procesa en el resto de rutas.
      shouldHandleCode={() => !window.location.pathname.startsWith("/signin")}
    >
      <AuthErrorRecovery />
      {children}
    </ConvexAuthProvider>
  );
}
