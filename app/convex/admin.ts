// @ts-nocheck
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

async function requireActiveAdmin(ctx) {
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

export const approveUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    const target = await ctx.db
      .query("user_roles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (!target) throw new Error("Usuario sin rol");
    await ctx.db.patch(target._id, { status: "active" });
    return target._id;
  },
});

// Bootstrap del primer admin: se llama desde la CLI (npx convex run) con el
// secreto configurado en el deployment (npx convex env set ADMIN_BOOTSTRAP_SECRET ...).
export const promoteByEmail = mutation({
  args: { email: v.string(), secret: v.string(), role: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const expected = process.env.ADMIN_BOOTSTRAP_SECRET;
    if (!expected) {
      throw new Error("ADMIN_BOOTSTRAP_SECRET no configurado en el deployment");
    }
    if (args.secret !== expected) {
      throw new Error("Secreto inválido");
    }
    const email = args.email.toLowerCase();
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .unique();
    if (!user) throw new Error(`No existe usuario con email ${email}`);
    const role = args.role === "admin" ? "admin" : "viewer";
    const existing = await ctx.db
      .query("user_roles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { role, status: "active" });
      return existing._id;
    }
    return await ctx.db.insert("user_roles", {
      userId: user._id,
      role,
      status: "active",
    });
  },
});

export const markRegistrationPaid = mutation({
  args: { email: v.string(), workshopSlug: v.string() },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    const email = args.email.toLowerCase();
    const registration = await ctx.db
      .query("workshop_registrations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .filter((q) => q.eq(q.field("workshopSlug"), args.workshopSlug))
      .unique();
    if (!registration) {
      throw new Error(`No existe registro de ${email} en ${args.workshopSlug}`);
    }
    await ctx.db.patch(registration._id, { status: "paid" });
    return registration._id;
  },
});

async function isActiveAdmin(ctx) {
  const callerId = await getAuthUserId(ctx);
  if (!callerId) return false;
  const callerRole = await ctx.db
    .query("user_roles")
    .withIndex("by_userId", (q) => q.eq("userId", callerId))
    .unique();
  return !!callerRole && callerRole.role === "admin" && callerRole.status === "active";
}

export const listPendingUsers = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isActiveAdmin(ctx))) return [];
    const roles = await ctx.db.query("user_roles").collect();
    const pending = roles.filter((r) => r.status === "pending");
    return await Promise.all(
      pending.map(async (r) => {
        const user = await ctx.db.get(r.userId);
        return {
          userId: r.userId,
          email: user?.email ?? null,
          name: user?.name ?? null,
          role: r.role,
        };
      }),
    );
  },
});

export const listRegistrations = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isActiveAdmin(ctx))) return [];
    const registrations = await ctx.db.query("workshop_registrations").collect();
    return registrations.sort((a, b) => a.createdAt - b.createdAt);
  },
});
