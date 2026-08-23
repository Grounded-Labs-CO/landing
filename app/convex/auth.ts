// @ts-nocheck
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Resend from "@auth/core/providers/resend";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Email (magic link) es el método principal. Resend es el proveedor.
// Password queda como opción secundaria no-default.
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    {
      ...Resend({
        from: process.env.AUTH_EMAIL_FROM ?? "Grounded Labs <noreply@grounded-labs.com>",
        apiKey: process.env.AUTH_RESEND_KEY,
      }),
      // Plantilla comercial corporativa en español, colores 2A (tinta/terracota)
      sendVerificationRequest: async ({ identifier: to, provider, url }) => {
        const brandColor = "#B4552B";
        const html = `
<body style="margin:0;background:#0E1214;padding:32px 16px;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#1C2427;border:1px solid #262E31;">
    <tr><td style="padding:28px 32px 0 32px;">
      <table border="0" cellspacing="0" cellpadding="0"><tr>
        <td style="width:28px;height:28px;background:${brandColor};text-align:center;font-family:'IBM Plex Mono',monospace;font-size:16px;font-weight:600;color:#0E1214;line-height:28px;">g</td>
        <td style="padding-left:10px;font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:500;color:#F1F3F2;letter-spacing:0.04em;">grounded<span style="color:#6C7573;">_</span>labs</td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:28px 32px 0 32px;font-family:'IBM Plex Sans',Helvetica,Arial,sans-serif;font-size:22px;font-weight:300;line-height:1.3;color:#F1F3F2;letter-spacing:-0.02em;">Ingresa a tus cursos</td></tr>
    <tr><td style="padding:12px 32px 0 32px;font-family:'IBM Plex Sans',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#9AA3A1;">Te enviamos un link para ingresar — sin contraseña. Haz clic para continuar, expira en 1 hora.</td></tr>
    <tr><td align="left" style="padding:28px 32px 0 32px;">
      <a href="${url}" target="_blank" style="display:inline-block;background:${brandColor};color:#0E1214;text-decoration:none;font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;padding:14px 28px;">ingresar →</a>
    </td></tr>
    <tr><td style="padding:24px 32px 0 32px;font-family:'IBM Plex Mono',monospace;font-size:11px;line-height:1.6;color:#6C7573;">Si no solicitaste este correo, puedes ignorarlo. El link solo funciona para ${to}.</td></tr>
    <tr><td style="padding:16px 32px 28px 32px;border-top:1px solid #262E31;margin-top:24px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#565F62;">Grounded Labs · Medellín · grounded-labs.com</td></tr>
  </table>
  <p style="max-width:560px;margin:16px auto 0 auto;font-family:'IBM Plex Mono',monospace;font-size:10px;color:#565F62;text-align:center;">No respondas a este correo (noreply@grounded-labs.com)</p>
</body>
`;
        const text = `Ingresa a Grounded Labs\n${url}\n\nSi no solicitaste este correo, puedes ignorarlo. Expira en 1 hora.`;
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to,
            subject: "Ingresa a Grounded Labs — tu link de acceso",
            html,
            text,
          }),
        });
        if (!res.ok) throw new Error("Resend error: " + JSON.stringify(await res.json()));
      },
    },
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
