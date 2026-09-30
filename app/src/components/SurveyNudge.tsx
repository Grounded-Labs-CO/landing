"use client";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { api } from "../../convex/_generated/api";

// Recordatorio de la encuesta de cierre.
//
// Deliberadamente discreto, porque es lo que más aburre a la gente:
//   · Solo aparece si ya le mandamos el correo, sigue sin responder y la sesión
//     todavía no se dio (eso lo filtra `survey.mySurveyStatus` en el server).
//   · Es una línea, no bloquea nada y tiene "ahora no".
//   · "ahora no" es un snooze de 7 días, NO un borrado permanente: sin eso,
//     decir que no una vez mataba el recordatorio para siempre, incluso para
//     otra campaña. Si la persona responde, ahí sí se acaba (el server ya no
//     lo devuelve).
//   · La llave incluye el token, así que cada invitación lleva su propio snooze.

const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;
const KEY = "gl:encuesta-recordatorio";

/** "Ya estoy en el cliente" sin setState-en-effect. */
const noopSubscribe = () => () => {};

function readHiddenUntil(token: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const at = Number(window.localStorage.getItem(`${KEY}:${token}`));
    return Number.isFinite(at) && at > 0 ? at : 0;
  } catch {
    // sin storage (modo privado): se muestra y no se recuerda
    return 0;
  }
}

export function SurveyNudge({ courseSlug }: { courseSlug: string }) {
  const status = useQuery(api.survey.mySurveyStatus, { courseSlug });
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  if (!mounted) return null;
  if (status?.state !== "pendiente") return null;

  return <NudgeCard token={status.token} when={status.when} />;
}

/**
 * Vive aparte para que el snooze se lea con el token ya disponible: los hooks
 * corren siempre, aunque el padre devuelva `null`, así que leerlo en el mismo
 * componente leería una llave sin token en el primer render.
 */
function NudgeCard({ token, when }: { token: string; when: string }) {
  // El snooze se compara contra el momento en que se montó, no contra `Date.now()`
  // en cada render: el lint de React marca `Date.now()` en render como impuro, y
  // para esto da igual — la tarjeta se remonta al entrar a la página.
  const [now] = useState(() => Date.now());
  const [hiddenUntil, setHiddenUntil] = useState(() => readHiddenUntil(token));
  if (now < hiddenUntil) return null;

  return (
    <div className="nudge relative flex flex-wrap items-center justify-between gap-3 overflow-hidden border border-[#262E31] border-l-2 border-l-[#B4552B] bg-[#111719] px-5 py-4">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#B4552B]">
          falta tu encuesta
        </span>
        <p className="font-sans text-[14px] leading-[1.6] text-[#9AA3A1]">
          {when ? (
            <>
              Gracias por estar con nosotros. Son 3 minutos de feedback, nos ayudan a mejorar la
              sesión del {when}, y con ellos te guardamos el lugar.
            </>
          ) : (
            "Gracias por estar con nosotros. Son 3 minutos de feedback y nos ayudan a mejorar lo que viene."
          )}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {/* Botón SOLIDO: es el único acento lleno de la página, igual que
            "ver material". Eso solo ya hace que el ojo baje a él. */}
        <Link
          href={`/encuesta?t=${token}`}
          className="bg-[#B4552B] px-5 py-2.5 font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-[#0E1214] transition-colors hover:bg-[#9A4A24]"
        >
          llenarla →
        </Link>
        <button
          type="button"
          onClick={() => {
            const until = Date.now() + SNOOZE_MS;
            setHiddenUntil(until);
            try {
              window.localStorage.setItem(`${KEY}:${token}`, String(until));
            } catch {
              // si no se puede guardar, se oculta solo en esta sesión
            }
          }}
          title="Te lo volvemos a mostrar en una semana, si sigues sin responder."
          className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#565F62] underline decoration-current/30 underline-offset-4 transition-colors hover:text-[#9AA3A1]"
        >
          ahora no
        </button>
      </div>
    </div>
  );
}
