import { AuthGuard } from "@/components/AuthGuard";

export default function AdminPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-[1120px] px-6 py-16">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>Admin</h1>
        <p className="mt-2 text-sm text-[#4e5b53]">Solo usuarios con rol admin activo. Usa <code>api.admin.approveUser</code> para aprobar pendientes.</p>
      </div>
    </AuthGuard>
  );
}
