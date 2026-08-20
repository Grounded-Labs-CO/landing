"use client";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/signin");
  }, [isLoading, isAuthenticated, router]);
  if (isLoading) return <div className="p-8 text-sm text-muted-foreground">Cargando…</div>;
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
