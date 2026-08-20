"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const isWorkshop = pathname?.startsWith("/workshops");
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-[#f6f2ea]/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[13px] font-bold tracking-[0.08em] text-[#236b4b]">GROUNDED Labs</span>
          <span className="hidden sm:inline text-xs text-[#6f7d74]">No hype. Solo IA que entiende tu mundo.</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/#workshops" className="hidden md:inline text-[#4e5b53] hover:text-[#236b4b]">Workshops</Link>
          <Link href="/#empresas" className="hidden md:inline text-[#4e5b53] hover:text-[#236b4b]">Empresas</Link>
          <Link href={isWorkshop ? "#precio" : "/workshops/finanzas-personales-ia#precio"} className="rounded-full bg-[#236b4b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#174e36]">
            Reservar cupo
          </Link>
        </nav>
      </div>
    </header>
  );
}
