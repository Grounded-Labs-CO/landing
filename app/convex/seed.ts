// @ts-nocheck
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

// Siembra del catálogo de cursos + archivos de sample data en storage.
// Solo ejecutable con ADMIN_BOOTSTRAP_SECRET (scripts/seed-course.mjs).
// Nota: los actions no tienen ctx.db directo, usan runQuery/runMutation.

function requireSecret(args) {
  const expected = process.env.ADMIN_BOOTSTRAP_SECRET;
  if (!expected || args.secret !== expected) {
    throw new Error("Secreto de siembra inválido o no configurado");
  }
}

export const clearCourse = mutation({
  args: { secret: v.string(), courseSlug: v.string() },
  handler: async (ctx, args) => {
    requireSecret(args);
    const course = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", args.courseSlug))
      .unique();
    if (!course) return { deleted: 0 };

    let deleted = 0;
    const sections = await ctx.db
      .query("course_sections")
      .withIndex("by_course", (q) => q.eq("courseId", course._id))
      .collect();
    for (const section of sections) {
      const items = await ctx.db
        .query("course_items")
        .withIndex("by_section", (q) => q.eq("sectionId", section._id))
        .collect();
      for (const item of items) {
        if (item.storageId) await ctx.storage.delete(item.storageId);
        await ctx.db.delete(item._id);
        deleted++;
      }
      await ctx.db.delete(section._id);
      deleted++;
    }

    const profiles = await ctx.db
      .query("sample_profiles")
      .withIndex("by_course", (q) => q.eq("courseId", course._id))
      .collect();
    for (const profile of profiles) {
      const files = await ctx.db
        .query("sample_files")
        .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
        .collect();
      for (const file of files) {
        await ctx.storage.delete(file.storageId);
        await ctx.db.delete(file._id);
        deleted++;
      }
      if (profile.introStorageId) {
        await ctx.storage.delete(profile.introStorageId);
      }
      await ctx.db.delete(profile._id);
      deleted++;
    }

    await ctx.db.delete(course._id);
    return { deleted: deleted + 1 };
  },
});

const eventInfoValidator = v.object({ label: v.string(), value: v.string() });
const itemValidator = v.object({
  order: v.number(),
  title: v.string(),
  description: v.optional(v.string()),
  url: v.optional(v.string()),
  note: v.optional(v.string()),
  status: v.optional(v.union(v.literal("proximo"), v.literal("published"))),
});

export const seedCourse = mutation({
  args: {
    secret: v.string(),
    course: v.object({
      slug: v.string(),
      title: v.string(),
      tagline: v.string(),
      schedule: v.string(),
      price: v.string(),
      eventInfo: v.array(eventInfoValidator),
    }),
    sections: v.array(
      v.object({
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
        items: v.array(itemValidator),
      }),
    ),
    profiles: v.array(
      v.object({
        order: v.number(),
        slug: v.string(),
        name: v.string(),
        tagline: v.string(),
        introFileName: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    requireSecret(args);
    const courseId = await ctx.db.insert("courses", {
      slug: args.course.slug,
      title: args.course.title,
      tagline: args.course.tagline,
      schedule: args.course.schedule,
      price: args.course.price,
      eventInfo: args.course.eventInfo,
    });

    for (const section of args.sections) {
      const sectionId = await ctx.db.insert("course_sections", {
        courseId,
        order: section.order,
        kind: section.kind,
        title: section.title,
        hint: section.hint,
      });
      for (const item of section.items) {
        await ctx.db.insert("course_items", {
          sectionId,
          order: item.order,
          title: item.title,
          description: item.description,
          url: item.url,
          note: item.note,
          status: item.status,
        });
      }
    }

    for (const profile of args.profiles) {
      await ctx.db.insert("sample_profiles", {
        courseId,
        order: profile.order,
        slug: profile.slug,
        name: profile.name,
        tagline: profile.tagline,
        introFileName: profile.introFileName,
      });
    }

    return { courseId };
  },
});

// ---- helpers usados por los actions (sin ctx.db directo) ----

export const findProfileId = query({
  args: { secret: v.string(), courseSlug: v.string(), profileSlug: v.string() },
  handler: async (ctx, args) => {
    requireSecret(args);
    const course = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", args.courseSlug))
      .unique();
    if (!course) throw new Error("Curso no encontrado");
    const profile = await ctx.db
      .query("sample_profiles")
      .withIndex("by_course", (q) => q.eq("courseId", course._id))
      .filter((q) => q.eq(q.field("slug"), args.profileSlug))
      .unique();
    if (!profile) throw new Error(`Perfil ${args.profileSlug} no encontrado`);
    return profile._id;
  },
});

export const insertSampleFile = mutation({
  args: {
    secret: v.string(),
    profileId: v.id("sample_profiles"),
    category: v.string(),
    order: v.number(),
    label: v.string(),
    fileName: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    requireSecret(args);
    await ctx.db.insert("sample_files", {
      profileId: args.profileId,
      category: args.category,
      order: args.order,
      label: args.label,
      fileName: args.fileName,
      storageId: args.storageId,
    });
  },
});

export const setProfileIntro = mutation({
  args: {
    secret: v.string(),
    profileId: v.id("sample_profiles"),
    storageId: v.id("_storage"),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    requireSecret(args);
    await ctx.db.patch(args.profileId, {
      introStorageId: args.storageId,
      introFileName: args.fileName,
    });
  },
});

export const findItemId = query({
  args: { secret: v.string(), courseSlug: v.string(), sectionOrder: v.number(), itemOrder: v.number() },
  handler: async (ctx, args) => {
    requireSecret(args);
    const course = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", args.courseSlug))
      .unique();
    if (!course) throw new Error("Curso no encontrado");
    const sections = await ctx.db
      .query("course_sections")
      .withIndex("by_course", (q) => q.eq("courseId", course._id))
      .collect();
    const section = sections.find((s) => s.order === args.sectionOrder);
    if (!section) throw new Error("Sección no encontrada");
    const items = await ctx.db
      .query("course_items")
      .withIndex("by_section", (q) => q.eq("sectionId", section._id))
      .collect();
    const item = items.find((i) => i.order === args.itemOrder);
    if (!item) throw new Error("Ítem no encontrado");
    return { itemId: item._id, existingStorageId: item.storageId ?? null };
  },
});

export const setItemFile = mutation({
  args: {
    secret: v.string(),
    itemId: v.id("course_items"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    requireSecret(args);
    await ctx.db.patch(args.itemId, {
      storageId: args.storageId,
      status: "published",
    });
  },
});

// ---- actions con acceso a storage ----

export const attachProfileFile = action({
  args: {
    secret: v.string(),
    courseSlug: v.string(),
    profileSlug: v.string(),
    category: v.string(),
    order: v.number(),
    label: v.string(),
    fileName: v.string(),
    contentType: v.string(),
    contentBase64: v.string(),
    isIntro: v.boolean(),
  },
  handler: async (ctx, args) => {
    requireSecret(args);
    const bytes = Uint8Array.from(atob(args.contentBase64), (c) => c.charCodeAt(0));
    const storageId = await ctx.storage.store(
      new Blob([bytes], { type: args.contentType }),
    );

    const profileId = await ctx.runQuery(api.seed.findProfileId, {
      secret: args.secret,
      courseSlug: args.courseSlug,
      profileSlug: args.profileSlug,
    });

    if (args.isIntro) {
      await ctx.runMutation(api.seed.setProfileIntro, {
        secret: args.secret,
        profileId,
        storageId,
        fileName: args.fileName,
      });
    } else {
      await ctx.runMutation(api.seed.insertSampleFile, {
        secret: args.secret,
        profileId,
        category: args.category,
        order: args.order,
        label: args.label,
        fileName: args.fileName,
        storageId,
      });
    }
    return { storageId };
  },
});

// Adjuntar un documento publicado a un ítem (artículos/docs con archivo real).
export const attachItemFile = action({
  args: {
    secret: v.string(),
    courseSlug: v.string(),
    sectionOrder: v.number(),
    itemOrder: v.number(),
    fileName: v.string(),
    contentType: v.string(),
    contentBase64: v.string(),
  },
  handler: async (ctx, args) => {
    requireSecret(args);
    const bytes = Uint8Array.from(atob(args.contentBase64), (c) => c.charCodeAt(0));
    const storageId = await ctx.storage.store(
      new Blob([bytes], { type: args.contentType }),
    );

    const { itemId, existingStorageId } = await ctx.runQuery(api.seed.findItemId, {
      secret: args.secret,
      courseSlug: args.courseSlug,
      sectionOrder: args.sectionOrder,
      itemOrder: args.itemOrder,
    });
    if (existingStorageId) await ctx.storage.delete(existingStorageId);

    await ctx.runMutation(api.seed.setItemFile, {
      secret: args.secret,
      itemId,
      storageId,
    });
    return { storageId };
  },
});

export const seedCatalogOptions = mutation({
  args: {
    secret: v.string(),
    professions: v.array(v.string()),
    aiTools: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    requireSecret(args);
    const existingProfs = await ctx.db.query("professions").collect();
    for (const row of existingProfs) await ctx.db.delete(row._id);
    const existingTools = await ctx.db.query("ai_tools").collect();
    for (const row of existingTools) await ctx.db.delete(row._id);

    for (const [i, label] of args.professions.entries()) {
      await ctx.db.insert("professions", { order: i, label });
    }
    for (const [i, label] of args.aiTools.entries()) {
      await ctx.db.insert("ai_tools", { order: i, label });
    }
    return { professions: args.professions.length, aiTools: args.aiTools.length };
  },
});
