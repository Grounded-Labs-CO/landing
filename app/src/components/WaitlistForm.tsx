"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SUPPORT_WHATSAPP_URL } from "@/components/SupportLine";

const WA_TEXT = encodeURIComponent(
  "Hola, quiero que me avisen cuando abran la próxima edición del workshop de finanzas personales con IA.",
);

const TONES = {
  dark: {
    input:
      "border-[#262E31] bg-[#0E1214] text-[#F1F3F2] placeholder:text-[#565F62] focus:border-[#B4552B]",
    button: "bg-[#B4552B] text-[#0E1214] hover:bg-[#9A4A24]",
    note: "text-[#6C7573]",
    success: "text-[#7FC7A3]",
    error: "text-[#E2A084]",
    link: "text-[#9AA3A1] hover:text-[#F1F3F2]",
  },
  terracota: {
    input:
      "border-[#0E1214]/40 bg-[#0E1214]/10 text-[#0E1214] placeholder:text-[#3A1C0C]/60 focus:border-[#0E1214]",
    button: "bg-[#0E1214] text-[#F1F3F2] hover:bg-[#1C2427]",
    note: "text-[#3A1C0C]/80",
    success: "text-[#0E1214]",
    error: "text-[#3A1C0C]",
    link: "text-[#3A1C0C] hover:text-[#0E1214]",
  },
} as const;

// Lista de espera para la próxima edición (post-workshop): guarda el correo en
// `leads` (mutación pública, sin auth). Si el guardado falla, ofrecemos WhatsApp.
export function WaitlistForm({
  source,
  tone = "dark",
  className = "",
}: {
  source: string;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  const createLead = useMutation(api.mutations.createLead);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const t = TONES[tone];

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      await createLead({ email: value, source });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <p className={`font-mono text-[12px] leading-[1.7] ${t.success}`}>
          {"// listo — te avisamos cuando abramos la próxima edición."}
        </p>
        <a
          href={`${SUPPORT_WHATSAPP_URL}?text=${WA_TEXT}`}
          target="_blank"
          rel="noreferrer"
          className={`self-start font-mono text-[10px] tracking-[0.12em] uppercase underline decoration-current/30 underline-offset-4 transition-colors ${t.link}`}
        >
          escribir por WhatsApp ↗
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`flex flex-col gap-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="tu@correo.com"
          aria-label="Correo para avisarte de la próxima edición"
          className={`min-w-0 flex-1 border px-3 py-3 font-mono text-[12px] outline-none transition-colors ${t.input}`}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className={`shrink-0 px-5 py-3 font-mono text-[11px] font-medium tracking-[0.12em] uppercase transition-colors disabled:opacity-60 ${t.button}`}
        >
          {status === "sending" ? "guardando…" : "avísenme →"}
        </button>
      </div>
      {status === "error" ? (
        <p className={`font-mono text-[11px] leading-[1.6] ${t.error}`}>
          {"// revisa el correo e inténtalo de nuevo — o escríbenos por "}
          <a
            href={`${SUPPORT_WHATSAPP_URL}?text=${WA_TEXT}`}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            WhatsApp
          </a>
        </p>
      ) : (
        <p className={`font-mono text-[10px] leading-[1.6] ${t.note}`}>
          {"// sin spam: solo te avisamos de la próxima edición."}
        </p>
      )}
    </form>
  );
}
