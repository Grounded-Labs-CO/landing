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
            <span className="text-[#c86f3d]">No hype.</span> Solo IA que entiende tu mundo.
          </p>
          <p className="mb-4 text-[13px] font-bold tracking-[0.02em] text-[#236b4b]">Workshops prácticos de IA aplicada para profesionales que dependen de su conocimiento.</p>
          <h1 className="max-w-[780px] text-[clamp(38px,6vw,68px)] font-semibold leading-[1.02] tracking-[-0.025em] text-[#17251f]" style={{ fontFamily: "var(--font-fraunces)" }}>
            Hay mucho material de IA. <span className="text-[#236b4b]">Mucho humo también.</span>
          </h1>
          <p className="mt-6 max-w-[760px] text-[20px] font-medium leading-[1.45] text-[#4e5b53]">
            No sabes por dónde empezar ni qué sirve. <span className="text-[#17251f] font-semibold">Nosotros filtramos.</span> Traducimos las mejores prácticas de IA —probadas en software— a tu profesión, con método fácil, sin tecnicismos, con tus propios archivos.
          </p>
          <p className="mt-4 max-w-[760px] text-[18px] text-[#4e5b53]">
            Ayudamos a profesionales a <strong className="text-[#236b4b]">maximizar el valor que entregan</strong>: de usar un chat a exprimir la IA con criterio y resultados aplicables mañana.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/workshops/finanzas-personales-ia" className="rounded-full bg-[#236b4b] px-8 py-4 text-[16px] font-bold text-white hover:bg-[#174e36] shadow-[0_10px_22px_rgba(35,107,75,0.18)]">Ver workshops →</Link>
            <Link href="#empresas" className="rounded-full border border-[#dce3da] bg-white px-8 py-4 text-[16px] font-bold text-[#236b4b] hover:bg-[#e9f0e8]">Para tu empresa</Link>
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
              <p className="mt-2 text-[15px] text-[#4e5b53]">Ya usas IA, ves valor, pero el feed es humo. No sabes qué funciona ni por dónde empezar sin perder semanas.</p>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] bg-[#fffdf8] p-7">
              <div className="mb-2 text-[12px] font-bold tracking-[0.08em] text-[#6f7d74]">INVERSIÓN</div>
              <h3 className="text-[18px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>Sabes invertir en ti, pero quieres valor real</h3>
              <p className="mt-2 text-[15px] text-[#4e5b53]">Ganas bien, no te da miedo pagar por aprender, pero exiges algo útil, cercano y aplicable — no teoría.</p>
            </div>
          </div>
          <div className="mt-8 rounded-xl bg-[#e9f0e8] px-6 py-5 text-center">
            <p className="font-semibold text-[#236b4b]">Filtramos el ruido de la IA y enseñamos a convertirla en valor real para tu trabajo, con experiencias prácticas, cercanas y aplicables.</p>
          </div>
        </div>
      </section>

      {/* MÉTODO */}
      <section className="bg-[#edf3eb] px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-3 text-[13px] font-bold tracking-[0.02em] text-[#236b4b]"><span className="text-[#c86f3d]">02</span> Método</div>
          <h2 className="text-[clamp(32px,4.5vw,48px)] font-semibold leading-[1.08] tracking-[-0.025em]" style={{ fontFamily: "var(--font-fraunces)" }}>
            Útil, cercano y entretenido. <span className="text-[#6f7d74]">No clase magistral.</span>
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-[18px] border border-[#dce3da] border-l-4 border-l-[#236b4b] bg-[#fffdf8] p-7 shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
              <div className="text-[12px] font-bold tracking-[0.08em] text-[#236b4b]">CERO HUMO + CURADURÍA</div>
              <h3 className="mt-2 text-[18px] font-semibold">Filtramos qué sirve</h3>
              <p className="mt-2 text-[14px] text-[#4e5b53]">Criterio experto. Traducimos mejores prácticas de IA en software a tu profesión. Sin vender por vender, sin masivos genéricos.</p>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] border-l-4 border-l-[#356b72] bg-[#fffdf8] p-7 shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
              <div className="text-[12px] font-bold tracking-[0.08em] text-[#356b72]">80% PRÁCTICA</div>
              <h3 className="mt-2 text-[18px] font-semibold">Con tus archivos, checkpoints por hito</h3>
              <p className="mt-2 text-[14px] text-[#4e5b53]">12 máx, 1 facilitador cada 6, guía previa. Avanzas a tu ritmo y nunca te quedas atrás.</p>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] border-l-4 border-l-[#c86f3d] bg-[#fffdf8] p-7 shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
              <div className="text-[12px] font-bold tracking-[0.08em] text-[#c86f3d]">VALIÓ LA PENA</div>
              <h3 className="mt-2 text-[18px] font-semibold">Sales con 2–3 cosas para mañana</h3>
              <p className="mt-2 text-[14px] text-[#4e5b53]">Valor real en tu profesión. Tan bueno que quieres más, nos recomiendas y quieres llevarlo a tu empresa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS / CAMINO */}
      <section id="workshops" className="bg-[#f6f2ea] px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-3 text-[13px] font-bold tracking-[0.02em] text-[#236b4b]"><span className="text-[#c86f3d]">03</span> Productos</div>
          <h2 className="text-[clamp(32px,4.5vw,48px)] font-semibold leading-[1.08] tracking-[-0.025em]" style={{ fontFamily: "var(--font-fraunces)" }}>
            Empiezas pequeño, escalas con criterio.
          </h2>
          <p className="mt-4 max-w-[760px] text-[16px] text-[#4e5b53]">Los workshops son la puerta y el laboratorio. Desde ahí creces a verticales, avanzados y empresa. Productos solo si hay dolor repetido y solución demostrada.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-5">
            <div className="rounded-[18px] border-2 border-[#236b4b] bg-[#fffdf8] p-6 shadow-[0_8px_24px_rgba(36,60,45,0.08)]">
              <div className="text-[12px] font-bold text-[#236b4b]">01 · HOY</div>
              <div className="mt-2 text-[15px] font-bold">Workshops 12p presencial</div>
              <p className="mt-1 text-[13px] text-[#6f7d74]">4h, manos a la obra.</p>
              <div className="mt-3 text-[12px] font-bold text-[#236b4b]">● Activo</div>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] bg-[#fffdf8] p-6">
              <div className="text-[12px] font-bold text-[#6f7d74]">02 · SIGUIENTE</div>
              <div className="mt-2 text-[15px] font-bold">Talleres por profesión</div>
              <p className="mt-1 text-[13px] text-[#6f7d74]">Finanzas, médicos, abogados…</p>
              <div className="mt-3 text-[12px] text-[#c86f3d]">Finanzas = #1</div>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] bg-[#fffdf8] p-6">
              <div className="text-[12px] font-bold text-[#6f7d74]">03</div>
              <div className="mt-2 text-[15px] font-bold">Workshops avanzados</div>
              <p className="mt-1 text-[13px] text-[#6f7d74]">Profundizas método.</p>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] bg-[#fffdf8] p-6">
              <div className="text-[12px] font-bold text-[#6f7d74]">04</div>
              <div className="mt-2 text-[15px] font-bold">Empresa / equipos</div>
              <p className="mt-1 text-[13px] text-[#6f7d74]">Llevas el método.</p>
            </div>
            <div className="rounded-[18px] border border-dashed border-[#dce3da] bg-[#fffdf8]/60 p-6">
              <div className="text-[12px] font-bold text-[#6f7d74]">05 · SI APLICA</div>
              <div className="mt-2 text-[15px] font-bold">Kits / productos</div>
              <p className="mt-1 text-[13px] text-[#6f7d74]">Solo si hay patrón repetido.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Link href="/workshops/finanzas-personales-ia" className="rounded-[18px] border-2 border-[#236b4b] bg-white p-7 shadow-[0_12px_30px_rgba(35,107,75,0.12)] hover:shadow-[0_16px_36px_rgba(35,107,75,0.18)] transition-shadow">
              <div className="text-[12px] font-bold tracking-[0.08em] text-[#236b4b]">WORKSHOP · 26 SEP · MEDELLÍN</div>
              <h3 className="mt-2 text-[20px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>Asistente Financiero con IA</h3>
              <p className="mt-2 text-[14px] text-[#4e5b53]">Presupuesto, deudas, inversiones y tu marco de análisis — con tus datos.</p>
              <div className="mt-4 text-[13px] font-bold text-[#c86f3d]">4h · 12 cupos · $400k lanzamiento →</div>
              <div className="mt-3 inline-block rounded-full bg-[#236b4b] px-5 py-2 text-sm font-bold text-white">Ver detalles</div>
            </Link>
            <div className="rounded-[18px] border border-[#dce3da] bg-[#fffdf8] p-7 opacity-90">
              <div className="text-[12px] font-bold tracking-[0.08em] text-[#6f7d74]">PRÓXIMAMENTE · EN CURADURÍA</div>
              <h3 className="mt-2 text-[20px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>Para médicos</h3>
              <p className="mt-2 text-[14px] text-[#4e5b53]">Historias, papers, protocolos — IA que cruza tu conocimiento clínico.</p>
              <Link href="#lista-espera" className="mt-4 inline-block text-[13px] font-bold text-[#236b4b]">Únete a lista de espera →</Link>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] bg-[#fffdf8] p-7 opacity-90">
              <div className="text-[12px] font-bold tracking-[0.08em] text-[#6f7d74]">EN LISTA DE ESPERA</div>
              <h3 className="mt-2 text-[20px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>Para abogados</h3>
              <p className="mt-2 text-[14px] text-[#4e5b53]">Contratos, jurisprudencia, expedientes — respuestas sobre tu caso.</p>
              <Link href="#lista-espera" className="mt-4 inline-block text-[13px] font-bold text-[#236b4b]">Quiero que me avisen →</Link>
            </div>
          </div>
          <p className="mt-4 text-center text-[12px] text-[#6f7d74]">No vendemos “IA para todos”. Cada vertical nace cuando hay dolor concreto y casos para adaptar el método.</p>
        </div>
      </section>

      {/* EMPRESAS */}
      <section id="empresas" className="bg-[#17251f] px-6 py-[88px] text-white">
        <div className="mx-auto max-w-[1120px] grid gap-8 md:grid-cols-2 items-center">
          <div>
            <div className="text-[12px] font-bold tracking-[0.14em] text-[#dcebd7]">PARA EMPRESAS</div>
            <h2 className="mt-3 text-[32px] font-semibold leading-[1.08]" style={{ fontFamily: "var(--font-fraunces)" }}>Lleva el método a tu equipo</h2>
            <p className="mt-4 text-[16px] text-[#a5afa8]">Los workshops son el laboratorio. Cuando vemos el impacto, escalamos a tu empresa con talleres cerrados y apoyos puntuales — sin vender por vender, sin consultoría mágica.</p>
            <p className="mt-3 text-[13px] text-[#6f7d74]">Todo fuera de horario, con recursos propios. Sin usar clientes ni activos de Globant.</p>
          </div>
          <div className="rounded-[18px] bg-white p-7 text-[#17251f]">
            <div className="text-[13px] font-bold text-[#236b4b]">¿Tu empresa necesita esto?</div>
            <p className="mt-2 text-[14px] text-[#4e5b53]">Cuéntanos tu dolor y vemos si uno de los workshops o un taller cerrado encaja.</p>
            <Link href="mailto:hola@groundedlabs.co" className="mt-4 inline-block rounded-full bg-[#236b4b] px-6 py-3 text-sm font-bold text-white hover:bg-[#174e36]">Hablar para tu empresa</Link>
            <div className="mt-3 text-[12px] text-[#6f7d74]">Respuesta en &lt;24h. También captura para “¿lo recomendarías a tu empresa?” post-workshop.</div>
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="bg-[#edf3eb] px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-3 text-[13px] font-bold tracking-[0.02em] text-[#236b4b]"><span className="text-[#c86f3d]">04</span> Quiénes somos</div>
          <p className="-mt-3 mb-2 max-w-[760px] text-[18px] text-[#4e5b53]">Workshops prácticos de IA aplicada para profesionales que dependen de su conocimiento.</p>
          <h2 className="text-[clamp(32px,4.5vw,48px)] font-semibold leading-[1.08] tracking-[-0.025em]" style={{ fontFamily: "var(--font-fraunces)" }}>Quienes filtran y enseñan.</h2>
          <p className="mt-3 max-w-[760px] text-[14px] text-[#6f7d74]">No gurus. Dos profesionales con 20+ años en software que traducen IA real a trabajo real — fuera de horario, con recursos propios, sin humo.</p>
          <div className="mt-8 grid gap-7 md:grid-cols-2">
            <div className="rounded-[18px] border border-[#dce3da] bg-[#fffdf8] p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#dfece0] font-bold text-[#236b4b]">FM</div>
              <h3 className="text-[18px] font-semibold">Francisco Martínez</h3>
              <div className="text-[13px] font-bold text-[#236b4b]">Technical Manager + IA aplicada</div>
              <ul className="mt-3 list-disc pl-5 text-[14px] text-[#4e5b53]">
                <li>20+ años en industria de software</li>
                <li>Lidera adopción de IA en equipos técnicos y de negocio</li>
                <li>Inversionista BVC, mercados internacionales</li>
              </ul>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] bg-[#fffdf8] p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#dfece0] font-bold text-[#236b4b]">EC</div>
              <h3 className="text-[18px] font-semibold">Eduardo Castillo</h3>
              <div className="text-[13px] font-bold text-[#236b4b]">Salesforce, Claude e IA aplicada</div>
              <ul className="mt-3 list-disc pl-5 text-[14px] text-[#4e5b53]">
                <li>Claude Certified Architect · Agentforce Specialist</li>
                <li>20+ años en soluciones empresariales</li>
                <li>Experto Salesforce · Inversiones finca raíz/cripto/acciones</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRUEBA SOCIAL HONESTA */}
      <section className="bg-white px-6 py-[72px]">
        <div className="mx-auto max-w-[1120px] rounded-[18px] border border-[#dce3da] bg-[#fffdf8] p-8 text-center">
          <div className="text-[12px] font-bold tracking-[0.14em] text-[#6f7d74]">ESTADO ACTUAL · SIN HUMO</div>
          <p className="mx-auto mt-3 max-w-[640px] text-[18px] font-semibold text-[#17251f]">Workshop piloto · 12 cupos · Validación con pago real (meta 10–15).</p>
          <p className="mx-auto mt-2 max-w-[640px] text-[14px] text-[#4e5b53]">Medellín, presencial, porque la ayuda 1-a-1 importa. Después medimos NPS, “¿lo recomendarías a tu empresa?” y solicitudes de verticales. Sin testimonios inventados.</p>
        </div>
      </section>

      {/* LEAD MAGNET */}
      <section id="lista-espera" className="bg-[#f6f2ea] px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px] rounded-[22px] border border-[#dce3da] bg-[#fffdf8] p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <div className="text-[12px] font-bold tracking-[0.14em] text-[#6f7d74]">RECURSO GRATUITO</div>
              <h2 className="mt-2 text-[28px] font-semibold leading-[1.1]" style={{ fontFamily: "var(--font-fraunces)" }}>¿Cuánto conoces tu plata?</h2>
              <p className="mt-3 text-[15px] text-[#4e5b53]">Guía de 5 números para diagnosticar tu salud financiera antes del workshop. Te la enviamos por email — y quedas en lista de espera segmentada por profesión.</p>
            </div>
            <form className="rounded-[18px] border border-[#dce3da] bg-[#f6f2ea] p-6" onSubmit={(e)=>e.preventDefault()}>
              <label className="text-[12px] font-bold tracking-[0.08em] text-[#6f7d74]">EMAIL</label>
              <input placeholder="tu@email.com" className="mt-2 w-full rounded-xl border border-[#dce3da] bg-white px-4 py-3 text-[14px] outline-none focus:border-[#236b4b]" />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <select className="rounded-xl border border-[#dce3da] bg-white px-3 py-3 text-[13px] text-[#4e5b53]">
                  <option>Profesión</option><option>Finanzas</option><option>Médico</option><option>Abogado</option><option>Otro</option>
                </select>
                <select className="rounded-xl border border-[#dce3da] bg-white px-3 py-3 text-[13px] text-[#4e5b53]">
                  <option>Dolor</option><option>Tiempo</option><option>Datos dispersos</option><option>Decisiones</option>
                </select>
              </div>
              <button className="mt-4 w-full rounded-full bg-[#236b4b] py-3 text-sm font-bold text-white hover:bg-[#174e36]">Enviar guía →</button>
              <p className="mt-2 text-center text-[11px] text-[#6f7d74]">Guardamos tu lead en Convex (`leads`). No spam. No regalamos el workshop.</p>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#dce3da] bg-[#fffdf8] px-6 py-10">
        <div className="mx-auto flex max-w-[1120px] flex-wrap justify-between gap-6 text-[13px]">
          <div>
            <div className="font-bold tracking-[0.08em] text-[#236b4b]">GROUNDED Labs</div>
            <div className="text-[#6f7d74]">No hype. Solo IA que entiende tu mundo.</div>
          </div>
          <div className="flex gap-6 text-[#4e5b53]">
            <Link href="/workshops/finanzas-personales-ia" className="hover:text-[#236b4b]">Workshops</Link>
            <Link href="#workshops" className="hover:text-[#236b4b]">Método</Link>
            <Link href="#empresas" className="hover:text-[#236b4b]">Empresas</Link>
            <Link href="mailto:hola@groundedlabs.co" className="hover:text-[#236b4b]">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
