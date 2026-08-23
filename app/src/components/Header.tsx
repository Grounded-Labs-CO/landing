"use client";
import Link from "next/link";
import { useConvexAuth } from "convex/react";

export function Header() {
  const { isAuthenticated } = useConvexAuth();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#262E31] bg-[#0E1214]/90 backdrop-blur">
      <div className="mx-auto flex h-[64px] max-w-[1120px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center bg-[#B4552B]">
            <span className="font-mono text-[22px] font-semibold leading-none text-[#0E1214]">
              g
            </span>
          </div>
          <span className="font-mono text-[15px] font-medium tracking-[0.02em] text-[#F1F3F2]">
            grounded<span className="text-[#6C7573]">_</span>labs
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/workshops/finanzas-personales-ia"
            className="hidden md:inline font-mono text-[11px] tracking-[0.12em] uppercase text-[#9AA3A1] hover:text-[#F1F3F2]"
          >
            Workshops
          </Link>
          <Link
            href="/estudiantes"
            className="inline-flex items-center bg-[#B4552B] px-5 py-2.5 font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-[#0E1214] hover:bg-[#9A4A24] transition-colors"
          >
            {isAuthenticated ? "Perfil →" : "Estudiantes →"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
