// @ts-nocheck
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      const existing = await ctx.db
        .query("user_roles")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .unique();
      if (!existing) {
        await ctx.db.insert("user_roles", {
          userId: args.userId,
          role: "viewer",
          status: "pending",
        });
      }
    },
  },
});
