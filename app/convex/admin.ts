// @ts-nocheck
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const approveUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const callerId = await getAuthUserId(ctx);
    if (!callerId) throw new Error("No autenticado");
    const callerRole = await ctx.db
      .query("user_roles")
      .withIndex("by_userId", (q) => q.eq("userId", callerId))
      .unique();
    if (!callerRole || callerRole.role !== "admin" || callerRole.status !== "active") {
      throw new Error("No autorizado");
    }
    const target = await ctx.db
      .query("user_roles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (!target) throw new Error("Usuario sin rol");
    await ctx.db.patch(target._id, { status: "active" });
    return target._id;
  },
});
