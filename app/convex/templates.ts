// Plantillas de los correos de la encuesta.
//
// Módulo **puro**: sin imports de Convex, sin `process.env`, sin `fetch`. Eso
// permite que el preview de /admin (que corre en el navegador) renderice
// exactamente el mismo HTML que sale por Resend. Si el preview viviera en otro
// lado, se desincroniza al primer cambio de texto.

const BRAND_COLOR = "#B4552B";

/** La fila de `followup_sessions`, tal como se guarda. */
export type SessionLike = {
  title?: string;
  /** ISO `YYYY-MM-DD`. */
  date?: string;
  /** `HH:MM` en 24h. */
  startTime?: string;
  joinUrl?: string;
  agenda?: string[];
};

export type Rendered = { subject: string; html: string; text: string };

const WHATSAPP = "+57 323 908 5619";
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const HH_MM = /^\d{1,2}:\d{2}$/;

/**
 * El agradecimiento del correo #1, sin atarlo a un momento del día: el taller
 * del 26-sep fue en la mañana y el copy decía "una tarde". Va genérico.
 */
const GRACIAS_TIEMPO =
  "Gracias por dedicarle tu tiempo a armar tu asistente financiero con nosotros. Fue la primera edición del taller y queremos que la próxima salga mejor.";

// ---------------------------------------------------------------------------
// Fechas legibles
// ---------------------------------------------------------------------------

/** "jueves, 8 de octubre de 2026" — para paneles y encabezados. */
export function formatDay(iso: string | undefined): string {
  if (!iso || !ISO_DATE.test(iso)) return "";
  try {
    return new Intl.DateTimeFormat("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

/** "jueves 8 de octubre" — para meter en medio de una frase (sin coma ni año). */
export function formatDayShort(iso: string | undefined): string {
  if (!iso || !ISO_DATE.test(iso)) return "";
  try {
    // Intl mete coma después del día ("viernes, 9 de octubre") y en medio de una
    // frase eso estorba: "el viernes, 9 de octubre" → "el viernes 9 de octubre".
    return new Intl.DateTimeFormat("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "UTC",
    })
      .format(new Date(iso))
      .replace(",", "");
  } catch {
    return "";
  }
}

/** "8 de octubre" — para el preheader. */
export function formatDayMedium(iso: string | undefined): string {
  if (!iso || !ISO_DATE.test(iso)) return "";
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "numeric",
      month: "long",
      timeZone: "UTC",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

/** "7:00 p. m." */
export function formatTime(hhmm: string | undefined): string {
  if (!hhmm || !HH_MM.test(hhmm)) return "";
  const [h, m] = hhmm.split(":").map(Number);
  if (h > 23 || m > 59) return "";
  try {
    return new Intl.DateTimeFormat("es-CO", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2000, 0, 1, h, m)));
  } catch {
    return "";
  }
}

/** "jueves, 8 de octubre de 2026 · 7:00 p. m." */
export function formatWhen(session: SessionLike | null | undefined): string {
  const day = formatDay(session?.date);
  const hour = formatTime(session?.startTime);
  return [day, hour].filter(Boolean).join(" · ");
}

/** "a, b y c" — para las frases con enumeración. */
export function esList(items: string[] | undefined): string {
  const list = (items ?? []).filter(Boolean);
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  return `${list.slice(0, -1).join(", ")} y ${list[list.length - 1]}`;
}

export function firstName(name: string | undefined): string {
  return (name ?? "").trim().split(/\s+/)[0] ?? "";
}

// ---------------------------------------------------------------------------
// Piezas de HTML
// ---------------------------------------------------------------------------

/**
 * Texto previo del correo: lo que se ve chiquito junto al asunto en la bandeja.
 * Se hace con un div oculto, que es como lo resuelve todo el mundo (Resend no
 * tiene campo propio para preheader).
 */
function pre(text: string | undefined): string {
  if (!text) return "";
  return (
    `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">` +
    `${text}</div>`
  );
}

export function shellHtml(contentRows: string, { preheader }: { preheader?: string } = {}) {
  return `
<body style="margin:0;background:#0E1214;padding:32px 16px;">
  ${pre(preheader)}
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#1C2427;border:1px solid #262E31;">
    <tr><td style="padding:28px 32px 0 32px;">
      <table border="0" cellspacing="0" cellpadding="0"><tr>
        <td style="width:28px;height:28px;background:${BRAND_COLOR};text-align:center;font-family:'IBM Plex Mono',monospace;font-size:16px;font-weight:600;color:#0E1214;line-height:28px;">g</td>
        <td style="padding-left:10px;font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:500;color:#F1F3F2;letter-spacing:0.04em;">grounded<span style="color:#6C7573;">_</span>labs</td>
      </tr></table>
    </td></tr>
    ${contentRows}
    <tr><td style="padding:16px 32px 28px 32px;border-top:1px solid #262E31;margin-top:24px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#565F62;">Grounded Labs · Medellín · grounded-labs.com</td></tr>
  </table>
  <p style="max-width:560px;margin:16px auto 0 auto;font-family:'IBM Plex Mono',monospace;font-size:10px;color:#565F62;text-align:center;">No respondas a este correo (noreply@grounded-labs.com)</p>
</body>
`;
}

export function heading(text: string) {
  return `<tr><td style="padding:28px 32px 0 32px;font-family:'IBM Plex Sans',Helvetica,Arial,sans-serif;font-size:22px;font-weight:300;line-height:1.3;color:#F1F3F2;letter-spacing:-0.02em;">${text}</td></tr>`;
}

export function body(text: string) {
  return `<tr><td style="padding:12px 32px 0 32px;font-family:'IBM Plex Sans',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#9AA3A1;">${text}</td></tr>`;
}

/**
 * Botón. `full` lo hace de ancho completo y texto centrado.
 *
 * En el correo los botones van uno por fila, y sin `full` cada uno mide lo que
 * dice su texto: los bordes derechos quedan desalineados y se ve descuidado.
 * Ancho completo es lo que se ve parejo en todos los clientes (en email no se
 * puede usar flexbox como en la web).
 */
export function cta(url: string, label: string, { full = false }: { full?: boolean } = {}) {
  return `<tr><td style="padding:28px 32px 0 32px;">
    <a href="${url}" target="_blank" style="display:${full ? "block" : "inline-block"};${
      full ? "text-align:center;" : ""
    }background:${BRAND_COLOR};color:#0E1214;text-decoration:none;font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;padding:14px 28px;">${label}</a>
  </td></tr>`;
}

export function ctaGhost(url: string, label: string, { full = false }: { full?: boolean } = {}) {
  return `<tr><td style="padding:12px 32px 0 32px;">
    <a href="${url}" target="_blank" style="display:${full ? "block" : "inline-block"};${
      full ? "text-align:center;" : ""
    }border:1px solid #2F3A3D;color:#9AA3A1;text-decoration:none;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;padding:13px 26px;">${label}</a>
  </td></tr>`;
}

export function footnote(text: string) {
  return `<tr><td style="padding:24px 32px 0 32px;font-family:'IBM Plex Mono',monospace;font-size:11px;line-height:1.6;color:#6C7573;">${text}</td></tr>`;
}

export function kicker(text: string) {
  return `<tr><td style="padding:24px 32px 0 32px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND_COLOR};">${text}</td></tr>`;
}

export function bullets(items: string[]) {
  return `<tr><td style="padding:12px 32px 0 32px;font-family:'IBM Plex Sans',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.7;color:#9AA3A1;">${items
    .map((i) => `<span style="color:${BRAND_COLOR};">—</span> <span style="color:#DDE2E0;">${i}</span>`)
    .join("<br/>")}</td></tr>`;
}

export function panel(rows: { label: string; value: string }[]) {
  const inner = rows
    .filter(Boolean)
    .map(
      (r) => `<tr>
        <td style="padding:0 0 10px 0;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#565F62;vertical-align:top;width:96px;">${r.label}</td>
        <td style="padding:0 0 10px 0;font-family:'IBM Plex Sans',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:#DDE2E0;">${r.value}</td>
      </tr>`,
    )
    .join("");
  return `<tr><td style="padding:20px 24px;margin:8px 32px 0 32px;background:#0E1214;border-left:2px solid ${BRAND_COLOR};">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;">${inner}</table>
  </td></tr>`;
}

// ---------------------------------------------------------------------------
// Link de "agendar" (Google Calendar)
// ---------------------------------------------------------------------------

/**
 * Se calcula desde fecha+hora en vez de guardarse, para que no se pueda quedar
 * viejo si el admin mueve la fecha. La duración es de 2 horas por defecto.
 */
export function googleCalendarUrl(session: SessionLike): string {
  if (!session?.date || !ISO_DATE.test(session.date)) return "";
  const start =
    session.startTime && /^\d{2}:\d{2}$/.test(session.startTime) ? session.startTime : "09:00";
  const [h, m] = start.split(":").map(Number);
  const end = new Date(Date.UTC(2000, 0, 1, 0, 0, 0, (h * 60 + m + 120) * 60 * 1000));

  const compact = `${session.date.replace(/-/g, "")}T${start.replace(":", "")}00`;
  const compactEnd =
    `${session.date.replace(/-/g, "")}T` +
    `${String(end.getUTCHours()).padStart(2, "0")}${String(end.getUTCMinutes()).padStart(2, "0")}00`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: session.title || "Sesión de follow-up",
    dates: `${compact}/${compactEnd}`,
    ctz: "America/Bogota",
  });
  if (session.agenda?.length) {
    params.set("details", session.agenda.map((a) => `· ${a}`).join("\n"));
  }
  if (session.joinUrl) params.set("location", session.joinUrl);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ---------------------------------------------------------------------------
// Correo #1 — el que pide el favor
// ---------------------------------------------------------------------------

/**
 * La frase de "qué vamos a hacer en la sesión" se arma con la agenda que se
 * escribe en /admin: ahí se pone "resolver dudas", "revisar cómo te va con tu
 * asistente", y el correo arma la frase. Una sola fuente para las dos cosas.
 *
 * Ojo: esta frase ya trae su propio "Como agradecimiento", así que en el correo
 * NO se le pone una etiqueta encima (quedaba dicho dos veces).
 */
function followupLine(session: SessionLike | null | undefined): string {
  const para = esList(session?.agenda);
  const cuando = formatDayShort(session?.date);
  if (!para && !cuando) return "";
  const fecha = cuando ? ` el ${cuando}` : " pronto";
  return `Como agradecimiento${fecha} vamos a hacer una sesión virtual de follow-up${
    para ? ` para ${para}` : ""
  }. Cuando termines la encuesta te llega el link de entrada con la hora.`;
}

export function inviteSubject(session: SessionLike | null | undefined): string {
  const cuando = formatDayMedium(session?.date);
  return cuando
    ? `¿Qué tal te pareció el taller? (3 min) + tu link a la sesión del ${cuando}`
    : "¿Qué tal te pareció el taller? (3 min)";
}

export function invitePreheader(session: SessionLike | null | undefined): string {
  const cuando = formatDayMedium(session?.date);
  return cuando
    ? `Cuéntanos qué mejorar y te mandamos el acceso a la sesión del ${cuando}.`
    : "Cuéntanos qué mejorar y te mandamos el acceso a la sesión.";
}

/** `session` es la fila cruda de la sesión; `url`, el link con token de esa persona. */
export function inviteTemplate({
  to,
  name,
  url,
  session,
}: {
  to: string;
  name?: string;
  url: string;
  session?: SessionLike | null;
}): Rendered {
  const hola = name ? `Hola ${name},` : "Hola,";
  const seguimiento = followupLine(session);

  const html = shellHtml(
    // Sin encabezado propio: el cuerpo ya arranca agradeciendo, y un "Gracias
    // por haber estado con nosotros" arriba era decir lo mismo dos veces.
    kicker("[gracias]") +
      body(`${hola}<br/><br/>${GRACIAS_TIEMPO} Para eso necesitamos tu opinión.`) +
      body(
        'Son 3 minutos. Y te pedimos que seas honesto: <span style="color:#DDE2E0;">lo que no te gustó nos sirve más que un elogio</span>.',
      ) +
      cta(url, "contarnos qué te pareció →") +
      (seguimiento ? body(seguimiento) : "") +
      body(
        `¿No tienes esos 3 minutos? Tranquilo, escríbenos por WhatsApp al <span style="color:#DDE2E0;">${WHATSAPP}</span> y te mandamos el link de todas formas.`,
      ) +
      footnote(`Si el botón no funciona, abre este enlace: ${url}`),
    { preheader: invitePreheader(session) },
  );

  const text = [
    hola,
    "",
    `${GRACIAS_TIEMPO} Para eso necesitamos tu opinión.`,
    "",
    "Son 3 minutos. Y te pedimos que seas honesto: lo que no te gustó nos sirve más que un elogio.",
    "",
    `Contarnos qué te pareció: ${url}`,
    "",
    seguimiento,
    "",
    `¿No tienes esos 3 minutos? Tranquilo, escríbenos por WhatsApp al ${WHATSAPP} y te mandamos el link de todas formas.`,
    "",
    `Si el botón no funciona, abre este enlace: ${url}`,
  ]
    .filter((line) => line !== null && line !== "")
    .join("\n");

  return { subject: inviteSubject(session), html, text };
}

// ---------------------------------------------------------------------------
// Correo #2 — el de los datos de la sesión
// ---------------------------------------------------------------------------

export function confirmationSubject(): string {
  return "Ya tienes tu lugar para la sesión";
}

export function confirmationPreheader(session: SessionLike | null | undefined): string {
  const cuando = formatDay(session?.date);
  return cuando ? `Tu sesión es el ${cuando}. Acá están todos los datos.` : "Acá están los datos.";
}

export function confirmationTemplate({
  name,
  session,
}: {
  name?: string;
  session: SessionLike;
}): Rendered {
  const first = firstName(name);

  const cuando = formatWhen(session);
  const calendarUrl = googleCalendarUrl(session);

  const filas = [
    cuando ? { label: "Cuándo", value: cuando } : null,
    {
      label: "Dónde",
      value: session?.joinUrl
        ? `<a href="${session.joinUrl}" target="_blank" style="color:#E2A084;text-decoration:none;border-bottom:1px solid rgba(180,85,43,0.4);">Enlace para entrar</a>`
        : "Virtual — te lo reenviamos el mismo día",
    },
  ].filter(Boolean) as { label: string; value: string }[];

  // Casual y directo: agradece, dice para qué sirvió y va derecho a la info.
  // La mayúscula va solo cuando no hay nombre: "Ana, gracias…" vs "Gracias…".
  const apertura = first
    ? `${first}, gracias por tu respuesta: nos sirve mucho para mejorar. Te dejamos la información de la sesión:`
    : "Gracias por tu respuesta: nos sirve mucho para mejorar. Te dejamos la información de la sesión:";

  const html = shellHtml(
    kicker("[confirmación]") +
      body(apertura) +
      panel(filas) +
      // La agenda va directa, sin el rótulo "Qué vamos a ver".
      (session?.agenda?.length ? bullets(session.agenda) : "") +
      (session?.joinUrl ? cta(session.joinUrl, "entrar a la sesión →", { full: true }) : "") +
      (calendarUrl ? ctaGhost(calendarUrl, "agendar", { full: true }) : "") +
      body(
        `Si se te complica conectarte ese día, no te preocupes: escríbenos al <span style="color:#DDE2E0;">${WHATSAPP}</span> y lo resolvemos por WhatsApp.`,
      ),
    { preheader: confirmationPreheader(session) },
  );

  const text = [
    first ? `${first},` : null,
    "",
    "Gracias por tu respuesta: nos sirve mucho para mejorar. Te dejamos la información de la sesión:",
    "",
    cuando || null,
    session?.joinUrl ? `Enlace: ${session.joinUrl}` : null,
    session?.agenda?.length ? "" : null,
    ...(session?.agenda ?? []).map((a) => `· ${a}`),
    "",
    `Si se te complica conectarte, escríbenos al ${WHATSAPP} y lo resolvemos por WhatsApp.`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject: confirmationSubject(), html, text };
}
