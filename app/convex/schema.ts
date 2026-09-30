// @ts-nocheck
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  user_roles: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("viewer"), v.literal("admin")),
    status: v.union(v.literal("pending"), v.literal("active")),
  }).index("by_userId", ["userId"]),

  // Ejemplo para leads del workshop (alineado con validación de mercado)
  leads: defineTable({
    email: v.string(),
    profession: v.optional(v.string()),
    pain: v.optional(v.string()),
    source: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // --- Encuesta de cierre (NPS, resultado, precio, origen, B2B, demanda) ---
  //
  // El flujo es: el admin genera una invitación por persona (con token único en
  // la URL, para que nadie escriba mal su correo) → la persona la llena → al
  // enviarla recibe el correo con los datos de la sesión virtual de follow-up.
  // El link de la encuesta es también el comprobante de asistencia.

  // Invitación = una persona con su link propio.
  survey_invites: defineTable({
    token: v.string(),
    courseSlug: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
    sentAt: v.optional(v.number()),
  })
    .index("by_token", ["token"])
    .index("by_email", ["email"])
    .index("by_course", ["courseSlug"]),

  // Respuesta = una fila por invitación (si se vuelve a enviar, se actualiza).
  survey_responses: defineTable({
    token: v.string(),
    courseSlug: v.string(),
    email: v.string(),
    name: v.string(),
    // 0–10 (NPS). Las cerradas van como código corto para que la hoja de
    // análisis pueda agrupar sin depender del texto de la opción.
    nps: v.number(),
    npsWhy: v.optional(v.string()),
    channelOther: v.optional(v.string()),
    assistant: v.string(),
    pace: v.string(),
    price: v.string(),
    channel: v.string(),
    knewHosts: v.string(),
    b2b: v.string(),
    interests: v.array(v.string()),
    changeOne: v.optional(v.string()),
    consent: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_course", ["courseSlug"]),

  // Sesión virtual de follow-up. **Una sola por workshop**: las
  // fechas cambian y se edita la misma fila. Sin estado ni varias fechas — lo que
  // decide si la sesión existe es que tenga `date`, y sin `date` no se pueden
  // mandar invitaciones. La encuesta es siempre sobre el workshop, no sobre la
  // sesión, así que `survey_responses` cuelga de la invitación.
  followup_sessions: defineTable({
    courseSlug: v.string(),
    title: v.string(),
    // ISO `YYYY-MM-DD` y `HH:MM` en 24h: son tipos, no texto libre, para no
    // estar escribiendo "jueves 8 de octubre" a mano (que es justo donde se
    // equivoca uno). Todo lo legible para el correo —"jueves, 8 de octubre",
    // "7:00 p. m."— se formatea desde acá, y el link de "agendar" se arma solo.
    date: v.optional(v.string()),
    startTime: v.optional(v.string()),
    joinUrl: v.optional(v.string()),
    agenda: v.array(v.string()),
    updatedAt: v.number(),
  }).index("by_course", ["courseSlug"]),

  workshop_registrations: defineTable({
    email: v.string(),
    workshopSlug: v.string(),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("cancelled")),
    createdAt: v.number(),
  }).index("by_email", ["email"]).index("by_workshop", ["workshopSlug"]),

  // Catálogo de cursos y su contenido (zona de estudiantes)
  courses: defineTable({
    slug: v.string(),
    title: v.string(),
    tagline: v.string(),
    schedule: v.string(),
    price: v.string(),
    eventInfo: v.array(
      v.object({ label: v.string(), value: v.string(), url: v.optional(v.string()) }),
    ),
    status: v.optional(
      v.union(v.literal("active"), v.literal("full"), v.literal("completed"), v.literal("disabled")),
    ),
    // Brochure comercial del curso (PDF en Convex storage). Se administra desde
    // /admin; opcional: si falta, la landing no pinta el botón de descarga.
    brochureStorageId: v.optional(v.id("_storage")),
    brochureFileName: v.optional(v.string()),
    // Link "agregar al calendario" del evento (Google Calendar, con fecha y
    // sede prellenadas). Opcional: si falta, no se muestra.
    calendarUrl: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  // Secciones del curso (los "sellos" 01..N)
  course_sections: defineTable({
    courseId: v.id("courses"),
    order: v.number(),
    kind: v.union(
      v.literal("info"),
      v.literal("articles"),
      v.literal("checklist"),
      v.literal("sample-data"),
      v.literal("docs"),
      v.literal("links"),
    ),
    title: v.string(),
    hint: v.string(),
  }).index("by_course", ["courseId"]),

  // Ítems de una sección: artículos (antes de), docs (presentación) y links
  course_items: defineTable({
    sectionId: v.id("course_sections"),
    order: v.number(),
    title: v.string(),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    note: v.optional(v.string()),
    status: v.optional(v.union(v.literal("proximo"), v.literal("published"), v.literal("disabled"))),
    storageId: v.optional(v.id("_storage")),
    // Imagen (foto de sede, tarifas del parqueadero…) que se muestra como
    // figura en el detalle de la sección.
    imageStorageId: v.optional(v.id("_storage")),
    // Agrupación para la sección `checklist` (ej. "Ingresos", "Deudas").
    group: v.optional(v.string()),
  }).index("by_section", ["sectionId"]),

  // Perfiles de sample data
  sample_profiles: defineTable({
    courseId: v.id("courses"),
    order: v.number(),
    slug: v.string(),
    name: v.string(),
    tagline: v.string(),
    // Ficha tipo hoja de vida (opcionales: el perfil puede ser mínimo)
    role: v.optional(v.string()),
    meta: v.optional(v.string()),
    bio: v.optional(v.string()),
    facts: v.optional(v.array(v.object({ label: v.string(), value: v.string() }))),
    quote: v.optional(v.string()),
    introStorageId: v.optional(v.id("_storage")),
    introFileName: v.optional(v.string()),
    photoStorageId: v.optional(v.id("_storage")),
    photoFileName: v.optional(v.string()),
    // ZIP del expediente (opcional). Si existe, el botón "descargar datos de
    // prueba" lo entrega directo; si no, se arma en vivo desde sample_files.
    zipStorageId: v.optional(v.id("_storage")),
    zipFileName: v.optional(v.string()),
  }).index("by_course", ["courseId"]),

  // Documentos de cada perfil (archivo vive en Convex storage)
  sample_files: defineTable({
    profileId: v.id("sample_profiles"),
    category: v.string(),
    order: v.number(),
    label: v.string(),
    fileName: v.string(),
    storageId: v.id("_storage"),
  }).index("by_profile", ["profileId"]),

  // Perfil extendido del usuario (nombre, teléfono, profesión, segmentación IA y motivación)
  user_profiles: defineTable({
    userId: v.id("users"),
    displayName: v.optional(v.string()),
    phone: v.optional(v.string()),
    profession: v.optional(v.string()),
    aiLevel: v.optional(
      v.union(v.literal("principiante"), v.literal("intermedio"), v.literal("avanzado")),
    ),
    aiTool: v.optional(v.string()),
    contactMethod: v.optional(v.union(v.literal("whatsapp"), v.literal("correo"), v.literal("ambos"))),
    // Qué quiere resolver o aprender con IA (opcional, editable en el perfil).
    motivation: v.optional(v.string()),
    completed: v.optional(v.boolean()),
  }).index("by_userId", ["userId"]),

  // Profesiones para el dropdown del onboarding (sembradas)
  professions: defineTable({
    order: v.number(),
    label: v.string(),
  }).index("by_order", ["order"]),

  // Herramientas de IA para el dropdown del onboarding (sembradas)
  ai_tools: defineTable({
    order: v.number(),
    label: v.string(),
  }).index("by_order", ["order"]),
});
