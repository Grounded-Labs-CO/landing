// @ts-nocheck
import { query } from "./_generated/server";
import { v } from "convex/values";

// Cursos activos con sus secciones (metadatos, sin contenido premium).
// Lo usa el listado "Mis cursos" y la landing.
export const list = query({
  args: {},
  handler: async (ctx) => {
    const courses = await ctx.db.query("courses").collect();
    return courses
      .sort((a, b) => a.schedule.localeCompare(b.schedule))
      .map((course) => ({
        slug: course.slug,
        title: course.title,
        schedule: course.schedule,
        price: course.price,
      }));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const course = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!course) return null;
    return {
      slug: course.slug,
      title: course.title,
      tagline: course.tagline,
      schedule: course.schedule,
      price: course.price,
      eventInfo: course.eventInfo,
    };
  },
});
