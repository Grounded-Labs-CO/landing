// @ts-nocheck
import Resend from "@auth/core/providers/resend";
import { api } from "./_generated/api";
import { MAIL_FROM, sendEmail } from "./mailer";
import { body, cta, footnote, heading, shellHtml } from "./templates";

// Proveedor de magic link (Resend). Si el email tiene un curso y aún no está
// verificado (invitado), manda BIENVENIDA con la data del curso; si no, login.
export const resendEmailProvider = {
  ...Resend({ from: MAIL_FROM, apiKey: process.env.AUTH_RESEND_KEY }),
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
    } else if (!verified) {
      await sendEmail(
        to,
        "Valida tu correo — Grounded Labs",
        validationHtml(url, email),
        `Valida tu correo en Grounded Labs\n${url}\n\nPara activar tu cuenta y completar tu perfil, confirma tu dirección de email. Expira en 1 hora.`,
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

function loginHtml(url, to) {
  return shellHtml(
    heading("Ingresa a tus cursos") +
      body("Te enviamos un link para ingresar — sin contraseña. Haz clic para continuar, expira en 1 hora.") +
      cta(url, "ingresar →") +
      footnote(`Si no solicitaste este correo, puedes ignorarlo. El link solo funciona para ${to}.`),
  );
}

function validationHtml(url, to) {
  return shellHtml(
    heading("Valida tu correo") +
      body(
        "Para activar tu cuenta y <span style=\"color:#DDE2E0;\">completar tu perfil</span>, confirma tu dirección de email. Haz clic en el enlace, expira en 1 hora.",
      ) +
      cta(url, "validar →") +
      footnote(`Si no solicitaste este correo, puedes ignorarlo. El enlace solo funciona para ${to}.`),
  );
}

function welcomeHtml(url, to, course) {
  const SECCIONES = [
    "Qué necesitas saber — fecha, lugar y qué llevar.",
    "Antes de — cómo llegar con la cuenta de IA lista.",
    "Qué documentos traer — la lista (opcional) para practicar con tus datos.",
    "Datos de prueba — un expediente de ejemplo, con su .zip.",
    "Presentación y artículos — el material de la sesión, después del taller.",
    "Links de interés — las herramientas que usamos.",
  ];
  return shellHtml(
    heading(`Bienvenido al curso ${course.title}`) +
      body(`${course.schedule}`) +
      body(
        "Ya podés entrar a tu cuenta. Ahí vas a encontrar, en seis secciones:<br/><br/>" +
          SECCIONES.map((p) => `· <span style="color:#DDE2E0;">${p}</span>`).join("<br/>"),
      ) +
      cta(url, "entrar a la plataforma →") +
      body(
        "Gracias por confiar en nosotros. Si tienes cualquier duda, escríbenos por WhatsApp al <span style=\"color:#DDE2E0;\">+57 323 908 5619</span>.",
      ),
      footnote(`El enlace solo funciona para ${to}. Si no esperabas este correo, puedes ignorarlo.`),
  );
}
