// @ts-nocheck
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId, createAccount, modifyAccountCredentials } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const listProfessions = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("professions").collect();
    return rows.sort((a, b) => a.order - b.order).map((r) => r.label);
  },
});

export const listAiTools = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("ai_tools").collect();
    return rows.sort((a, b) => a.order - b.order).map((r) => r.label);
  },
});

export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId).eq("provider", "password"))
      .collect();
    const p = profile ?? {};
    return {
      email: user?.email ?? null,
      phone: (user as any)?.phone ?? null,
      displayName: p.displayName ?? null,
      profession: p.profession ?? null,
      aiLevel: p.aiLevel ?? null,
      aiTool: p.aiTool ?? null,
      contactMethod: p.contactMethod ?? null,
      completed: p.completed === true,
      hasPassword: accounts.length > 0,
    };
  },
});

export const updateMyProfile = mutation({
  args: {
    displayName: v.string(),
    profession: v.string(),
    aiLevel: v.union(v.literal("principiante"), v.literal("intermedio"), v.literal("avanzado")),
    aiTool: v.string(),
    contactMethod: v.union(v.literal("whatsapp"), v.literal("correo"), v.literal("ambos")),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("No autenticado");
    if (!args.displayName.trim() || !args.profession.trim() || !args.aiTool.trim()) {
      throw new Error("Perfil incompleto");
    }
    const existing = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    const data = {
      userId,
      displayName: args.displayName,
      profession: args.profession,
      aiLevel: args.aiLevel,
      aiTool: args.aiTool,
      contactMethod: args.contactMethod,
      phone: args.phone,
      completed: true,
    };
    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("user_profiles", data);
    }
    if (args.phone) {
      await ctx.db.patch(userId, { name: args.displayName, phone: args.phone } as any);
    } else {
      await ctx.db.patch(userId, { name: args.displayName } as any);
    }
    return true;
  },
});

export const setMyPassword = action({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    if (args.password.length < 8) throw new Error("Mínimo 8 caracteres");
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("No autenticado");
    // getMyProfile está gateada al usuario autenticado (vía getAuthUserId),
    // así que email y hasPassword pertenecen al llamador — sin filtración.
    const me = await ctx.runQuery(api.profile.getMyProfile, {});
    if (!me?.email) throw new Error("Usuario sin email");
    const e = me.email.toLowerCase();
    if (me.hasPassword) {
      await modifyAccountCredentials(ctx, {
        provider: "password",
        account: { id: e, secret: args.password },
      });
    } else {
      // createAccount con shouldLinkViaEmail enlaza al usuario existente SOLO si
      // el email está verificado y es único (footgun documentado en AGENTS.md).
      await createAccount(ctx, {
        provider: "password",
        account: { id: e, secret: args.password },
        profile: { email: e } as any,
        shouldLinkViaEmail: true,
      });
    }
    return true;
  },
});
