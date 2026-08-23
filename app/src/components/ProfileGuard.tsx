"use client";
import { useRole } from "@/hooks/useRole";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { api } from "../../convex/_generated/api";
import { shouldRequireOnboarding } from "@/lib/onboarding";

export function ProfileGuard({ children }: { children: ReactNode }) {
  const { isAdmin, isLoading: roleLoading } = useRole();
  const profile = useQuery(api.profile.getMyProfile);
  const router = useRouter();

  useEffect(() => {
    if (roleLoading || profile === undefined || profile === null) return;
    if (shouldRequireOnboarding({ isAdmin, completed: profile.completed })) {
      router.replace("/estudiantes/completar-perfil");
    }
  }, [roleLoading, profile, isAdmin, router]);

  if (roleLoading || profile === undefined || profile === null) {
    return <div className="p-8 font-mono text-[12px] text-[#565F62]">cargando…</div>;
  }
  if (shouldRequireOnboarding({ isAdmin, completed: profile.completed })) return null;
  return <>{children}</>;
}
