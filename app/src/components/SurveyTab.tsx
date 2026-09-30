"use client";
import { useAction, useMutation, useQuery } from "convex/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../convex/_generated/api";
import {
  type ResponseRow,
  computeNps,
  errText,

  labelFor,
  npsVerdict,
  responsesToCsv,
} from "@/lib/survey";
import { SurveyEmailPreview } from "@/components/SurveyEmailPreview";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ChevronDownIcon } from "lucide-react";

// Pestaña "encuesta" del admin. Tres bloques, en el orden en que se usan:
//   1. Datos de la sesión virtual de seguimiento (contenido del correo #2).
//   2. Los inscritos al curso: se seleccionan y se les manda el correo #1.
//   3. Respuestas + NPS + CSV.
//
// Hoy hay un solo curso con encuesta, así que el slug es una constante en vez
// de un selector; cuando haya una segunda cohorte se cambia por un dropdown.

const COURSE = "finanzas-personales-ia";

type StudentLite = {
  email: string | null;
  name: string | null;
  workshopSlug: string | null;
  workshopStatus: string | null;
};

type InviteRow = {
  token: string;
  email: string;
  name: string;
  sentAt: number | null;
  responded: boolean;
};

type SessionRow = {
  title: string;
  date?: string;
  startTime?: string;
  joinUrl?: string;
  agenda: string[];
};

/** Sub-tabs: un bloque a la vez. */
type View = "invitar" | "respuestas" | "sesion";

type Attendee = {
  email: string;
  name: string;
  status: "sin_enviar" | "enviado" | "respondio" | "externo";
  sentAt: number | null;
  token: string | null;
};

/**
 * Estado de una persona frente a la encuesta. Lo que decide si se le puede
 * volver a invitar.
 */
function attendeeStatus(isEnrolled: boolean, invite: InviteRow | undefined): Attendee["status"] {
  if (!isEnrolled) return "externo";
  if (invite?.responded) return "respondio";
  return invite?.sentAt != null ? "enviado" : "sin_enviar";
}

/** Orden del listado: primero a quien todavía no le llega el correo. */
const STATUS_RANK: Record<Attendee["status"], number> = {
  sin_enviar: 0,
  enviado: 1,
  respondio: 2,
  externo: 3,
};

/**
 * Los tres estados, escritos como lo que son en vez de como se llaman por
 * dentro. Antes se llamaban draft/open/closed y no se entendían.
 */
const FILTERS = {
  faltan: "faltan",
  todos: "todos",
  respondieron: "respondieron",
} as const;
type FilterKey = keyof typeof FILTERS;

export function SurveyTab({ students }: { students: StudentLite[] }) {
  const courseSlug = COURSE;
  const session = useQuery(api.survey.getSession, { courseSlug });
  const invites = useQuery(api.survey.listInvites, { courseSlug });
  const responses = useQuery(api.survey.listResponses, { courseSlug });

  const createInvites = useMutation(api.survey.createInvites);
  const deleteResponse = useMutation(api.survey.deleteResponse);
  const sendInvites = useAction(api.survey.sendInvites);
  const resendConfirmation = useAction(api.survey.resendConfirmation);

  const [msg, setMsg] = useState<{ tone: "ok" | "bad"; text: string } | null>(null);
  const say = (tone: "ok" | "bad", text: string) => setMsg({ tone, text });

  // Un bloque a la vez (mismo patrón de tabs del panel): con los tres abiertos
  // había que hacer mucho scroll para llegar al botón de enviar.
  //
  // Arranca en "invitar", que es lo que se quiere hacer —PERO si todavía no hay
  // fecha de sesión, ahí no se puede invitar, así que abre en "sesión": es el
  // primer paso de verdad y dejarlo de entrada evita el callejón sin salida.
  const [view, setView] = useState<View>("invitar");
  const [viewDecided, setViewDecided] = useState(false);
  if (!viewDecided) {
    // Solo una vez, cuando la query ya respondió (si no, `session` es undefined
    // y siempre caería en "sesión").
    if (session !== undefined) {
      setViewDecided(true);
      if (!session?.date) setView("sesion");
    }
  }

  // --- Sesión ---
  const editing = session as SessionRow | null;

  // Sin fecha no hay correo con datos que mandar, así que tampoco se puede
  // invitar. Es la misma regla que verifica `sendInvites` en el servidor.
  const hasDate = !!editing?.date;

  // --- Seleccion de inscritos ---
  const inviteRows = useMemo(() => (invites ?? []) as InviteRow[], [invites]);

  // Inscritos al curso (pagados y pendientes) + cualquiera que ya tenga un
  // link, aunque no esté en la plataforma (invitado manual).
  const attendees = useMemo<Attendee[]>(() => {
    const byEmail = new Map(inviteRows.map((i) => [i.email, i]));
    const enrolled = students
      .filter((s) => s.workshopSlug === courseSlug && s.email)
      .map((s) => s.email!.toLowerCase());
    const emails = [...new Set([...enrolled, ...byEmail.keys()])];

    const nameByEmail = new Map(
      students.filter((s) => s.email).map((s) => [s.email!.toLowerCase(), s.name ?? ""]),
    );

    return emails
      .map((email): Attendee => {
        const invite = byEmail.get(email);
        const isEnrolled = enrolled.includes(email);
        return {
          email,
          name: nameByEmail.get(email) || invite?.name || "",
          status: attendeeStatus(isEnrolled, invite),
          sentAt: invite?.sentAt ?? null,
          token: invite?.token ?? null,
        };
      })
      .sort(
        (a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status] || a.email.localeCompare(b.email),
      );
  }, [students, inviteRows, courseSlug]);

  const [filter, setFilter] = useState<FilterKey>("faltan");
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  // Borrar una respuesta pide DOS confirmaciones: es destructivo y no se puede
  // deshacer, así que un solo clic no puede bastar.
  const [borrar, setBorrar] = useState<{
    paso: 1 | 2;
    token: string;
    nombre: string;
  } | null>(null);
  const [sendBusy, setSendBusy] = useState(false);
  const seeded = useRef(false);

  // Primera pasada: quedan marcados los que nunca han recibido el correo. Los
  // que ya lo tienen NO se preseleccionan, porque ahí "enviar" es reenviar.
  useEffect(() => {
    if (seeded.current || attendees.length === 0) return;
    seeded.current = true;
    setSelected(new Set(attendees.filter((a) => a.status === "sin_enviar").map((a) => a.email)));
  }, [attendees]);

  const visible = useMemo(() => {
    if (filter === "faltan") return attendees.filter((a) => a.status !== "respondio");
    if (filter === "respondieron") return attendees.filter((a) => a.status === "respondio");
    return attendees;
  }, [attendees, filter]);

  // A los que ya respondieron no se les puede volver a invitar.
  const selectable = visible.filter((a) => a.status !== "respondio");
  const selectedList = selectable.filter((a) => selected.has(a.email));

  const toggle = (email: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });

  const selectAll = () => setSelected(new Set(selectable.map((a) => a.email)));
  const selectNone = () => setSelected(new Set());

  const send = async (emails: string[]) => {
    // Misma regla que aplica `sendInvites` en el servidor: sin fecha de sesión
    // el correo #1 promete datos que no existen, así que no se manda.
    if (!hasDate) {
      say("bad", "primero ponle la fecha a la sesión de seguimiento (pestaña “sesión”).");
      setView("sesion");
      return;
    }
    if (emails.length === 0) {
      say("bad", "no hay nadie seleccionado.");
      return;
    }
    setSendBusy(true);
    try {
      // Un paso: se crea (o se reutiliza) el link de cada persona y se manda.
      const nameByEmail = new Map(attendees.map((a) => [a.email, a.name]));
      const made = await createInvites({
        courseSlug,
        entries: emails.map((email) => ({ email, name: nameByEmail.get(email) || undefined })),
      });
      const res = await sendInvites({ courseSlug, tokens: made.map((m) => m.token) });
      const failed = res.failed.length;
      const nuevos = made.filter((m) => !m.reused).length;
      if (failed > 0) {
        say(
          "bad",
          `${res.sent.length} enviado(s), ${failed} fallaron: ` +
            res.failed.map((f) => `${f.email} (${f.error})`).join(", "),
        );
      } else {
        say(
          "ok",
          `correo enviado a ${res.sent.length} persona(s)` +
            (nuevos > 0 ? ` · ${nuevos} link(s) nuevo(s)` : " · reenvío"),
        );
        setSelected(new Set());
      }
    } catch (e: unknown) {
      say("bad", errText(e));
    } finally {
      setSendBusy(false);
    }
  };

  const copyLink = async (token: string) => {
    const url = `${window.location.origin}/encuesta?t=${token}`;
    try {
      await navigator.clipboard.writeText(url);
      say("ok", `link copiado: ${url}`);
    } catch {
      say("ok", url);
    }
  };

  // --- Respuestas ---
  const rows = useMemo(
    () => (responses ?? []) as unknown as ResponseRow[],
    [responses],
  );
  const nps = useMemo(() => computeNps(rows.map((r) => r.nps)), [rows]);
  const verdict = npsVerdict(nps.nps);
  const counts = {
    sinEnviar: attendees.filter((a) => a.status === "sin_enviar").length,
    enviado: attendees.filter((a) => a.status === "enviado").length,
    respondio: attendees.filter((a) => a.status === "respondio").length,
  };

  const download = () => {
    const blob = new Blob([`﻿${responsesToCsv(rows)}`], {
      type: "text/csv;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `encuesta-cierre-${courseSlug}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="mt-6 flex flex-col gap-4">
      {msg && (
        <div
          className={`border p-4 font-mono text-[11px] leading-[1.7] ${
            msg.tone === "ok"
              ? "border-[#262E31] bg-[#111719] text-[#7FC7A3]"
              : "border-[#5D2F2F] bg-[#1C1616] text-[#E2A084]"
          }`}
        >
          {`// ${msg.text}`}
        </div>
      )}

      {/* Sub-tabs: un bloque a la vez, como las pestañas del panel. Evita el
          scroll largo de tener los tres apilados. */}
      <div className="flex flex-wrap border border-[#262E31]">
        {(
          [
            ["sesion", "1 · sesión", 0],
            ["invitar", "2 · invitar", counts.sinEnviar + counts.enviado],
            ["respuestas", "3 · respuestas", rows.length],
          ] as const
        ).map(([id, label, n]) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`border-r border-[#262E31] px-4 py-2.5 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors last:border-r-0 sm:text-[11px] ${
              view === id ? "bg-[#1C2427] text-[#F1F3F2]" : "text-[#6C7573] hover:text-[#F1F3F2]"
            }`}
          >
            {label}
            {n > 0 ? <span className="ml-2 text-[#565F62]">{n}</span> : null}
          </button>
        ))}
      </div>

      {view === "sesion" && (
        <Panel
          title="1 · sesión de seguimiento"
          hint="Una sola por workshop. Lo que pongas aquí es lo que llega en el correo cuando alguien responde la encuesta. La fecha es lo único obligatorio: sin ella no se puede invitar."
        >
          <SessionForm
            courseSlug={courseSlug}
            session={editing}
            onSaved={() => undefined}
            say={say}
          />
        </Panel>
      )}

      {view === "invitar" && (
        <Panel
        title="2 · invitar a los inscritos"
        hint="Marca a quién le mandas el correo. Cada persona recibe un link propio, con su nombre y su correo ya puestos, para que no los escriba mal. Si ya lo recibió, volver a marcarlo reenvía."
        right={
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#6C7573]">
            {counts.sinEnviar} sin enviar · {counts.enviado} sin responder ·{" "}
            {counts.respondio} respondieron
          </span>
        }
      >
        {/* El correo #2 ES el de los datos de la sesión, así que sin una fecha
            confirmada el que responde no se lleva nada por correo. */}
        {!hasDate && (
          <p className="mb-4 border border-[#5D4A2F] bg-[#1C1611] px-3 py-2.5 font-mono text-[11px] leading-[1.7] text-[#E2C084]">
            {
              "// no hay ninguna fecha de sesión confirmada (pestaña “sesión”). Se puede invitar igual, pero quien responda no recibirá correo con los datos: solo los verá en la pantalla de gracias."
            }
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(FILTERS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key as FilterKey)}
              className={`border px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] uppercase transition-colors ${
                filter === key
                  ? "border-[#B4552B] bg-[#1C2427] text-[#F1F3F2]"
                  : "border-[#262E31] text-[#6C7573] hover:border-[#9AA3A1] hover:text-[#F1F3F2]"
              }`}
            >
              {label}
            </button>
          ))}
          <span className="ml-auto flex gap-2">
            <button
              onClick={selectAll}
              disabled={selectable.length === 0}
              className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6C7573] underline decoration-current/30 underline-offset-4 transition-colors hover:text-[#F1F3F2] disabled:opacity-40"
            >
              marcar todos
            </button>
            <button
              onClick={selectNone}
              disabled={selected.size === 0}
              className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6C7573] underline decoration-current/30 underline-offset-4 transition-colors hover:text-[#F1F3F2] disabled:opacity-40"
            >
              ninguno
            </button>
          </span>
        </div>

        <div className="mt-3 border border-[#262E31]">
          {attendees.length === 0 ? (
            <p className="p-4 font-mono text-[11px] leading-[1.7] text-[#565F62]">
              {"// no hay inscritos en este curso todavía"}
            </p>
          ) : (
            <ul className="max-h-[420px] overflow-y-auto">
              {visible.map((a) => {
                const done = a.status === "respondio";
                const on = selected.has(a.email);
                return (
                  <li
                    key={a.email}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-[#1C2427] px-3 py-2 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      disabled={done}
                      onChange={() => toggle(a.email)}
                      aria-label={`Invitar a ${a.name || a.email}`}
                      className="h-4 w-4 shrink-0 accent-[#B4552B]"
                    />
                    <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-[#DDE2E0]">
                      {a.name ? `${a.name} · ` : ""}
                      {a.email}
                    </span>
                    <StatusPill status={a.status} />
                    {a.token && (
                      <>
                        <RowAction onClick={() => void copyLink(a.token!)}>
                          copiar link
                        </RowAction>
                        {!done && (
                          <RowAction
                            onClick={() => {
                              if (a.status === "enviado") void send([a.email]);
                            }}
                            disabled={a.status !== "enviado"}
                          >
                            reenviar
                          </RowAction>
                        )}
                        {done && (
                          <RowAction
                            onClick={async () => {
                              try {
                                await resendConfirmation({ courseSlug, token: a.token! });
                                say("ok", `info de la sesión reenviada a ${a.email}.`);
                              } catch (e: unknown) {
                                say("bad", errText(e));
                              }
                            }}
                          >
                            reenviar info
                          </RowAction>
                        )}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            onClick={() => void send(selectedList.map((a) => a.email))}
            disabled={sendBusy || selectedList.length === 0 || !hasDate}
            className="bg-[#B4552B] px-5 py-2.5 font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-[#0E1214] transition-colors hover:bg-[#9A4A24] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {!hasDate
              ? "sin fecha de sesión"
              : sendBusy
                ? "enviando…"
                : selectedList.some((a) => a.status === "enviado")
                  ? `enviar / reenviar a ${selectedList.length}`
                  : `enviar a ${selectedList.length}`}
          </button>
          {!hasDate && (
            <button
              onClick={() => setView("sesion")}
              className="border border-[#2F3A3D] px-4 py-2.5 font-mono text-[11px] tracking-[0.12em] uppercase text-[#9AA3A1] transition-colors hover:border-[#9AA3A1] hover:text-[#F1F3F2]"
            >
              ir a poner la fecha →
            </button>
          )}
          <p className="font-mono text-[10px] leading-[1.6] text-[#565F62]">
            {
              "// los que ya respondieron salen bloqueados: no se re-invitan. Para ellos, el botón 'reenviar info' les manda solo los datos de la sesión."
            }
          </p>
        </div>
      </Panel>

      )}

      {view === "respuestas" && (
        <Panel
        title="3 · respuestas"
        hint="NPS = % de 9–10 menos % de 0–6. Con menos de 10 respuestas es orientativo."
        right={
          <button
            onClick={download}
            disabled={rows.length === 0}
            className="border border-[#2F3A3D] px-3 py-2 font-mono text-[10px] tracking-[0.12em] uppercase text-[#9AA3A1] transition-colors hover:border-[#9AA3A1] hover:text-[#F1F3F2] disabled:opacity-40"
          >
            ↓ csv
          </button>
        }
      >
        {rows.length === 0 ? (
          <p className="font-mono text-[11px] leading-[1.7] text-[#565F62]">
            {"// todavía no hay respuestas"}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat
                label="respuestas"
                value={String(rows.length)}
                sub={rows.length < 10 ? "orientativo: menos de 10" : `${counts.respondio} invitaciones`}
              />
              <Stat
                label="NPS"
                value={nps.nps == null ? "—" : String(nps.nps)}
                sub={verdict.label}
                tone={verdict.tone}
              />
              <Stat
                label="9–10 / 7–8 / 0–6"
                value={`${nps.promoters}·${nps.passives}·${nps.detractors}`}
                sub="promotores · pasivos · detractores"
              />
              <Stat
                label="asistente listo"
                value={String(
                  rows.filter((r) => r.assistant === "completo" || r.assistant === "ejemplo")
                    .length,
                )}
                sub={`de ${rows.length}`}
              />
            </div>

            <Counts title="origen de la venta" rows={rows.map((r) => r.channel)} total={rows.length} />
            <Counts title="red cercana" rows={rows.map((r) => r.knewHosts)} total={rows.length} />
            <Counts title="ritmo" rows={rows.map((r) => r.pace)} total={rows.length} />
            <Counts title="precio" rows={rows.map((r) => r.price)} total={rows.length} />
            <Counts title="¿a su empresa?" rows={rows.map((r) => r.b2b)} total={rows.length} />

            <div className="mt-4 flex flex-col gap-3">
              {rows.map((r) => (
                <div key={r._id} className="border border-[#262E31] bg-[#0E1214] p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-mono text-[12px] text-[#DDE2E0]">
                      {r.name} · {r.email}
                    </span>
                    <span className="font-mono text-[11px] text-[#B4552B]">
                      NPS {r.nps}
                      {r.consent === "con_nombre" || r.consent === "sin_nombre"
                        ? " · ✓ publicable"
                        : ""}
                    </span>
                  </div>
                  <button
                    onClick={() => setBorrar({ paso: 1, token: r.token, nombre: r.name })}
                    className="mt-2 font-mono text-[10px] tracking-[0.1em] uppercase text-[#6C7573] underline decoration-current/30 underline-offset-4 transition-colors hover:text-[#E2A084]"
                  >
                    borrar encuesta
                  </button>
                  <p className="mt-2 font-mono text-[10px] leading-[1.7] text-[#6C7573]">
                    {[
                      labelFor(r.assistant),
                      labelFor(r.pace),
                      labelFor(r.price),
                      r.channel === "otro" && r.channelOther
                        ? `Otro (${r.channelOther})`
                        : labelFor(r.channel),
                      labelFor(r.knewHosts),
                      labelFor(r.b2b),
                      (r.interests ?? []).map(labelFor).join(" + "),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {r.npsWhy && <Quote>«{r.npsWhy}»</Quote>}
                  {r.changeOne && <Quote>cambiaría: {r.changeOne}</Quote>}
                </div>
              ))}
            </div>
          </>
        )}
      </Panel>
      )}

      {/* Doble confirmación para borrar una respuesta. El segundo diálogo
          repite el nombre para que no se borre a quien no era. */}
      <ConfirmDialog
        open={borrar !== null}
        onClose={() => setBorrar(null)}
        danger
        title={borrar?.paso === 1 ? "¿Borrar esta encuesta?" : "¿Seguro? No se puede deshacer"}
        description={
          borrar?.paso === 1
            ? `Se borran las respuestas de ${borrar?.nombre || "esta persona"}. La invitación queda, así que puede volver a responder con el mismo link.`
            : `Última confirmación: se borra la encuesta de ${borrar?.nombre || "esta persona"} y no hay forma de recuperarla. Si vuelve a responder, se le manda otra vez el correo con los datos de la sesión.`
        }
        confirmLabel={borrar?.paso === 1 ? "borrar" : "sí, borrar"}
        cancelLabel="mejor no"
        onConfirm={async () => {
          if (!borrar) return;
          if (borrar.paso === 1) {
            setBorrar({ ...borrar, paso: 2 });
            return;
          }
          try {
            const res = await deleteResponse({ token: borrar.token });
            say("ok", res ? `encuesta de ${res.email} borrada.` : "esa encuesta ya no existía.");
          } catch (e: unknown) {
            say("bad", errText(e));
          }
          setBorrar(null);
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Piezas
// ---------------------------------------------------------------------------

const PILL: Record<Attendee["status"], { label: string; className: string }> = {
  sin_enviar: { label: "sin enviar", className: "text-[#565F62]" },
  enviado: { label: "enviado · sin responder", className: "text-[#E2C084]" },
  respondio: { label: "respondió", className: "text-[#7FC7A3]" },
  externo: { label: "fuera de la plataforma", className: "text-[#6C7573]" },
};

function StatusPill({ status }: { status: Attendee["status"] }) {
  const p = PILL[status];
  return (
    <span className={`shrink-0 font-mono text-[10px] tracking-[0.1em] uppercase ${p.className}`}>
      {p.label}
    </span>
  );
}

function RowAction({
  onClick,
  children,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="shrink-0 font-mono text-[10px] tracking-[0.1em] uppercase text-[#6C7573] underline decoration-current/30 underline-offset-4 transition-colors hover:text-[#F1F3F2] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Panel({
  title,
  hint,
  right,
  children,
}: {
  title: string;
  hint?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-[#262E31] bg-[#111719] p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#B4552B]">
          {title}
        </span>
        {right}
      </div>
      {hint && (
        <p className="mt-2 max-w-[70ch] font-mono text-[10px] leading-[1.7] text-[#6C7573]">
          {hint}
        </p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  wide,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  wide?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#6C7573]">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-[#262E31] bg-[#0E1214] px-3 py-2.5 font-mono text-[12px] text-[#F1F3F2] outline-none placeholder:text-[#4A5356] focus:border-[#B4552B]"
      />
    </label>
  );
}

/**
 * Fecha y hora con los controles nativos del sistema: en el celular abren el
 * datepicker del teléfono (que es donde se llena esto) y en escritorio un
 * calendario. Sin dependencias — no hay ninguna lib de fechas en el repo.
 */
function DateField({
  label,
  value,
  onChange,
  type = "date",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "date" | "time";
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#6C7573]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-[#262E31] bg-[#0E1214] px-3 py-2.5 font-mono text-[12px] text-[#F1F3F2] outline-none transition-colors focus:border-[#B4552B] [color-scheme:dark]"
      />
    </label>
  );
}

/**
 * Formulario de una sesión de seguimiento.
 *
 * Vive en su propio componente y el padre lo remonta con `key` al cambiar de
 * sesión: así los campos salen del `session` en el inicializador del estado, sin
 * efectos ni setState durante el render (que es lo que rompía el lint antes).
 */
function SessionForm({
  courseSlug,
  session,
  onSaved,
  say,
}: {
  courseSlug: string;
  session: SessionRow | null;
  onSaved: () => void;
  say: (tone: "ok" | "bad", text: string) => void;
}) {
  const saveSession = useMutation(api.survey.saveSession);

  const [title, setTitle] = useState(session?.title || "Sesión virtual de seguimiento");
  const [date, setDate] = useState(session?.date ?? "");
  const [startTime, setStartTime] = useState(session?.startTime ?? "");
  const [joinUrl, setJoinUrl] = useState(session?.joinUrl ?? "");
  const [agenda, setAgenda] = useState((session?.agenda ?? []).join("\n"));
  const [busy, setBusy] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const saved = !!session?.date;

  const save = async () => {
    setBusy(true);
    try {
      await saveSession({
        courseSlug,
        title: title.trim() || "Sesión virtual de seguimiento",
        date,
        startTime,
        joinUrl,
        agenda: agenda.split("\n"),
      });
      onSaved();
      say("ok", "sesión guardada — esto es lo que llega en el correo.");
    } catch (e: unknown) {
      say("bad", errText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="título" value={title} onChange={setTitle} wide />
        <DateField label="fecha" value={date} onChange={setDate} />
        <DateField label="hora" type="time" value={startTime} onChange={setStartTime} />
        <Field
          label="link de la sesión"
          value={joinUrl}
          onChange={setJoinUrl}
          placeholder="https://meet.google.com/…"
          wide
        />
      </div>

      {!date && (
        <p className="mt-3 border-l-2 border-[#B4552B] bg-[#0E1214] px-3 py-2 font-mono text-[11px] leading-[1.7] text-[#9AA3A1]">
          {"// la fecha es lo único obligatorio: sin ella no se puede invitar"}
        </p>
      )}

      <label className="mt-3 flex flex-col gap-1.5">
        <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#6C7573]">
          qué vamos a ver (una línea por punto, opcional)
        </span>
        <textarea
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
          rows={3}
          placeholder={
            "Las dudas que más repetimos\nCómo mejorarle las preguntas a tu asistente\nQué viene después"
          }
          className="w-full resize-y border border-[#262E31] bg-[#0E1214] px-3 py-2.5 font-mono text-[12px] leading-[1.7] text-[#F1F3F2] outline-none placeholder:text-[#4A5356] focus:border-[#B4552B]"
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={save}
          disabled={busy}
          className="bg-[#B4552B] px-5 py-2.5 font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-[#0E1214] transition-colors hover:bg-[#9A4A24] disabled:opacity-60"
        >
          {busy ? "guardando…" : "guardar sesión"}
        </button>
        {saved && (
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#7FC7A3]">
            guardada
          </span>
        )}
      </div>

      {/* Preview: usa las MISMAS plantillas que el servidor, así que esto es
          literalmente lo que sale por Resend. Va colapsado (como las secciones
          del tab material): es para revisar cuando uno quiere, no para tener un
          iframe ocupando media pantalla siempre. */}
      <div className="mt-6 border-t border-[#262E31] pt-4">
        <button
          onClick={() => setShowPreview((v) => !v)}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span className="font-mono text-[10px] leading-[1.7] text-[#6C7573]">
            {"// ver cómo va a salir el correo de confirmación"}
          </span>
          <ChevronDownIcon
            aria-hidden
            className={`h-4 w-4 shrink-0 text-[#6C7573] transition-transform ${
              showPreview ? "rotate-180" : ""
            }`}
          />
        </button>
        {showPreview && (
          <div className="mt-3">
            <SurveyEmailPreview
              session={{
                title,
                date,
                startTime,
                joinUrl,
                agenda: agenda.split("\n").filter(Boolean),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const TONES = {
  good: "text-[#7FC7A3]",
  warn: "text-[#E2C084]",
  bad: "text-[#E2A084]",
  dim: "text-[#565F62]",
} as const;

function Stat({
  label,
  value,
  sub,
  tone = "dim",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: keyof typeof TONES;
}) {
  return (
    <div className="border border-[#262E31] bg-[#0E1214] p-4">
      <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#6C7573]">
        {label}
      </span>
      <p className="mt-1.5 font-sans text-[26px] font-light leading-none text-[#F1F3F2]">
        {value}
      </p>
      {sub && <p className={`mt-1.5 font-mono text-[10px] ${TONES[tone]}`}>{sub}</p>}
    </div>
  );
}

function Counts({
  title,
  rows,
  total,
}: {
  title: string;
  rows: string[];
  total: number;
}) {
  const counts = rows.reduce<Record<string, number>>((acc, v) => {
    acc[v] = (acc[v] ?? 0) + 1;
    return acc;
  }, {});
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return null;
  return (
    <div className="mt-4 border-t border-[#262E31] pt-3">
      <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#6C7573]">
        {title}
      </span>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
        {entries.map(([value, n]) => (
          <li key={value} className="flex items-baseline gap-2">
            <span className="font-mono text-[11px] text-[#DDE2E0]">{labelFor(value)}</span>
            <span className="font-mono text-[10px] text-[#6C7573]">
              {n} · {Math.round((n / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 border-l border-[#262E31] pl-3 font-sans text-[14px] leading-[1.6] text-[#9AA3A1]">
      {children}
    </p>
  );
}
