"use client";
import { AuthGuard } from "@/components/AuthGuard";
import { useRole } from "@/hooks/useRole";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

function AdminPanel() {
  const { isAdmin, isLoading } = useRole();
  const [tab, setTab] = useState<"estudiantes" | "cursos" | "invitar">("estudiantes");

  // Estudiantes
  const allStudents = useQuery(api.admin.listAllStudents);
  const pendingUsers = useQuery(api.admin.listPendingUsers);
  const registrations = useQuery(api.admin.listRegistrations);
  const approveUser = useMutation(api.admin.approveUser);
  const revokeUser = useMutation(api.admin.revokeUser);
  const markPaid = useMutation(api.admin.markRegistrationPaid);
  const inviteStudent = useMutation(api.admin.inviteStudent);

  // Cursos
  const courses = useQuery(api.admin.listCoursesAdmin);
  const updateCourse = useMutation(api.admin.updateCourse);
  const toggleCourseStatus = useMutation(api.admin.toggleCourseStatus);
  const [editCourseId, setEditCourseId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editSchedule, setEditSchedule] = useState("");

  // Invitar
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteWorkshop, setInviteWorkshop] = useState("finanzas-personales-ia");
  const [inviteAsPaid, setInviteAsPaid] = useState(true);
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);

  // Filtros estudiantes
  const [filter, setFilter] = useState<"todos" | "pendientes" | "activos" | "paid" | "pending">("todos");
  const [search, setSearch] = useState("");

  const filteredStudents = (allStudents ?? []).filter((s) => {
    const q = search.toLowerCase();
    if (q && !(s.email?.toLowerCase().includes(q) || s.name?.toLowerCase().includes(q))) return false;
    if (filter === "pendientes") return s.status === "pending";
    if (filter === "activos") return s.status === "active";
    if (filter === "paid") return s.workshopStatus === "paid";
    if (filter === "pending") return s.workshopStatus === "pending";
    return true;
  });

  if (isLoading) return <p className="mt-8 font-mono text-[12px] text-[#6C7573]">cargando…</p>;
  if (!isAdmin)
    return (
      <div className="mt-8 border border-[#262E31] bg-[#1C2427] p-6">
        <div className="h-[1.5px] w-8 bg-[#B4552B]"></div>
        <p className="mt-3 font-mono text-[12px] leading-[1.7] text-[#9AA3A1]">{"// solo usuarios con rol admin activo."}</p>
        <p className="mt-2 font-mono text-[11px] leading-[1.7] text-[#565F62]">
          {"// primer admin: npx convex run admin:promoteByEmail '{\"email\":\"...\",\"secret\":\"...\",\"role\":\"admin\"}'"}
        </p>
      </div>
    );

  return (
    <>
      {/* TABS */}
      <div className="mt-8 flex border border-[#262E31] max-w-[640px]">
        {[
          ["estudiantes", "estudiantes"],
          ["cursos", "cursos"],
          ["invitar", "invitar"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id as any)}
            className={`flex-1 px-4 py-3 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors ${
              tab === id ? "bg-[#1C2427] text-[#F1F3F2]" : "text-[#6C7573] hover:text-[#9AA3A1]"
            } ${id !== "estudiantes" ? "border-l border-[#262E31]" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "estudiantes" && (
        <>
          {/* Filtros */}
          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                ["todos", "todos"],
                ["pendientes", "pend. cuenta"],
                ["activos", "activos"],
                ["paid", "paid"],
                ["pending", "pending cupo"],
              ].map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setFilter(v as any)}
                  className={`px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase border ${
                    filter === v ? "border-[#B4552B] bg-[#1C2427] text-[#F1F3F2]" : "border-[#262E31] text-[#6C7573] hover:border-[#9AA3A1] hover:text-[#F1F3F2]"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <input
              placeholder="buscar email o nombre"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-[#262E31] bg-[#0E1214] px-3 py-2 font-mono text-[12px] text-[#F1F3F2] outline-none focus:border-[#B4552B] w-full md:w-[260px]"
            />
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-4 font-mono text-[11px] text-[#6C7573]">
            <span>total: {allStudents?.length ?? "…"}</span>
            <span className="text-[#DDE2E0]">·</span>
            <span>pendientes: {pendingUsers?.length ?? "…"}</span>
            <span className="text-[#DDE2E0]">·</span>
            <span>registros: {registrations?.length ?? "…"}</span>
          </div>

          {/* Tabla estudiantes */}
          <div className="mt-6 flex flex-col gap-2">
            {allStudents === undefined ? (
              <p className="font-mono text-[12px] text-[#6C7573]">cargando…</p>
            ) : filteredStudents.length === 0 ? (
              <p className="font-mono text-[12px] text-[#565F62]">{"// sin resultados"}</p>
            ) : (
              filteredStudents.map((s) => (
                <div key={String(s.userId)} className="border border-[#262E31] bg-[#111719] p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-mono text-[13px] text-[#DDE2E0] truncate">{s.email ?? s.userId}</span>
                    <span className="font-mono text-[11px] text-[#6C7573]">
                      {s.name ?? "—"} {s.phone ? `· ${s.phone}` : ""} · {s.role} · cuenta:{s.status} · cupo:{s.workshopStatus ?? "—"}
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {s.status === "pending" && (
                      <button
                        onClick={() => void approveUser({ userId: s.userId as any })}
                        className="border border-[#2F5D43] px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase text-[#7FC7A3] hover:bg-[#2F5D43] hover:text-[#F1F3F2]"
                      >
                        aprobar
                      </button>
                    )}
                    {s.status === "active" && (
                      <button
                        onClick={() => {
                          if (!confirm(`¿Revocar acceso de ${s.email}? No se borra, solo pasa a pending.`)) return;
                          void revokeUser({ userId: s.userId as any });
                        }}
                        className="border border-[#5D2F2F] px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase text-[#C77F7F] hover:bg-[#5D2F2F] hover:text-[#F1F3F2]"
                      >
                        revocar
                      </button>
                    )}
                    {s.workshopStatus === "pending" && (
                      <button
                        onClick={() => void markPaid({ email: s.email!, workshopSlug: s.workshopSlug ?? "finanzas-personales-ia" })}
                        className="border border-[#5D4A2F] px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase text-[#E2C084] hover:bg-[#5D4A2F] hover:text-[#F1F3F2]"
                      >
                        marcar pagado
                      </button>
                    )}
                    {s.workshopStatus === "paid" && <span className="px-2 py-1 font-mono text-[11px] text-[#7FC7A3]">✓ paid</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {tab === "cursos" && (
        <div className="mt-6 flex flex-col gap-3">
          {courses === undefined ? (
            <p className="font-mono text-[12px] text-[#6C7573]">cargando…</p>
          ) : courses.length === 0 ? (
            <p className="font-mono text-[12px] text-[#565F62]">{"// sin cursos"}</p>
          ) : (
            courses.map((c: any) => (
              <div key={c._id} className="border border-[#262E31] bg-[#111719] p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#B4552B]">{c.slug}</span>
                    <h3 className="mt-1 font-sans text-[18px] font-light text-[#F1F3F2]">{c.title}</h3>
                    <p className="font-mono text-[11px] text-[#6C7573]">{c.tagline} · {c.schedule} · {c.price}</p>
                  </div>
                  <span className={`px-2 py-1 font-mono text-[11px] uppercase ${c.status === "archived" ? "bg-[#5D2F2F] text-[#E2A084]" : "bg-[#1C2427] text-[#7FC7A3] border border-[#262E31]"}`}>
                    {c.status}
                  </span>
                </div>
                {editCourseId === c._id ? (
                  <div className="flex flex-col gap-3 border-t border-[#262E31] pt-4">
                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="título" className="border border-[#262E31] bg-[#0E1214] px-3 py-2 font-mono text-[12px] text-[#F1F3F2]" />
                    <input value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="precio" className="border border-[#262E31] bg-[#0E1214] px-3 py-2 font-mono text-[12px] text-[#F1F3F2]" />
                    <input value={editSchedule} onChange={(e) => setEditSchedule(e.target.value)} placeholder="schedule" className="border border-[#262E31] bg-[#0E1214] px-3 py-2 font-mono text-[12px] text-[#F1F3F2]" />
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          await updateCourse({ courseId: c._id, patch: { title: editTitle || undefined, price: editPrice || undefined, schedule: editSchedule || undefined } });
                          setEditCourseId(null);
                        }}
                        className="bg-[#B4552B] px-4 py-2 font-mono text-[11px] uppercase text-[#0E1214]"
                      >
                        guardar
                      </button>
                      <button onClick={() => setEditCourseId(null)} className="border border-[#262E31] px-4 py-2 font-mono text-[11px] uppercase text-[#6C7573]">
                        cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditCourseId(c._id);
                        setEditTitle(c.title);
                        setEditPrice(c.price);
                        setEditSchedule(c.schedule);
                      }}
                      className="border border-[#262E31] px-3 py-1.5 font-mono text-[11px] uppercase text-[#9AA3A1] hover:text-[#F1F3F2]"
                    >
                      editar
                    </button>
                    <button
                      onClick={() => void toggleCourseStatus({ courseId: c._id })}
                      className={`px-3 py-1.5 font-mono text-[11px] uppercase ${c.status === "archived" ? "bg-[#1C2427] text-[#7FC7A3] border border-[#262E31]" : "border border-[#5D2F2F] text-[#C77F7F] hover:bg-[#5D2F2F] hover:text-[#F1F3F2]"}`}
                    >
                      {c.status === "archived" ? "activar" : "archivar"}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === "invitar" && (
        <div className="mt-6 max-w-[480px] border border-[#262E31] bg-[#111719] p-6 flex flex-col gap-4">
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#B4552B]">invitar a curso</span>
          <p className="font-mono text-[11px] leading-[1.6] text-[#6C7573]">Crea o activa la cuenta y la deja como <span className="text-[#E2C084]">paid</span> si marcas la casilla. Solo email.</p>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[11px] uppercase text-[#6C7573]">email</span>
            <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="alguien@correo.com" className="border border-[#262E31] bg-[#0E1214] px-3 py-2 font-mono text-[13px] text-[#F1F3F2]" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[11px] uppercase text-[#6C7573]">workshop</span>
            <input value={inviteWorkshop} onChange={(e) => setInviteWorkshop(e.target.value)} className="border border-[#262E31] bg-[#0E1214] px-3 py-2 font-mono text-[13px] text-[#F1F3F2]" />
          </label>
          <label className="flex items-center gap-2 font-mono text-[11px] text-[#9AA3A1]">
            <input type="checkbox" checked={inviteAsPaid} onChange={(e) => setInviteAsPaid(e.target.checked)} className="accent-[#B4552B]" /> pagado (acceso directo a material)
          </label>
          <button
            onClick={async () => {
              setInviteMsg(null);
              try {
                await inviteStudent({ email: inviteEmail, workshopSlug: inviteWorkshop, asPaid: inviteAsPaid });
                setInviteMsg(`✓ invitado ${inviteEmail} como ${inviteAsPaid ? "paid" : "pending"}`);
                setInviteEmail("");
              } catch (e: any) {
                setInviteMsg(`✗ ${e.message ?? "error"}`);
              }
            }}
            className="bg-[#B4552B] px-4 py-2 font-mono text-[11px] uppercase text-[#0E1214] hover:bg-[#9A4A24]"
          >
            invitar
          </button>
          {inviteMsg && <p className="font-mono text-[11px] text-[#DDE2E0]">{inviteMsg}</p>}
        </div>
      )}
    </>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-[900px] px-6 py-16">
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">Admin</span>
        <h1 className="mt-3 font-sans text-[32px] font-light tracking-[-0.02em] text-[#F1F3F2]">Panel de administración</h1>
        <AdminPanel />
      </div>
    </AuthGuard>
  );
}
