"use client";
import { AuthGuard } from "@/components/AuthGuard";
import { ProfileGuard } from "@/components/ProfileGuard";
import type { CourseMaterial, CourseSection, SampleProfile } from "@/lib/material-types";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

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
  // undefined = nunca abierto (por defecto el primer perfil); null = cerrado
  const [openProfile, setOpenProfile] = useState<string | null | undefined>(undefined);
  const [zipping, setZipping] = useState<string | null>(null);

  // Sección/perfil activos derivados (sin efectos): si el estado aún no
  // apunta a algo válido, cae al primero.
  const sections = material?.sections ?? [];
  const activeSection = sections.find((s) => s.order === openSection) ?? sections[0];
  const sampleData = sections.find((s) => s.kind === "sample-data")?.sampleData ?? [];
  const activeProfileSlug =
    openProfile === undefined ? (sampleData[0]?.slug ?? null) : openProfile;

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
                    pasajero: <span className="text-[#DDE2E0]">{material.email}</span>
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
            <div className="border-t border-[#2F3A3D] px-7 py-3">
              <Barcode />
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
                activeProfileSlug={activeProfileSlug}
                setOpenProfile={setOpenProfile}
                zipping={zipping}
                setZipping={setZipping}
              />
            )}
          </section>
        </>
      )}
    </div>
  );
}

function SectionDetail({
  section,
  material,
  activeProfileSlug,
  setOpenProfile,
  zipping,
  setZipping,
}: {
  section: CourseSection;
  material: CourseMaterial;
  activeProfileSlug: string | null;
  setOpenProfile: (slug: string | null) => void;
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
          <p className="max-w-[64ch] font-sans text-[15px] leading-[1.7] text-[#DDE2E0]">
            Lo esencial del día: cuándo, dónde y qué llevar.
          </p>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {material.eventInfo.map((item) => (
              <div key={item.label} className="flex flex-col gap-1 border-l-2 border-[#B4552B] pl-4">
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#6C7573]">
                  {item.label}
                </span>
                <span className="font-mono text-[13px] leading-[1.6] text-[#DDE2E0]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <p className="font-mono text-[11px] tracking-[0.08em] leading-[1.7] text-[#565F62]">
            {"// café, snacks y buena conversación incluidos — trae ganas de trabajar con tus datos."}
          </p>
        </>
      )}

      {(section.kind === "articles" || section.kind === "docs") && (
        <>
          <p className="max-w-[64ch] font-sans text-[15px] leading-[1.7] text-[#DDE2E0]">
            {section.kind === "articles"
              ? "Lecturas cortas para llegar con todo listo al sábado."
              : "El material que entregamos durante la sesión queda disponible aquí."}
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
          <p className="max-w-[64ch] font-sans text-[15px] leading-[1.7] text-[#DDE2E0]">
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
          <p className="font-mono text-[11px] tracking-[0.08em] leading-[1.7] text-[#565F62]">
            {"// ninguna afiliación — son las herramientas que usamos y recomendamos para el ejercicio."}
          </p>
        </>
      )}

      {section.kind === "sample-data" && section.sampleData && (
        <>
          <p className="max-w-[64ch] font-sans text-[15px] leading-[1.7] text-[#DDE2E0]">
            Tres casos completos con documentos 100% ficticios. Elige tu viajero, descarga
            sus documentos y tráelos al workshop: con ese material hacemos los ejercicios.
          </p>
          <div className="flex flex-col gap-3">
            {section.sampleData.map((profile) => (
              <ProfileCard
                key={profile.slug}
                profile={profile}
                isOpen={activeProfileSlug === profile.slug}
                onToggle={() =>
                  setOpenProfile(activeProfileSlug === profile.slug ? null : profile.slug)
                }
                zipping={zipping === profile.slug}
                onZip={async () => {
                  setZipping(profile.slug);
                  try {
                    const files = [
                      ...(profile.introUrl
                        ? [{ name: profile.introName ?? "perfil.md", url: profile.introUrl }]
                        : []),
                      ...profile.categories.flatMap((c) =>
                        c.files.map((f) => ({ name: `${c.label}/${f.fileName}`, url: f.url })),
                      ),
                    ];
                    await downloadZip(`${profile.slug}.zip`, files);
                  } finally {
                    setZipping(null);
                  }
                }}
              />
            ))}
          </div>
          <p className="font-mono text-[11px] tracking-[0.08em] leading-[1.7] text-[#565F62]">
            {"// documentos simulados — datos 100% ficticios con fines educativos."}
          </p>
        </>
      )}
    </div>
  );
}

function ProfileCard({
  profile,
  isOpen,
  onToggle,
  zipping,
  onZip,
}: {
  profile: SampleProfile;
  isOpen: boolean;
  onToggle: () => void;
  zipping: boolean;
  onZip: () => Promise<void>;
}) {
  return (
    <div className="border border-[#262E31] bg-[#0E1214]">
      <button
        onClick={onToggle}
        className={`flex w-full items-center gap-5 p-5 text-left transition-colors ${
          isOpen ? "border-b border-[#262E31] bg-[#111719]" : "hover:bg-[#111719]"
        }`}
      >
        <div className="grid h-14 w-14 shrink-0 place-items-center bg-[#B4552B]">
          <span className="font-mono text-[24px] font-semibold text-[#0E1214]">
            {profile.name.charAt(0)}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="font-sans text-[18px] font-light text-[#F1F3F2]">{profile.name}</span>
          <span className="font-mono text-[11px] leading-[1.5] text-[#9AA3A1]">
            {profile.tagline}
          </span>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="font-mono text-[22px] font-extralight leading-none text-[#B4552B]">
            {profile.fileCount}
          </span>
          <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#6C7573]">
            documentos {isOpen ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="flex flex-col gap-5 p-5">
          {profile.introUrl && (
            <div className="border border-[#2F3A3D] bg-[#111719] p-4">
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#B4552B]">
                perfil del caso
              </span>
              <a
                href={profile.introUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block font-mono text-[13px] text-[#F1F3F2] underline decoration-[#B4552B] underline-offset-4 hover:text-[#E2A084]"
              >
                {(profile.introName ?? "perfil")
                  .replace(/-/g, " ")
                  .replace(/\.md$/, "")}{" "}
                ⬇
              </a>
            </div>
          )}

          {profile.categories
            .filter((c) => c.files.length > 0)
            .map((category) => (
              <div key={category.label}>
                <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#6C7573]">
                  {category.label} · {category.files.length}
                </span>
                <ul className="mt-2 grid grid-cols-1 gap-1.5 md:grid-cols-2">
                  {category.files.map((file) => (
                    <li key={file.fileName + file.label}>
                      <a
                        href={file.url ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[12px] leading-[1.6] text-[#DDE2E0] hover:text-[#B4552B]"
                      >
                        {file.label} ⬇
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          <button
            onClick={() => void onZip()}
            disabled={zipping}
            className="self-start border border-[#B4552B] px-4 py-2 font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-[#B4552B] hover:bg-[#B4552B] hover:text-[#0E1214] transition-colors disabled:opacity-60"
          >
            {zipping ? "preparando zip…" : "descargar todo (zip) ⬇"}
          </button>
        </div>
      )}
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
      <p className="mt-2 font-mono text-[11px] leading-[1.7] text-[#565F62]">
        {`estado: pago ${registrationStatus ?? "—"}`}
      </p>
      <Link
        href="/estudiantes"
        className="mt-6 inline-flex border border-[#2F3A3D] px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] uppercase text-[#9AA3A1] hover:text-[#F1F3F2] hover:border-[#9AA3A1] transition-colors"
      >
        ← mis cursos
      </Link>
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
