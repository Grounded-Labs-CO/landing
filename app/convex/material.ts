// @ts-nocheck
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export async function requireMaterialAccess(ctx, courseSlug) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("No autenticado");

  const user = await ctx.db.get(userId);
  const email = user?.email?.toLowerCase();
  if (!email) throw new Error("Usuario sin email");

  const course = await ctx.db
    .query("courses")
    .withIndex("by_slug", (q) => q.eq("slug", courseSlug))
    .unique();
  if (!course) throw new Error("Curso no encontrado");
  if ((course as any).status === "disabled") throw new Error("Curso no disponible");

  const registration = await ctx.db
    .query("workshop_registrations")
    .withIndex("by_email", (q) => q.eq("email", email))
    .filter((q) => q.eq(q.field("workshopSlug"), courseSlug))
    .unique();
  if (!registration || registration.status !== "paid") {
    throw new Error("Pago del curso pendiente");
  }
  return { userId, email };
}

// Estado de acceso del estudiante para pintar la UI.
export const myAccess = query({
  args: { courseSlug: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { authenticated: false };

    const user = await ctx.db.get(userId);
    const email = user?.email?.toLowerCase();
    const registration = email
      ? await ctx.db
          .query("workshop_registrations")
          .withIndex("by_email", (q) => q.eq("email", email))
          .filter((q) => q.eq(q.field("workshopSlug"), args.courseSlug))
          .unique()
      : null;

    return {
      authenticated: true,
      email,
      registrationStatus: registration?.status ?? null,
    };
  },
});

// Contenido completo del curso para estudiantes con acceso: secciones,
// ítems y sample data con URLs firmadas de Convex storage (expiran solas,
// no hace falta el token de descarga anterior).
export const getCourse = query({
  args: { courseSlug: v.string() },
  handler: async (ctx, args) => {
    const { email } = await requireMaterialAccess(ctx, args.courseSlug);

    const course = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", args.courseSlug))
      .unique();
    if (!course) return null;

    const sections = (
      await ctx.db
        .query("course_sections")
        .withIndex("by_course", (q) => q.eq("courseId", course._id))
        .collect()
    ).sort((a, b) => a.order - b.order);

    const sectionsOut = [];
    for (const section of sections) {
      const items = (
        await ctx.db
          .query("course_items")
          .withIndex("by_section", (q) => q.eq("sectionId", section._id))
          .collect()
      ).sort((a, b) => a.order - b.order);

      const itemsOut = [];
      for (const item of items) {
        itemsOut.push({
          title: item.title,
          description: item.description ?? null,
          url: item.url ?? null,
          note: item.note ?? null,
          status: item.status ?? null,
          downloadUrl: item.storageId ? await ctx.storage.getUrl(item.storageId) : null,
        });
      }

      let sampleData = null;
      if (section.kind === "sample-data") {
        const profiles = (
          await ctx.db
            .query("sample_profiles")
            .withIndex("by_course", (q) => q.eq("courseId", course._id))
            .collect()
        ).sort((a, b) => a.order - b.order);

        sampleData = await Promise.all(
          profiles.map(async (profile) => {
            const files = (
              await ctx.db
                .query("sample_files")
                .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
                .collect()
            ).sort((a, b) => a.order - b.order);

            const filesOut = await Promise.all(
              files.map(async (f) => ({
                category: f.category,
                label: f.label,
                fileName: f.fileName,
                url: await ctx.storage.getUrl(f.storageId),
              })),
            );

            const categories = [];
            for (const f of filesOut) {
              let cat = categories.find((c) => c.label === f.category);
              if (!cat) {
                cat = { label: f.category, files: [] };
                categories.push(cat);
              }
              cat.files.push(f);
            }

            return {
              slug: profile.slug,
              name: profile.name,
              tagline: profile.tagline,
              introUrl: profile.introStorageId
                ? await ctx.storage.getUrl(profile.introStorageId)
                : null,
              introName: profile.introFileName ?? null,
              categories,
              fileCount: filesOut.length,
            };
          }),
        );
      }

      sectionsOut.push({
        order: section.order,
        kind: section.kind,
        title: section.title,
        hint: section.hint,
        items: itemsOut,
        sampleData,
      });
    }

    return {
      slug: course.slug,
      title: course.title,
      tagline: course.tagline,
      schedule: course.schedule,
      price: course.price,
      eventInfo: course.eventInfo,
      email,
      sections: sectionsOut,
    };
  },
});
