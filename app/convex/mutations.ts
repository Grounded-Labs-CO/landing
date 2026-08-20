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
