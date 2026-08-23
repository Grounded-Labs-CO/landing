"use client";
import { AuthGuard } from "@/components/AuthGuard";
import { useRole } from "@/hooks/useRole";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

function AdminPanel() {
  const { isAdmin, isLoading } = useRole();
  const pendingUsers = useQuery(api.admin.listPendingUsers);
  const registrations = useQuery(api.admin.listRegistrations);
  const approveUser = useMutation(api.admin.approveUser);
  const markPaid = useMutation(api.admin.markRegistrationPaid);

  return (
    <div className="mx-auto max-w-[900px] px-6 py-16">
      <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">Admin</span>
      <h1 className="mt-3 font-sans text-[32px] font-light tracking-[-0.02em] text-[#F1F3F2]">
        Panel de administración
      </h1>

      {isLoading ? (
        <p className="mt-8 font-mono text-[12px] text-[#6C7573]">cargando…</p>
      ) : !isAdmin ? (
        <div className="mt-8 border border-[#262E31] bg-[#1C2427] p-6">
          <div className="h-[1.5px] w-8 bg-[#B4552B]"></div>
          <p className="mt-3 font-mono text-[12px] leading-[1.7] text-[#9AA3A1]">
            {"// solo usuarios con rol admin activo."}
          </p>
          <p className="mt-2 font-mono text-[11px] leading-[1.7] text-[#565F62]">
            {"// primer admin: crea tu cuenta en /signin y promuévela con:"}
            <br />
            {"// npx convex run admin:promoteByEmail '{\"email\":\"...\",\"secret\":\"...\",\"role\":\"admin\"}'"}
          </p>
        </div>
      ) : (
        <>
          {/* CUENTAS PENDIENTES */}
          <section className="mt-10">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B4552B]">
              [cuentas pendientes]
            </span>
            {pendingUsers === undefined ? (
              <p className="mt-4 font-mono text-[12px] text-[#6C7573]">cargando…</p>
            ) : pendingUsers.length === 0 ? (
              <p className="mt-4 font-mono text-[12px] text-[#565F62]">
                {"// sin pendientes — todo aprobado."}
              </p>
            ) : (
              <div className="mt-4 flex flex-col gap-2">
                {pendingUsers.map((u) => (
                  <div
                    key={u.userId}
                    className="flex flex-col gap-3 border border-[#262E31] bg-[#111719] p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <span className="font-mono text-[13px] text-[#DDE2E0]">{u.email ?? u.userId}</span>
                    <button
                      onClick={() => void approveUser({ userId: u.userId })}
                      className="self-start border border-[#2F5D43] px-4 py-2 font-mono text-[11px] tracking-[0.12em] uppercase text-[#7FC7A3] hover:bg-[#2F5D43] hover:text-[#F1F3F2] transition-colors"
                    >
                      aprobar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* REGISTROS WORKSHOP */}
          <section className="mt-12 border-t border-[#262E31] pt-10">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B4552B]">
              [registros · workshop]
            </span>
            {registrations === undefined ? (
              <p className="mt-4 font-mono text-[12px] text-[#6C7573]">cargando…</p>
            ) : registrations.length === 0 ? (
              <p className="mt-4 font-mono text-[12px] text-[#565F62]">
                {"// sin registros todavía."}
              </p>
            ) : (
              <div className="mt-4 flex flex-col gap-2">
                {registrations.map((r) => (
                  <div
                    key={`${r.email}-${r.workshopSlug}`}
                    className="flex flex-col gap-3 border border-[#262E31] bg-[#111719] p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[13px] text-[#DDE2E0]">{r.email}</span>
                      <span className="font-mono text-[11px] text-[#6C7573]">
                        {r.workshopSlug} · {r.status}
                      </span>
                    </div>
                    {r.status === "pending" && (
                      <button
                        onClick={() =>
                          void markPaid({ email: r.email, workshopSlug: r.workshopSlug })
                        }
                        className="self-start border border-[#5D4A2F] px-4 py-2 font-mono text-[11px] tracking-[0.12em] uppercase text-[#E2C084] hover:bg-[#5D4A2F] hover:text-[#F1F3F2] transition-colors"
                      >
                        marcar pagado
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminPanel />
    </AuthGuard>
  );
}
