import type { Metadata } from "next";
import { SurveyFlow } from "@/components/SurveyFlow";

// Página pública: la encuesta no pide login. El link que llega por correo trae
// `?t=<token>` y con eso el nombre y el correo ya vienen puestos.
export const metadata: Metadata = {
  title: "Encuesta de cierre — Grounded Labs",
  description:
    "Encuesta de 3 minutos sobre el workshop. Son preguntas de un toque y nos ayudan a mejorar la sesión de follow-up.",
  robots: { index: false, follow: false },
};

export default async function EncuestaPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.t) ? params.t[0] : params.t;
  const token = typeof raw === "string" && /^[a-f0-9]{16,64}$/.test(raw) ? raw : undefined;

  // El header global queda (es la marca y sirve de salida), así que la
  // encuesta vive en el flujo normal y solo se le descuenta su alto (64px).
  return (
    <div className="[--survey-top:64px]">
      <SurveyFlow token={token} />
    </div>
  );
}