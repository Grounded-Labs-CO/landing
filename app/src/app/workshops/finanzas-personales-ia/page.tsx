import Link from "next/link";
import Image from "next/image";

export default function FinanzasPage() {
  return (
    <div className="bg-[#f6f2ea] text-[#17251f]">
      {/* HERO */}
      <section className="bg-[linear-gradient(115deg,#f6f2ea_0%,#f6f2ea_55%,#e7efe5_100%)] px-6 py-[96px] max-[820px]:py-[72px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-8 text-[13px] font-bold tracking-[0.08em] text-[#236b4b]">GROUNDED Labs</div>
          <p className="mb-8 -mt-[18px] text-[18px] font-bold text-[#17251f]">
            <span className="text-[#c86f3d] italic">No hype.</span> Solo inteligencia artificial que entiende tu mundo.
          </p>
          <h1
            className="max-w-[760px] text-[clamp(42px,6vw,76px)] font-semibold leading-[1.02] tracking-[-0.025em] text-[#17251f]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Tu <span className="text-[#236b4b]">Asistente Financiero</span>
            <br />
            con Inteligencia Artificial
          </h1>
          <p className="mt-6 max-w-[680px] text-[clamp(17px,2vw,22px)] font-medium leading-[1.45] text-[#4e5b53]">
            Una sesión práctica para aprender a trabajar con información financiera y explorar formas concretas de usar inteligencia artificial en tu día a día.
          </p>
          <p className="mt-5 max-w-[680px] text-[16px] text-[#6f7d74]">No es una clase magistral. No es teoría. Es manos a la obra.</p>
          <div className="mt-6 font-sans text-[15px] tracking-[0.02em] text-[#6f7d74]">
            <b className="font-semibold text-[#236b4b]">Presencial en Medellín</b> &nbsp;·&nbsp; Sábado 26 de septiembre &nbsp;·&nbsp; No necesitas saber programar
          </div>
          <Link
            href="#precio"
            className="mt-10 inline-block rounded-full bg-[#236b4b] px-8 py-[17px] font-sans text-[18px] font-bold text-[#fffdf8] shadow-[0_10px_22px_rgba(35,107,75,0.18)] hover:bg-[#174e36] hover:shadow-[0_14px_28px_rgba(35,107,75,0.25)]"
          >
            Reservar mi cupo →
          </Link>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="bg-[#f6f2ea] px-6 py-[104px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-3 text-[13px] font-bold tracking-[0.02em] text-[#236b4b]">
            <span className="text-[#c86f3d]">01</span> El problema
          </div>
          <h2 className="mb-8 text-[clamp(34px,4.5vw,52px)] font-semibold leading-[1.08] tracking-[-0.025em]" style={{ fontFamily: "var(--font-fraunces)" }}>
            Ganas bien… y no sabes a dónde se va tu plata
          </h2>
          <div className="flex flex-col gap-[14px]">
            <div className="flex gap-3.5 text-[19px] text-[#4e5b53]">
              <span className="font-bold text-[#c86f3d]">•</span>
              Tu información financiera está regada: nómina en PDF, extractos en el correo, inversiones en apps distintas.
            </div>
            <div className="flex gap-3.5 text-[19px] text-[#4e5b53]">
              <span className="font-bold text-[#c86f3d]">•</span>
              No sabes si estás mejor que el año pasado. Cada decisión de plata la tomas con el estómago, no con datos.
            </div>
            <div className="flex gap-3.5 text-[19px] text-[#4e5b53]">
              <span className="font-bold text-[#c86f3d]">•</span>
              El banco, las tarjetas y datacredito tienen un perfil tuyo. Tú no tienes ninguno propio.
            </div>
            <div className="flex gap-3.5 text-[19px] font-semibold text-[#236b4b]">
              <span className="font-bold text-[#c86f3d]">•</span>
              Imagina preguntarle a tu plata: &quot;¿puedo pagar esta deuda más rápido?&quot; — y que te responda con TUS números.
            </div>
          </div>
        </div>
      </section>

      {/* SOLUCION */}
      <section className="bg-[#edf3eb] px-6 py-[104px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-3 text-[13px] font-bold tracking-[0.02em] text-[#236b4b]">
            <span className="text-[#c86f3d]">02</span> Lo que te llevas
          </div>
          <h2 className="mb-8 text-[clamp(34px,4.5vw,52px)] font-semibold leading-[1.08] tracking-[-0.025em]" style={{ fontFamily: "var(--font-fraunces)" }}>
            Te vas con tu asistente financiero andando, no con apuntes
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[18px] border border-[#dce3da] border-l-4 border-l-[#236b4b] bg-[#fffdf8] p-7 shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
              <div className="mb-2.5 text-[13px] font-bold tracking-[0.02em] text-[#236b4b]">Tu presupuesto real</div>
              <h3 className="mb-3 text-[22px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>
                A dónde va cada peso
              </h3>
              <p className="text-[16px] leading-6 text-[#4e5b53]">
                Trabajas con ejemplos de ingresos y gastos para aprender a organizar información financiera y hacer mejores preguntas.
              </p>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] border-l-4 border-l-[#356b72] bg-[#fffdf8] p-7 shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
              <div className="mb-2.5 text-[13px] font-bold tracking-[0.02em] text-[#356b72]">Tus deudas e inversiones</div>
              <h3 className="mb-3 text-[22px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>
                Deuda, bolsa y CDTs
              </h3>
              <p className="text-[16px] leading-6 text-[#4e5b53]">Exploras cómo analizar deudas e inversiones con información organizada y preguntas específicas.</p>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] border-l-4 border-l-[#76628d] bg-[#fffdf8] p-7 shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
              <div className="mb-2.5 text-[13px] font-bold tracking-[0.02em] text-[#76628d]">Un marco para analizar</div>
              <h3 className="mb-3 text-[22px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>
                Entiende tus números
              </h3>
              <p className="text-[16px] leading-6 text-[#4e5b53]">Conoces un marco de análisis para revisar tu situación financiera y detectar preguntas importantes.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-[18px] border border-[#dce3da] border-l-4 border-l-[#c86f3d] bg-[#fffdf8] p-7 shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
              <div className="mb-2.5 text-[13px] font-bold tracking-[0.02em] text-[#c86f3d]">Preguntas concretas</div>
              <h3 className="mb-3 text-[22px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>
                Pregúntale a tu plata
              </h3>
              <p className="text-[16px] leading-6 text-[#4e5b53]">
                Practicas preguntas como &quot;¿cómo va mi ahorro?&quot; o &quot;¿qué información necesito para comparar mis deudas?&quot; y revisas las respuestas
                con criterio.
              </p>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] border-l-4 border-l-[#236b4b] bg-[#fffdf8] p-7 shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
              <div className="mb-2.5 text-[13px] font-bold tracking-[0.02em] text-[#236b4b]">Criterio profesional</div>
              <h3 className="mb-3 text-[22px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>
                Tú decides y revisas
              </h3>
              <p className="text-[16px] leading-6 text-[#4e5b53]">
                La inteligencia artificial puede ayudarte a organizar y analizar información, pero la interpretación y las decisiones siguen bajo tu responsabilidad.
              </p>
            </div>
          </div>
          <div className="mt-10 rounded-xl border border-[#d99b78] bg-[#fff8f2] p-7 text-center">
            <p className="font-sans text-[16px] text-[#a85e35]">
              Sin humo: no prometemos hacerte rico ni damos recomendaciones de inversión. Te damos un sistema para ver tu plata con claridad y decidir mejor.
              Las decisiones siempre son tuyas.
            </p>
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <section className="bg-[#f6f2ea] px-6 py-[104px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-3 text-[13px] font-bold tracking-[0.02em] text-[#236b4b]">
            <span className="text-[#c86f3d]">03</span> Cómo es el workshop
          </div>
          <h2 className="mb-8 text-[clamp(34px,4.5vw,52px)] font-semibold leading-[1.08] tracking-[-0.025em]" style={{ fontFamily: "var(--font-fraunces)" }}>
            4 horas, 4 pasos. Nadie se queda atrás.
          </h2>
          <div className="flex flex-col gap-4">
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
              <div key={item.n} className="flex gap-5 rounded-[18px] border border-[#dce3da] border-l-4 border-l-[#356b72] bg-[#fffdf8] px-7 py-[26px] shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
                <div className="min-w-11 font-semibold text-[#236b4b] text-[34px] leading-none" style={{ fontFamily: "var(--font-fraunces)" }}>
                  {item.n}
                </div>
                <div>
                  <h3 className="mb-1 text-[20px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>
                    {item.title} <span className="font-sans text-[13px] font-normal text-[#6f7d74]">· {item.time}</span>
                  </h3>
                  <p className="text-[15px] text-[#4e5b53]">{item.p}</p>
                  <div className="mt-2 text-[13px] font-bold text-[#236b4b]">{item.hito}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA QUIEN */}
      <section className="bg-[#edf3eb] px-6 py-[104px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-3 text-[13px] font-bold tracking-[0.02em] text-[#236b4b]">
            <span className="text-[#c86f3d]">04</span> ¿Es para ti?
          </div>
          <h2 className="mb-8 text-[clamp(34px,4.5vw,52px)] font-semibold leading-[1.08] tracking-[-0.025em]" style={{ fontFamily: "var(--font-fraunces)" }}>
            Si ganas plata y no sabes exactamente a dónde va, es para ti
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[18px] border border-[#dce3da] border-l-4 border-l-[#236b4b] bg-[#fffdf8] p-7 shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
              <div className="mb-2.5 text-[13px] font-bold text-[#236b4b]">Profesionales</div>
              <h3 className="mb-3 text-[22px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>
                Con ingresos y poco tiempo
              </h3>
              <p className="text-[16px] text-[#4e5b53]">Ganas bien pero tu plata vive dispersa. Quieres claridad sin volverte experto en Excel ni pagar un asesor mensual.</p>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] border-l-4 border-l-[#356b72] bg-[#fffdf8] p-7 shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
              <div className="mb-2.5 text-[13px] font-bold text-[#356b72]">Emprendedores</div>
              <h3 className="mb-3 text-[22px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>
                Finanzas personales y de negocio mezcladas
              </h3>
              <p className="text-[16px] text-[#4e5b53]">Necesitas separar, ordenar y entender tus números para tomar decisiones con datos, no con corazonadas.</p>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] border-l-4 border-l-[#c86f3d] bg-[#fffdf8] p-7 shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
              <div className="mb-2.5 text-[13px] font-bold text-[#c86f3d]">No es para ti si…</div>
              <h3 className="mb-3 text-[22px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>
                Buscas tips de inversión mágicos
              </h3>
              <p className="text-[16px] text-[#4e5b53]">No damos recomendaciones de bolsa ni promesas de rentabilidad. Te damos claridad sobre tu plata; las decisiones son tuyas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MAS QUE FINANZAS */}
      <section className="bg-[#f6f2ea] px-6 py-[104px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-3 text-[13px] font-bold tracking-[0.02em] text-[#236b4b]">
            <span className="text-[#c86f3d]">05</span> Más que finanzas
          </div>
          <h2 className="text-[clamp(34px,4.5vw,52px)] font-semibold leading-[1.08] tracking-[-0.025em]" style={{ fontFamily: "var(--font-fraunces)" }}>
            No solo aprendes de tu plata: aprendes a trabajar con inteligencia artificial
          </h2>
          <p className="mb-8 mt-4 max-w-[760px] text-[18px] text-[#4e5b53]">
            Las finanzas son el ejemplo perfecto para aprender, pero el método que te llevas te sirve en cualquier trabajo donde tu conocimiento sea tu valor. Lo aplicable
            es la forma de trabajar, no solo el tema.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[18px] border border-[#dce3da] border-l-4 border-l-[#236b4b] bg-[#fffdf8] p-7 shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
              <div className="mb-2.5 text-[13px] font-bold text-[#236b4b]">La habilidad que te llevas</div>
              <h3 className="mb-3 text-[22px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>
                Un método, mil usos
              </h3>
              <p className="text-[16px] text-[#4e5b53]">
                Aprendes a enseñarle a una inteligencia artificial tu información, organizarla y preguntarle sobre ella. Ese mismo método se aplica a expedientes, clientes, investigación o
                proyectos — no solo a números.
              </p>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] border-l-4 border-l-[#356b72] bg-[#fffdf8] p-7 shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
              <div className="mb-2.5 text-[13px] font-bold text-[#356b72]">Para cualquier profesional</div>
              <h3 className="mb-3 text-[22px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>
                Médicos, abogados, docentes, gerentes
              </h3>
              <p className="text-[16px] text-[#4e5b53]">
                Si tu trabajo depende de consultar conocimiento propio — historias, casos, papers, datos — te llevas la manera de hacer que la inteligencia artificial lo tenga a la mano. Las finanzas son la
                puerta de entrada.
              </p>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] border-l-4 border-l-[#76628d] bg-[#fffdf8] p-7 shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
              <div className="mb-2.5 text-[13px] font-bold text-[#76628d]">Tu calificación financiera</div>
              <h3 className="mb-3 text-[22px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>
                ¿AAA… o B+?
              </h3>
              <p className="text-[16px] text-[#4e5b53]">
                Los bancos te califican a ti. En este taller conoces un marco para revisar tu salud financiera y hacer mejores preguntas sobre tus números.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROFESORES */}
      <section className="bg-[#edf3eb] px-6 py-[104px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-3 text-[13px] font-bold tracking-[0.02em] text-[#236b4b]">
            <span className="text-[#c86f3d]">06</span> Quiénes somos
          </div>
          <p className="-mt-3 mb-8 max-w-[760px] text-[18px] text-[#4e5b53]">Workshops prácticos de inteligencia artificial aplicada para profesionales que dependen de su conocimiento.</p>
          <h2 className="mb-8 text-[clamp(34px,4.5vw,52px)] font-semibold leading-[1.08] tracking-[-0.025em]" style={{ fontFamily: "var(--font-fraunces)" }}>
            Experiencia real para aprender sin perder tiempo
          </h2>
          <div className="grid gap-7 md:grid-cols-2">
            <div className="rounded-[18px] border border-[#dce3da] bg-[#fffdf8] p-8 shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
              <Image src="/assets/Francisco.jpeg" alt="Francisco Martínez" width={64} height={64} className="mb-5 h-16 w-16 rounded-full object-cover border-2 border-[#dfece0] shadow-sm" />
              <h3 className="mb-1 text-[22px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>
                Francisco Martínez
              </h3>
              <div className="mb-3.5 text-[14px] font-bold text-[#236b4b]">Technical Manager + Inteligencia Artificial aplicada</div>
              <ul className="list-disc pl-5 text-[15px] text-[#4e5b53]">
                <li className="mb-1.5">Más de 20 años de experiencia en la industria del software</li>
                <li className="mb-1.5">Lidera la adopción de inteligencia artificial en equipos técnicos y de negocio</li>
                <li>Inversionista en la Bolsa de Valores de Colombia, con experiencia en mercados internacionales</li>
              </ul>
            </div>
            <div className="rounded-[18px] border border-[#dce3da] bg-[#fffdf8] p-8 shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
              <Image src="/assets/Carlos.jpeg" alt="Eduardo Castillo" width={64} height={64} className="mb-5 h-16 w-16 rounded-full object-cover border-2 border-[#dfece0] shadow-sm" />
              <h3 className="mb-1 text-[22px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>
                Eduardo Castillo
              </h3>
              <div className="mb-3.5 text-[14px] font-bold text-[#236b4b]">Salesforce, Claude e Inteligencia Artificial aplicada</div>
              <ul className="list-disc pl-5 text-[15px] text-[#4e5b53]">
                <li className="mb-1.5">Experto en Salesforce y soluciones empresariales</li>
                <li className="mb-1.5">Claude Certified Architect y Salesforce Agentforce Specialist</li>
                <li className="mb-1.5">Más de 20 años diseñando soluciones para empresas</li>
                <li>Experiencia construyendo y gestionando inversiones en finca raíz, cripto y acciones</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRECIO */}
      <section id="precio" className="bg-[#f6f2ea] px-6 py-[104px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-3 text-center text-[13px] font-bold tracking-[0.02em] text-[#236b4b]">
            <span className="text-[#c86f3d]">07</span> Inversión
          </div>
          <div className="mx-auto max-w-[560px] rounded-[22px] border-2 border-[#236b4b] bg-[#fffdf8] px-10 py-14 text-center shadow-[0_20px_50px_rgba(35,107,75,0.13)]">
            <div className="text-[13px] uppercase tracking-[0.14em] text-[#6f7d74]">Workshop presencial · Sábado 26 sep · 4 horas · Solo 12 cupos</div>
            <div className="mt-2.5 font-semibold leading-none text-[#236b4b] text-[88px]" style={{ fontFamily: "var(--font-fraunces)" }}>
              $400k
            </div>
            <div className="mb-3.5 text-[14px] font-bold text-[#c86f3d]">Precio de lanzamiento</div>
            <div className="mx-auto mt-2 flex max-w-[380px] flex-col gap-2.5 text-left">
              <div className="flex items-start gap-3 rounded-xl border border-[#dfe8dc] bg-[#f3f7f1] px-4 py-[13px] text-[15px] text-[#4e5b53]">
                <span className="font-extrabold text-[#236b4b]">✓</span> 4 horas de workshop 100% práctico
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-[#dfe8dc] bg-[#f3f7f1] px-4 py-[13px] text-[15px] text-[#4e5b53]">
                <span className="font-extrabold text-[#236b4b]">✓</span> Guía de preparación previa
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-[#dfe8dc] bg-[#f3f7f1] px-4 py-[13px] text-[15px] text-[#4e5b53]">
                <span className="font-extrabold text-[#236b4b]">✓</span> Ayuda uno-a-uno en sala
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-[#dfe8dc] bg-[#f3f7f1] px-4 py-[13px] text-[15px] text-[#4e5b53]">
                <span className="font-extrabold text-[#236b4b]">✓</span> Kit de trabajo: plantilla, skills y guía de análisis
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-[#bcd8b9] bg-[#e6f2e4] px-4 py-[13px] text-[15px] font-semibold text-[#17251f]">
                <span className="font-extrabold text-[#236b4b]">✓</span> Una metodología para seguir explorando inteligencia artificial aplicada
              </div>
            </div>
            <Link href="#" className="mt-8 inline-block rounded-full bg-[#236b4b] px-8 py-[17px] text-[18px] font-bold text-[#fffdf8] hover:bg-[#174e36]">
              Reservar mi cupo →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#edf3eb] px-6 py-[104px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-3 text-[13px] font-bold tracking-[0.02em] text-[#236b4b]">
            <span className="text-[#c86f3d]">08</span> Preguntas frecuentes
          </div>
          <h2 className="mb-8 text-[clamp(34px,4.5vw,52px)] font-semibold leading-[1.08] tracking-[-0.025em]" style={{ fontFamily: "var(--font-fraunces)" }}>
            Lo que debes saber
          </h2>
          <div className="flex flex-col gap-3.5">
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
              <div key={item.q} className="rounded-[18px] border border-[#dce3da] bg-[#fffdf8] px-[26px] py-[22px] shadow-[0_8px_24px_rgba(36,60,45,0.045)]">
                <h3 className="mb-2 text-[18px] font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>
                  {item.q}
                </h3>
                <p className="text-[15px] text-[#4e5b53]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="reservar" className="bg-[#17251f] px-6 py-[104px] text-center">
        <div className="mx-auto max-w-[1120px]">
          <h2 className="text-[clamp(32px,5vw,56px)] font-semibold leading-[1.08] tracking-[-0.025em] text-[#fffdf8]" style={{ fontFamily: "var(--font-fraunces)" }}>
            Aprende a mirar tu información financiera
            <br />
            con más claridad
          </h2>
          <p className="mb-8 mt-4 font-sans text-[20px] text-[#c86f3d]">Solo 12 cupos · Sábado 26 sep · Precio de lanzamiento</p>
          <Link href="#" className="inline-block rounded-full bg-[#dcebd7] px-[52px] py-5 text-[20px] font-bold text-[#17251f] hover:bg-[#fffdf8]">
            Reservar mi cupo — $400k
          </Link>
          <div className="mt-8 font-sans text-[13px] text-[#a5afa8]">Workshop presencial · Medellín, Colombia · Sábado 26 de septiembre · Cupos limitados</div>
        </div>
      </section>
    </div>
  );
}
