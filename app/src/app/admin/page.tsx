import { AuthGuard } from "@/components/AuthGuard";

export default function AdminPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-[1120px] px-6 py-16">
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">Admin</span>
        <h1 className="mt-3 font-sans text-[32px] font-light tracking-[-0.02em] text-[#F1F3F2]">Admin</h1>
        <p className="mt-2 font-mono text-[12px] leading-[1.7] text-[#9AA3A1]">
          Solo usuarios con rol admin activo. Usa <code className="bg-[#1C2427] border border-[#262E31] px-1.5 py-0.5 text-[#DDE2E0]">api.admin.approveUser</code>{" "}
          para aprobar pendientes.
        </p>
        <div className="mt-6 border border-[#262E31] bg-[#1C2427] p-6">
          <div className="h-[1.5px] w-8 bg-[#B4552B]"></div>
          <p className="mt-3 font-mono text-[11px] tracking-[0.08em] text-[#6C7573]">{"// panel protegido — verifica rol en Convex"}</p>
        </div>
      </div>
    </AuthGuard>
  );
}
