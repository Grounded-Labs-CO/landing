import Link from "next/link";
import Image from "next/image";

export default function FinanzasPage() {
  return (
    <div className="bg-[#0E1214] text-[#F1F3F2]">
      {/* HERO */}
      <section className="border-b border-[#262E31] px-6 py-[88px] max-[820px]:py-[64px]">
        <div className="mx-auto max-w-[1120px]">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">Workshop · 26 Sep · Medellín</span>
          <div className="mt-4 font-mono text-[11px] tracking-[0.12em] uppercase text-[#9AA3A1]">
            <span className="text-[#B4552B]">No hype.</span> Solo inteligencia artificial que entiende tu mundo.
          </div>
          <h1 className="mt-6 max-w-[760px] font-sans text-[clamp(42px,6vw,64px)] font-extralight leading-[0.98] tracking-[-0.035em] text-[#F1F3F2]">
            Tu <span className="font-light text-[#B4552B]">Asistente Financiero</span>
            <br />
            con Inteligencia Artificial
          </h1>
          <p className="mt-6 max-w-[680px] font-sans text-[18px] leading-[1.6] text-[#DDE2E0]">
            Una sesión práctica para aprender a trabajar con información financiera y explorar formas concretas de usar inteligencia artificial en tu día a
            día.
          </p>
          <p className="mt-3 max-w-[680px] font-mono text-[13px] leading-[1.7] text-[#9AA3A1]">// No es una clase magistral. No es teoría. Es manos a la obra.</p>
          <div className="mt-6 font-mono text-[11px] tracking-[0.08em] uppercase text-[#9AA3A1]">
            <span className="font-medium text-[#DDE2E0]">Presencial en Medellín</span> &nbsp;·&nbsp; Sábado 26 de septiembre &nbsp;·&nbsp; No necesitas saber
            programar
          </div>
          <Link
            href="#precio"
            className="mt-8 inline-flex items-center bg-[#B4552B] px-8 py-[14px] font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-[#0E1214] hover:bg-[#9A4A24] transition-colors"
          >
            Reservar mi cupo →
          </Link>
          <div className="mt-6 flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] uppercase text-[#6C7573]">
            <span className="h-[1.5px] w-8 bg-[#B4552B]"></span> 4h · 12 cupos · Presencial · 2 facilitadores en sala
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="border-b border-[#262E31] bg-[#0E1214] px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">01 — El problema</span>
          <h2 className="mt-4 max-w-[720px] font-sans text-[clamp(32px,4.5vw,44px)] font-light leading-[1.08] tracking-[-0.025em] text-[#F1F3F2]">
            Ganas bien… y no sabes a dónde se va tu plata
          </h2>
          <div className="mt-8 flex flex-col gap-4 border-l border-[#262E31] pl-6">
            <div className="flex gap-3 font-sans text-[17px] leading-[1.6] text-[#9AA3A1]">
              <span className="font-mono text-[#B4552B]">—</span>
              Tu información financiera está regada: nómina en PDF, extractos en el correo, inversiones en apps distintas.
            </div>
            <div className="flex gap-3 font-sans text-[17px] leading-[1.6] text-[#9AA3A1]">
              <span className="font-mono text-[#B4552B]">—</span>
              No sabes si estás mejor que el año pasado. Cada decisión de plata la tomas con el estómago, no con datos.
            </div>
            <div className="flex gap-3 font-sans text-[17px] leading-[1.6] text-[#9AA3A1]">
              <span className="font-mono text-[#B4552B]">—</span>
              El banco, las tarjetas y datacredito tienen un perfil tuyo. Tú no tienes ninguno propio.
            </div>
            <div className="flex gap-3 border border-[#B4552B] bg-[#1C2427] px-4 py-3 font-sans text-[17px] font-medium leading-[1.6] text-[#F1F3F2]">
              <span className="font-mono text-[#B4552B]">→</span>
              Imagina preguntarle a tu plata: &quot;¿puedo pagar esta deuda más rápido?&quot; — y que te responda con TUS números.
            </div>
          </div>
        </div>
      </section>

      {/* SOLUCION — LO QUE TE LLEVAS */}
      <section className="border-b border-[#262E31] bg-[#1C2427] px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">02 — Lo que te llevas</span>
          <h2 className="mt-4 max-w-[720px] font-sans text-[clamp(32px,4.5vw,44px)] font-light leading-[1.08] tracking-[-0.025em] text-[#F1F3F2]">
            Te vas con tu asistente financiero andando, no con apuntes
          </h2>
          <div className="mt-8 grid gap-px border border-[#262E31] bg-[#262E31] md:grid-cols-3">
            <div className="bg-[#0E1214] p-7">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#B4552B]">Tu presupuesto real</div>
              <h3 className="mt-3 font-sans text-[18px] font-light text-[#F1F3F2]">A dónde va cada peso</h3>
              <p className="mt-3 font-sans text-[14px] leading-[1.65] text-[#9AA3A1]">
                Trabajas con ejemplos de ingresos y gastos para aprender a organizar información financiera y hacer mejores preguntas.
              </p>
            </div>
            <div className="bg-[#0E1214] p-7">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#9AA3A1]">Tus deudas e inversiones</div>
              <h3 className="mt-3 font-sans text-[18px] font-light text-[#F1F3F2]">Deuda, bolsa y CDTs</h3>
              <p className="mt-3 font-sans text-[14px] leading-[1.65] text-[#9AA3A1]">
                Exploras cómo analizar deudas e inversiones con información organizada y preguntas específicas.
              </p>
            </div>
            <div className="bg-[#0E1214] p-7">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#6C7573]">Un marco para analizar</div>
              <h3 className="mt-3 font-sans text-[18px] font-light text-[#F1F3F2]">Entiende tus números</h3>
              <p className="mt-3 font-sans text-[14px] leading-[1.65] text-[#9AA3A1]">
                Conoces un marco de análisis para revisar tu situación financiera y detectar preguntas importantes.
              </p>
            </div>
          </div>
          <div className="mt-px grid gap-px border border-t-0 border-[#262E31] bg-[#262E31] md:grid-cols-2">
            <div className="bg-[#0E1214] p-7">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#B4552B]">Preguntas concretas</div>
              <h3 className="mt-3 font-sans text-[18px] font-light text-[#F1F3F2]">Pregúntale a tu plata</h3>
              <p className="mt-3 font-sans text-[14px] leading-[1.65] text-[#9AA3A1]">
                Practicas preguntas como &quot;¿cómo va mi ahorro?&quot; o &quot;¿qué información necesito para comparar mis deudas?&quot; y revisas las
                respuestas con criterio.
              </p>
            </div>
            <div className="bg-[#0E1214] p-7">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#B4552B]">Criterio profesional</div>
              <h3 className="mt-3 font-sans text-[18px] font-light text-[#F1F3F2]">Tú decides y revisas</h3>
              <p className="mt-3 font-sans text-[14px] leading-[1.65] text-[#9AA3A1]">
                La inteligencia artificial puede ayudarte a organizar y analizar información, pero la interpretación y las decisiones siguen bajo tu
                responsabilidad.
              </p>
            </div>
          </div>
          <div className="mt-6 border border-[#262E31] border-l-2 border-l-[#B4552B] bg-[#0E1214] px-6 py-4">
            <p className="text-center font-mono text-[11px] leading-[1.7] tracking-[0.02em] text-[#9AA3A1]">
              <span className="text-[#B4552B] font-medium">Sin humo:</span> no prometemos hacerte rico ni damos recomendaciones de inversión. Te damos un
              sistema para ver tu plata con claridad y decidir mejor. Las decisiones siempre son tuyas.
            </p>
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <section className="border-b border-[#262E31] bg-[#0E1214] px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">03 — Cómo es el workshop</span>
          <h2 className="mt-4 font-sans text-[clamp(32px,4.5vw,44px)] font-light leading-[1.08] tracking-[-0.025em] text-[#F1F3F2]">
            4 horas, 4 pasos. Nadie se queda atrás.
          </h2>
          <div className="mt-8 flex flex-col gap-px border border-[#262E31] bg-[#262E31]">
            {[
              {
                n: "01",
                title: "Inteligencia artificial sin humo",
                time: "~30 min",
                p: "Solo lo que necesitas entender: cómo funciona la inteligencia artificial de verdad y por qué puede leer tus documentos financieros. En español claro, sin tecnicismos.",
                hito: "Entiendes qué puede y qué no puede hacer la inteligencia artificial con tu plata",
              },
              {
                n: "02",
                title: "Tu asistente, instalado y listo",
                time: "~60 min",
                p: "Lo configuramos juntos en tu computador, paso a paso. Si te atascas, un facilitador te ayuda en el momento. Tú no vienes a ver: vienes a hacer.",
                hito: "Tu asistente responde su primera pregunta",
              },
              {
                n: "03",
                title: "Procesas tu nómina y tus extractos",
                time: "~75 min",
                p: "Le das de comer TU desprendible de nómina y TUS extractos. El asistente arma tu presupuesto, analiza tus deudas y organiza tus inversiones.",
                hito: "Tu vida financiera, por fin en un solo lugar",
              },
              {
                n: "04",
                title: "Tu calificación financiera",
                time: "~45 min",
                p: "Conoces un marco de calificación financiera y practicas cómo formular preguntas sobre tu información.",
                hito: "Exploras un flujo para analizar tu información financiera",
              },
            ].map((item) => (
              <div key={item.n} className="flex gap-6 bg-[#1C2427] px-7 py-6">
                <div className="min-w-[48px] font-mono text-[32px] font-light leading-none text-[#B4552B]">{item.n}</div>
                <div className="flex-1">
                  <h3 className="font-sans text-[18px] font-light text-[#F1F3F2]">
                    {item.title} <span className="font-mono text-[11px] font-normal tracking-[0.08em] text-[#9AA3A1]">· {item.time}</span>
                  </h3>
                  <p className="mt-2 font-sans text-[14px] leading-[1.6] text-[#9AA3A1]">{item.p}</p>
                  <div className="mt-3 flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] uppercase text-[#B4552B]">
                    <span className="h-[1.5px] w-6 bg-[#B4552B]"></span> {item.hito}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA QUIEN */}
      <section className="border-b border-[#262E31] bg-[#1C2427] px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">04 — ¿Es para ti?</span>
          <h2 className="mt-4 max-w-[720px] font-sans text-[clamp(32px,4.5vw,44px)] font-light leading-[1.08] tracking-[-0.025em] text-[#F1F3F2]">
            Si ganas plata y no sabes exactamente a dónde va, es para ti
          </h2>
          <div className="mt-8 grid gap-px border border-[#262E31] bg-[#262E31] md:grid-cols-3">
            <div className="bg-[#0E1214] p-7">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#B4552B]">Profesionales</div>
              <h3 className="mt-3 font-sans text-[18px] font-light text-[#F1F3F2]">Con ingresos y poco tiempo</h3>
              <p className="mt-3 font-sans text-[14px] leading-[1.65] text-[#9AA3A1]">
                Ganas bien pero tu plata vive dispersa. Quieres claridad sin volverte experto en Excel ni pagar un asesor mensual.
              </p>
            </div>
            <div className="bg-[#0E1214] p-7">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#9AA3A1]">Emprendedores</div>
              <h3 className="mt-3 font-sans text-[18px] font-light text-[#F1F3F2]">Finanzas personales y de negocio mezcladas</h3>
              <p className="mt-3 font-sans text-[14px] leading-[1.65] text-[#9AA3A1]">
                Necesitas separar, ordenar y entender tus números para tomar decisiones con datos, no con corazonadas.
              </p>
            </div>
            <div className="bg-[#0E1214] p-7">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#6C7573]">No es para ti si…</div>
              <h3 className="mt-3 font-sans text-[18px] font-light text-[#F1F3F2]">Buscas tips de inversión mágicos</h3>
              <p className="mt-3 font-sans text-[14px] leading-[1.65] text-[#9AA3A1]">
                No damos recomendaciones de bolsa ni promesas de rentabilidad. Te damos claridad sobre tu plata; las decisiones son tuyas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAS QUE FINANZAS */}
      <section className="border-b border-[#262E31] bg-[#0E1214] px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">05 — Más que finanzas</span>
          <h2 className="mt-4 max-w-[760px] font-sans text-[clamp(32px,4.5vw,44px)] font-light leading-[1.08] tracking-[-0.025em] text-[#F1F3F2]">
            No solo aprendes de tu plata: aprendes a trabajar con inteligencia artificial
          </h2>
          <p className="mt-4 max-w-[760px] font-sans text-[16px] leading-[1.65] text-[#9AA3A1]">
            Las finanzas son el ejemplo perfecto para aprender, pero el método que te llevas te sirve en cualquier trabajo donde tu conocimiento sea tu
            valor. Lo aplicable es la forma de trabajar, no solo el tema.
          </p>
          <div className="mt-8 grid gap-px border border-[#262E31] bg-[#262E31] md:grid-cols-3">
            <div className="bg-[#1C2427] p-7">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#B4552B]">La habilidad que te llevas</div>
              <h3 className="mt-3 font-sans text-[18px] font-light text-[#F1F3F2]">Un método, mil usos</h3>
              <p className="mt-3 font-sans text-[14px] leading-[1.65] text-[#9AA3A1]">
                Aprendes a enseñarle a una inteligencia artificial tu información, organizarla y preguntarle sobre ella. Ese mismo método se aplica a
                expedientes, clientes, investigación o proyectos — no solo a números.
              </p>
            </div>
            <div className="bg-[#1C2427] p-7">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#9AA3A1]">Para cualquier profesional</div>
              <h3 className="mt-3 font-sans text-[18px] font-light text-[#F1F3F2]">Médicos, abogados, docentes, gerentes</h3>
              <p className="mt-3 font-sans text-[14px] leading-[1.65] text-[#9AA3A1]">
                Si tu trabajo depende de consultar conocimiento propio — historias, casos, papers, datos — te llevas la manera de hacer que la inteligencia
                artificial lo tenga a la mano. Las finanzas son la puerta de entrada.
              </p>
            </div>
            <div className="bg-[#1C2427] p-7">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#6C7573]">Tu calificación financiera</div>
              <h3 className="mt-3 font-sans text-[18px] font-light text-[#F1F3F2]">¿AAA… o B+?</h3>
              <p className="mt-3 font-sans text-[14px] leading-[1.65] text-[#9AA3A1]">
                Los bancos te califican a ti. En este taller conoces un marco para revisar tu salud financiera y hacer mejores preguntas sobre tus números.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROFESORES */}
      <section className="border-b border-[#262E31] bg-[#1C2427] px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">06 — Quiénes somos</span>
          <p className="mt-4 max-w-[760px] font-mono text-[12px] leading-[1.7] text-[#9AA3A1]">
            // Workshops prácticos de inteligencia artificial aplicada para profesionales que dependen de su conocimiento.
          </p>
          <h2 className="mt-3 font-sans text-[clamp(32px,4.5vw,44px)] font-light leading-[1.08] tracking-[-0.025em] text-[#F1F3F2]">
            Experiencia real para aprender sin perder tiempo
          </h2>
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
              <ul className="mt-5 flex flex-col gap-1.5 font-sans text-[14px] leading-[1.6] text-[#9AA3A1]">
                <li className="flex gap-2">
                  <span className="text-[#B4552B]">—</span> Más de 20 años de experiencia en la industria del software
                </li>
                <li className="flex gap-2">
                  <span className="text-[#B4552B]">—</span> Lidera la adopción de inteligencia artificial en equipos técnicos y de negocio
                </li>
                <li className="flex gap-2">
                  <span className="text-[#B4552B]">—</span> Inversionista en la Bolsa de Valores de Colombia, con experiencia en mercados internacionales
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
              <ul className="mt-5 flex flex-col gap-1.5 font-sans text-[14px] leading-[1.6] text-[#9AA3A1]">
                <li className="flex gap-2">
                  <span className="text-[#B4552B]">—</span> Experto en Salesforce y soluciones empresariales
                </li>
                <li className="flex gap-2">
                  <span className="text-[#B4552B]">—</span> Claude Certified Architect y Salesforce Agentforce Specialist
                </li>
                <li className="flex gap-2">
                  <span className="text-[#B4552B]">—</span> Más de 20 años diseñando soluciones para empresas
                </li>
                <li className="flex gap-2">
                  <span className="text-[#B4552B]">—</span> Experiencia construyendo y gestionando inversiones en finca raíz, cripto y acciones
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRECIO */}
      <section id="precio" className="border-b border-[#262E31] bg-[#0E1214] px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="text-center font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">07 — Inversión</div>
          <div className="mx-auto mt-8 max-w-[560px] border-2 border-[#B4552B] bg-[#1C2427] px-8 py-10 text-center">
            <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#9AA3A1]">Workshop presencial · Sábado 26 sep · 4 horas · Solo 12 cupos</div>
            <div className="mt-4 font-sans text-[72px] font-extralight leading-none tracking-[-0.03em] text-[#F1F3F2]">$400k</div>
            <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#B4552B]">Precio de lanzamiento</div>
            <div className="mx-auto mt-2 font-mono text-[11px] tracking-[0.08em] text-[#9AA3A1]">
              precio referencia $800k · pago seguro con Wompi · guía + café incluidos
            </div>
            <div className="mx-auto mt-6 flex max-w-[380px] flex-col gap-px border border-[#262E31] bg-[#262E31] text-left">
              <div className="flex items-start gap-3 bg-[#0E1214] px-4 py-3 font-sans text-[14px] text-[#9AA3A1]">
                <span className="font-mono font-bold text-[#B4552B]">✓</span> 4 horas de workshop 100% práctico
              </div>
              <div className="flex items-start gap-3 bg-[#0E1214] px-4 py-3 font-sans text-[14px] text-[#9AA3A1]">
                <span className="font-mono font-bold text-[#B4552B]">✓</span> Guía de preparación previa
              </div>
              <div className="flex items-start gap-3 bg-[#0E1214] px-4 py-3 font-sans text-[14px] text-[#9AA3A1]">
                <span className="font-mono font-bold text-[#B4552B]">✓</span> Ayuda uno-a-uno en sala
              </div>
              <div className="flex items-start gap-3 bg-[#0E1214] px-4 py-3 font-sans text-[14px] text-[#9AA3A1]">
                <span className="font-mono font-bold text-[#B4552B]">✓</span> Kit de trabajo: plantillas y guía de análisis
              </div>
              <div className="flex items-start gap-3 bg-[#1C2427] px-4 py-3 font-sans text-[14px] font-medium text-[#F1F3F2]">
                <span className="font-mono font-bold text-[#B4552B]">✓</span> Una metodología para seguir explorando inteligencia artificial aplicada
              </div>
            </div>
            <Link
              href="#"
              className="mt-8 inline-flex items-center bg-[#B4552B] px-8 py-[14px] font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-[#0E1214] hover:bg-[#9A4A24] transition-colors"
            >
              Reservar mi cupo →
            </Link>
            <div className="mt-4 flex justify-center">
              <div className="flex h-[32px] w-full max-w-[320px] border border-[#262E31]">
                <div className="flex-[85] bg-[#0E1214] grid place-items-center font-mono text-[8px] tracking-[0.08em] uppercase text-[#565F62]">85% tinta+panel</div>
                <div className="flex-[10] bg-[#F1F3F2] grid place-items-center font-mono text-[8px] text-[#0E1214]">10%</div>
                <div className="flex-[5] bg-[#B4552B]"></div>
              </div>
            </div>
            <div className="mt-2 font-mono text-[11px] tracking-[0.08em] text-[#6C7573]">12 cupos · 2 facilitadores en sala · Medellín</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-[#262E31] bg-[#1C2427] px-6 py-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">08 — Preguntas frecuentes</span>
          <h2 className="mt-4 font-sans text-[clamp(32px,4.5vw,44px)] font-light leading-[1.08] tracking-[-0.025em] text-[#F1F3F2]">Lo que debes saber</h2>
          <div className="mt-8 flex flex-col gap-px border border-[#262E31] bg-[#262E31]">
            {[
              {
                q: "¿Necesito saber programar?",
                a: "No. El workshop está diseñado para profesionales no-técnicos. La inteligencia artificial hace el trabajo pesado; tú decides y revisas. Solo necesitas saber usar tu computador.",
              },
              {
                q: "¿Necesito algo extra para usar la herramienta?",
                a: "Sí. La herramienta que usamos requiere una cuenta de pago. Te explicamos cómo crearla y qué debes tener listo en la guía previa.",
              },
              {
                q: "¿Qué necesito llevar?",
                a: "Tu laptop y, si quieres, tu desprendible de nómina y tus extractos bancarios (PDF o descargados de tu banco). Si no los traes o no te sientes cómodo compartiéndolos, te damos unos datos de ejemplo para que sigas el workshop paso a paso igual. Una semana antes te enviamos la guía.",
              },
              {
                q: "¿Mis datos financieros están seguros?",
                a: "No necesitas traer información financiera sensible. Puedes trabajar con datos de ejemplo y te explicaremos las recomendaciones de manejo responsable de información durante el workshop.",
              },
              {
                q: "¿Esto es asesoría financiera o de inversión?",
                a: "No. Te damos un sistema para organizar y entender tu plata, y herramientas para analizarla. No damos recomendaciones de inversión; las decisiones siempre son tuyas.",
              },
              {
                q: "¿Cuánta gente hay por sesión?",
                a: "Máximo 12 personas, con facilitadores en sala, para que nadie se quede atrás y todos salgan con su asistente andando.",
              },
            ].map((item) => (
              <div key={item.q} className="bg-[#0E1214] px-6 py-5">
                <h3 className="font-sans text-[16px] font-normal text-[#F1F3F2]">{item.q}</h3>
                <p className="mt-2 font-sans text-[14px] leading-[1.6] text-[#9AA3A1]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="reservar" className="bg-[#0E1214] px-6 py-[88px] text-center">
        <div className="mx-auto max-w-[1120px]">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">Reserva</span>
          <h2 className="mx-auto mt-4 max-w-[720px] font-sans text-[clamp(32px,5vw,52px)] font-extralight leading-[1.08] tracking-[-0.035em] text-[#F1F3F2]">
            Aprende a mirar tu información financiera
            <br />
            <span className="font-light text-[#9AA3A1]">con más claridad</span>
          </h2>
          <p className="mx-auto mt-4 font-mono text-[12px] tracking-[0.12em] uppercase text-[#B4552B]">Solo 12 cupos · Sábado 26 sep · Precio de lanzamiento</p>
          <Link
            href="#"
            className="mt-8 inline-flex items-center bg-[#B4552B] px-10 py-4 font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-[#0E1214] hover:bg-[#9A4A24] transition-colors"
          >
            Reservar mi cupo — $400k
          </Link>
          <div className="mt-8 font-mono text-[11px] tracking-[0.12em] uppercase text-[#6C7573]">
            Workshop presencial · Medellín, Colombia · Sábado 26 de septiembre · Cupos limitados
          </div>
        </div>
      </section>
    </div>
  );
}
