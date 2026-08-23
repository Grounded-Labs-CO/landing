"use client";
import { AuthGuard } from "@/components/AuthGuard";
import { useRole } from "@/hooks/useRole";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

const STATUS_META: Record<string, { label: string; className: string }> = {
  active: { label: "activo", className: "bg-[#1C2427] text-[#7FC7A3] border border-[#262E31]" },
  full: { label: "lleno", className: "bg-[#5D4A2F] text-[#E2C084] border border-[#5D4A2F]" },
  completed: { label: "dictado", className: "bg-[#2F3A3D] text-[#9AA3A1] border border-[#2F3A3D]" },
  disabled: { label: "desactivado", className: "bg-[#5D2F2F] text-[#E2A084] border border-[#5D2F2F]" },
};

function AdminPanel() {
  const { isAdmin, isLoading } = useRole();
  const [tab, setTab] = useState<"estudiantes" | "cursos" | "invitar">("estudiantes");

  // Estudiantes
  const allStudents = useQuery(api.admin.listAllStudents);
  const registrations = useQuery(api.admin.listRegistrations);
  const markPaid = useMutation(api.admin.markRegistrationPaid);
  const inviteStudent = useMutation(api.admin.inviteStudent);
  const deleteUser = useMutation(api.admin.deleteUser);
  const removeInvite = useMutation(api.admin.removeInvite);
  const sendInviteEmail = useAction(api.admin.sendInviteEmail);

  // Cursos
  const courses = useQuery(api.admin.listCoursesAdmin);
  const selectableCourses = (courses ?? []).filter(
    (c: any) => (c.status ?? "active") !== "disabled",
  );
  const updateCourse = useMutation(api.admin.updateCourse);
  const setCourseStatus = useMutation(api.admin.setCourseStatus);
  const [editCourseId, setEditCourseId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTagline, setEditTagline] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editSchedule, setEditSchedule] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editEventInfo, setEditEventInfo] = useState("");

  // Invitar
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteWorkshop, setInviteWorkshop] = useState("finanzas-personales-ia");
  const [inviteAsPaid, setInviteAsPaid] = useState(true);
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);

  // Filtros estudiantes — por estado de pago del curso
  const [filter, setFilter] = useState<"todos" | "pagado" | "por_pagar">("todos");
  const [search, setSearch] = useState("");

  const filteredStudents = (allStudents ?? []).filter((s) => {
    const q = search.toLowerCase();
    if (q && !(s.email?.toLowerCase().includes(q) || s.name?.toLowerCase().includes(q)))
      return false;
    if (filter === "pagado") return s.workshopStatus === "paid";
    if (filter === "por_pagar") return s.workshopStatus === "pending";
    return true;
  });

  if (isLoading) return <p className="mt-8 font-mono text-[12px] text-[#6C7573]">cargando…</p>;
  if (!isAdmin)
    return (
      <div className="mt-8 border border-[#262E31] bg-[#1C2427] p-6">
        <div className="h-[1.5px] w-8 bg-[#B4552B]"></div>
        <p className="mt-3 font-mono text-[12px] leading-[1.7] text-[#9AA3A1]">
          {"// acceso denegado"}
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
                ["pagado", "pagado"],
                ["por_pagar", "por pagar"],
              ].map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setFilter(v as any)}
                  className={`px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase border ${
                    filter === v
                      ? "border-[#B4552B] bg-[#1C2427] text-[#F1F3F2]"
                      : "border-[#262E31] text-[#6C7573] hover:border-[#9AA3A1] hover:text-[#F1F3F2]"
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
                <div
                  key={String(s.userId)}
                  className="border border-[#262E31] bg-[#111719] p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-mono text-[13px] text-[#DDE2E0] truncate">
                      {s.email ?? s.userId}
                    </span>
                    <span className="font-mono text-[11px] text-[#6C7573]">
                      {s.name ?? "—"} {s.phone ? `· ${s.phone}` : ""} · {s.role ?? (s.workshopSlug ? "invitado" : "usuario")} · cupo:{s.workshopStatus === "paid" ? "pagado" : s.workshopStatus === "pending" ? "pendiente" : "—"}
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {s.workshopStatus === "pending" && (
                      <button
                        onClick={() =>
                          void markPaid({
                            email: s.email!,
                            workshopSlug: s.workshopSlug ?? "finanzas-personales-ia",
                          })
                        }
                        className="border border-[#5D4A2F] px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase text-[#E2C084] hover:bg-[#5D4A2F] hover:text-[#F1F3F2]"
                      >
                        marcar pagado
                      </button>
                    )}
                    {s.workshopStatus === "paid" && (
                      <span className="px-2 py-1 font-mono text-[11px] text-[#7FC7A3]">✓ pagado</span>
                    )}
                    <button
                      onClick={() => {
                        if (s.userId) {
                          if (!confirm(`¿Borrar permanentemente a ${s.email ?? s.userId}?`)) return;
                          if (
                            !confirm(
                              "Esto NO se puede deshacer. Se eliminarán su cuenta, sesiones y todos sus registros. ¿Confirmás?",
                            )
                          )
                            return;
                          void deleteUser({ userId: s.userId as any }).catch((e: any) =>
                            alert(e.message ?? "error"),
                          );
                        } else {
                          if (!confirm(`¿Quitar la invitación de ${s.email}?`)) return;
                          void removeInvite({
                            email: s.email!,
                            workshopSlug: s.workshopSlug ?? "finanzas-personales-ia",
                          }).catch((e: any) => alert(e.message ?? "error"));
                        }
                      }}
                      className="border border-[#5D2F2F] px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase text-[#E2A084] hover:bg-[#5D2F2F] hover:text-[#F1F3F2]"
                    >
                      {s.userId ? "borrar" : "quitar"}
                    </button>
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
              <div
                key={c._id}
                className="border border-[#262E31] bg-[#111719] p-5 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#B4552B]">
                      {c.slug}
                    </span>
                    <h3 className="mt-1 font-sans text-[18px] font-light text-[#F1F3F2]">
                      {c.title}
                    </h3>
                    <p className="font-mono text-[11px] text-[#6C7573]">
                      {c.tagline} · {c.schedule} · {c.price}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 font-mono text-[11px] uppercase ${STATUS_META[(c as any).status ?? "active"]?.className ?? "bg-[#1C2427] text-[#7FC7A3] border border-[#262E31]"}`}
                  >
                    {STATUS_META[(c as any).status ?? "active"]?.label ?? "activo"}
                  </span>
                </div>
                {editCourseId === c._id ? (
                  <div className="flex flex-col gap-3 border-t border-[#262E31] pt-4">
                    <label className="flex flex-col gap-1">
                      <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[#6C7573]">título *</span>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Ej: Asistente Financiero con IA"
                        className="border border-[#262E31] bg-[#0E1214] px-3 py-2 font-mono text-[12px] text-[#F1F3F2] outline-none focus:border-[#B4552B]"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[#6C7573]">tagline</span>
                      <input
                        value={editTagline}
                        onChange={(e) => setEditTagline(e.target.value)}
                        placeholder="Ej: Tu asistente financiero, andando"
                        className="border border-[#262E31] bg-[#0E1214] px-3 py-2 font-mono text-[12px] text-[#F1F3F2] outline-none focus:border-[#B4552B]"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[#6C7573]">slug (URL) *</span>
                      <input
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                        placeholder="finanzas-personales-ia"
                        className="border border-[#262E31] bg-[#0E1214] px-3 py-2 font-mono text-[12px] text-[#F1F3F2] outline-none focus:border-[#B4552B]"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[#6C7573]">fecha / horario</span>
                      <input
                        value={editSchedule}
                        onChange={(e) => setEditSchedule(e.target.value)}
                        placeholder="Ej: Sábado 26 sep · 4 horas · Medellín"
                        className="border border-[#262E31] bg-[#0E1214] px-3 py-2 font-mono text-[12px] text-[#F1F3F2] outline-none focus:border-[#B4552B]"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[#6C7573]">precio (COP) *</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={1000}
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        placeholder="400000"
                        className="border border-[#262E31] bg-[#0E1214] px-3 py-2 font-mono text-[12px] text-[#F1F3F2] outline-none focus:border-[#B4552B]"
                      />
                      <span className="font-mono text-[10px] text-[#565F62]">{editPrice ? `→ $${Number(editPrice).toLocaleString("es-CO")} COP` : "ej: 400000"}</span>
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[#6C7573]">eventInfo (JSON)</span>
                      <textarea
                        value={editEventInfo}
                        onChange={(e) => setEditEventInfo(e.target.value)}
                        placeholder='[{"label":"fecha","value":"26 sep"},{"label":"lugar","value":"Medellín"}]'
                        rows={3}
                        className="border border-[#262E31] bg-[#0E1214] px-3 py-2 font-mono text-[11px] text-[#F1F3F2] outline-none focus:border-[#B4552B]"
                      />
                      <span className="font-mono text-[10px] text-[#565F62]">formato: array de {"{label, value}"} — deja vacío para no cambiar</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          let eventInfo: { label: string; value: string }[] | undefined;
                          if (editEventInfo.trim()) {
                            try {
                              eventInfo = JSON.parse(editEventInfo);
                            } catch {
                              alert("eventInfo no es JSON válido");
                              return;
                            }
                          }
                          // price se guarda como string con formato $400k o número; normalizamos a "$400.000"
                          let priceStr: string | undefined;
                          if (editPrice) {
                            const n = Number(editPrice);
                            priceStr = isNaN(n) ? editPrice : `$${n.toLocaleString("es-CO")}`;
                          }
                          await updateCourse({
                            courseId: c._id,
                            patch: {
                              title: editTitle || undefined,
                              tagline: editTagline || undefined,
                              slug: editSlug || undefined,
                              schedule: editSchedule || undefined,
                              price: priceStr,
                              eventInfo,
                            } as any,
                          });
                          setEditCourseId(null);
                        }}
            className="bg-[#B4552B] px-4 py-2 font-mono text-[11px] uppercase text-[#0E1214] hover:bg-[#9A4A24] disabled:bg-[#5D4A2F] disabled:text-[#3A1C0C] disabled:cursor-not-allowed disabled:hover:bg-[#5D4A2F]"
                      >
                        guardar
                      </button>
                      <button
                        onClick={() => setEditCourseId(null)}
                        className="border border-[#262E31] px-4 py-2 font-mono text-[11px] uppercase text-[#6C7573] hover:text-[#F1F3F2]"
                      >
                        cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => {
                        setEditCourseId(c._id);
                        setEditTitle(c.title);
                        setEditTagline((c as any).tagline ?? "");
                        setEditSlug(c.slug);
                        setEditPrice(String((c.price ?? "").replace(/[^0-9]/g, "")));
                        setEditSchedule(c.schedule);
                        setEditEventInfo(JSON.stringify((c as any).eventInfo ?? [], null, 2));
                      }}
                      className="border border-[#262E31] px-3 py-1.5 font-mono text-[11px] uppercase text-[#9AA3A1] hover:text-[#F1F3F2]"
                    >
                      editar
                    </button>
                    <select
                      value={(c as any).status ?? "active"}
                      onChange={(e) => void setCourseStatus({ courseId: c._id, status: e.target.value as any })}
                      className="border border-[#262E31] bg-[#0E1214] px-3 py-1.5 font-mono text-[11px] uppercase text-[#F1F3F2] outline-none focus:border-[#B4552B]"
                    >
                      <option value="active">activo</option>
                      <option value="full">lleno</option>
                      <option value="completed">dictado</option>
                      <option value="disabled">desactivado</option>
                    </select>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === "invitar" && (
        <div className="mt-6 border border-[#262E31] bg-[#111719] p-6 flex flex-col gap-4">
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#B4552B]">
            invitar a curso
          </span>
          <p className="font-mono text-[11px] leading-[1.6] text-[#6C7573]">
            Crea o activa la cuenta y la deja como <span className="text-[#E2C084]">pagado</span> si
            marcas la casilla. Solo email.
          </p>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[11px] uppercase text-[#6C7573]">email</span>
            <input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="alguien@correo.com"
              className="border border-[#262E31] bg-[#0E1214] px-3 py-2 font-mono text-[13px] text-[#F1F3F2]"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[11px] uppercase text-[#6C7573]">workshop</span>
            <select
              value={inviteWorkshop}
              onChange={(e) => setInviteWorkshop(e.target.value)}
              disabled={selectableCourses.length === 0}
              className="border border-[#262E31] bg-[#0E1214] px-3 py-2 font-mono text-[13px] text-[#F1F3F2] outline-none focus:border-[#B4552B] disabled:opacity-50"
            >
              {selectableCourses.length === 0 ? (
                <option value="">— sin cursos disponibles —</option>
              ) : (
                selectableCourses.map((c: any) => (
                  <option key={c._id} value={c.slug}>
                    {c.title} · {c.slug}
                  </option>
                ))
              )}
            </select>
            {selectableCourses.length === 0 && (
              <span className="font-mono text-[10px] text-[#565F62]">
                no hay cursos disponibles para invitar (solo se ocultan los desactivados)
              </span>
            )}
          </label>
          <label className="flex items-center gap-2 font-mono text-[11px] text-[#9AA3A1]">
            <input
              type="checkbox"
              checked={inviteAsPaid}
              onChange={(e) => setInviteAsPaid(e.target.checked)}
              className="accent-[#B4552B]"
            />{" "}
            pagado (acceso directo a material)
          </label>
          <button
            disabled={selectableCourses.length === 0 || !inviteWorkshop}
            onClick={async () => {
              setInviteMsg(null);
              try {
                const res = await inviteStudent({
                  email: inviteEmail,
                  workshopSlug: inviteWorkshop,
                  asPaid: inviteAsPaid,
                });
                setInviteEmail("");
                if (res.created) {
                  try {
                    await sendInviteEmail({ email: inviteEmail, workshopSlug: inviteWorkshop });
                    setInviteMsg(
                      `✓ invitado ${inviteEmail} como ${inviteAsPaid ? "pagado" : "pendiente"} · correo enviado`,
                    );
                  } catch {
                    setInviteMsg(`✓ invitado ${inviteEmail} · no se pudo enviar el correo`);
                  }
                } else {
                  setInviteMsg(
                    `✓ ${inviteEmail} ya estaba invitado · actualizado a ${inviteAsPaid ? "pagado" : "pendiente"}`,
                  );
                }
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
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">
          Admin
        </span>
        <h1 className="mt-3 font-sans text-[32px] font-light tracking-[-0.02em] text-[#F1F3F2]">
          Panel de administración
        </h1>
        <AdminPanel />
      </div>
    </AuthGuard>
  );
}
