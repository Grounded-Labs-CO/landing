"use client";
import { AuthGuard } from "@/components/AuthGuard";
import { ProfileGuard } from "@/components/ProfileGuard";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

function StatusChip({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    paid: { label: "pagado", className: "border-[#2F5D43] text-[#7FC7A3]" },
    pending: { label: "pago en verificación", className: "border-[#5D4A2F] text-[#E2C084]" },
    cancelled: { label: "cancelado", className: "border-[#5D2F2F] text-[#E29F9F]" },
    full: { label: "sin cupo", className: "border-[#5D4A2F] text-[#E2C084]" },
  };
  const conf = map[status] ?? { label: status, className: "border-[#262E31] text-[#6C7573]" };
  return (
    <span
      className={`inline-flex items-center border px-3 py-1 font-mono text-[10px] tracking-[0.12em] uppercase ${conf.className}`}
    >
      {conf.label}
    </span>
  );
}

function StudentHome() {
  const courses = useQuery(api.courses.list);
  const registrations = useQuery(api.queries.myRegistrations);
  const { signOut } = useAuthActions();

  return (
    <div className="mx-auto max-w-[900px] px-6 py-16">
      <div className="flex items-start justify-between gap-6">
        <div>
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">
            Perfil
          </span>
          <h1 className="mt-3 font-sans text-[32px] font-light tracking-[-0.02em] text-[#F1F3F2]">
            Mis cursos
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/estudiantes/perfil"
            className="border border-[#262E31] px-4 py-2 font-mono text-[11px] tracking-[0.12em] uppercase text-[#9AA3A1] hover:text-[#F1F3F2] hover:border-[#9AA3A1] transition-colors"
          >
            mis datos
          </Link>
          <button
            onClick={() => void signOut()}
            className="border border-[#262E31] px-4 py-2 font-mono text-[11px] tracking-[0.12em] uppercase text-[#9AA3A1] hover:text-[#F1F3F2] hover:border-[#9AA3A1] transition-colors"
          >
            cerrar sesión
          </button>
        </div>
      </div>

      {courses === undefined || registrations === undefined ? (
        <p className="mt-10 font-mono text-[12px] text-[#6C7573]">cargando…</p>
      ) : (
        (() => {
          const enrolled = registrations.filter((r) => r.courseStatus !== "disabled");
          const enrolledSlugs = new Set(enrolled.map((r) => r.workshopSlug));
          const available = (courses as any[]).filter((c) => !enrolledSlugs.has(c.slug));

          return (
            <div className="mt-10 flex flex-col gap-10">
              {/* Tus cursos */}
              <section className="flex flex-col gap-3">
                <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#9AA3A1]">
                  tus cursos
                </span>
                {enrolled.length === 0 ? (
                  <div className="border border-[#262E31] bg-[#111719] p-6 font-mono text-[12px] text-[#565F62]">
                    {"// aún no estás inscrito en ningún curso."}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {enrolled.map((r) => {
                      const unlocked = r.status === "paid";
                      return (
                        <div
                          key={r.workshopSlug}
                          className="flex flex-col gap-4 border border-[#262E31] bg-[#111719] p-6 md:flex-row md:items-center md:justify-between"
                        >
                          <div className="flex flex-col gap-2">
                            <span className="font-sans text-[19px] font-light text-[#F1F3F2]">
                              {r.courseTitle}
                            </span>
                            <span className="font-mono text-[12px] leading-[1.6] text-[#9AA3A1]">
                              {r.courseSchedule}
                            </span>
                          </div>
                          <div className="flex flex-col items-start gap-3 md:items-end">
                            <div className="flex items-center gap-2">
                              <StatusChip status={r.status} />
                              {r.courseStatus === "completed" && (
                                <span className="border border-[#2F3A3D] px-2 py-1 font-mono text-[10px] uppercase text-[#9AA3A1]">
                                  dictado
                                </span>
                              )}
                            </div>
                            {unlocked ? (
                              <Link
                                href={`/estudiantes/cursos/${r.workshopSlug}`}
                                className="bg-[#B4552B] px-5 py-2.5 font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-[#0E1214] hover:bg-[#9A4A24] transition-colors"
                              >
                                ver material →
                              </Link>
                            ) : r.status === "pending" ? (
                              <span className="font-mono text-[11px] text-[#565F62]">
                                {"// material disponible al registrar el pago"}
                              </span>
                            ) : (
                              <Link
                                href={`/workshops/${r.workshopSlug}#precio`}
                                className="border border-[#2F3A3D] px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] uppercase text-[#9AA3A1] hover:text-[#F1F3F2] hover:border-[#9AA3A1] transition-colors"
                              >
                                reservar cupo
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Workshops disponibles */}
              <section className="flex flex-col gap-3">
                <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#9AA3A1]">
                  workshops disponibles
                </span>
                {available.length === 0 ? (
                  <div className="border border-[#262E31] bg-[#111719] p-6 font-mono text-[12px] text-[#565F62]">
                    {"// por ahora no hay workshops abiertos para reservar."}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {available.map((c) => (
                      <div
                        key={c.slug}
                        className="flex flex-col gap-4 border border-[#262E31] bg-[#111719] p-6 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex flex-col gap-2">
                          <span className="font-sans text-[19px] font-light text-[#F1F3F2]">
                            {c.title}
                          </span>
                          <span className="font-mono text-[12px] leading-[1.6] text-[#9AA3A1]">
                            {c.schedule}
                          </span>
                        </div>
                        <div className="flex flex-col items-start gap-3 md:items-end">
                          {c.status === "full" ? (
                            <>
                              <StatusChip status="full" />
                              <span className="font-mono text-[11px] text-[#565F62]">
                                {"// sin cupo por ahora — avisamos cuando se abra"}
                              </span>
                            </>
                          ) : (
                            <Link
                              href={`/workshops/${c.slug}#precio`}
                              className="border border-[#2F3A3D] px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] uppercase text-[#9AA3A1] hover:text-[#F1F3F2] hover:border-[#9AA3A1] transition-colors"
                            >
                              reservar cupo
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          );
        })()
      )}
    </div>
  );
}

export default function EstudiantesPage() {
  return (
    <AuthGuard>
      <ProfileGuard>
        <StudentHome />
      </ProfileGuard>
    </AuthGuard>
  );
}
