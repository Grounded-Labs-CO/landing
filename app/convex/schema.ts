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
    eventInfo: v.array(v.object({ label: v.string(), value: v.string() })),
    status: v.optional(v.union(v.literal("active"), v.literal("archived"))),
  }).index("by_slug", ["slug"]),

  // Secciones del curso (los "sellos" 01..N)
  course_sections: defineTable({
    courseId: v.id("courses"),
    order: v.number(),
    kind: v.union(
      v.literal("info"),
      v.literal("articles"),
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
    status: v.optional(v.union(v.literal("proximo"), v.literal("published"))),
    storageId: v.optional(v.id("_storage")),
  }).index("by_section", ["sectionId"]),

  // Perfiles de sample data
  sample_profiles: defineTable({
    courseId: v.id("courses"),
    order: v.number(),
    slug: v.string(),
    name: v.string(),
    tagline: v.string(),
    introStorageId: v.optional(v.id("_storage")),
    introFileName: v.optional(v.string()),
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

  // Perfil extendido del usuario (nombre, teléfono, profesión y segmentación IA)
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
