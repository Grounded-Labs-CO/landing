// @ts-nocheck
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { resendEmailProvider } from "./email";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Email (magic link) es el método principal. Resend es el proveedor.
// Password queda como opción secundaria no-default.
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    resendEmailProvider,
    Password({
      profile: (params) => ({
        email: (params.email as string)?.toLowerCase(),
        ...(params.phone ? { phone: params.phone as string } : {}),
      }),
    }),
  ],
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
          status: "active",
        });
      }
    },
  },
});
