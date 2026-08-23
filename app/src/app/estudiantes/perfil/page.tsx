"use client";
import { AuthGuard } from "@/components/AuthGuard";
import { ProfileGuard } from "@/components/ProfileGuard";
import { ProfileForm } from "@/components/ProfileForm";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";

function ProfileEditor() {
  const profile = useQuery(api.profile.getMyProfile);
  const professions = useQuery(api.profile.listProfessions);
  const aiTools = useQuery(api.profile.listAiTools);

  if (profile === undefined || professions === undefined || aiTools === undefined) {
    return (
      <div className="mt-10 font-mono text-[12px] text-[#6C7573]">cargando…</div>
    );
  }
  if (!profile) {
    return (
      <div className="mt-10 font-mono text-[12px] text-[#6C7573]">inicia sesión para continuar.</div>
    );
  }

  return (
    <div className="mx-auto max-w-[560px] px-6 py-16">
      <Link
        href="/estudiantes"
        className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#9AA3A1] hover:text-[#F1F3F2]"
      >
        ← mis cursos
      </Link>
      <span className="mt-6 block font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">
        Tu cuenta
      </span>
      <h1 className="mt-3 font-sans text-[28px] font-light tracking-[-0.02em] text-[#F1F3F2]">
        Mis datos
      </h1>
      <p className="mt-2 font-mono text-[12px] leading-[1.6] text-[#9AA3A1]">
        {"// revisa y actualiza la información de tu perfil."}
      </p>
      <div className="mt-8">
        <ProfileForm profile={profile} professions={professions} aiTools={aiTools} mode="edit" />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileGuard>
        <ProfileEditor />
      </ProfileGuard>
    </AuthGuard>
  );
}
