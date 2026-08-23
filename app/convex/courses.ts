// @ts-nocheck
import { query } from "./_generated/server";
import { v } from "convex/values";

// Cursos públicos (visible en la landing / listados). Incluye active y full;
// completed y disabled no se muestran en público. "active" es el default.
export const list = query({
  args: {},
  handler: async (ctx) => {
    const courses = await ctx.db.query("courses").collect();
    return courses
      .filter((c) => {
        const s = (c as any).status ?? "active";
        return s === "active" || s === "full";
      })
      .sort((a, b) => a.schedule.localeCompare(b.schedule))
      .map((course) => ({
        slug: course.slug,
        title: course.title,
        tagline: course.tagline,
        schedule: course.schedule,
        price: course.price,
        status: (course as any).status ?? "active",
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
      status: (course as any).status ?? "active",
    };
  },
});
