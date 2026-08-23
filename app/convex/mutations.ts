// @ts-nocheck
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createLead = mutation({
  args: {
    email: v.string(),
    profession: v.optional(v.string()),
    pain: v.optional(v.string()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (existing) return existing._id;
    return await ctx.db.insert("leads", {
      email: args.email,
      profession: args.profession,
      pain: args.pain,
      source: args.source,
      createdAt: Date.now(),
    });
  },
});

export const saveUserProfile = mutation({
  args: {
    displayName: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");
    const userId = identity.subject as any;
    const existing = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        displayName: args.displayName ?? existing.displayName,
        phone: args.phone ?? existing.phone,
      });
      return existing._id;
    }
    return await ctx.db.insert("user_profiles", {
      userId,
      displayName: args.displayName,
      phone: args.phone,
    });
  },
});
