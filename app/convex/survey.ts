import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { anyApi } from "convex/server";
import type { Doc } from "./_generated/dataModel";
import { sendEmail, siteUrl } from "./mailer";
import {
  confirmationTemplate,
  formatDay,
  formatWhen,
  googleCalendarUrl,
  inviteTemplate,
} from "./templates";

// Encuesta de cierre del workshop. Fuente de la questionnaire:
// `workshops/AI-Financial-Advisor/encuesta-cierre/encuesta-cierre.md`.
//
// El flujo completo es:
//   1. /admin → pestaña "encuesta" → pega los correos y genera links únicos.
//   2. `sendInvites` manda el correo #1: "si quieres la sesión, llénanos esto".
//   3. La persona abre /encuesta?t=<token> (nombre y correo ya prellenados) y
//      contesta una pregunta por pantalla.
//   4. `submit` guarda la respuesta y manda el correo #2 con toda la info de
//      la sesión virtual de seguimiento.
//
// Los códigos de las opciones (`completo`, `justo`, `si`…) están en
// `src/lib/survey.ts`; acá solo se valida que sean de la lista permitida, para
// que la hoja de análisis pueda agrupar sin depender del texto.
//
// NOTA: las referencias entre funciones de este archivo usan `anyApi`, NO
// `api.survey.*`.
//
// `internalMutation(...)` devuelve un callable plano, no una FunctionReference,
// así que no sirve para `ctx.runMutation`: por eso lo que se pasa es
// `anyApi.survey.<nombre>`, que sí es una referencia por path y puede invocar
// funciones internas desde una action (que no tiene `ctx.db`).
//
// Y del `api` generado no se importa nada: `api.d.ts` importa este archivo, e
// importarlo de vuelta crea un ciclo de tipos que hace colapsar TODO el tipo
// `api` a `any` en el resto del repo. `anyApi` viene de `convex/server`, sin
// tipos, así que no hay ciclo.

const NPS_MIN = 0;
const NPS_MAX = 10;

const CODES = {
  assistant: ["completo", "ejemplo", "a_medias", "no"],
  pace: ["lento", "adecuado", "rapido"],
  price: ["barato", "justo", "caro"],
  channel: ["linkedin", "instagram", "whatsapp", "recomendacion", "otro"],
  knewHosts: ["personal", "redes", "no"],
  b2b: ["si", "tal_vez", "no", "no_aplica"],
  interests: ["avanzado", "adaptado", "empresa", "nada", "otro"],
  consent: ["con_nombre", "sin_nombre", "no"],
};

function randomToken() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function oneOf(codes: readonly string[], value: string, field: string) {
  if (!codes.includes(value)) throw new Error(`Respuesta inválida en "${field}"`);
  return value;
}

function clean(value: string | undefined, max: number) {
  if (value == null) return undefined;
  const t = value.trim().replace(/\s+/g, " ");
  if (!t) return undefined;
  return t.slice(0, max);
}

/**
 * La sesión de seguimiento del curso: una sola fila (una por workshop).
 * Cambiar la fecha es editar esta misma fila.
 */
async function findSession(ctx: QueryCtx | MutationCtx, courseSlug: string) {
  return await ctx.db
    .query("followup_sessions")
    .withIndex("by_course", (q) => q.eq("courseSlug", courseSlug))
    .unique();
}

/**
 * ¿La sesión ya está seteada? Solo tener `date` cuenta: sin fecha no hay correo
 * que mandar, así que tampoco se puede invitar.
 */
function hasDate(session: { date?: string } | null | undefined) {
  return !!session?.date && /^\d{4}-\d{2}-\d{2}$/.test(session.date);
}

/** Ya pasó la fecha → se deja de invitar y de recordar. */
function isPast(session: { date?: string } | null | undefined) {
  const date = session?.date;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const today = new Date().toISOString().slice(0, 10);
  return date < today;
}

/** Normaliza la fila de `followup_sessions` para la vista y para el correo. */
function shapeSession(s: Doc<"followup_sessions"> | null) {
  if (!s) return null;
  return {
    title: s.title,
    date: s.date ?? "",
    startTime: s.startTime ?? "",
    joinUrl: s.joinUrl ?? "",
    agenda: s.agenda ?? [],
    // Derivados (nunca se guardan): lo que se lee, si hay fecha y si ya pasó.
    when: formatWhen(s),
    day: formatDay(s?.date),
    calendarUrl: googleCalendarUrl(s),
    dated: hasDate(s),
    past: isPast(s),
  };
}

async function requireActiveAdmin(ctx: QueryCtx | MutationCtx) {
  const callerId = await getAuthUserId(ctx);
  if (!callerId) throw new Error("No autenticado");
  const callerRole = await ctx.db
    .query("user_roles")
    .withIndex("by_userId", (q) => q.eq("userId", callerId))
    .unique();
  if (!callerRole || callerRole.role !== "admin" || callerRole.status !== "active") {
    throw new Error("No autorizado");
  }
  return callerId;
}

// ---------------------------------------------------------------------------
// Público (la encuesta)
// ---------------------------------------------------------------------------

/**
 * Datos que necesita el formulario: nombre/correo prellenados desde el token,
 * si ya respondió antes, y la info de la sesión de seguimiento.
 */
export const getByToken = query({
  args: { token: v.optional(v.string()), courseSlug: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const courseSlug = args.courseSlug ?? "finanzas-personales-ia";
    const token = (args.token ?? "").trim();

    const invite = token
      ? await ctx.db
          .query("survey_invites")
          .withIndex("by_token", (q) => q.eq("token", token))
          .unique()
      : null;

    const session = shapeSession(await findSession(ctx, courseSlug));

    const previous = token
      ? await ctx.db
          .query("survey_responses")
          .withIndex("by_token", (q) => q.eq("token", token))
          .unique()
      : null;

    return {
      // `validToken === false` con token puesto significa link inválido: el
      // formulario cae al modo anónimo en vez de romperse.
      validToken: !!invite,
      email: invite?.email ?? "",
      name: invite?.name ?? "",
      submitted: !!previous,
      submittedAt: previous?.updatedAt ?? null,
      session,
    };
  },
});

const answerArgs = {
  token: v.optional(v.string()),
  courseSlug: v.optional(v.string()),
  email: v.string(),
  name: v.string(),
  nps: v.number(),
  npsWhy: v.optional(v.string()),
  channelOther: v.optional(v.string()),
  interestsOther: v.optional(v.string()),
  assistant: v.string(),
  pace: v.string(),
  price: v.string(),
  channel: v.string(),
  knewHosts: v.string(),
  b2b: v.string(),
  interests: v.array(v.string()),
  changeOne: v.optional(v.string()),
  consent: v.string(),
};

/** Guarda (o actualiza) la respuesta. Idempotente por token. */
export const saveResponseInternal = internalMutation({
  args: answerArgs,
  handler: async (ctx, args) => {
    const token = args.token ?? "";
    const existing = token
      ? await ctx.db
          .query("survey_responses")
          .withIndex("by_token", (q) => q.eq("token", token))
          .unique()
      : null;

    const doc = {
      token,
      courseSlug: args.courseSlug ?? "finanzas-personales-ia",
      email: args.email.trim().toLowerCase(),
      name: args.name,
      nps: args.nps,
      npsWhy: args.npsWhy,
      channelOther: args.channelOther,
      interestsOther: args.interestsOther,
      assistant: args.assistant,
      pace: args.pace,
      price: args.price,
      channel: args.channel,
      knewHosts: args.knewHosts,
      b2b: args.b2b,
      interests: args.interests,
      changeOne: args.changeOne,
      consent: args.consent,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, doc);
      return { alreadySubmitted: true };
    }
    await ctx.db.insert("survey_responses", { ...doc, createdAt: Date.now() });
    return { alreadySubmitted: false };
  },
});

export const getSessionInternal = internalQuery({
  args: { courseSlug: v.string() },
  handler: async (ctx, args) => shapeSession(await findSession(ctx, args.courseSlug)),
});

/**
 * Guarda la respuesta y manda el correo con la info de la sesión.
 *
 * Es una action (no una mutation) porque necesita `fetch` para el correo. La
 * validación es la misma que en `saveResponseInternal`: una encuesta
 * incompleta o con un código raro no entra a la base, así el análisis no se
 * ensucia.
 *
 * Si el correo falla NO se le cae al usuario encima: devuelve `emailed: false`
 * y la pantalla de gracias muestra los datos de la sesión igual.
 */
export const submit = action({
  args: answerArgs,
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Correo inválido");

    const name = clean(args.name, 120);
    if (!name) throw new Error("Falta el nombre");

    const nps = Math.round(args.nps);
    if (Number.isNaN(nps) || nps < NPS_MIN || nps > NPS_MAX) throw new Error("NPS inválido");

    const interests = [...new Set(args.interests)].filter((v) => CODES.interests.includes(v));
    if (interests.length === 0) throw new Error("Elige al menos una opción de 'qué sigue'");

    const courseSlug = args.courseSlug ?? "finanzas-personales-ia";
    const token = (args.token ?? "").trim() || `anon_${randomToken()}`;

    const previous = await ctx.runMutation(anyApi.survey.saveResponseInternal, {
      token,
      courseSlug,
      email,
      name,
      nps,
      npsWhy: clean(args.npsWhy, 2000),
      channelOther: clean(args.channelOther, 200),
      interestsOther: clean(args.interestsOther, 200),
      assistant: oneOf(CODES.assistant, args.assistant, "assistant"),
      pace: oneOf(CODES.pace, args.pace, "pace"),
      price: oneOf(CODES.price, args.price, "price"),
      channel: oneOf(CODES.channel, args.channel, "channel"),
      knewHosts: oneOf(CODES.knewHosts, args.knewHosts, "knewHosts"),
      b2b: oneOf(CODES.b2b, args.b2b, "b2b"),
      interests,
      changeOne: clean(args.changeOne, 2000),
      consent: oneOf(CODES.consent, args.consent, "consent"),
    });

    // Solo se manda el correo la primera vez: si corrige algo después no
    // queremos que le llegue el mismo mensaje dos veces.
    if (previous.alreadySubmitted) {
      return { ok: true, emailed: false, alreadySubmitted: true };
    }

    const session = await ctx.runQuery(anyApi.survey.getSessionInternal, { courseSlug });
    let emailed = false;
    try {
      // `sendConfirmation` devuelve `false` si todavía no hay fecha: el correo
      // #2 ES el de los datos, así que sin sesión no hay nada que mandar y la
      // pantalla no debe prometer un correo que no salió.
      emailed = await sendConfirmation({ to: email, name, session });
    } catch (error) {
      console.error("encuesta: falló el correo de confirmación", error);
    }

    return { ok: true, emailed, alreadySubmitted: false };
  },
});

/**
 * Estado de la encuesta para el usuario que está conectado.
 *
 * Devuelve `pendiente` solo cuando se cumplen las tres condiciones para
 * molestarlo: ya le mandamos el correo, no ha respondido y la sesión está
 * confirmada. Es lo que usa el recordatorio discreto de "mis cursos" — si
 * falta cualquiera de las tres, el usuario no ve nada.
 */
export const mySurveyStatus = query({
  args: { courseSlug: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    const email = user?.email?.toLowerCase();
    if (!email) return null;

    const courseSlug = args.courseSlug ?? "finanzas-personales-ia";
    const invites = await ctx.db
      .query("survey_invites")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();
    const invite = invites.find((i) => i.courseSlug === courseSlug);
    if (!invite) return null;

    const response = await ctx.db
      .query("survey_responses")
      .withIndex("by_token", (q) => q.eq("token", invite.token))
      .unique();
    if (response) return { state: "respondido" as const };

    // Todavía no le hemos escrito: no tenemos por qué recordarle nada.
    if (invite.sentAt == null) return null;

    const session = await findSession(ctx, courseSlug);
    // Sin fecha no hay nada que recordar todavía, y si la fecha ya pasó se
    // acabó: no tiene sentido estar pidiendo feedback a estas alturas.
    if (!hasDate(session) || isPast(session)) return null;

    return {
      state: "pendiente" as const,
      token: invite.token,
      when: formatWhen(session),
    };
  },
});

// ---------------------------------------------------------------------------
// Correos
// ---------------------------------------------------------------------------

/** Link de la encuesta de una persona. Con token propio, sin escribir nada. */
function surveyUrl(token: string) {
  return `${siteUrl()}/encuesta?t=${token}`;
}

/**
 * Correo #1 — el que pide el favor.
 *
 * Tono: agradecimiento primero, el favor después, y salida libre. NO es una
 * puerta: si no responden, el link se les puede mandar igual por WhatsApp, y el
 * correo lo dice. La versión anterior sonaba a ultimátum y ese no es el trato.
 */
async function sendConfirmation({
  to,
  name,
  session,
}: {
  to: string;
  name?: string;
  session: { dated?: boolean; date?: string; title?: string; startTime?: string; joinUrl?: string; agenda?: string[] } | null;
}) {
  if (!session?.dated) return false;
  const mail = confirmationTemplate({ name, session });
  await sendEmail(to, mail.subject, mail.html, mail.text);
  return true;
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

/** Crea (o reutiliza) una invitación por persona y devuelve su link único. */
export const createInvites = mutation({
  args: {
    courseSlug: v.string(),
    entries: v.array(v.object({ email: v.string(), name: v.optional(v.string()) })),
  },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    const out = [];
    for (const raw of args.entries) {
      const email = raw.email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) continue;

      const existing = (
        await ctx.db
          .query("survey_invites")
          .withIndex("by_email", (q) => q.eq("email", email))
          .collect()
      ).find((i) => i.courseSlug === args.courseSlug);

      const name = clean(raw.name, 120);
      if (existing) {
        // Si se vuelve a generar la lista, no se pisa el "enviado" ni se
        // duplica: solo se completa el nombre si faltaba.
        if (!existing.name && name) await ctx.db.patch(existing._id, { name });
        out.push({
          token: existing.token,
          email,
          name: existing.name ?? name ?? "",
          reused: true,
        });
        continue;
      }

      const token = randomToken();
      await ctx.db.insert("survey_invites", {
        token,
        courseSlug: args.courseSlug,
        email,
        name,
        createdAt: Date.now(),
      });
      out.push({ token, email, name: name ?? "", reused: false });
    }
    return out;
  },
});

async function invitesWithStatus(ctx: QueryCtx | MutationCtx, courseSlug: string) {
  const invites = await ctx.db
    .query("survey_invites")
    .withIndex("by_course", (q) => q.eq("courseSlug", courseSlug))
    .collect();
  const responses = await ctx.db
    .query("survey_responses")
    .withIndex("by_course", (q) => q.eq("courseSlug", courseSlug))
    .collect();
  const responded = new Set(responses.map((r) => r.token));
  return invites
    .map((i) => ({
      token: i.token,
      email: i.email,
      name: i.name ?? "",
      sentAt: i.sentAt ?? null,
      responded: responded.has(i.token),
    }))
    .sort((a, b) => a.email.localeCompare(b.email));
}

export const listInvites = query({
  args: { courseSlug: v.string() },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    return await invitesWithStatus(ctx, args.courseSlug);
  },
});

export const assertAdminInternal = internalMutation({
  args: {},
  handler: async (ctx) => {
    await requireActiveAdmin(ctx);
    return true;
  },
});

export const markInviteSentInternal = internalMutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query("survey_invites")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (!invite) return null;
    await ctx.db.patch(invite._id, { sentAt: Date.now() });
    return invite._id;
  },
});

/** Todo lo que `sendInvites` necesita, en una sola llamada interna. */
export const getSendBatchInternal = internalQuery({
  args: { courseSlug: v.string() },
  handler: async (ctx, args) => ({
    invites: await invitesWithStatus(ctx, args.courseSlug),
    session: shapeSession(await findSession(ctx, args.courseSlug)),
  }),
});

/**
 * Correo #1 a las invitaciones indicadas (por defecto, las que aún no se han
 * enviado). Devuelve el detalle de cada envío para que el admin vea qué falló
 * en vez de un "listo" genérico.
 */
export const sendInvites = action({
  args: {
    courseSlug: v.string(),
    tokens: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(anyApi.survey.assertAdminInternal, {});
    const { invites, session } = await ctx.runQuery(anyApi.survey.getSendBatchInternal, {
      courseSlug: args.courseSlug,
    });

    // El correo #1 promete que con la respuesta llega la fecha y el link. Sin
    // sesión con fecha eso es falso, así que no se manda nada (el panel también
    // lo bloquea, pero la red de seguridad va aquí).
    if (!hasDate(session)) {
      throw new Error(
        "Falta la fecha de la sesión de seguimiento. Configúrala antes de invitar.",
      );
    }

    const wanted = args.tokens ?? null;
    // `anyApi` no trae tipos (a propósito, para no armar el ciclo de `api.d.ts`),
    // así que el resultado del runQuery se tipa acá a mano.
    const batch = invites as {
      token: string;
      email: string;
      name: string;
      sentAt: number | null;
      responded: boolean;
    }[];
    const targets = wanted
      ? batch.filter((i) => wanted.includes(i.token))
      : batch.filter((i) => i.sentAt == null);

    const sent = [];
    const failed = [];
    for (const invite of targets) {
      const url = surveyUrl(invite.token);
      try {
        const mail = inviteTemplate({
          to: invite.email,
          name: invite.name,
          url,
          session,
        });
        await sendEmail(invite.email, mail.subject, mail.html, mail.text);
        await ctx.runMutation(anyApi.survey.markInviteSentInternal, { token: invite.token });
        sent.push(invite.email);
      } catch (error) {
        failed.push({
          email: invite.email,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    return { sent, failed };
  },
});

export const getResponseInternal = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, args) =>
    await ctx.db
      .query("survey_responses")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique(),
});

/** Reenvía el correo #2 (info de la sesión) a quien ya respondió. */
export const resendConfirmation = action({
  args: { courseSlug: v.string(), token: v.string() },
  handler: async (ctx, args) => {
    await ctx.runMutation(anyApi.survey.assertAdminInternal, {});
    const response = await ctx.runQuery(anyApi.survey.getResponseInternal, { token: args.token });
    if (!response) throw new Error("Ese link no tiene respuesta");
    const session = await ctx.runQuery(anyApi.survey.getSessionInternal, { courseSlug: args.courseSlug });
    const sent = await sendConfirmation({
      to: response.email,
      name: response.name,
      session,
    });
    if (!sent) throw new Error("Todavía no hay fecha de sesión configurada");
    return { ok: true, to: response.email };
  },
});

/** La sesión de seguimiento del curso, para editarla en /admin. */
export const getSession = query({
  args: { courseSlug: v.string() },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    return (await findSession(ctx, args.courseSlug)) ?? null;
  },
});

/** Crea la sesión si no existe, o actualiza la que ya hay (una sola por curso). */
export const saveSession = mutation({
  args: {
    courseSlug: v.string(),
    title: v.string(),
    date: v.optional(v.string()),
    startTime: v.optional(v.string()),
    joinUrl: v.optional(v.string()),
    agenda: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    const existing = await findSession(ctx, args.courseSlug);

    const doc = {
      courseSlug: args.courseSlug,
      title: args.title.trim(),
      date: args.date?.trim() || undefined,
      startTime: args.startTime?.trim() || undefined,
      joinUrl: args.joinUrl?.trim() || undefined,
      agenda: (args.agenda ?? []).map((a) => a.trim()).filter(Boolean),
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, doc);
      return existing._id;
    }
    return await ctx.db.insert("followup_sessions", doc);
  },
});


/**
 * Borra la respuesta de una persona. La invitación NO se toca: queda con su
 * token, así que la persona puede volver a responder con el mismo link si el
 * admin se lo reenvía (o si vuelve a abrir el correo que le llegó).
 *
 * Ojo: si vuelve a responder, el correo #2 (datos de la sesión) se le manda
 * otra vez, porque `submit` lo considera una respuesta nueva.
 */
export const deleteResponse = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    const row = await ctx.db
      .query("survey_responses")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (!row) return null;
    await ctx.db.delete(row._id);
    return { deleted: true, email: row.email };
  },
});

/** Respuestas crudas; el NPS y los conteos los calcula el panel. */
export const listResponses = query({
  args: { courseSlug: v.string() },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    const rows = await ctx.db
      .query("survey_responses")
      .withIndex("by_course", (q) => q.eq("courseSlug", args.courseSlug))
      .collect();
    return rows.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});