// @ts-nocheck
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserRole = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const role = await ctx.db
      .query("user_roles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    return role;
  },
});

export const listLeads = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const role = await ctx.db
      .query("user_roles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!role || role.role !== "admin" || role.status !== "active") return [];
    return await ctx.db.query("leads").collect();
  },
});

// Cursos del estudiante autenticado (por email de la cuenta).
export const myRegistrations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const user = await ctx.db.get(userId);
    const email = user?.email?.toLowerCase();
    if (!email) return [];
    const registrations = await ctx.db
      .query("workshop_registrations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();
    return registrations.map((r) => ({
      workshopSlug: r.workshopSlug,
      status: r.status,
      createdAt: r.createdAt,
    }));
  },
});
