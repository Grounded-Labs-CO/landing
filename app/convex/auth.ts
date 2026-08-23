// @ts-nocheck
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Email } from "@convex-dev/auth/providers/Email";
import Resend from "@auth/core/providers/resend";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Curso activo: toda cuenta nueva en la zona de estudiantes reserva cupo
// en este workshop (pending) hasta que un admin marque el pago.
const DEFAULT_WORKSHOP_SLUG = "finanzas-personales-ia";

// Email (magic link) es el método principal. Resend es el proveedor de email.
// Password queda como opción secundaria no-default.
const emailProvider = Email(
  Resend({
    apiKey: process.env.AUTH_RESEND_KEY,
    from: process.env.AUTH_EMAIL_FROM ?? "Grounded Labs <onboarding@resend.dev>",
  }),
);

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    // Magic link - default
    Email({
      ...emailProvider,
      // Magic link: solo el token es necesario, no requiere re-enviar email en verificación
      authorize: undefined,
      id: "resend",
      type: "email",
    }),
    // Password - secundario
    Password,
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
          status: "pending",
        });
      }

      const user = await ctx.db.get(args.userId);
      const email = user?.email?.toLowerCase();
      if (email) {
        const registration = await ctx.db
          .query("workshop_registrations")
          .withIndex("by_email", (q) => q.eq("email", email))
          .filter((q) => q.eq(q.field("workshopSlug"), DEFAULT_WORKSHOP_SLUG))
          .unique();
        if (!registration) {
          await ctx.db.insert("workshop_registrations", {
            email,
            workshopSlug: DEFAULT_WORKSHOP_SLUG,
            status: "pending",
            createdAt: Date.now(),
          });
        }
      }
    },
  },
});
