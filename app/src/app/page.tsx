"use client";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function CorporatePage() {
  const publicCourses = useQuery(api.courses.list);
  return (
    <div className="bg-[#0E1214] text-[#F1F3F2]">
      {/* HERO — 1.25fr / 1fr */}
      <section
        id="top"
        className="mx-auto max-w-[1240px] px-12 max-[900px]:px-6 py-[88px] max-[900px]:py-[64px] grid grid-cols-[1.25fr_1fr] max-[900px]:grid-cols-1 gap-[64px] items-start"
      >
        <div className="flex flex-col gap-[28px]">
          <div className="flex flex-col gap-4">
            <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#9AA3A1]">
              <span className="text-[#B4552B] italic">No hype.</span> Solo inteligencia artificial
              que entiende tu mundo.
            </div>
          </div>
          <h1
            className="m-0 max-w-[780px] text-[72px] max-[900px]:text-[48px] font-extralight leading-[0.98] tracking-[-0.04em] text-[#F1F3F2] text-balance"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Inteligencia Artificial para profesionales que dependen de su conocimiento.
          </h1>
          <p className="m-0 max-w-[52ch] text-[20px] leading-[1.6] text-[#DDE2E0]">
            No sabes por dónde empezar ni qué sirve. Nosotros filtramos las mejores prácticas
            —probadas en software— y las traemos a tu profesión, con tus propios archivos.
          </p>
          <div className="flex gap-[14px] flex-wrap pt-[6px]">
            <Link
              href="#workshops"
              className="bg-[#B4552B] text-[#0E1214] px-[30px] py-[16px] font-mono text-[12px] font-medium tracking-[0.12em] uppercase hover:bg-[#9A4A24] transition-colors"
            >
              ver workshops →
            </Link>
            <Link
              href="#problema"
              className="border border-[#2F3A3D] text-[#9AA3A1] px-[30px] py-[16px] font-mono text-[12px] tracking-[0.12em] uppercase hover:text-[#F1F3F2] hover:border-[#9AA3A1] transition-colors"
            >
              nuestro método
            </Link>
          </div>
          <div className="flex gap-10 pt-[20px] border-t border-[#262E31] mt-3">
            <div className="flex flex-col gap-[6px]">
              <span className="text-[34px] font-extralight tracking-[-0.02em] text-[#F1F3F2]">
                12
              </span>
              <span className="font-mono text-[10px] leading-[1.6] tracking-[0.1em] uppercase text-[#6C7573]">
                cupos máx por sesión
              </span>
            </div>
            <div className="flex flex-col gap-[6px]">
              <span className="text-[34px] font-extralight tracking-[-0.02em] text-[#F1F3F2]">
                4h
              </span>
              <span className="font-mono text-[10px] leading-[1.6] tracking-[0.1em] uppercase text-[#6C7573]">
                de piloto a sistema
              </span>
            </div>
            <div className="flex flex-col gap-[6px]">
              <span className="text-[34px] font-extralight tracking-[-0.02em] text-[#F1F3F2]">
                1:6
              </span>
              <span className="font-mono text-[10px] leading-[1.6] tracking-[0.1em] uppercase text-[#6C7573]">
                facilitador cada 6
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[14px]">
          <div className="aspect-[4/5] border border-[#262E31] bg-[repeating-linear-gradient(135deg,#1C2427_0_10px,#131A1C_10px_20px)] grid place-items-center">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#6C7573]">
              [foto] sesión 4:5 — Medellín presencial
            </span>
          </div>
          <span className="font-mono text-[10px] leading-[1.7] text-[#565F62]">
            {"// 12 personas máx · Sales con 2–3 cosas aplicables mañana"}
          </span>
        </div>
      </section>

      {/* BANDA PROBLEMA — 2 col #1C2427 */}
      <section id="problema" className="border-y border-[#262E31] bg-[#1C2427]">
        <div className="mx-auto max-w-[1240px] px-12 max-[900px]:px-6 py-[76px] grid grid-cols-2 max-[900px]:grid-cols-1 gap-16">
          <div className="flex flex-col gap-4 items-start">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B4552B]">
              [el_problema]
            </span>
            <span className="text-[38px] font-extralight leading-[1.16] tracking-[-0.025em] text-[#F1F3F2]">
              Tu valor depende de tu conocimiento. Tu conocimiento vive disperso.
            </span>
          </div>
          <div className="flex flex-col gap-8 justify-center">
            <div className="grid gap-6">
              <div className="border border-[#262E31] bg-[#0E1214] p-6 flex flex-col gap-3">
                <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#B4552B]">
                  profesional
                </span>
                <span className="text-[18px] font-light text-[#F1F3F2]">
                  Dependes de tu conocimiento para generar ingresos
                </span>
                <span className="text-[15px] leading-[1.7] text-[#9AA3A1]">
                  Médico, abogado, profe, gerente, emprendedor: cada entrega exige cruzar
                  documentos, papers, casos, datos.
                </span>
              </div>
              <div className="border border-[#262E31] bg-[#0E1214] p-6 flex flex-col gap-3">
                <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#B4552B]">
                  tiempo
                </span>
                <span className="text-[18px] font-light text-[#F1F3F2]">
                  Poco tiempo, mucho ruido
                </span>
                <span className="text-[15px] leading-[1.7] text-[#9AA3A1]">
                  Ya usas inteligencia artificial, ves valor, pero el feed es humo. No sabes qué
                  funciona ni por dónde empezar sin perder semanas.
                </span>
              </div>
              <div className="border border-[#262E31] bg-[#0E1214] p-6 flex flex-col gap-3">
                <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#B4552B]">
                  inversión
                </span>
                <span className="text-[18px] font-light text-[#F1F3F2]">
                  Sabes invertir en ti, pero quieres valor real
                </span>
                <span className="text-[15px] leading-[1.7] text-[#9AA3A1]">
                  Ganas bien, no te da miedo pagar por aprender, pero exiges algo útil, cercano y
                  aplicable — no teoría.
                </span>
              </div>
            </div>
            <p className="font-mono text-[14px] leading-[1.8] text-[#9AA3A1]">
              {
                "// traemos las prácticas avanzadas de desarrollo de software al mundo profesional para que puedas adaptarlas en tu día a día"
              }
            </p>
          </div>
        </div>
      </section>

      {/* PRÓXIMOS EVENTOS — servicios 3 cols */}
      <section
        id="workshops"
        className="mx-auto max-w-[1240px] px-12 max-[900px]:px-6 py-24 flex flex-col gap-11 border-t border-[#262E31]"
      >
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B4552B]">
            [próximos_eventos]
          </span>
          <h2 className="m-0 text-[46px] font-extralight tracking-[-0.03em] text-[#F1F3F2]">
            Próximos eventos
          </h2>
          <p className="max-w-[52ch] text-[16px] leading-[1.7] text-[#9AA3A1]">
            Talleres prácticos, presenciales y con cupos limitados.
          </p>
        </div>
        <div className="grid grid-cols-3 max-[900px]:grid-cols-1 gap-[22px]">
          {(publicCourses ?? []).map((c) => (
            <Link
              key={c.slug}
              href={`/workshops/${c.slug}`}
              className="border border-[#262E31] bg-[#1C2427] p-[38px_34px] flex flex-col gap-[22px] min-h-[420px] hover:border-[#B4552B] transition-colors group"
            >
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#B4552B]">
                workshop · {c.status === "full" ? "sin cupo" : "inscripción abierta"}
              </span>
              <span className="text-[30px] font-light leading-[1.15] tracking-[-0.02em] text-[#F1F3F2] group-hover:text-white">
                {c.title}
              </span>
              <span className="text-[16px] leading-[1.7] text-[#9AA3A1]">
                {c.tagline}
              </span>
              <div className="flex flex-col gap-2.5 mt-auto">
                <div className="h-[1px] bg-[#2F3A3D]"></div>
                <span className="font-mono text-[12px] leading-[1.7] text-[#DDE2E0]">
                  {c.schedule} · {c.price}
                </span>
                <span className="font-mono text-[12px] leading-[1.7] text-[#B4552B] group-hover:text-[#F1F3F2]">
                  {c.status === "full" ? "sin cupo — avísame" : "→ ver detalles"}
                </span>
              </div>
            </Link>
          ))}
          <div className="hidden md:flex border border-[#262E31] bg-[#0E1214] p-[38px_34px] flex-col gap-[22px] min-h-[420px] opacity-60">
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#6C7573]">
              [próximamente]
            </span>
            <span className="text-[30px] font-light leading-[1.15] tracking-[-0.02em] text-[#565F62]">
              Para médicos
            </span>
            <span className="text-[16px] leading-[1.7] text-[#565F62]">
              Historias, papers, protocolos — inteligencia artificial que cruza tu conocimiento
              clínico.
            </span>
            <div className="flex flex-col gap-2.5 mt-auto">
              <div className="h-[1px] bg-[#2F3A3D] opacity-50"></div>
              <span className="font-mono text-[12px] leading-[1.7] text-[#565F62]">
                — en curaduría
              </span>
            </div>
          </div>
          <div className="hidden md:flex border border-[#262E31] bg-[#0E1214] p-[38px_34px] flex-col gap-[22px] min-h-[420px] opacity-60">
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#6C7573]">
              [lista_espera]
            </span>
            <span className="text-[30px] font-light leading-[1.15] tracking-[-0.02em] text-[#565F62]">
              Para abogados
            </span>
            <span className="text-[16px] leading-[1.7] text-[#565F62]">
              Contratos, jurisprudencia, expedientes — respuestas sobre tu caso.
            </span>
            <div className="flex flex-col gap-2.5 mt-auto">
              <div className="h-[1px] bg-[#2F3A3D] opacity-50"></div>
              <span className="font-mono text-[12px] leading-[1.7] text-[#565F62]">— avísame</span>
            </div>
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS — perfiles 4 cols #1C2427 */}
      <section id="quienes" className="border-t border-[#262E31] bg-[#1C2427]">
        <div className="mx-auto max-w-[1240px] px-12 max-[900px]:px-6 py-24 flex flex-col gap-11">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B4552B]">
              [equipo]
            </span>
            <h2 className="m-0 text-[46px] font-extralight tracking-[-0.03em] text-[#F1F3F2]">
              Quienes filtran y enseñan
            </h2>
            <p className="max-w-[52ch] text-[16px] leading-[1.7] text-[#9AA3A1]">
              No gurus. Dos profesionales con 20+ años en software que traducen inteligencia
              artificial real a trabajo real.
            </p>
          </div>
          <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-[1px] bg-[#2F3A3D] border border-[#2F3A3D]">
            <div className="bg-[#1C2427] p-8 flex flex-col gap-[18px]">
              <Image
                src="/assets/Francisco.jpeg"
                alt="Francisco Martínez"
                width={64}
                height={64}
                className="h-16 w-16 rounded-none object-cover border border-[#262E31]"
              />
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[14px] font-medium text-[#F1F3F2]">
                  Francisco Martínez
                </span>
                <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#B4552B]">
                  Technical Manager + Inteligencia Artificial aplicada
                </span>
              </div>
              <ul className="flex flex-col gap-2 font-mono text-[12px] leading-[1.7] text-[#9AA3A1] list-none p-0 m-0">
                <li>— 20+ años en industria de software</li>
                <li>
                  — Lidera adopción de inteligencia artificial en equipos técnicos y de negocio
                </li>
                <li>— Inversionista BVC, mercados internacionales</li>
              </ul>
            </div>
            <div className="bg-[#1C2427] p-8 flex flex-col gap-[18px]">
              <Image
                src="/assets/Carlos.jpeg"
                alt="Eduardo Castillo"
                width={64}
                height={64}
                className="h-16 w-16 rounded-none object-cover border border-[#262E31]"
              />
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[14px] font-medium text-[#F1F3F2]">
                  Eduardo Castillo
                </span>
                <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#B4552B]">
                  Salesforce, Claude e Inteligencia Artificial aplicada
                </span>
              </div>
              <ul className="flex flex-col gap-2 font-mono text-[12px] leading-[1.7] text-[#9AA3A1] list-none p-0 m-0">
                <li>— Claude Certified Architect · Agentforce Specialist</li>
                <li>— 20+ años en soluciones empresariales</li>
                <li>— Experto Salesforce · Inversiones finca raíz/cripto/acciones</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LEAD MAGNET - oculto por ahora */}

      {/* CTA FINAL — terracota */}
      <section id="agendar" className="border-t border-[#262E31] bg-[#B4552B] text-[#0E1214]">
        <div className="mx-auto max-w-[1240px] px-12 max-[900px]:px-6 py-16 flex items-center justify-between gap-12 flex-wrap">
          <div className="flex flex-col gap-4 max-w-[28ch]">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#3A1C0C]">
              [cupos · 12 máx · Medellín]
            </span>
            <span className="text-[40px] md:text-[44px] font-extralight leading-[1.05] tracking-[-0.03em]">
              Finanzas personales con IA.
              <br />
              Con tus datos.
            </span>
          </div>
          <div className="flex flex-col gap-4 items-start">
            <span className="font-mono text-[12px] leading-[1.7] text-[#3A1C0C]/80 max-w-[32ch]">
              {"// 4 horas · Presencial · Sales con 2–3 cosas aplicables mañana"}
            </span>
            <Link
              href="#workshops"
              className="bg-[#0E1214] text-[#F1F3F2] px-[30px] py-[16px] font-mono text-[12px] font-medium tracking-[0.12em] uppercase self-start hover:bg-[#1C2427] transition-colors"
            >
              reservar cupo — $400k
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER — 2A */}
      <footer className="border-t border-[#262E31] bg-[#0E1214]">
        <div className="mx-auto max-w-[1240px] px-12 max-[900px]:px-6 py-[52px] flex items-center justify-between gap-10 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="grid h-6 w-6 place-items-center bg-[#B4552B] font-mono text-[14px] font-semibold leading-none text-[#0E1214]">
              g
            </span>
            <span className="font-mono text-[13px] font-medium text-[#F1F3F2]">
              grounded<span className="text-[#6C7573]">_</span>labs
            </span>
          </div>
          <div className="flex gap-7 font-mono text-[11px] tracking-[0.1em] text-[#6C7573]">
            <a
              href="https://www.linkedin.com/company/grounded-labs-co"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F1F3F2] transition-colors"
            >
              linkedin
            </a>
            <a
              href="https://www.instagram.com/groundedlabs.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F1F3F2] transition-colors"
            >
              instagram
            </a>
            <a
              href="mailto:groundedlabsco@gmail.com"
              className="hover:text-[#F1F3F2] transition-colors"
            >
              groundedlabsco@gmail.com
            </a>
            <span className="text-[#565F62]">© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
