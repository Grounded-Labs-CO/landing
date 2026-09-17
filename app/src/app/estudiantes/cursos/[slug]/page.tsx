"use client";
import { AuthGuard } from "@/components/AuthGuard";
import { ProfileGuard } from "@/components/ProfileGuard";
import { SupportLine } from "@/components/SupportLine";
import type { CourseItem, CourseMaterial, CourseSection, SampleProfile } from "@/lib/material-types";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function Barcode() {
  return (
    <div
      aria-hidden
      className="h-7 w-full opacity-70"
      style={{
        background:
          "repeating-linear-gradient(90deg, #6C7573 0 2px, transparent 2px 5px, #6C7573 5px 8px, transparent 8px 12px, #6C7573 12px 13px, transparent 13px 18px)",
      }}
    />
  );
}

async function downloadZip(fileName: string, files: { name: string; url: string | null }[]) {
  const valid = files.filter((f): f is { name: string; url: string } => !!f.url);
  const res = await fetch("/api/material/zip", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ fileName, files: valid }),
  });
  if (!res.ok) throw new Error("zip");
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(href);
}

function CourseMaterial() {
  const params = useParams<{ slug: string }>();
  const courseSlug = params.slug ?? "";

  const access = useQuery(api.material.myAccess, { courseSlug });

  const unlocked =
    !!access &&
    access.authenticated &&
    access.registrationStatus === "paid";

  const material = useQuery(
    api.material.getCourse,
    unlocked ? { courseSlug } : "skip",
  );

  const [openSection, setOpenSection] = useState<number | null>(null);
  const [zipping, setZipping] = useState<string | null>(null);

  // Sección activa derivada (sin efectos): si el estado aún no apunta a algo
  // válido, cae a la primera.
  const sections = material?.sections ?? [];
  const activeSection = sections.find((s) => s.order === openSection) ?? sections[0];

  return (
    <div className="mx-auto max-w-[960px] px-6 py-12">
      <Link
        href="/estudiantes"
        className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#9AA3A1] hover:text-[#F1F3F2]"
      >
        ← mis cursos
      </Link>

      {access === undefined ? (
        <p className="mt-10 font-mono text-[12px] text-[#6C7573]">cargando…</p>
      ) : !unlocked ? (
        <LockedPanel registrationStatus={access.registrationStatus ?? null} />
      ) : material === undefined ? (
        <p className="mt-10 font-mono text-[12px] text-[#6C7573]">cargando material…</p>
      ) : material === null ? (
        <div className="mt-10 border border-[#262E31] bg-[#111719] p-8 font-mono text-[12px] leading-[1.8] text-[#6C7573]">
          {"// este curso aún no tiene material publicado."}
        </div>
      ) : (
        <>
          {/* WORKSHOP — pase de abordar */}
          <section className="mt-6 border border-[#2F3A3D] bg-[#111719]">
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr]">
              <div className="flex flex-col gap-3 p-7">
                <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B4552B]">
                  [workshop]
                </span>
                <h1 className="font-sans text-[30px] font-light leading-[1.15] tracking-[-0.02em] text-[#F1F3F2]">
                  {material.title}
                </h1>
                <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1 font-mono text-[11px] tracking-[0.06em] text-[#9AA3A1]">
                  <span>
                    pasajero: <span className="text-[#DDE2E0]">{material.passengerName ?? material.email}</span>
                  </span>
                  <span>
                    estado: <span className="text-[#7FC7A3]">cupo pagado ✓</span>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-dashed border-[#2F3A3D] p-7 md:border-l md:border-t-0">
                {material.eventInfo.slice(0, 4).map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#6C7573]">
                      {item.label}
                    </span>
                    <span className="font-mono text-[12px] leading-[1.5] text-[#DDE2E0]">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#2F3A3D] px-7 py-3">
              <div className="min-w-[180px] flex-1">
                <Barcode />
              </div>
              {material.calendarUrl && (
                <a
                  href={material.calendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 border border-[#2F3A3D] px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-[#9AA3A1] transition-colors hover:border-[#9AA3A1] hover:text-[#F1F3F2]"
                >
                  agregar al calendario ↗
                </a>
              )}
            </div>
          </section>

          {/* RECURSOS */}
          <section className="mt-10">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B4552B]">
              [recursos]
            </span>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {material.sections.map((section) => {
                const num = String(section.order).padStart(2, "0");
                const active = activeSection?.order === section.order;
                return (
                  <button
                    key={section.order}
                    onClick={() => setOpenSection(section.order)}
                    className={`flex flex-col gap-2 border p-5 text-left transition-colors ${
                      active
                        ? "border-[#B4552B] bg-[#1C2427]"
                        : "border-dashed border-[#2F3A3D] bg-[#111719] hover:border-[#9AA3A1]"
                    }`}
                  >
                    <span
                      className={`font-mono text-[11px] tracking-[0.14em] ${
                        active ? "text-[#B4552B]" : "text-[#6C7573]"
                      }`}
                    >
                      {num}
                    </span>
                    <span className="font-sans text-[17px] font-light text-[#F1F3F2]">
                      {section.title}
                    </span>
                    <span className="font-mono text-[11px] leading-[1.5] text-[#9AA3A1]">
                      {section.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* DETALLE DE LA SECCIÓN SELECCIONADA */}
          <section className="mt-8 border border-[#262E31] bg-[#111719] p-7">
            {activeSection && (
              <SectionDetail
                key={activeSection.order}
                section={activeSection}
                material={material}
                zipping={zipping}
                setZipping={setZipping}
              />
            )}
          </section>

          <div className="mt-8">
            <SupportLine />
          </div>
        </>
      )}
    </div>
  );
}

function SectionDetail({
  section,
  material,
  zipping,
  setZipping,
}: {
  section: CourseSection;
  material: CourseMaterial;
  zipping: string | null;
  setZipping: (slug: string | null) => void;
}) {
  const num = String(section.order).padStart(2, "0");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[11px] tracking-[0.14em] text-[#6C7573]">
          {num} · {section.title.toLowerCase()}
        </span>
      </div>

      {section.kind === "info" && (
        <>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {material.eventInfo.map((item) => (
              <div key={item.label} className="flex flex-col gap-1 border-l-2 border-[#B4552B] pl-4">
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#6C7573]">
                  {item.label}
                </span>
                <span className="font-mono text-[13px] leading-[1.6] text-[#DDE2E0]">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-[#B4552B]/50 underline-offset-4 transition-colors hover:text-[#E2A084]"
                    >
                      {item.value}
                      <span className="whitespace-nowrap">&nbsp;↗</span>
                    </a>
                  ) : (
                    item.value
                  )}
                </span>
              </div>
            ))}
          </div>
          <ParkingCard />
          {section.items
            .filter((item) => item.imageUrl)
            .map((item) => (
              <figure
                key={item.title}
                className="flex flex-col gap-3 border border-[#262E31] bg-[#0E1214] p-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl!}
                  alt={item.title}
                  className="w-full max-w-[380px] self-start"
                />
                <figcaption className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#6C7573]">
                  {item.title}
                </figcaption>
              </figure>
            ))}
          <p className="font-mono text-[11px] tracking-[0.08em] leading-[1.7] text-[#6C7573]">
            {"// café, snacks y buena conversación incluidos — trae ganas de trabajar con tus datos."}
          </p>
        </>
      )}

      {section.kind === "checklist" && (
        <ChecklistSection
          items={section.items}
          storageKey={`gl-checklist:${material.slug}:${section.order}`}
        />
      )}

      {(section.kind === "articles" || section.kind === "docs") && (
        <>
          <p className="font-sans text-[15px] leading-[1.7] text-[#DDE2E0]">
            {section.kind === "articles"
              ? "Lecturas cortas para llegar con todo listo al sábado."
              : "El material de la sesión se publica aquí después del taller — te avisamos por correo."}
          </p>
          <div
            className={`grid grid-cols-1 gap-3 ${
              section.items.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"
            }`}
          >
            {section.items.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-3 border border-dashed border-[#2F3A3D] bg-[#0E1214] p-5"
              >
                <span className="font-sans text-[16px] font-light text-[#F1F3F2]">
                  {item.title}
                </span>
                {item.description && (
                  <p className="font-mono text-[11px] leading-[1.6] text-[#9AA3A1]">
                    {item.description}
                  </p>
                )}
                {item.downloadUrl ? (
                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="self-start border border-[#2F5D43] px-3 py-1 font-mono text-[10px] tracking-[0.12em] uppercase text-[#7FC7A3] hover:bg-[#2F5D43] hover:text-[#F1F3F2] transition-colors"
                  >
                    abrir ⬇
                  </a>
                ) : (
                  <span className="self-start border border-dashed border-[#5D4A2F] px-3 py-1 font-mono text-[10px] tracking-[0.12em] uppercase text-[#E2C084]">
                    próximamente
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {section.kind === "links" && (
        <>
          <p className="font-sans text-[15px] leading-[1.7] text-[#DDE2E0]">
            Dónde conseguir las herramientas que usamos en sala. Todas requieren cuenta con
            plan de pago — elige la tuya antes del sábado.
          </p>
          <div className="flex flex-col divide-y divide-[#262E31] border border-[#262E31]">
            {section.items.map((item) => (
              <a
                key={item.title}
                href={item.url ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col gap-1 p-5 transition-colors hover:bg-[#1C2427] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-[16px] font-light text-[#F1F3F2]">
                    {item.title} ↗
                  </span>
                  {item.note && (
                    <span className="font-mono text-[11px] leading-[1.6] text-[#9AA3A1]">
                      {item.note}
                    </span>
                  )}
                </div>
                {item.url && (
                  <span className="font-mono text-[11px] text-[#6C7573] sm:ml-6 sm:shrink-0">
                    {item.url.replace("https://", "")}
                  </span>
                )}
              </a>
            ))}
          </div>
          <p className="font-mono text-[11px] tracking-[0.08em] leading-[1.7] text-[#6C7573]">
            {"// ninguna afiliación — son las herramientas que usamos y recomendamos para el ejercicio."}
          </p>
        </>
      )}

      {section.kind === "sample-data" && section.sampleData && (
        <>
          <div className="flex flex-col gap-6">
            {section.sampleData.map((profile, index) => {
              const zipFiles = [
                ...(profile.introUrl
                  ? [{ name: profile.introName ?? "perfil.md", url: profile.introUrl }]
                  : []),
                ...profile.categories.flatMap((c) =>
                  c.files.map((f) => ({ name: `${c.label}/${f.fileName}`, url: f.url })),
                ),
              ];
              return (
                <ProfileDossier
                  key={profile.slug}
                  profile={profile}
                  index={index + 1}
                  zipping={zipping === profile.slug}
                  onZip={async () => {
                    setZipping(profile.slug);
                    try {
                      await downloadZip(`${profile.slug}.zip`, zipFiles);
                    } finally {
                      setZipping(null);
                    }
                  }}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Sección tipo checklist: documentos agrupados por categoría (agrupación por
// `item.group`, en el orden en que llegan los ítems). Las marcas viven en
// localStorage (sin BD): cada navegador recuerda lo que el estudiante ya tiene.
function ChecklistSection({ items, storageKey }: { items: CourseItem[]; storageKey: string }) {
  const groups: { label: string; items: CourseItem[] }[] = [];
  for (const item of items) {
    const label = item.group ?? "Otros";
    let group = groups.find((candidate) => candidate.label === label);
    if (!group) {
      group = { label, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }

  const [done, setDone] = useState<Record<string, boolean>>(() => {
    // Lectura perezosa en el primer render: la sección solo monta en el cliente
    // (el material llega por Convex), así que no hay riesgo de hidratación.
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    } catch {
      // localStorage bloqueado (modo privado): el checklist funciona sin memoria.
      return {};
    }
  });

  const toggle = (key: string) => {
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignorar cuota/privacidad: la marca se ve igual, solo no persiste.
      }
      return next;
    });
  };

  const clear = () => {
    setDone({});
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // nada que limpiar
    }
  };

  const doneCount = items.filter((item) => done[item.title]).length;

  return (
    <>
      <div className="flex flex-col gap-3">
        <p className="font-sans text-[15px] leading-[1.7] text-[#DDE2E0]">
          Estos son algunos documentos que recomendamos traer al taller. Tu información
          es tuya y de nadie más: nada sale de tu computador.
        </p>
        <p className="font-sans text-[15px] leading-[1.7] text-[#9AA3A1]">
          Entre más datos y contexto le des, mejor responde tu asesor financiero. Y si no
          quieres traer nada, no pasa nada: en la sección 04 · Caso de práctica hay una
          data de prueba para hacer el taller.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px border border-[#262E31] bg-[#262E31] sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-4 bg-[#0E1214] p-5">
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#B4552B]">
              {group.label}
            </span>
            <ul className="flex flex-col gap-4">
              {group.items.map((item) => {
                const isDone = !!done[item.title];
                return (
                  <li key={item.title}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isDone}
                      onClick={() => toggle(item.title)}
                      className="group flex w-full items-start gap-3 text-left"
                    >
                      <span
                        className={`mt-[3px] grid h-3 w-3 shrink-0 place-items-center border transition-colors ${
                          isDone
                            ? "border-[#B4552B] bg-[#B4552B]"
                            : "border-[#2F3A3D] group-hover:border-[#9AA3A1]"
                        }`}
                      >
                        {isDone && (
                          <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden>
                            <path
                              d="M1 5.2 3.8 8 9 2"
                              fill="none"
                              stroke="#0E1214"
                              strokeWidth="1.8"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="flex flex-col gap-1">
                        <span
                          className={`font-mono text-[12px] leading-[1.5] transition-colors ${
                            isDone
                              ? "text-[#6C7573] line-through decoration-[#2F3A3D]"
                              : "text-[#DDE2E0]"
                          }`}
                        >
                          {item.title}
                        </span>
                        {item.description && (
                          <span className="font-mono text-[10px] leading-[1.6] text-[#6C7573]">
                            {item.description}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p className="font-mono text-[11px] tracking-[0.08em] leading-[1.7] text-[#6C7573]">
          {"// sin imprimir nada: el PDF o la captura del portal es suficiente."}
        </p>
        {doneCount > 0 && (
          <button
            type="button"
            onClick={clear}
            className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#6C7573] underline decoration-[#2F3A3D] underline-offset-4 transition-colors hover:text-[#9AA3A1]"
          >
            borrar marcas
          </button>
        )}
      </div>
    </>
  );
}

// Tarifas del parqueadero del edificio (recreadas de la tabla del venue).
// Se muestran en un modal para no cargar la ficha del evento.
const PARKING_ROWS: { label: string; car: string; moto: string }[] = [
  { label: "15 minutos", car: "gratis", moto: "gratis" },
  { label: "1ª hora", car: "$4.300", moto: "$2.500" },
  { label: "2ª hora", car: "$3.100", moto: "$1.800" },
  { label: "3ª hora en adelante (cada hora)", car: "$7.400", moto: "$4.300" },
  { label: "día completo (12 horas)", car: "$37.600", moto: "$22.200" },
  { label: "6:00 p.m. a 7:00 a.m.", car: "$2.000", moto: "$1.800" },
  { label: "sábado 12:00 m. al lunes 7:00 a.m.", car: "$2.000", moto: "$1.800" },
];

function ParkingCard() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="flex flex-col gap-1 border-l-2 border-[#B4552B] pl-4">
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#6C7573]">
          parqueadero
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="self-start text-left font-mono text-[13px] leading-[1.6] text-[#DDE2E0] underline decoration-[#B4552B]/50 underline-offset-4 transition-colors hover:text-[#E2A084]"
        >
          El lugar cuenta con parqueadero
          <span className="whitespace-nowrap">&nbsp;· ver tarifas ↗</span>
        </button>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tarifas del parqueadero"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0E1214]/85 p-4 py-10"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-[520px] border border-[#2F3A3D] bg-[#111719]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#262E31] px-6 py-4">
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B4552B]">
                tarifas del parqueadero
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#6C7573] transition-colors hover:text-[#F1F3F2]"
              >
                cerrar ✕
              </button>
            </div>
            <table className="w-full border-collapse font-mono text-[12px]">
              <thead>
                <tr className="text-[#6C7573]">
                  <th className="border-b border-[#262E31] px-6 py-3 text-left text-[10px] font-normal tracking-[0.16em] uppercase">
                    tiempo
                  </th>
                  <th className="border-b border-[#262E31] px-3 py-3 text-right text-[10px] font-medium tracking-[0.16em] uppercase">
                    carro
                  </th>
                  <th className="border-b border-[#262E31] px-6 py-3 text-right text-[10px] font-medium tracking-[0.16em] uppercase">
                    moto
                  </th>
                </tr>
              </thead>
              <tbody>
                {PARKING_ROWS.map((row) => (
                  <tr key={row.label}>
                    <td className="border-b border-[#1C2427] px-6 py-2.5 text-[#9AA3A1]">
                      {row.label}
                    </td>
                    <td className="border-b border-[#1C2427] px-3 py-2.5 text-right text-[#DDE2E0]">
                      {row.car}
                    </td>
                    <td className="border-b border-[#1C2427] px-6 py-2.5 text-right text-[#DDE2E0]">
                      {row.moto}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-col gap-2 px-6 py-4">
              <p className="font-mono text-[11px] leading-[1.7] text-[#DDE2E0]">
                Para el taller (4 horas): ≈ $22.200 en carro o $12.900 en moto.
              </p>
              <p className="font-mono text-[10px] leading-[1.7] text-[#6C7573]">
                {"// tarifas del edificio; pueden cambiar sin aviso."}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProfileDossier({
  profile,
  index,
  zipping,
  onZip,
}: {
  profile: SampleProfile;
  index: number;
  zipping: boolean;
  onZip: () => Promise<void>;
}) {
  const caseNo = String(index).padStart(2, "0");
  // `?? []` protege contra deployments cuya query aún no manda los campos de
  // ficha (el schema/query se empuja después de este cambio de UI).
  const facts = profile.facts ?? [];
  const categories = profile.categories.filter((category) => category.files.length > 0);
  const docCount = categories.reduce((count, category) => count + category.files.length, 0);
  const total = docCount + (profile.introUrl ? 1 : 0);

  return (
    <article className="border border-[#2F3A3D] border-t-2 border-t-[#B4552B] bg-[#0E1214]">
      {/* Identificación: foto + ficha tipo hoja de vida */}
      <header className="grid grid-cols-1 md:grid-cols-[248px_1fr]">
        <PhotoSlot
          profile={profile}
          caseNo={caseNo}
          extra={[
            { label: "documentos", value: String(total) },
            { label: "categorías", value: String(categories.length) },
          ]}
          zipping={zipping}
          onZip={onZip}
        />
        <div className="flex flex-col gap-6 border-t border-[#2F3A3D] p-6 md:border-l md:border-t-0 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#B4552B]">
              [expediente {caseNo}]
            </span>
            <span className="border border-dashed border-[#2F3A3D] px-2.5 py-1 font-mono text-[9px] tracking-[0.14em] uppercase text-[#6C7573]">
              datos ficticios
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-sans text-[26px] font-light leading-[1.1] tracking-[-0.02em] text-[#F1F3F2]">
              {profile.name}
            </h3>
            <p className="font-mono text-[12px] leading-[1.6] text-[#DDE2E0]">
              {profile.tagline}
            </p>
          </div>

          {profile.bio && (
            <p className="max-w-[62ch] whitespace-pre-line font-sans text-[14px] leading-[1.75] text-[#9AA3A1]">
              {profile.bio}
            </p>
          )}

          {facts.length > 0 && (
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 border-t border-dashed border-[#2F3A3D] pt-5 sm:grid-cols-2 lg:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-0.5">
                  <dt className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#6C7573]">
                    {fact.label}
                  </dt>
                  <dd className="font-mono text-[11px] leading-[1.55] text-[#DDE2E0]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </header>
    </article>
  );
}

function PhotoSlot({
  profile,
  caseNo,
  extra,
  zipping,
  onZip,
}: {
  profile: SampleProfile;
  caseNo: string;
  extra: { label: string; value: string }[];
  zipping: boolean;
  onZip: () => Promise<void>;
}) {
  const [failed, setFailed] = useState(false);
  const photoUrl = failed ? null : profile.photoUrl;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col p-4 md:p-5">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[260px] overflow-hidden bg-[#111719] md:mx-0 md:max-w-none">
          {photoUrl ? (
            // URL firmada de Convex storage: <img> directo, sin optimizador ni dominios permitidos.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt={`Retrato de ${profile.name}`}
              onError={() => setFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <div className="absolute inset-0 grid place-items-center">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2F3A3D"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <circle cx="12" cy="8.5" r="3.75" />
                  <path d="M4.5 20.5c0-4.1 3.36-7.4 7.5-7.4s7.5 3.3 7.5 7.4" />
                </svg>
              </div>
              <div className="absolute inset-x-0 bottom-3 flex flex-col items-center gap-1 px-3 text-center">
                <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#6C7573]">
                  foto pendiente
                </span>
                {profile.photoName && (
                  <span className="w-full truncate font-mono text-[9px] text-[#6C7573]">
                    {profile.photoName}
                  </span>
                )}
              </div>
            </>
          )}
          <span className="pointer-events-none absolute left-2 top-2 h-3.5 w-3.5 border-l border-t border-[#B4552B]" aria-hidden />
          <span className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 border-r border-t border-[#B4552B]" aria-hidden />
          <span className="pointer-events-none absolute bottom-2 left-2 h-3.5 w-3.5 border-b border-l border-[#B4552B]" aria-hidden />
          <span className="pointer-events-none absolute bottom-2 right-2 h-3.5 w-3.5 border-b border-r border-[#B4552B]" aria-hidden />
        </div>
        <div className="mx-auto mt-3 flex w-full max-w-[260px] items-center justify-between border-t border-dashed border-[#2F3A3D] pt-2 md:mx-0 md:max-w-none">
          <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#6C7573]">
            exp. {caseNo}
          </span>
          <span className="font-mono text-[9px] text-[#6C7573]">
            {photoUrl ? "4:5 · foto" : "espacio 4:5"}
          </span>
        </div>

        {/* Resumen bajo la foto: cuántos documentos y categorías trae el caso */}
        <dl className="mx-auto mt-4 flex w-full max-w-[260px] flex-col gap-3 md:mx-0 md:max-w-none">
          {extra.map((item) => (
            <div key={item.label} className="flex items-baseline justify-between gap-2">
              <dt className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#6C7573]">
                {item.label}
              </dt>
              <dd className="font-mono text-[11px] text-[#DDE2E0]">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <button
        onClick={() => void onZip()}
        disabled={zipping}
        title={`${profile.slug}.zip`}
        className="mt-auto w-full bg-[#B4552B] px-3 py-3.5 font-mono text-[10px] font-medium leading-[1.5] tracking-[0.1em] uppercase text-[#0E1214] transition-colors hover:bg-[#C96A3C] disabled:opacity-60 md:text-[11px]"
      >
        {zipping ? "generando zip…" : "descargar datos de prueba ⬇"}
      </button>
    </div>
  );
}

function LockedPanel({ registrationStatus }: { registrationStatus: string | null }) {
  return (
    <div className="mt-10 border border-[#262E31] bg-[#1C2427] p-8">
      <div className="h-[1.5px] w-10 bg-[#B4552B]" />
      <p className="mt-4 font-mono text-[13px] leading-[1.8] text-[#9AA3A1]">
        {"// el material se desbloquea cuando se registre tu pago."}
      </p>
      <p className="mt-2 font-mono text-[11px] leading-[1.7] text-[#6C7573]">
        {`estado: pago ${registrationStatus ?? "—"}`}
      </p>
      <Link
        href="/estudiantes"
        className="mt-6 inline-flex border border-[#2F3A3D] px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] uppercase text-[#9AA3A1] hover:text-[#F1F3F2] hover:border-[#9AA3A1] transition-colors"
      >
        ← mis cursos
      </Link>
      <div className="mt-6">
        <SupportLine note="// si ya registraste el pago, escríbenos y lo revisamos." />
      </div>
    </div>
  );
}

export default function CourseMaterialPage() {
  return (
    <AuthGuard>
      <ProfileGuard>
        <CourseMaterial />
      </ProfileGuard>
    </AuthGuard>
  );
}
