"use client";
import { type SessionLike, confirmationTemplate } from "../../convex/templates";

// Preview del **correo de confirmación** (el que sale después de responder la
// encuesta). Es el que más datos toma de la sesión —fecha, hora, link, agenda—
// así que es el que vale la pena revisar antes de mandar la invitación.
//
// Importa la **misma plantilla** que usa el servidor (`convex/templates.ts`),
// así que lo que se ve acá es literalmente lo que sale por Resend: no hay dos
// copias del texto que se puedan desincronizar. Por eso ese módulo tiene que
// seguir siendo puro (sin `process.env` ni `fetch`).
//
// El link es de ejemplo: en el preview no apunta a ningún lado.

const SAMPLE_NAME = "Ana Rueda";

export function SurveyEmailPreview({ session }: { session: SessionLike | null }) {
  const mail = confirmationTemplate({ name: SAMPLE_NAME, session: session ?? {} });

  return (
    <div className="border border-[#262E31] bg-[#0E1214]">
      <div className="border-b border-[#262E31] px-3 py-3">
        <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#565F62]">asunto</p>
        <p className="mt-1 font-sans text-[14px] leading-[1.5] text-[#F1F3F2]">{mail.subject}</p>
      </div>

      {!session?.date && (
        <p className="border-b border-[#5D4A2F] bg-[#1C1611] px-3 py-2.5 font-mono text-[10px] leading-[1.7] text-[#E2C084]">
          {"// sin fecha: el correo sale sin cuándo ni link, así que no hay correo que mandar. Ponle fecha arriba."}
        </p>
      )}

      {/* El correo tal cual se ve: mismo HTML que se le manda a Resend. */}
      <iframe
        title="preview del correo de confirmación"
        srcDoc={mail.html}
        sandbox=""
        className="h-[560px] w-full border-0 bg-[#0E1214]"
      />
    </div>
  );
}
