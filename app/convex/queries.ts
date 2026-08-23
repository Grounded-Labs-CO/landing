// @ts-nocheck
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

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

// Contexto de un email para decidir si el correo de magic link es de BIENVENIDA
// (invitado a un curso, sin verificar) o el login genérico.
export const getEmailContext = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .unique();
    const verified = !!user?.emailVerificationTime;
    const regs = await ctx.db
      .query("workshop_registrations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();
    const reg = regs[0] ?? null;
    let course = null;
    if (reg) {
      const c = await ctx.db
        .query("courses")
        .withIndex("by_slug", (q) => q.eq("slug", reg.workshopSlug))
        .unique();
      if (c) {
        course = {
          title: c.title,
          schedule: c.schedule,
          price: c.price,
          eventInfo: c.eventInfo,
        };
      }
    }
    return { hasRegistration: !!reg, verified, course };
  },
});
