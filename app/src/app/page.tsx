"use client";
import Link from "next/link";
import Image from "next/image";

export default function CorporatePage() {
  return (
    <div className="bg-[#0E1214] text-[#F1F3F2]">
      {/* HERO — MANIFIESTO 2A */}
      <section className="border-b border-[#262E31] px-6 py-[88px] max-[820px]:py-[64px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="flex flex-col gap-5">
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">01 — Fundamento</span>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center bg-[#B4552B]">
                <span className="font-mono text-[22px] font-semibold leading-none text-[#0E1214]">g</span>
              </div>
              <span className="font-mono text-[13px] font-medium tracking-[0.08em] text-[#9AA3A1]">
                grounded<span className="text-[#6C7573]">_</span>labs
              </span>
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#6C7573]">· Medellín · 2026</span>
            </div>
            <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#9AA3A1]">
              <span className="text-[#B4552B]">No hype.</span> Solo inteligencia artificial que entiende tu mundo.
            </p>
            <p className="max-w-[760px] font-mono text-[12px] tracking-[0.12em] uppercase text-[#9AA3A1]">
              Workshops prácticos de inteligencia artificial aplicada — para profesionales que dependen de su conocimiento.
            </p>
            <h1 className="max-w-[780px] font-sans text-[clamp(38px,6vw,64px)] font-extralight leading-[0.98] tracking-[-0.035em] text-[#F1F3F2]">
              Hay mucho material de inteligencia artificial. <span className="font-light text-[#9AA3A1]">Mucho humo también.</span>
            </h1>
            <p className="max-w-[760px] font-sans text-[19px] font-normal leading-[1.6] text-[#DDE2E0]">
              No sabes por dónde empezar ni qué sirve. <span className="font-medium text-[#F1F3F2]">Nosotros filtramos.</span> Traducimos las mejores
              prácticas —probadas en software— a tu profesión, con método simple, sin tecnicismos, con tus propios archivos.
            </p>
            <p className="max-w-[760px] font-sans text-[16px] leading-[1.65] text-[#9AA3A1]">
              Ayudamos a profesionales a <span className="text-[#DDE2E0]">maximizar el valor que entregan</span>: de usar un chat a exprimir la inteligencia
              artificial con criterio y resultados aplicables mañana.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/workshops/finanzas-personales-ia"
                className="inline-flex items-center bg-[#B4552B] px-8 py-[14px] font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-[#0E1214] hover:bg-[#9A4A24] transition-colors"
              >
                Ver workshops →
              </Link>
              <span className="inline-flex items-center border border-[#2F3A3D] px-6 py-[14px] font-mono text-[11px] tracking-[0.12em] uppercase text-[#9AA3A1]">
                4h · Presencial · Máx 12
              </span>
            </div>
            <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#6C7573]">
              Medellín · Presencial · Máx 12 personas · 4 horas · Sales con 2–3 cosas aplicables mañana
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="border-b border-[#262E31] bg-[#0E1214] px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">02 — El problema</span>
          <h2 className="mt-4 max-w-[760px] font-sans text-[clamp(32px,4.5vw,44px)] font-light leading-[1.08] tracking-[-0.025em] text-[#F1F3F2]">
            Tu valor depende de tu conocimiento. Tu conocimiento vive disperso.
          </h2>
          <div className="mt-8 grid gap-px border border-[#262E31] bg-[#262E31] md:grid-cols-3">
            <div className="bg-[#1C2427] p-8">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#6C7573]">[profesional]</div>
              <h3 className="mt-3 font-sans text-[18px] font-light leading-tight text-[#F1F3F2]">Dependes de tu conocimiento para generar ingresos</h3>
              <p className="mt-3 font-sans text-[15px] leading-[1.65] text-[#9AA3A1]">
                Médico, abogado, profe, gerente, emprendedor: cada entrega exige cruzar documentos, papers, casos, datos.
              </p>
            </div>
            <div className="bg-[#1C2427] p-8">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#6C7573]">[tiempo]</div>
              <h3 className="mt-3 font-sans text-[18px] font-light leading-tight text-[#F1F3F2]">Poco tiempo, mucho ruido</h3>
              <p className="mt-3 font-sans text-[15px] leading-[1.65] text-[#9AA3A1]">
                Ya usas inteligencia artificial, ves valor, pero el feed es humo. No sabes qué funciona ni por dónde empezar sin perder semanas.
              </p>
            </div>
            <div className="bg-[#1C2427] p-8">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#6C7573]">[inversión]</div>
              <h3 className="mt-3 font-sans text-[18px] font-light leading-tight text-[#F1F3F2]">Sabes invertir en ti, pero quieres valor real</h3>
              <p className="mt-3 font-sans text-[15px] leading-[1.65] text-[#9AA3A1]">
                Ganas bien, no te da miedo pagar por aprender, pero exiges algo útil, cercano y aplicable — no teoría.
              </p>
            </div>
          </div>
          <div className="mt-6 border border-[#262E31] border-l-2 border-l-[#B4552B] bg-[#1C2427] px-6 py-5">
            <p className="text-center font-mono text-[12px] leading-[1.7] tracking-[0.02em] text-[#DDE2E0]">
              Traemos las prácticas avanzadas de desarrollo de software al mundo profesional para que puedas adaptarlas en tu día a día y convertirlas en
              valor real para tu trabajo, con experiencias prácticas, cercanas y aplicables.
            </p>
          </div>
        </div>
      </section>

      {/* PRÓXIMOS EVENTOS */}
      <section id="workshops" className="border-b border-[#262E31] bg-[#0E1214] px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">03 — Próximos eventos</span>
          <h2 className="mt-4 font-sans text-[clamp(32px,4.5vw,44px)] font-light leading-[1.08] tracking-[-0.025em] text-[#F1F3F2]">Próximos eventos</h2>
          <p className="mt-3 max-w-[760px] font-sans text-[16px] leading-[1.65] text-[#9AA3A1]">Talleres prácticos, presenciales y con cupos limitados.</p>
          <div className="mt-8 grid gap-px border border-[#262E31] bg-[#262E31] md:grid-cols-2">
            <Link
              href="/workshops/finanzas-personales-ia"
              className="group relative flex flex-col gap-4 border-2 border-[#B4552B] bg-[#1C2427] p-8 hover:bg-[#242F33] transition-colors"
            >
              <div className="absolute right-0 top-0 h-3 w-3 bg-[#B4552B]"></div>
              <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#B4552B]">Workshop · 26 Sep · Medellín</div>
              <h3 className="font-sans text-[20px] font-light leading-tight text-[#F1F3F2]">Asistente Financiero con Inteligencia Artificial</h3>
              <p className="font-sans text-[14px] leading-[1.6] text-[#9AA3A1]">Presupuesto, deudas, inversiones y tu marco de análisis — con tus datos.</p>
              <div className="font-mono text-[11px] tracking-[0.08em] text-[#6C7573]">4h · 12 cupos · $400k lanzamiento →</div>
              <div className="mt-2 inline-flex self-start bg-[#B4552B] px-5 py-2 font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-[#0E1214] group-hover:bg-[#9A4A24]">
                Ver detalles
              </div>
            </Link>
            <div className="flex flex-col justify-center gap-4 bg-[#0E1214] p-8">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#B4552B]">[siguiente_taller]</div>
              <p className="font-sans text-[16px] leading-[1.6] text-[#DDE2E0]">Próxima fecha en preparación. Te avisamos cuando abramos cupos.</p>
              <p className="font-mono text-[12px] leading-[1.7] text-[#9AA3A1]">
                Seguinos en{" "}
                <a href="https://www.instagram.com/groundedlabs.ai" target="_blank" rel="noopener noreferrer" className="text-[#B4552B] hover:text-[#F1F3F2]">
                  @groundedlabs.ai
                </a>{" "}
                o escribinos a{" "}
                <a href="mailto:groundedlabsco@gmail.com" className="text-[#B4552B] hover:text-[#F1F3F2]">
                  groundedlabsco@gmail.com
                </a>
                .
              </p>
              <a
                href="mailto:groundedlabsco@gmail.com?subject=Quiero%20cupo%20en%20el%20pr%C3%B3ximo%20taller"
                className="mt-1 inline-flex self-start items-center border border-[#2F3A3D] px-5 py-2 font-mono text-[11px] tracking-[0.12em] uppercase text-[#9AA3A1] hover:bg-[#1C2427] hover:text-[#F1F3F2] transition-colors"
              >
                avísame →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="border-b border-[#262E31] bg-[#1C2427] px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">04 — Quiénes somos</span>
          <p className="mt-4 max-w-[760px] font-sans text-[16px] leading-[1.65] text-[#9AA3A1]">
            Workshops prácticos de inteligencia artificial aplicada para profesionales que dependen de su conocimiento.
          </p>
          <h2 className="mt-3 font-sans text-[clamp(32px,4.5vw,44px)] font-light leading-[1.08] tracking-[-0.025em] text-[#F1F3F2]">
            Quienes filtran y enseñan.
          </h2>
          <p className="mt-3 max-w-[760px] font-mono text-[12px] leading-[1.7] text-[#9AA3A1]">
            // Sin gurús. Dos profesionales que aplican inteligencia artificial en su trabajo real y traducen eso a tu profesión — con método, no con
            promesas.
          </p>
          <div className="mt-8 grid gap-px border border-[#262E31] bg-[#262E31] md:grid-cols-2">
            <div className="bg-[#0E1214] p-8">
              <div className="flex items-start gap-4">
                <Image
                  src="/assets/Francisco.jpeg"
                  alt="Francisco Martínez"
                  width={56}
                  height={56}
                  className="h-14 w-14 object-cover border border-[#262E31]"
                />
                <div>
                  <h3 className="font-sans text-[18px] font-light text-[#F1F3F2]">Francisco Martínez</h3>
                  <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#B4552B]">Technical Manager + IA aplicada</div>
                </div>
              </div>
              <ul className="mt-5 flex flex-col gap-2 font-sans text-[14px] leading-[1.6] text-[#9AA3A1]">
                <li className="flex gap-2">
                  <span className="text-[#B4552B]">—</span> 20+ años en industria de software
                </li>
                <li className="flex gap-2">
                  <span className="text-[#B4552B]">—</span> Lidera adopción de inteligencia artificial en equipos técnicos y de negocio
                </li>
                <li className="flex gap-2">
                  <span className="text-[#B4552B]">—</span> Inversionista BVC, mercados internacionales
                </li>
              </ul>
            </div>
            <div className="bg-[#0E1214] p-8">
              <div className="flex items-start gap-4">
                <Image
                  src="/assets/Carlos.jpeg"
                  alt="Eduardo Castillo"
                  width={56}
                  height={56}
                  className="h-14 w-14 object-cover border border-[#262E31]"
                />
                <div>
                  <h3 className="font-sans text-[18px] font-light text-[#F1F3F2]">Eduardo Castillo</h3>
                  <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#B4552B]">Salesforce · Claude · IA aplicada</div>
                </div>
              </div>
              <ul className="mt-5 flex flex-col gap-2 font-sans text-[14px] leading-[1.6] text-[#9AA3A1]">
                <li className="flex gap-2">
                  <span className="text-[#B4552B]">—</span> Claude Certified Architect · Agentforce Specialist
                </li>
                <li className="flex gap-2">
                  <span className="text-[#B4552B]">—</span> 20+ años en soluciones empresariales
                </li>
                <li className="flex gap-2">
                  <span className="text-[#B4552B]">—</span> Experto Salesforce · Inversiones finca raíz / cripto / acciones
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 flex gap-px border border-[#262E31] bg-[#262E31]">
            <div className="flex-1 bg-[#0E1214] px-6 py-5 text-center">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#6C7573]">principio</span>
              <div className="mt-1 font-mono text-[12px] tracking-[0.08em] uppercase text-[#B4552B]">anclado</div>
              <div className="font-sans text-[14px] text-[#9AA3A1]">Toda afirmación con fuente: tu documento, tu dato.</div>
            </div>
            <div className="flex-1 bg-[#0E1214] px-6 py-5 text-center">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#6C7573]">principio</span>
              <div className="mt-1 font-mono text-[12px] tracking-[0.08em] uppercase text-[#B4552B]">sin_humo</div>
              <div className="font-sans text-[14px] text-[#9AA3A1]">Explicamos el límite antes que el potencial.</div>
            </div>
            <div className="flex-1 bg-[#0E1214] px-6 py-5 text-center">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#6C7573]">principio</span>
              <div className="mt-1 font-mono text-[12px] tracking-[0.08em] uppercase text-[#B4552B]">aplicable_hoy</div>
              <div className="font-sans text-[14px] text-[#9AA3A1]">Sales con tu asistente funcionando.</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#262E31] bg-[#0E1214] px-6 py-8">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center bg-[#B4552B]">
              <span className="font-mono text-[16px] font-semibold leading-none text-[#0E1214]">g</span>
            </div>
            <div>
              <div className="font-mono text-[12px] font-medium tracking-[0.08em] text-[#F1F3F2]">
                grounded<span className="text-[#6C7573]">_</span>labs
              </div>
              <div className="font-mono text-[11px] tracking-[0.08em] text-[#6C7573]">
                <span className="text-[#B4552B]">No hype.</span> Solo IA que entiende tu mundo.
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] tracking-[0.08em] uppercase text-[#9AA3A1]">
            <a href="https://www.linkedin.com/company/grounded-labs-co" target="_blank" rel="noopener noreferrer" className="hover:text-[#F1F3F2]">
              LinkedIn
            </a>
            <a href="https://www.instagram.com/groundedlabs.ai" target="_blank" rel="noopener noreferrer" className="hover:text-[#F1F3F2]">
              Instagram — @groundedlabs.ai
            </a>
            <a href="mailto:groundedlabsco@gmail.com" className="hover:text-[#F1F3F2]">
              groundedlabsco@gmail.com
            </a>
          </div>
        </div>
        <div className="mx-auto mt-6 max-w-[1120px] border-t border-[#262E31] pt-4 font-mono text-[11px] tracking-[0.12em] uppercase text-[#6C7573]">
          <span>© 2026 grounded_labs · Medellín, Colombia · Workshops prácticos de IA aplicada</span>
        </div>
      </footer>
    </div>
  );
}
