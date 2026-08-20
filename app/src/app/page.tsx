"use client";
import Link from "next/link";

export default function CorporatePage() {
  return (
    <div className="bg-[#f6f2ea] text-[#17251f]">
      {/* HERO MANIFIESTO */}
      <section className="bg-[linear-gradient(115deg,#f6f2ea_0%,#f6f2ea_55%,#e7efe5_100%)] px-6 py-[96px] max-[820px]:py-[72px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-8 text-[13px] font-bold tracking-[0.08em] text-[#236b4b]">GROUNDED Labs</div>
          <p className="mb-8 -mt-[18px] text-[18px] font-bold text-[#17251f]">
            <span className="text-[#c86f3d] italic">No hype.</span> Solo inteligencia artificial que entiende tu mundo.
          </p>
          <p className="mb-4 text-[13px] font-bold tracking-[0.02em] text-[#236b4b]">Workshops prácticos de inteligencia artificial aplicada para profesionales que dependen de su conocimiento.</p>
          <h1 className="max-w-[780px] text-[clamp(38px,6vw,68px)] font-semibold leading-[1.02] tracking-[-0.025em] text-[#17251f]" style={{ fontFamily: "var(--font-fraunces)" }}>
            Hay mucho material de inteligencia artificial. <span className="text-[#236b4b]">Mucho humo también.</span>
          </h1>
          <p className="mt-6 max-w-[760px] text-[20px] font-medium leading-[1.45] text-[#4e5b53]">
            No sabes por dónde empezar ni qué sirve. <span className="text-[#17251f] font-semibold">Nosotros filtramos.</span> Traducimos las mejores prácticas de inteligencia artificial —probadas en software— a tu profesión, con método fácil, sin tecnicismos, con tus propios archivos.
          </p>
          <p className="mt-4 max-w-[760px] text-[18px] text-[#4e5b53]">
            Ayudamos a profesionales a <strong className="text-[#236b4b]">maximizar el valor que entregan</strong>: de usar un chat a exprimir la inteligencia artificial con criterio y resultados aplicables mañana.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/workshops/finanzas-personales-ia" className="rounded-full bg-[#236b4b] px-8 py-4 text-[16px] font-bold text-white hover:bg-[#174e36] shadow-[0_10px_22px_rgba(35,107,75,0.18)]">Ver workshops →</Link>
          </div>
          <div className="mt-6 text-[13px] tracking-[0.02em] text-[#6f7d74]">Medellín · Presencial · Máx 12 personas · 4 horas · Sales con 2–3 cosas aplicables mañana</div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="bg-white px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-3 text-[13px] font-bold tracking-[0.02em] text-[#236b4b]"><span className="text-[#c86f3d]">01</span> El problema</div>
          <h2 className="max-w-[760px] text-[clamp(32px,4.5vw,48px)] font-semibold leading-[1.08] tracking-[-0.025em]" style={{ fontFamily: "var(--font-fraunces)" }}>
            Tu valor depende de tu conocimiento. Tu conocimiento vive disperso.
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-[18px] border border-[#dce3da] bg-[#fffdf8] p-7">
              <div className="mb-2 text-[12px] font-bold tracking-[0.08em] text-[#6f7d74]">PROFESIONAL</div>
              <h3 className="text-[18px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>Dependes de tu conocimiento para generar ingresos</h3>
              <p className="mt-2 text-[15px] text-[#4e5b53]">Médico, abogado, profe, gerente, emprendedor: cada entrega exige cruzar documentos, papers, casos, datos.</p>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] bg-[#fffdf8] p-7">
              <div className="mb-2 text-[12px] font-bold tracking-[0.08em] text-[#6f7d74]">TIEMPO</div>
              <h3 className="text-[18px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>Poco tiempo, mucho ruido</h3>
              <p className="mt-2 text-[15px] text-[#4e5b53]">Ya usas inteligencia artificial, ves valor, pero el feed es humo. No sabes qué funciona ni por dónde empezar sin perder semanas.</p>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] bg-[#fffdf8] p-7">
              <div className="mb-2 text-[12px] font-bold tracking-[0.08em] text-[#6f7d74]">INVERSIÓN</div>
              <h3 className="text-[18px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>Sabes invertir en ti, pero quieres valor real</h3>
              <p className="mt-2 text-[15px] text-[#4e5b53]">Ganas bien, no te da miedo pagar por aprender, pero exiges algo útil, cercano y aplicable — no teoría.</p>
            </div>
          </div>
          <div className="mt-8 rounded-xl bg-[#e9f0e8] px-6 py-5 text-center">
            <p className="font-semibold text-[#236b4b]">Traemos las prácticas avanzadas de desarrollo de software al mundo profesional para que puedas adaptarlas en tu día a día y convertirlas en valor real para tu trabajo, con experiencias prácticas, cercanas y aplicables.</p>
          </div>
        </div>
      </section>

      {/* PRÓXIMOS EVENTOS */}
      <section id="workshops" className="bg-[#f6f2ea] px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-3 text-[13px] font-bold tracking-[0.02em] text-[#236b4b]"><span className="text-[#c86f3d]">02</span> Próximos eventos</div>
          <h2 className="text-[clamp(32px,4.5vw,48px)] font-semibold leading-[1.08] tracking-[-0.025em]" style={{ fontFamily: "var(--font-fraunces)" }}>
            Próximos eventos
          </h2>
          <p className="mt-4 max-w-[760px] text-[16px] text-[#4e5b53]">Talleres prácticos, presenciales y con cupos limitados. Cada card es un evento hands-on.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/workshops/finanzas-personales-ia" className="rounded-[18px] border-2 border-[#236b4b] bg-white p-7 shadow-[0_12px_30px_rgba(35,107,75,0.12)] hover:shadow-[0_16px_36px_rgba(35,107,75,0.18)] transition-shadow block">
              <div className="text-[12px] font-bold tracking-[0.08em] text-[#236b4b]">WORKSHOP · 26 SEP · MEDELLÍN</div>
              <h3 className="mt-2 text-[20px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>Asistente Financiero con Inteligencia Artificial</h3>
              <p className="mt-2 text-[14px] text-[#4e5b53]">Presupuesto, deudas, inversiones y tu marco de análisis — con tus datos.</p>
              <div className="mt-4 text-[13px] font-bold text-[#c86f3d]">4h · 12 cupos · $400k lanzamiento →</div>
              <div className="mt-3 inline-block rounded-full bg-[#236b4b] px-5 py-2 text-sm font-bold text-white">Ver detalles</div>
            </Link>
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="bg-[#edf3eb] px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-3 text-[13px] font-bold tracking-[0.02em] text-[#236b4b]"><span className="text-[#c86f3d]">03</span> Quiénes somos</div>
          <p className="-mt-3 mb-2 max-w-[760px] text-[18px] text-[#4e5b53]">Workshops prácticos de inteligencia artificial aplicada para profesionales que dependen de su conocimiento.</p>
          <h2 className="text-[clamp(32px,4.5vw,48px)] font-semibold leading-[1.08] tracking-[-0.025em]" style={{ fontFamily: "var(--font-fraunces)" }}>Quienes filtran y enseñan.</h2>
          <p className="mt-3 max-w-[760px] text-[14px] text-[#6f7d74]">No gurus. Dos profesionales con 20+ años en software que traducen inteligencia artificial real a trabajo real — fuera de horario, con recursos propios, sin humo.</p>
          <div className="mt-8 grid gap-7 md:grid-cols-2">
            <div className="rounded-[18px] border border-[#dce3da] bg-[#fffdf8] p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#dfece0] font-bold text-[#236b4b]">FM</div>
              <h3 className="text-[18px] font-semibold">Francisco Martínez</h3>
              <div className="text-[13px] font-bold text-[#236b4b]">Technical Manager + Inteligencia Artificial aplicada</div>
              <ul className="mt-3 list-disc pl-5 text-[14px] text-[#4e5b53]">
                <li>20+ años en industria de software</li>
                <li>Lidera adopción de inteligencia artificial en equipos técnicos y de negocio</li>
                <li>Inversionista BVC, mercados internacionales</li>
              </ul>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] bg-[#fffdf8] p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#dfece0] font-bold text-[#236b4b]">EC</div>
              <h3 className="text-[18px] font-semibold">Eduardo Castillo</h3>
              <div className="text-[13px] font-bold text-[#236b4b]">Salesforce, Claude e Inteligencia Artificial aplicada</div>
              <ul className="mt-3 list-disc pl-5 text-[14px] text-[#4e5b53]">
                <li>Claude Certified Architect · Agentforce Specialist</li>
                <li>20+ años en soluciones empresariales</li>
                <li>Experto Salesforce · Inversiones finca raíz/cripto/acciones</li>
              </ul>
            </div>
          </div>
        </div>
      </section>



      {/* LEAD MAGNET - oculto por ahora */}

      {/* FOOTER */}
      <footer className="border-t border-[#dce3da] bg-[#fffdf8] px-6 py-10">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-6 text-[13px]">
          <div>
            <div className="font-bold tracking-[0.08em] text-[#236b4b]">GROUNDED Labs</div>
            <div className="text-[#6f7d74]"><span className="text-[#c86f3d] italic">No hype.</span> Solo inteligencia artificial que entiende tu mundo.</div>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-[#4e5b53]">
            <a href="https://www.linkedin.com/company/grounded-labs-co" target="_blank" rel="noopener noreferrer" className="hover:text-[#236b4b]">LinkedIn</a>
            <a href="https://www.instagram.com/groundedlabsco" target="_blank" rel="noopener noreferrer" className="hover:text-[#236b4b]">Instagram</a>
            <a href="mailto:groundedlabsco@gmail.com" className="hover:text-[#236b4b]">groundedlabsco@gmail.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
