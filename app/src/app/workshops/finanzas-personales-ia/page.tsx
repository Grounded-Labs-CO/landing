import Link from "next/link";
import Image from "next/image";

export default function FinanzasPage() {
  return (
    <div className="bg-[#0E1214] text-[#F1F3F2]">
      {/* HERO — 2A */}
      <section
        id="top"
        className="mx-auto max-w-[1240px] px-12 max-[900px]:px-6 py-[108px] max-[900px]:py-[72px] grid grid-cols-[1.25fr_1fr] max-[900px]:grid-cols-1 gap-[72px] items-start"
      >
        <div className="flex flex-col gap-[30px]">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B4552B]">
            [workshop · 26 sep · medellín · 12 cupos]
          </span>

          <h1
            className="m-0 max-w-[760px] text-[76px] max-[900px]:text-[48px] font-extralight leading-[0.98] tracking-[-0.04em] text-[#F1F3F2] text-balance"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Tu <span className="text-[#F1F3F2]">Asistente Financiero</span> con IA
          </h1>
          <p className="m-0 max-w-[52ch] text-[20px] leading-[1.6] text-[#DDE2E0]">
            Una sesión práctica para aprender a trabajar con información financiera y explorar
            formas concretas de usar inteligencia artificial en tu día a día.
          </p>
          <p className="max-w-[52ch] text-[16px] leading-[1.6] text-[#9AA3A1]">
            No es una clase magistral. No es teoría. Es manos a la obra.
          </p>
          <div className="font-mono text-[12px] tracking-[0.08em] uppercase text-[#6C7573]">
            <span className="text-[#DDE2E0] normal-case tracking-normal font-sans text-[14px] font-medium">
              Presencial en Medellín
            </span>{" "}
            · Sábado 26 de septiembre · No necesitas saber programar
          </div>
          <div className="flex gap-[14px] flex-wrap pt-[6px]">
            <Link
              href="#precio"
              className="bg-[#B4552B] text-[#0E1214] px-[30px] py-[16px] font-mono text-[12px] font-medium tracking-[0.12em] uppercase hover:bg-[#9A4A24] transition-colors"
            >
              reservar mi cupo →
            </Link>
            <Link
              href="#agenda"
              className="border border-[#2F3A3D] text-[#9AA3A1] px-[30px] py-[16px] font-mono text-[12px] tracking-[0.12em] uppercase hover:text-[#F1F3F2] hover:border-[#9AA3A1] transition-colors"
            >
              ver agenda
            </Link>
          </div>
        </div>
      </section>

      {/* BANDA PROBLEMA */}
      <section className="border-y border-[#262E31] bg-[#1C2427]">
        <div className="mx-auto max-w-[1240px] px-12 max-[900px]:px-6 py-[76px] grid grid-cols-2 max-[900px]:grid-cols-1 gap-16">
          <div className="flex flex-col gap-[18px]">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B4552B]">
              [el_problema]
            </span>
            <span className="text-[38px] font-extralight leading-[1.16] tracking-[-0.025em] text-[#F1F3F2]">
              Ganas bien… y no sabes a dónde se va tu plata
            </span>
          </div>
          <div className="flex flex-col gap-6 justify-center">
            <ul className="flex flex-col gap-3 font-mono text-[13px] leading-[1.7] text-[#DDE2E0]">
              <li>
                <span className="text-[#B4552B]">—</span> Tu información financiera está regada:
                nómina en PDF, extractos en el correo, inversiones en apps distintas.
              </li>
              <li>
                <span className="text-[#B4552B]">—</span> No sabes si estás mejor que el año pasado.
                Cada decisión la tomas con el estómago, no con datos.
              </li>
              <li>
                <span className="text-[#B4552B]">—</span> El banco tiene un perfil tuyo. Tú no
                tienes ninguno propio.
              </li>
              <li className="text-[#F1F3F2]">
                <span className="text-[#B4552B]">—</span> Imagina preguntarle a tu plata: “¿puedo
                pagar esta deuda más rápido?” — y que te responda con tus números.
              </li>
            </ul>
            <p className="font-mono text-[12px] leading-[1.7] text-[#9AA3A1]">
              {"// cada banco te califica — aquí aprendes a calificarte tú, con tus datos"}
            </p>
          </div>
        </div>
      </section>

      {/* LO QUE TE LLEVAS — método 4 cols */}
      <section
        id="llevas"
        className="mx-auto max-w-[1240px] px-12 max-[900px]:px-6 py-24 flex flex-col gap-11"
      >
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B4552B]">
            [lo_que_te_llevas]
          </span>
          <h2 className="m-0 text-[46px] font-extralight tracking-[-0.03em] text-[#F1F3F2]">
            Te vas con tu asistente andando, no con apuntes
          </h2>
        </div>
        <div className="grid grid-cols-4 max-[900px]:grid-cols-1 gap-[1px] bg-[#262E31] border border-[#262E31]">
          <div className="bg-[#0E1214] p-[34px_30px] flex flex-col gap-4 min-h-[240px]">
            <span className="font-mono text-[11px] tracking-[0.14em] text-[#B4552B]">01</span>
            <span className="text-[22px] font-light text-[#F1F3F2]">Tu presupuesto real</span>
            <span className="text-[15px] leading-[1.7] text-[#9AA3A1]">
              A dónde va cada peso. Con ejemplos de ingresos y gastos para hacer mejores preguntas.
            </span>
          </div>
          <div className="bg-[#0E1214] p-[34px_30px] flex flex-col gap-4 min-h-[240px]">
            <span className="font-mono text-[11px] tracking-[0.14em] text-[#B4552B]">02</span>
            <span className="text-[22px] font-light text-[#F1F3F2]">Tus deudas e inversiones</span>
            <span className="text-[15px] leading-[1.7] text-[#9AA3A1]">
              Cómo analizar deudas e inversiones con información organizada y preguntas específicas.
            </span>
          </div>
          <div className="bg-[#0E1214] p-[34px_30px] flex flex-col gap-4 min-h-[240px]">
            <span className="font-mono text-[11px] tracking-[0.14em] text-[#B4552B]">03</span>
            <span className="text-[22px] font-light text-[#F1F3F2]">Un marco para analizar</span>
            <span className="text-[15px] leading-[1.7] text-[#9AA3A1]">
              Entiende tus números y detecta preguntas importantes sobre tu salud financiera.
            </span>
          </div>
          <div className="bg-[#0E1214] p-[34px_30px] flex flex-col gap-4 min-h-[240px]">
            <span className="font-mono text-[11px] tracking-[0.14em] text-[#B4552B]">04</span>
            <span className="text-[22px] font-light text-[#F1F3F2]">Pregúntale a tu plata</span>
            <span className="text-[15px] leading-[1.7] text-[#9AA3A1]">
              “¿cómo va mi ahorro?” — practicas y revisas respuestas con criterio.
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-[1px] bg-[#262E31] border border-[#262E31]">
          <div className="bg-[#1C2427] p-6 flex gap-4 items-center">
            <span className="h-[1.5px] w-8 bg-[#B4552B]"></span>
            <span className="font-mono text-[12px] leading-[1.7] text-[#DDE2E0]">
              Tú decides y revisas — la inteligencia artificial organiza, tú interpretas. Sin humo:
              no prometemos hacerte rico ni damos recomendaciones de inversión.
            </span>
          </div>
        </div>
      </section>

      {/* AGENDA — 4 pasos */}
      <section id="agenda" className="border-t border-[#262E31] bg-[#1C2427]">
        <div className="mx-auto max-w-[1240px] px-12 max-[900px]:px-6 py-24 flex flex-col gap-11">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B4552B]">
              [agenda]
            </span>
            <h2 className="m-0 text-[46px] font-extralight tracking-[-0.03em] text-[#F1F3F2]">
              4 horas, 4 pasos. Nadie se queda atrás.
            </h2>
          </div>
          <div className="grid grid-cols-4 max-[900px]:grid-cols-1 gap-[1px] bg-[#262E31] border border-[#262E31]">
            {[
              {
                n: "01",
                title: "Inteligencia artificial sin humo",
                time: "30 min",
                p: "Solo lo que necesitas entender: cómo funciona la inteligencia artificial de verdad y por qué puede leer tus documentos financieros. En español claro, sin tecnicismos.",
                hito: "→ Entiendes qué puede y qué no puede hacer",
              },
              {
                n: "02",
                title: "Tu asistente, instalado y listo",
                time: "60 min",
                p: "Lo configuramos juntos en tu computador, paso a paso. Si te atascas, un facilitador te ayuda en el momento.",
                hito: "→ Tu asistente responde su primera pregunta",
              },
              {
                n: "03",
                title: "Procesas tu nómina y tus extractos",
                time: "75 min",
                p: "Le das de comer tu desprendible y tus extractos. El asistente arma tu presupuesto, analiza tus deudas y organiza tus inversiones.",
                hito: "→ Tu vida financiera, por fin en un solo lugar",
              },
              {
                n: "04",
                title: "Tu calificación financiera",
                time: "45 min",
                p: "Conoces un marco de calificación y practicas cómo formular preguntas sobre tu información.",
                hito: "→ Exploras un flujo para analizar tu información",
              },
            ].map((item) => (
              <div
                key={item.n}
                className="bg-[#0E1214] p-[34px_30px] flex flex-col gap-4 min-h-[260px]"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[11px] tracking-[0.14em] text-[#B4552B]">
                    {item.n}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.08em] text-[#565F62]">
                    {item.time}
                  </span>
                </div>
                <span className="text-[20px] font-light leading-[1.2] text-[#F1F3F2]">
                  {item.title}
                </span>
                <span className="text-[15px] leading-[1.7] text-[#9AA3A1]">{item.p}</span>
                <span className="font-mono text-[11px] tracking-[0.08em] text-[#B4552B] mt-auto">
                  {item.hito}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA QUIEN — 3 cols */}
      <section className="mx-auto max-w-[1240px] px-12 max-[900px]:px-6 py-24 flex flex-col gap-11 border-t border-[#262E31]">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B4552B]">
            [para_quién]
          </span>
          <h2 className="m-0 text-[46px] font-extralight tracking-[-0.03em] text-[#F1F3F2]">
            Si ganas plata y no sabes exactamente a dónde va, es para ti
          </h2>
        </div>
        <div className="grid grid-cols-3 max-[900px]:grid-cols-1 gap-[22px]">
          <div className="border border-[#262E31] bg-[#0E1214] p-[38px_34px] flex flex-col gap-4 min-h-[300px]">
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#B4552B]">
              profesionales
            </span>
            <span className="text-[24px] font-light leading-[1.2] text-[#F1F3F2]">
              Con ingresos y poco tiempo
            </span>
            <span className="text-[15px] leading-[1.7] text-[#9AA3A1]">
              Ganas bien pero tu plata vive dispersa. Quieres claridad sin volverte experto en Excel
              ni pagar un asesor mensual.
            </span>
          </div>
          <div className="border border-[#262E31] bg-[#1C2427] p-[38px_34px] flex flex-col gap-4 min-h-[300px]">
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#B4552B]">
              emprendedores
            </span>
            <span className="text-[24px] font-light leading-[1.2] text-[#F1F3F2]">
              Finanzas personales y de negocio mezcladas
            </span>
            <span className="text-[15px] leading-[1.7] text-[#9AA3A1]">
              Necesitas separar, ordenar y entender tus números para tomar decisiones con datos, no
              con corazonadas.
            </span>
          </div>
          <div className="border border-[#262E31] bg-[#0E1214] p-[38px_34px] flex flex-col gap-4 min-h-[300px]">
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#B4552B]">
              no es para ti si…
            </span>
            <span className="text-[24px] font-light leading-[1.2] text-[#F1F3F2]">
              Buscas tips mágicos
            </span>
            <span className="text-[15px] leading-[1.7] text-[#9AA3A1]">
              No damos recomendaciones de bolsa ni promesas de rentabilidad. Te damos claridad; las
              decisiones son tuyas.
            </span>
          </div>
        </div>
      </section>

      {/* MÁS QUE FINANZAS — banda */}
      <section className="border-y border-[#262E31] bg-[#1C2427]">
        <div className="mx-auto max-w-[1240px] px-12 max-[900px]:px-6 py-24 flex flex-col gap-11">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B4552B]">
              [más_que_finanzas]
            </span>
            <h2 className="m-0 text-[46px] font-extralight tracking-[-0.03em] text-[#F1F3F2]">
              No solo aprendes de tu plata: aprendes a trabajar con inteligencia artificial
            </h2>
            <p className="max-w-[52ch] text-[16px] leading-[1.7] text-[#9AA3A1]">
              Las finanzas son el ejemplo perfecto para aprender, pero el método que te llevas te
              sirve en cualquier trabajo donde tu conocimiento sea tu valor.
            </p>
          </div>
          <div className="grid grid-cols-3 max-[900px]:grid-cols-1 gap-[22px]">
            <div className="border border-[#262E31] bg-[#0E1214] p-8 flex flex-col gap-4">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#B4552B]">
                la habilidad
              </span>
              <span className="text-[22px] font-light text-[#F1F3F2]">Un método, mil usos</span>
              <span className="text-[15px] leading-[1.7] text-[#9AA3A1]">
                Aprendes a enseñarle a una inteligencia artificial tu información, organizarla y
                preguntarle sobre ella.
              </span>
            </div>
            <div className="border border-[#262E31] bg-[#0E1214] p-8 flex flex-col gap-4">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#B4552B]">
                para cualquier profesional
              </span>
              <span className="text-[22px] font-light text-[#F1F3F2]">
                Médicos, abogados, docentes
              </span>
              <span className="text-[15px] leading-[1.7] text-[#9AA3A1]">
                Si tu trabajo depende de consultar conocimiento propio — historias, casos, papers —
                te llevas la manera de hacer que la inteligencia artificial lo tenga a la mano.
              </span>
            </div>
            <div className="border border-[#262E31] bg-[#0E1214] p-8 flex flex-col gap-4">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#B4552B]">
                tu calificación
              </span>
              <span className="text-[22px] font-light text-[#F1F3F2]">¿AAA… o B+?</span>
              <span className="text-[15px] leading-[1.7] text-[#9AA3A1]">
                Los bancos te califican a ti. En este taller conoces un marco para revisar tu salud
                financiera.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PROFESORES — perfiles */}
      <section className="mx-auto max-w-[1240px] px-12 max-[900px]:px-6 py-24 flex flex-col gap-11">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B4552B]">
            [quienes_somos]
          </span>
          <h2 className="m-0 text-[46px] font-extralight tracking-[-0.03em] text-[#F1F3F2]">
            Experiencia real para aprender sin perder tiempo
          </h2>
          <p className="max-w-[52ch] text-[16px] leading-[1.7] text-[#9AA3A1]">
            Workshops prácticos de inteligencia artificial aplicada para profesionales que dependen
            de su conocimiento.
          </p>
        </div>
        <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-[1px] bg-[#2F3A3D] border border-[#2F3A3D]">
          <div className="bg-[#0E1214] p-8 flex flex-col gap-[18px]">
            <Image
              src="/assets/Francisco.jpeg"
              alt="Francisco Martínez"
              width={64}
              height={64}
              className="h-16 w-16 object-cover border border-[#262E31]"
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
              <li>— Más de 20 años de experiencia en la industria del software</li>
              <li>
                — Lidera la adopción de inteligencia artificial en equipos técnicos y de negocio
              </li>
              <li>
                — Inversionista en la Bolsa de Valores de Colombia, con experiencia en mercados
                internacionales
              </li>
            </ul>
          </div>
          <div className="bg-[#0E1214] p-8 flex flex-col gap-[18px]">
            <Image
              src="/assets/Carlos.jpeg"
              alt="Eduardo Castillo"
              width={64}
              height={64}
              className="h-16 w-16 object-cover border border-[#262E31]"
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
              <li>— Experto en Salesforce y soluciones empresariales</li>
              <li>— Claude Certified Architect y Salesforce Agentforce Specialist</li>
              <li>— Más de 20 años diseñando soluciones para empresas</li>
              <li>
                — Experiencia construyendo y gestionando inversiones en finca raíz, cripto y
                acciones
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* PRECIO — caso */}
      <section id="precio" className="border-y border-[#262E31] bg-[#1C2427]">
        <div className="mx-auto max-w-[1240px] px-12 max-[900px]:px-6 py-24 grid grid-cols-[1fr_1.1fr] max-[900px]:grid-cols-1 gap-16 items-center">
          <div className="border border-[#262E31] bg-[#0E1214] p-12 flex flex-col gap-6">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B4552B]">
              [inversión]
            </span>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#6C7573]">
                workshop presencial · sábado 26 sep · 4 horas · 12 cupos
              </span>
              <span className="text-[72px] font-extralight leading-none tracking-[-0.04em] text-[#F1F3F2]">
                $400k
              </span>
              <span className="font-mono text-[12px] tracking-[0.12em] uppercase text-[#B4552B]">
                Precio de lanzamiento
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[12px] leading-[1.7] text-[#DDE2E0]">
                — 4 horas de workshop 100% práctico
              </span>
              <span className="font-mono text-[12px] leading-[1.7] text-[#DDE2E0]">
                — Guía de preparación previa
              </span>
              <span className="font-mono text-[12px] leading-[1.7] text-[#DDE2E0]">
                — Ayuda uno-a-uno en sala
              </span>
              <span className="font-mono text-[12px] leading-[1.7] text-[#DDE2E0]">
                — Kit: plantilla, skills y guía de análisis
              </span>
              <span className="font-mono text-[12px] leading-[1.7] text-[#F1F3F2]">
                — Una metodología para seguir explorando inteligencia artificial aplicada
              </span>
            </div>
            <Link
              href="#"
              className="mt-2 bg-[#B4552B] text-[#0E1214] px-8 py-[16px] font-mono text-[12px] font-medium tracking-[0.12em] uppercase text-center hover:bg-[#9A4A24] transition-colors"
            >
              reservar mi cupo →
            </Link>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-[30px] font-extralight leading-[1.2] tracking-[-0.02em] text-[#F1F3F2]">
              Sales con tu asistente andando, no con apuntes.
            </span>
            <span className="font-mono text-[14px] leading-[1.7] text-[#9AA3A1]">
              Citas obligatorias, permisos y versión. Sin prometer hacerte rico ni dar
              recomendaciones de inversión — solo claridad para decidir mejor.
            </span>
            <div className="h-[1px] bg-[#262E31]"></div>
            <span className="font-mono text-[11px] tracking-[0.08em] text-[#565F62]">
              {"// las decisiones siempre son tuyas"}
            </span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[1240px] px-12 max-[900px]:px-6 py-24 grid grid-cols-[0.8fr_1.2fr] max-[900px]:grid-cols-1 gap-16 items-start">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B4552B]">
            [faq]
          </span>
          <h2 className="m-0 text-[40px] font-extralight tracking-[-0.03em] leading-[1.1] text-[#F1F3F2]">
            Lo que debes saber
          </h2>
        </div>
        <div className="flex flex-col">
          {[
            {
              q: "¿Necesito saber programar?",
              a: "No. El workshop está diseñado para profesionales no-técnicos. La inteligencia artificial hace el trabajo pesado; tú decides y revisas.",
            },
            {
              q: "¿Necesito algo extra para usar la herramienta?",
              a: "Sí. La herramienta que usamos requiere una cuenta de pago. Te explicamos cómo crearla en la guía previa.",
            },
            {
              q: "¿Qué necesito llevar?",
              a: "Tu laptop y, si quieres, tu desprendible y extractos (PDF). Si no los traes, te damos datos de ejemplo para que sigas el workshop igual.",
            },
            {
              q: "¿Mis datos financieros están seguros?",
              a: "No necesitas traer información sensible. Puedes trabajar con datos de ejemplo y te explicamos manejo responsable.",
            },
            {
              q: "¿Esto es asesoría financiera?",
              a: "No. Te damos un sistema para organizar y entender tu plata; las decisiones siempre son tuyas.",
            },
            {
              q: "¿Cuánta gente hay por sesión?",
              a: "Máximo 12 personas, con facilitadores en sala, para que nadie se quede atrás.",
            },
          ].map((item) => (
            <div key={item.q} className="border-t border-[#262E31] py-[26px] flex flex-col gap-2.5">
              <span className="text-[20px] font-light text-[#F1F3F2]">{item.q}</span>
              <span className="text-[16px] leading-[1.7] text-[#9AA3A1]">{item.a}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
