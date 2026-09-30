// Definición de la encuesta de cierre del workshop. Compartida entre el
// formulario (`SurveyFlow`) y la exportación del admin, para que la pregunta
// que se muestra y la que se analiza no se separen nunca.
//
// Los `value` son códigos cortos: son los que se guardan en Convex, los que
// valida `convex/survey.ts` y los que se exportan al CSV.

export type Choice = { value: string; label: string; hint?: string };

export type StepKind = "contact" | "nps" | "single" | "multi" | "text" | "review";

export type Step = {
  id: string;
  kind: StepKind;
  title: string;
  hint?: string;
  optional?: boolean;
  choices?: Choice[];
  placeholder?: string;
  /** Campo de texto extra que aparece solo si se elige este `value`. */
  extraFor?: string;
  extraId?: string;
  extraLabel?: string;
  /** Texto que se corta de la pantalla (para que la pregunta sea corta). */
  short: string;
};

export const STEPS: Step[] = [
  {
    id: "nps",
    kind: "nps",
    title: "¿Qué tan probable es que recomiendes este workshop a un amigo o colega?",
    hint: "0 = nada probable · 10 = muy probable",
    short: "Calificación general",
  },
  {
    id: "npsWhy",
    kind: "text",
    title: "¿Qué fue lo que más pesó en tu calificación anterior?",
    hint: "Lo que te lleva a marcarla. Con dos líneas basta.",
    placeholder: "Lo que me sirvió fue… lo que faltó fue…",
    optional: true,
    short: "Por qué esa calificación",
  },
  {
    id: "assistant",
    kind: "single",
    title: "¿Saliste con tu asistente funcionando?",
    choices: [
      { value: "completo", label: "Sí, funcionando con mis propios documentos" },
      { value: "ejemplo", label: "Sí, pero solo con los datos de ejemplo" },
      { value: "a_medias", label: "A medias: me faltó terminar algo" },
      { value: "no", label: "No" },
    ],
    short: "¿Asistente funcionando?",
  },
  {
    id: "pace",
    kind: "single",
    title: "¿El ritmo del workshop fue…",
    choices: [
      { value: "lento", label: "Muy lento" },
      { value: "adecuado", label: "Adecuado" },
      { value: "rapido", label: "Muy rápido, me quedé atrás en algún momento" },
    ],
    short: "Ritmo",
  },
  {
    id: "price",
    kind: "single",
    title: "Por lo que recibiste, el precio te pareció…",
    choices: [
      { value: "barato", label: "Barato" },
      { value: "justo", label: "Justo" },
      { value: "caro", label: "Caro" },
    ],
    short: "Precio",
  },
  {
    id: "channel",
    kind: "single",
    title: "¿Cómo te enteraste del workshop?",
    choices: [
      { value: "linkedin", label: "LinkedIn" },
      { value: "instagram", label: "Instagram" },
      { value: "whatsapp", label: "WhatsApp (mensaje o grupo)" },
      { value: "recomendacion", label: "Me lo recomendó alguien" },
      { value: "otro", label: "Otro" },
    ],
    extraFor: "otro",
    extraId: "channelOther",
    extraLabel: "¿Cuál? (una línea)",
    short: "Cómo nos encontraste",
  },
  {
    id: "knewHosts",
    kind: "single",
    title: "¿Antes de inscribirte, ¿conocías a Eduardo o a Francisco?",
    choices: [
      { value: "personal", label: "Sí, personalmente" },
      { value: "redes", label: "Solo de redes" },
      { value: "no", label: "No" },
    ],
    short: "¿Nos conocías?"
  },
  {
    id: "b2b",
    kind: "single",
    title: "¿Recomendarías este workshop a tu empresa o equipo?",
    choices: [
      { value: "si", label: "Sí" },
      { value: "tal_vez", label: "Tal vez" },
      { value: "no", label: "No" },
      { value: "no_aplica", label: "No aplica (trabajo independiente)" },
    ],
    short: "¿A tu empresa?",
  },
  {
    id: "interests",
    kind: "multi",
    title: "¿Qué te interesaría tomar después?",
    hint: "Puedes marcar varias.",
    choices: [
      { value: "avanzado", label: "Un curso avanzado para sacarle más a mi asistente" },
      { value: "adaptado", label: "Un workshop adaptado a mi profesión" },
      { value: "empresa", label: "Ayuda para montar un asistente en mi empresa o equipo" },
      { value: "nada", label: "Nada por ahora" },
      { value: "otro", label: "Otro" },
    ],
    extraFor: "otro",
    extraId: "interestsOther",
    extraLabel: "¿Cuál? (una línea)",
    short: "Qué sigue",
  },
  {
    id: "changeOne",
    kind: "text",
    title: "Si pudieras cambiar una sola cosa del workshop, ¿cuál sería?",
    placeholder: "Cambiaría…",
    optional: true,
    short: "Qué cambiarías",
  },
  {
    id: "consent",
    kind: "single",
    title: "¿Podemos usar tus respuestas en nuestras redes o en la web?",
    choices: [
      { value: "con_nombre", label: "Sí, con mi nombre" },
      { value: "sin_nombre", label: "Sí, pero sin mi nombre" },
      { value: "no", label: "No" },
    ],
    short: "Uso de tus respuestas",
  },
];

/** Preguntas que hay que responder sí o sí para poder enviar. */
export const REQUIRED_IDS = STEPS.filter((s) => !s.optional).map((s) => s.id);

/** Código → etiqueta legible, para el resumen y el CSV. */
export const LABELS: Record<string, string> = Object.fromEntries(
  STEPS.flatMap((s) => (s.choices ?? []).map((c) => [c.value, c.label])),
);

export function labelFor(value: string | undefined): string {
  if (!value) return "";
  return LABELS[value] ?? value;
}

export type Answers = Record<string, string | string[] | undefined>;

/**
 * NPS = % de 9–10 menos % de 0–6. Con menos de 10 respuestas es orientativo,
 * así que se devuelve el conteo para que el admin lo tenga a la vista.
 */
export function computeNps(values: number[]) {
  const n = values.length;
  if (n === 0) return { nps: null as number | null, promoters: 0, passives: 0, detractors: 0 };
  const promoters = values.filter((v) => v >= 9).length;
  const passives = values.filter((v) => v >= 7 && v <= 8).length;
  const detractors = values.filter((v) => v <= 6).length;
  return {
    nps: Math.round(((promoters - detractors) / n) * 100),
    promoters,
    passives,
    detractors,
  };
}

/** Umbrales de `analisis.md` §6, para que el admin sepa si salió verde. */
export function npsVerdict(nps: number | null) {
  if (nps == null) return { label: "sin dato", tone: "dim" as const };
  if (nps >= 50) return { label: "🟢 seguir y escalar", tone: "good" as const };
  if (nps >= 20) return { label: "🟡 ajustar", tone: "warn" as const };
  return { label: "🔴 replantear", tone: "bad" as const };
}

function csvCell(value: unknown) {
  const s = value == null ? "" : Array.isArray(value) ? value.join(" + ") : String(value);
  // Punto y coma = separador de las hojas en Colombia; se entrecomilla igual.
  return `"${s.replace(/"/g, '""')}"`;
}

export type ResponseRow = {
  _id: string;
  token: string;
  email: string;
  name: string;
  nps: number;
  npsWhy?: string;
  channelOther?: string;
  interestsOther?: string;
  assistant: string;
  pace: string;
  price: string;
  channel: string;
  knewHosts: string;
  b2b: string;
  interests: string[];
  changeOne?: string;
  consent: string;
  updatedAt: number;
};

/** CSV de una hoja, con las etiquetas en español (no los códigos). */
export function responsesToCsv(rows: ResponseRow[]): string {
  const headers = [
    "Nombre",
    "Correo",
    "NPS (0-10)",
    "Por qué esa nota",
    "¿Asistente funcionando?",
    "Ritmo",
    "Precio",
    "Origen",
    "Origen (otro)",
    "Red cercana",
    "¿A tu empresa?",
    "Qué sigue",
    "Qué sigue (otro)",
    "Qué cambiarías",
    "Uso del comentario",
    "Respondió",
  ];
  const lines = rows.map((r) =>
    [
      r.name,
      r.email,
      r.nps,
      r.npsWhy ?? "",
      labelFor(r.assistant),
      labelFor(r.pace),
      labelFor(r.price),
      r.channel === "otro" && r.channelOther
        ? `Otro (${r.channelOther})`
        : labelFor(r.channel),
      labelFor(r.knewHosts),
      labelFor(r.b2b),
      (r.interests ?? [])
        .filter((i) => i !== "otro")
        .map(labelFor)
        .join(" + "),
      r.interestsOther ?? "",
      r.changeOne ?? "",
      labelFor(r.consent),
      new Date(r.updatedAt).toLocaleString("es-CO"),
    ]
      .map(csvCell)
      .join(";"),
  );
  return [headers.map(csvCell).join(";"), ...lines].join("\n");
}

/** Mensaje de un error desconocido, sin `any` explícito. */
export function errText(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string" && e) return e;
  return "error inesperado";
}

/**
 * Parte la lista pegada en el textarea en entradas.
 *
 * La coma es separador *y* puede venir pegada al nombre ("Ana, <correo>"), así
 * que solo se parte por coma en las líneas que no traen la forma con `<`.
 */
function splitEntries(raw: string): string[] {
  const out: string[] = [];
  for (const line of raw.split(/[\n;]+/)) {
    if (line.includes("<")) out.push(line);
    else out.push(...line.split(","));
  }
  return out.map((s) => s.trim()).filter(Boolean);
}

// Fechas y links del correo: **fuente única** en `convex/templates.ts` (que es
// puro y lo usan tanto el servidor como el preview del admin). Se reexportan
// acá para no obligar a los componentes a importar de `convex/`.
export {
  formatDay as formatDate,
  formatTime,
  formatWhen,
  googleCalendarUrl,
} from "../../convex/templates";

/** Convierte `Nombre <correo>` o `correo` en la entrada que espera Convex. */
export function parseInviteList(raw: string): { email: string; name?: string }[] {
  const out: { email: string; name?: string }[] = [];
  const seen = new Set<string>();
  for (const entry of splitEntries(raw)) {
    const angled = entry.match(/^(.*?)<([^>]+)>$/);
    const email = (angled ? angled[2] : entry).trim().toLowerCase();
    const name = angled ? angled[1].trim().replace(/[,;]$/, "").trim() : undefined;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) continue;
    if (seen.has(email)) continue;
    seen.add(email);
    out.push(name ? { email, name } : { email });
  }
  return out;
}