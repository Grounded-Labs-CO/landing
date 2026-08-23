// @ts-nocheck
import Resend from "@auth/core/providers/resend";
import { api } from "./_generated/api";

const BRAND_COLOR = "#B4552B";
const FROM = process.env.AUTH_EMAIL_FROM ?? "Grounded Labs <noreply@grounded-labs.com>";

function shellHtml(contentRows) {
  return `
<body style="margin:0;background:#0E1214;padding:32px 16px;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#1C2427;border:1px solid #262E31;">
    <tr><td style="padding:28px 32px 0 32px;">
      <table border="0" cellspacing="0" cellpadding="0"><tr>
        <td style="width:28px;height:28px;background:${BRAND_COLOR};text-align:center;font-family:'IBM Plex Mono',monospace;font-size:16px;font-weight:600;color:#0E1214;line-height:28px;">g</td>
        <td style="padding-left:10px;font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:500;color:#F1F3F2;letter-spacing:0.04em;">grounded<span style="color:#6C7573;">_</span>labs</td>
      </tr></table>
    </td></tr>
    ${contentRows}
    <tr><td style="padding:16px 32px 28px 32px;border-top:1px solid #262E31;margin-top:24px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#565F62;">Grounded Labs · Medellín · grounded-labs.com</td></tr>
  </table>
  <p style="max-width:560px;margin:16px auto 0 auto;font-family:'IBM Plex Mono',monospace;font-size:10px;color:#565F62;text-align:center;">No respondas a este correo (noreply@grounded-labs.com)</p>
</body>
`;
}

function heading(text) {
  return `<tr><td style="padding:28px 32px 0 32px;font-family:'IBM Plex Sans',Helvetica,Arial,sans-serif;font-size:22px;font-weight:300;line-height:1.3;color:#F1F3F2;letter-spacing:-0.02em;">${text}</td></tr>`;
}
function body(text) {
  return `<tr><td style="padding:12px 32px 0 32px;font-family:'IBM Plex Sans',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#9AA3A1;">${text}</td></tr>`;
}
function cta(url, label) {
  return `<tr><td align="left" style="padding:28px 32px 0 32px;">
    <a href="${url}" target="_blank" style="display:inline-block;background:${BRAND_COLOR};color:#0E1214;text-decoration:none;font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;padding:14px 28px;">${label}</a>
  </td></tr>`;
}
function footnote(text) {
  return `<tr><td style="padding:24px 32px 0 32px;font-family:'IBM Plex Mono',monospace;font-size:11px;line-height:1.6;color:#6C7573;">${text}</td></tr>`;
}

function loginHtml(url, to) {
  return shellHtml(
    heading("Ingresa a tus cursos") +
      body("Te enviamos un link para ingresar — sin contraseña. Haz clic para continuar, expira en 1 hora.") +
      cta(url, "ingresar →") +
      footnote(`Si no solicitaste este correo, puedes ignorarlo. El link solo funciona para ${to}.`),
  );
}

function welcomeHtml(url, to, course) {
  const detail = `${course.schedule} · ${course.price}`;
  return shellHtml(
    heading(`Bienvenido al curso ${course.title}`) +
      body(detail) +
      body(
        "Ya podés ingresar a tu cuenta para <span style=\"color:#DDE2E0;\">completar tu perfil</span> y <span style=\"color:#DDE2E0;\">consultar el material del curso</span>.",
      ) +
      cta(url, "entrar a la plataforma →") +
      footnote(`Si no esperabas este correo, puedes ignorarlo. El enlace solo funciona para ${to}.`),
  );
}

async function sendEmail(to, subject, html, text) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AUTH_RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html, text }),
  });
  if (!res.ok) throw new Error("Resend error: " + JSON.stringify(await res.json()));
}

// Proveedor de magic link (Resend). Si el email tiene un curso y aún no está
// verificado (invitado), manda BIENVENIDA con la data del curso; si no, login.
export const resendEmailProvider = {
  ...Resend({ from: FROM, apiKey: process.env.AUTH_RESEND_KEY }),
  sendVerificationRequest: async ({ identifier: to, url }, ctx) => {
    const email = to.toLowerCase();
    let course = null;
    let verified = false;
    try {
      const dc = await ctx.runQuery(api.queries.getEmailContext, { email });
      course = dc?.course ?? null;
      verified = !!dc?.verified;
    } catch {
      // si no se puede resolver el contexto, usar login genérico
    }
    if (course && !verified) {
      const subject = `Bienvenido al curso ${course.title}`;
      await sendEmail(
        to,
        subject,
        welcomeHtml(url, to, course),
        `Bienvenido al curso ${course.title}\n${course.schedule} · ${course.price}\n\nYa podés ingresar a tu cuenta para completar tu perfil y consultar el material del curso.\n${url}`,
      );
    } else {
      await sendEmail(
        to,
        "Ingresa a Grounded Labs — tu link de acceso",
        loginHtml(url, email),
        `Ingresa a Grounded Labs\n${url}\n\nSi no solicitaste este correo, puedes ignorarlo. Expira en 1 hora.`,
      );
    }
  },
};
