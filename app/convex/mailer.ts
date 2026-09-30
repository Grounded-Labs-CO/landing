// @ts-nocheck
// Transporte de correo: únicamente lo que necesita el servidor (la clave de
// Resend, el remitente y el `fetch`). Las **plantillas** viven en
// `./templates.ts`, que es puro y lo puede importar también el preview del
// admin — así lo que se ve en /admin es exactamente lo que sale.

export const MAIL_FROM =
  process.env.AUTH_EMAIL_FROM ?? "Grounded Labs <noreply@grounded-labs.com>";

/** Base pública del sitio. `SITE_URL` es la fuente de verdad; hay fallback. */
export function siteUrl() {
  return (process.env.SITE_URL ?? "https://grounded-labs.com").replace(/\/+$/, "");
}

/** Manda el correo. Lanza si Resend responde con error. */
export async function sendEmail(to, subject, html, text) {
  const key = process.env.AUTH_RESEND_KEY;
  if (!key) throw new Error("Falta AUTH_RESEND_KEY en el deployment");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: MAIL_FROM, to, subject, html, text }),
  });
  if (!res.ok) throw new Error("Resend error: " + JSON.stringify(await res.json()));
}
