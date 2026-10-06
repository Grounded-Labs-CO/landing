"use client";
import { useAction, useQuery } from "convex/react";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { api } from "../../convex/_generated/api";
import { STEPS, type Answers, type Step, errText, labelFor } from "@/lib/survey";
import { SUPPORT_WHATSAPP, SUPPORT_WHATSAPP_URL } from "@/components/SupportLine";

// Encuesta de cierre, una pregunta por pantalla.
//
// Las tres reglas que hacen que nadie la llene "a la maldita sea":
//   1. El link trae token → nombre y correo ya vienen puestos. Nobody escribe
//      su correo (que es donde más se equivocan) salvo que venga sin token.
//   2. Nada se envía hasta que todas las obligatorias están contestadas, y
//      hay un paso de revisión donde se puede corregir antes de mandar.
//   3. Se autoguarda en localStorage: si la cierran a la mitad, al volver
//      sigue donde estaban.
// La pantalla de gracias muestra los datos de la sesión aunque el correo no
// haya salido, para que nadie se quede sin la info.

const COURSE = "finanzas-personales-ia";

/** Suscripción vacía: `useSyncExternalStore` solo se usa como "ya estoy en el cliente". */
const noopSubscribe = () => () => {};

/** Lee lo que quedó a medias. En el servidor devuelve vacío (nunca hay storage). */
function loadAnswers(key: string): Answers {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

type SessionInfo = {
  title: string;
  date: string;
  startTime: string;
  joinUrl: string;
  calendarUrl: string;
  agenda: string[];
  status: string;
  when: string;
  open: boolean;
} | null;

export function SurveyFlow({ token }: { token?: string }) {
  const info = useQuery(api.survey.getByToken, token ? { token } : { courseSlug: COURSE });
  const submit = useAction(api.survey.submit);

  const storageKey = `gl:encuesta:${token ?? "anon"}`;
  // "Ya estamos en el cliente" sin setState-en-effect: durante SSR y la
  // primera pasada de hidratación sale `false`, así que se ve "cargando…".
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  // Las respuestas a medias se leen en el inicializador del estado, no en un
  // efecto: si la persona cerró la encuesta y volvió, sigue donde estaba.
  const [answers, setAnswers] = useState<Answers>(() => loadAnswers(storageKey));
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorText, setErrorText] = useState("");
  const [emailed, setEmailed] = useState(true);
  // ¿Llegamos a esta pregunta tocando "cambiar" en la revisión? Si sí, al
  // terminar hay que volver a la revisión, no seguir hacia adelante: si no,
  // corregir la pregunta 2 obliga a recorrer las 9 siguientes otra vez.
  const [editando, setEditando] = useState(false);

  const email = (info?.email ?? "").trim();
  const name = (info?.name ?? "").trim();
  const hasToken = !!token && info?.validToken === true;
  const session = (info?.session ?? null) as SessionInfo;
  // Sin token válido hay que preguntar el contacto en la primera pantalla.
  const needContact = !hasToken;

  // Autoguardado en cada cambio. Si la cierran a la mitad, al volver el
  // inicializador de arriba la recoge.
  useEffect(() => {
    if (!mounted || status === "done") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(answers));
    } catch {
      /* ignora quota / modo privado */
    }
  }, [answers, mounted, storageKey, status]);

  const steps = useMemo<Step[]>(
    () => (needContact ? [CONTACT_STEP, ...STEPS] : STEPS),
    [needContact],
  );
  const total = steps.length + 1; // + paso de revisión
  const step = steps[index];
  const isReview = index >= steps.length;

  const setAnswer = useCallback((id: string, value: string | string[] | undefined) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const answered = useCallback(
    (step: Step | undefined) => {
      if (!step) return false;
      const v = answers[step.id];
      if (Array.isArray(v)) return v.length > 0;
      return typeof v === "string" && v.trim().length > 0;
    },
    [answers],
  );

  // ¿Se puede avanzar? Las opcionales dejan pasar; las obligatorias no.
  // ¿Se puede avanzar? Una pregunta opcional siempre deja pasar (puede quedar
  // en blanco); una obligatoria, solo si tiene algo marcado.
  const canContinue = step ? step.optional === true || answered(step) : false;

  // En el modo anónimo hay que validar el contacto antes de dejarlo pasar.
  const contactOk =
    !needContact ||
    (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(answers.email ?? "").trim()) &&
      String(answers.name ?? "").trim().length > 0);

  // Nada sale sin las obligatorias contestadas, aunque se salte con las flechas.
  const canSubmit = contactOk && STEPS.every((s) => s.optional || answered(s));

  // El índice del paso de revisión (está después de la última pregunta).
  const reviewIndex = steps.length;

  const goTo = useCallback(
    (next: number) => {
      setIndex(Math.max(0, Math.min(next, total - 1)));
      setErrorText("");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [total],
  );

  /** Termina de corregir y vuelve a la revisión. */
  const volverARevision = useCallback(() => {
    setEditando(false);
    goTo(reviewIndex);
  }, [goTo, reviewIndex]);

  const submitAll = async () => {
    setStatus("sending");
    setErrorText("");
    try {
      const result = await submit({
        token,
        courseSlug: COURSE,
        email: String(answers.email ?? email),
        name: String(answers.name ?? name),
        nps: Number(answers.nps ?? -1),
        npsWhy: String(answers.npsWhy ?? ""),
        channelOther: String(answers.channelOther ?? ""),
        interestsOther: String(answers.interestsOther ?? ""),
        assistant: String(answers.assistant ?? ""),
        pace: String(answers.pace ?? ""),
        price: String(answers.price ?? ""),
        channel: String(answers.channel ?? ""),
        knewHosts: String(answers.knewHosts ?? ""),
        b2b: String(answers.b2b ?? ""),
        interests: Array.isArray(answers.interests) ? answers.interests : [],
        changeOne: String(answers.changeOne ?? ""),
        consent: String(answers.consent ?? ""),
      });
      setEmailed(result.emailed !== false);
      setStatus("done");
      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        /* ignora */
      }
    } catch (error: unknown) {
      setStatus("error");
      setErrorText(errText(error));
    }
  };

  if (!info || !mounted) {
    return <Loading />;
  }

  if (status === "done") {
    return (
      <Done
        name={String(answers.name ?? name)}
        email={String(answers.email ?? email)}
        session={session}
        emailed={emailed}
        onEdit={() => {
          setStatus("idle");
          goTo(0);
        }}
      />
    );
  }

  return (
    <div className="min-h-[calc(100dvh-64px)] bg-[#0E1214] text-[#F1F3F2]">
      {/* Barra de progreso */}
      <Progress current={index + 1} total={total} />

      <div className="mx-auto flex min-h-[calc(100dvh-64px)] max-w-[620px] flex-col px-6 pb-8 pt-10 max-[560px]:px-5 max-[560px]:pt-7">
        {/* Quien llena */}
        <Header
          index={index}
          total={total}
          name={name}
          isReview={isReview}
        />

        <div className="flex flex-1 flex-col justify-center py-8">
          {isReview ? (
            <Review
              steps={steps}
              answers={answers}
              onEdit={(i) => {
                setEditando(true);
                goTo(i);
              }}
            />
          ) : (
            <Question
              step={step}
              value={answers[step.id]}
              extraValue={step.extraId ? answers[step.extraId] : undefined}
              email={email}
              name={name}
              onAnswer={(v) => {
                setAnswer(step.id, v);
                // Un toque y avanza: menos hunting del botón "siguiente".
                // Salvo si la opción elegida pide llenar algo ("Otro" → ¿cuál?):
                // ahí hay que quedarse en la pregunta, si no el campo nunca
                // aparece y la respuesta se pierde.
                const pideLlenar = step.extraFor != null && v === step.extraFor;
                if ((step.kind === "single" || step.kind === "nps") && !pideLlenar) {
                  // Corrigiendo: se vuelve a la revisión. Flujo normal: siguiente.
                  if (editando) volverARevision();
                  else goTo(index + 1);
                }
              }}
              onExtra={(v) => step.extraId && setAnswer(step.extraId, v)}
              onContact={(field, v) => setAnswer(field, v)}
            />
          )}
        </div>

        {/* Navegación */}
        <Nav
          index={index}
          total={total}
          isReview={isReview}
          showNext={
            step
              ? step.kind === "contact" ||
                step.kind === "multi" ||
                step.kind === "text" ||
                step.optional === true ||
                // Si ya tiene respuesta, se puede pasar sin tocar nada: es el
                // caso de volver a una pregunta desde la revisión.
                answered(step) ||
                // single/nps con "Otro" elegido: hay que darle un botón para
                // seguir después de escribir.
                (step.extraFor != null && answers[step.id] === step.extraFor)
              : false
          }
          editando={editando}
          canContinue={canContinue && contactOk}
          canSubmit={canSubmit}
          busy={status === "sending"}
          errorText={errorText}
          onBack={() => {
            setEditando(false);
            goTo(index - 1);
          }}
          onNext={() => (editando ? volverARevision() : goTo(index + 1))}
          onSubmit={submitAll}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Piezas
// ---------------------------------------------------------------------------

const CONTACT_STEP: Step = {
  id: "contact",
  kind: "contact",
  title: "¿Quién eres?",
  hint: "Así sabemos de quién es la respuesta.",

  short: "Contacto",
};

function Loading() {
  return (
    <div className="flex min-h-[calc(100dvh-64px)] items-center justify-center bg-[#0E1214]">
      <p className="font-mono text-[12px] tracking-[0.14em] uppercase text-[#6C7573]">
        cargando…
      </p>
    </div>
  );
}

function Progress({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="sticky top-0 z-10 h-[2px] w-full bg-[#1C2427]">
      <div
        className="h-full bg-[#B4552B] transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function Header({
  index,
  total,
  name,
  isReview,
}: {
  index: number;
  total: number;
  name: string;
  isReview: boolean;
}) {
  const label = isReview
    ? "último paso"
    : index === 0 && name
      ? `hola ${name.split(/\s+/)[0].toLowerCase()}`
      : "encuesta de cierre";
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#B4552B]">
        {label}
      </span>
      <span className="font-mono text-[10px] tracking-[0.12em] text-[#565F62]">
        {Math.min(index + 1, total)} / {total}
      </span>
    </div>
  );
}

function Question({
  step,
  value,
  extraValue,
  email: knownEmail,
  name: knownName,
  onAnswer,
  onExtra,
  onContact,
}: {
  step: Step;
  value: string | string[] | undefined;
  extraValue?: string | string[];
  email: string;
  name: string;
  onAnswer: (v: string | string[]) => void;
  onExtra: (v: string) => void;
  onContact: (field: string, v: string) => void;
}) {
  return (
    <div>
      <h1 className="m-0 text-[27px] font-extralight leading-[1.22] tracking-[-0.02em] text-[#F1F3F2] text-balance max-[560px]:text-[23px]">
        {step.title}
        {step.optional && (
          <span className="ml-2 align-middle font-mono text-[10px] tracking-[0.1em] uppercase text-[#565F62]">
            opcional
          </span>
        )}
      </h1>
      {step.hint && (
        <p className="mt-3 max-w-[46ch] font-mono text-[11px] leading-[1.7] text-[#6C7573]">
          {step.hint}
        </p>
      )}

      <div className="mt-7">
        {step.kind === "contact" && (
          <ContactFields
            email={knownEmail}
            name={knownName}
            emailValue={String(value ?? "")}
            nameValue={extraValue ? String(extraValue) : String(value ?? "")}
            onContact={onContact}
          />
        )}

        {step.kind === "nps" && <NpsScale value={typeof value === "string" ? value : ""} onPick={onAnswer} />}

        {step.kind === "single" && (
          <ChoiceList
            choices={step.choices ?? []}
            value={typeof value === "string" ? value : ""}
            onPick={onAnswer}
          />
        )}

        {step.kind === "multi" && (
          <ChoiceList
            multi
            choices={step.choices ?? []}
            value={Array.isArray(value) ? value : []}
            onPick={onAnswer}
          />
        )}

        {step.kind === "text" && (
          <textarea
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder={step.placeholder}
            rows={4}
            className="w-full resize-y border border-[#262E31] bg-[#0E1214] px-4 py-3 font-sans text-[15px] leading-[1.6] text-[#F1F3F2] outline-none transition-colors placeholder:text-[#4A5356] focus:border-[#B4552B]"
          />
        )}
      </div>

      {/* Campo extra (ej. "¿cuál?" cuando el origen es "otro"). */}
      {step.extraFor &&
        (value === step.extraFor ||
          (Array.isArray(value) && value.includes(step.extraFor))) && (
        <div className="mt-4">
          <input
            value={typeof extraValue === "string" ? extraValue : ""}
            onChange={(e) => onExtra(e.target.value)}
            placeholder={step.extraLabel ?? ""}
            aria-label={step.extraLabel ?? "Detalle"}
            className="w-full border border-[#262E31] bg-[#111719] px-4 py-3 font-sans text-[14px] text-[#F1F3F2] outline-none transition-colors placeholder:text-[#4A5356] focus:border-[#B4552B]"
          />
        </div>
      )}
    </div>
  );
}

function ContactFields({
  email: knownEmail,
  name: knownName,
  emailValue,
  nameValue,
  onContact,
}: {
  email: string;
  name: string;
  emailValue: string;
  nameValue: string;
  onContact: (field: string, v: string) => void;
}) {
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue.trim());
  const nameOk = nameValue.trim().length > 0;
  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#6C7573]">
          nombre
        </span>
        <input
          value={nameValue}
          onChange={(e) => onContact("name", e.target.value)}
          placeholder={knownName || "Tu nombre"}
          autoComplete="name"
          className="w-full border border-[#262E31] bg-[#0E1214] px-4 py-4 font-sans text-[15px] text-[#F1F3F2] outline-none transition-colors placeholder:text-[#4A5356] focus:border-[#B4552B]"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#6C7573]">
          correo
        </span>
        <input
          value={emailValue}
          onChange={(e) => onContact("email", e.target.value)}
          placeholder={knownEmail || "tu@correo.com"}
          inputMode="email"
          autoComplete="email"
          className="w-full border border-[#262E31] bg-[#0E1214] px-4 py-4 font-sans text-[15px] text-[#F1F3F2] outline-none transition-colors placeholder:text-[#4A5356] focus:border-[#B4552B]"
        />
      </label>
      {!nameOk && (
        <p className="font-mono text-[11px] text-[#E2A084]">{"// falta el nombre"}</p>
      )}
      {nameOk && !emailOk && (
        <p className="font-mono text-[11px] text-[#E2A084]">
          {"// revisa el correo: le faltaría la @ o el dominio"}
        </p>
      )}
      {nameOk && emailOk && (
        <p className="font-mono text-[11px] text-[#7FC7A3]">{"// listo"}</p>
      )}
    </div>
  );
}

/** 0–10 como once botones grandes: se marca sin apuntar. */
function NpsScale({ value, onPick }: { value: string; onPick: (v: string) => void }) {
  return (
    <div>
      <div className="grid grid-cols-6 gap-1.5 max-[560px]:gap-1 sm:grid-cols-11">
        {Array.from({ length: 11 }, (_, i) => i).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPick(String(n))}
            aria-pressed={value === String(n)}
            className={`h-[54px] border font-mono text-[15px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B4552B] max-[560px]:h-[48px] ${
              value === String(n)
                ? "border-[#B4552B] bg-[#B4552B] text-[#0E1214]"
                : "border-[#262E31] bg-[#111719] text-[#9AA3A1] hover:border-[#6C7573] hover:text-[#F1F3F2]"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-[#565F62]">
        <span>nada probable</span>
        <span>muy probable</span>
      </div>
    </div>
  );
}

function ChoiceList({
  choices,
  value,
  onPick,
  multi = false,
}: {
  choices: { value: string; label: string }[];
  value: string | string[];
  onPick: (v: string | string[]) => void;
  multi?: boolean;
}) {
  const selected = Array.isArray(value) ? value : [];
  const pick = (v: string) => {
    if (!multi) {
      onPick(v);
      return;
    }
    // "Nada por ahora" es excluyente con las demás.
    if (v === "nada") {
      onPick(selected.includes("nada") ? [] : ["nada"]);
      return;
    }
    const base = selected.filter((s) => s !== "nada");
    onPick(base.includes(v) ? base.filter((s) => s !== v) : [...base, v]);
  };

  return (
    <div className="flex flex-col gap-2">
      {choices.map((c) => {
        const on = multi ? selected.includes(c.value) : value === c.value;
        return (
          <button
            key={c.value}
            type="button"
            onClick={() => pick(c.value)}
            aria-pressed={on}
            className={`flex min-h-[58px] items-center gap-3 border px-4 py-3 text-left font-sans text-[15px] leading-[1.45] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B4552B] max-[560px]:min-h-[52px] max-[560px]:text-[14px] ${
              on
                ? "border-[#B4552B] bg-[#B4552B]/10 text-[#F1F3F2]"
                : "border-[#262E31] bg-[#111719] text-[#DDE2E0] hover:border-[#6C7573]"
            }`}
          >
            <span
              aria-hidden
              className={`grid h-[18px] w-[18px] shrink-0 place-items-center border ${
                multi ? "rounded-[2px]" : "rounded-full"
              } ${on ? "border-[#B4552B] bg-[#B4552B]" : "border-[#3A4447]"}`}
            >
              {on && <span className="block h-[6px] w-[6px] bg-[#0E1214]" />}
            </span>
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

/** Antes de mandar: todo lo contestado, con acceso directo a corregirlo. */
function Review({
  steps,
  answers,
  onEdit,
}: {
  steps: Step[];
  answers: Answers;
  onEdit: (index: number) => void;
}) {
  return (
    <div>
      <h1 className="m-0 text-[27px] font-extralight leading-[1.22] tracking-[-0.02em] text-[#F1F3F2] max-[560px]:text-[23px]">
        Revisa y envía
      </h1>
      <p className="mt-3 max-w-[46ch] font-mono text-[11px] leading-[1.7] text-[#6C7573]">
        Un ojo antes de mandar. Toca cualquier respuesta para cambiarla.
      </p>

      <dl className="mt-7 flex flex-col border-t border-[#262E31]">
        {steps
          .filter((s) => s.kind !== "contact")
          .map((s) => {
            const raw = answers[s.id];
            const shown = Array.isArray(raw)
              ? raw.map(labelFor).join(" + ")
              : labelFor(typeof raw === "string" ? raw : undefined);
            const index = steps.indexOf(s);
            return (
              <div
                key={s.id}
                className="flex items-baseline justify-between gap-4 border-b border-[#262E31] py-3"
              >
                <dt className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#6C7573]">
                  {s.short}
                </dt>
                <dd className="flex-1 text-right font-sans text-[14px] leading-[1.5] text-[#DDE2E0]">
                  {shown || <span className="text-[#E2A084]">sin responder</span>}
                </dd>
                <button
                  type="button"
                  onClick={() => onEdit(index)}
                  className="shrink-0 font-mono text-[10px] tracking-[0.1em] uppercase text-[#B4552B] underline decoration-[#B4552B]/40 underline-offset-4 transition-colors hover:text-[#E2A084]"
                >
                  cambiar
                </button>
              </div>
            );
          })}
      </dl>
    </div>
  );
}

function Nav({
  index,
  total,
  isReview,
  showNext,
  editando,
  canContinue,
  canSubmit,
  busy,
  errorText,
  onBack,
  onNext,
  onSubmit,
}: {
  index: number;
  total: number;
  isReview: boolean;
  showNext: boolean;
  editando: boolean;
  canContinue: boolean;
  canSubmit: boolean;
  busy: boolean;
  errorText: string;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  const atFirst = index === 0;

  return (
    <div className="flex flex-col gap-3 border-t border-[#262E31] pt-5">
      {errorText && (
        <p className="font-mono text-[11px] leading-[1.6] text-[#E2A084]">
          {`// ${errorText} — inténtalo de nuevo`}
        </p>
      )}

      <div className="flex items-center gap-3">
        {!atFirst && (
          <button
            type="button"
            onClick={onBack}
            disabled={busy}
            className="shrink-0 border border-[#262E31] px-5 py-4 font-mono text-[11px] tracking-[0.12em] uppercase text-[#9AA3A1] transition-colors hover:border-[#6C7573] hover:text-[#F1F3F2] disabled:opacity-50"
          >
            ← atrás
          </button>
        )}

        {isReview ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={busy || !canSubmit}
            className="flex-1 bg-[#B4552B] px-6 py-4 font-mono text-[12px] font-medium tracking-[0.12em] uppercase text-[#0E1214] transition-colors hover:bg-[#9A4A24] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "enviando…" : "enviar →"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!showNext || !canContinue}
            className="flex-1 border border-[#262E31] bg-[#111719] px-6 py-4 font-mono text-[12px] tracking-[0.12em] uppercase text-[#9AA3A1] transition-colors hover:border-[#6C7573] hover:text-[#F1F3F2] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {editando ? "listo →" : "siguiente →"}
          </button>
        )}
      </div>

      <span className="sr-only">
        {index + 1} de {total}
      </span>
    </div>
  );
}

function Done({
  name,
  email: to,
  session,
  emailed,
  onEdit,
}: {
  name: string;
  email: string;
  session: SessionInfo;
  emailed: boolean;
  onEdit: () => void;
}) {
  return (
    <div className="min-h-[calc(100dvh-64px)] bg-[#0E1214] text-[#F1F3F2]">
      <div className="mx-auto flex min-h-[calc(100dvh-64px)] max-w-[620px] flex-col justify-center px-6 py-12 max-[560px]:px-5">
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#B4552B]">
          [listo]
        </span>
        <h1 className="mt-4 m-0 text-[34px] font-extralight leading-[1.12] tracking-[-0.03em] text-[#F1F3F2] max-[560px]:text-[28px]">
          Gracias{name ? `, ${name.split(/\s+/)[0]}` : ""}.
        </h1>
        <p className="mt-3 max-w-[48ch] font-sans text-[16px] leading-[1.65] text-[#9AA3A1]">
          Tu respuesta quedó guardada.
          {session?.date
            ? emailed
              ? ` Te escribimos a ${to} con la fecha y el link de la sesión.`
              : " No pudimos mandarte el correo, pero te dejamos los datos acá abajo."
            : ""}
        </p>

        {session?.date && <SessionCard session={session} />}

        {session?.calendarUrl && (
          <a
            href={session.calendarUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 self-start bg-[#B4552B] px-6 py-4 font-mono text-[12px] font-medium tracking-[0.12em] uppercase text-[#0E1214] transition-colors hover:bg-[#9A4A24]"
          >
            guardar en mi calendario →
          </a>
        )}

        <div className="mt-5 flex flex-col gap-3">
          <a
            href={SUPPORT_WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="self-start font-mono text-[11px] tracking-[0.08em] uppercase text-[#6C7573] underline decoration-current/30 underline-offset-4 transition-colors hover:text-[#F1F3F2]"
          >
            duda por WhatsApp {SUPPORT_WHATSAPP} ↗
          </a>
          <button
            type="button"
            onClick={onEdit}
            className="self-start font-mono text-[11px] tracking-[0.08em] uppercase text-[#6C7573] underline decoration-current/30 underline-offset-4 transition-colors hover:text-[#F1F3F2]"
          >
            corregir mis respuestas
          </button>
        </div>
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: NonNullable<SessionInfo> }) {
  return (
    <div className="mt-8 border-l-2 border-[#B4552B] bg-[#111719] p-5">
      <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#B4552B]">
        [tu sesión]
      </span>
      {session.title && (
        <p className="mt-3 font-sans text-[19px] font-light leading-[1.3] text-[#F1F3F2]">
          {session.title}
        </p>
      )}
      <dl className="mt-4 flex flex-col gap-2">
        {session.when && <Row label="cuándo" value={session.when} />}
        <Row label="dónde" value="Virtual — el enlace te llega por correo" />
      </dl>
      {session.agenda.length > 0 && (
        <>
          <p className="mt-5 font-mono text-[10px] tracking-[0.12em] uppercase text-[#6C7573]">
            qué vamos a ver
          </p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {session.agenda.map((a) => (
              <li key={a} className="font-sans text-[14px] leading-[1.6] text-[#9AA3A1]">
                <span className="text-[#B4552B]">—</span> {a}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="w-[70px] shrink-0 font-mono text-[10px] tracking-[0.12em] uppercase text-[#565F62]">
        {label}
      </dt>
      <dd className="font-sans text-[14px] leading-[1.6] text-[#DDE2E0]">{value}</dd>
    </div>
  );
}