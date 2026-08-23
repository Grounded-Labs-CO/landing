"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SignInForm() {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authMethod, setAuthMethod] = useState<"email" | "password">("email");
  const [mode, setMode] = useState<"signIn" | "signUp">(
    searchParams.get("mode") === "signup" ? "signUp" : "signIn",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace("/estudiantes");
  }, [isAuthenticated, router]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn("resend", {
        email: email.trim().toLowerCase(),
      });
      setEmailSent(true);
    } catch {
      setError("No pudimos enviar el correo. Verifica tu email e intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn("password", {
        email: email.trim().toLowerCase(),
        password,
        flow: mode,
      });
    } catch {
      setError(
        mode === "signIn"
          ? "No pudimos validar tu email o contraseña."
          : "No pudimos crear la cuenta. ¿Ese email ya tiene una?",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">Estudiantes</span>
      <h1 className="mt-3 font-sans text-[32px] font-light tracking-[-0.02em] text-[#F1F3F2]">
        {authMethod === "email" ? "Ingresar con correo" : mode === "signIn" ? "Ingresar" : "Crear cuenta"}
      </h1>
      <p className="mt-2 font-sans text-[14px] leading-[1.6] text-[#9AA3A1]">
        {authMethod === "email"
          ? "Te enviamos un link a tu correo para ingresar — sin contraseña."
          : mode === "signIn"
            ? "Accede a tus cursos inscritos y su material."
            : "Reserva tu cupo: creas tu cuenta y queda pendiente hasta registrar el pago."}
      </p>

      {/* Selector de método: Email (default) vs Password (secundario) */}
      <div className="mt-8 flex border border-[#262E31]">
        <button
          type="button"
          onClick={() => {
            setAuthMethod("email");
            setError(null);
            setEmailSent(false);
          }}
          className={`flex-1 px-4 py-3 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors ${
            authMethod === "email" ? "bg-[#1C2427] text-[#F1F3F2]" : "text-[#6C7573] hover:text-[#9AA3A1]"
          }`}
        >
          correo
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMethod("password");
            setError(null);
            setEmailSent(false);
          }}
          className={`flex-1 px-4 py-3 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors border-l border-[#262E31] ${
            authMethod === "password" ? "bg-[#1C2427] text-[#F1F3F2]" : "text-[#6C7573] hover:text-[#9AA3A1]"
          }`}
        >
          contraseña
        </button>
      </div>

      {authMethod === "email" ? (
        <form onSubmit={handleEmailSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#6C7573]">email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="tu@email.com"
              className="border border-[#262E31] bg-[#0E1214] px-4 py-3 font-mono text-[14px] text-[#F1F3F2] outline-none focus:border-[#B4552B]"
            />
          </label>

          {error && (
            <p className="border border-[#3A1C0C] bg-[#1C2427] px-4 py-3 font-mono text-[12px] leading-[1.6] text-[#E2A084]">{error}</p>
          )}

          {emailSent ? (
            <div className="border border-[#1C2427] bg-[#0E1214] px-4 py-4">
              <p className="font-mono text-[12px] leading-[1.7] text-[#DDE2E0]">
                Revisa tu correo — te enviamos un link para ingresar.
              </p>
              <p className="mt-2 font-mono text-[11px] leading-[1.6] text-[#9AA3A1]">
                Si no lo ves, revisa spam. El link expira en 1 hora.
              </p>
              <button
                type="button"
                onClick={() => setEmailSent(false)}
                className="mt-4 font-mono text-[11px] tracking-[0.08em] uppercase text-[#6C7573] hover:text-[#9AA3A1]"
              >
                ← enviar a otro correo
              </button>
            </div>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 bg-[#B4552B] px-6 py-[14px] font-mono text-[12px] font-medium tracking-[0.12em] uppercase text-[#0E1214] hover:bg-[#9A4A24] transition-colors disabled:opacity-60"
            >
              {submitting ? "enviando…" : "enviar link →"}
            </button>
          )}
          <p className="font-mono text-[11px] tracking-[0.08em] leading-[1.7] text-[#565F62]">
            {"// sin contraseña — el link te lleva directo a tus cursos"}
          </p>
        </form>
      ) : (
        <>
          <div className="mt-6 flex border border-[#262E31]">
            <button
              type="button"
              onClick={() => {
                setMode("signIn");
                setError(null);
              }}
              className={`flex-1 px-4 py-3 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors ${
                mode === "signIn" ? "bg-[#1C2427] text-[#F1F3F2]" : "text-[#6C7573] hover:text-[#9AA3A1]"
              }`}
            >
              ingresar
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signUp");
                setError(null);
              }}
              className={`flex-1 px-4 py-3 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors border-l border-[#262E31] ${
                mode === "signUp" ? "bg-[#1C2427] text-[#F1F3F2]" : "text-[#6C7573] hover:text-[#9AA3A1]"
              }`}
            >
              crear cuenta
            </button>
          </div>

          <form onSubmit={handlePasswordSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#6C7573]">email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="border border-[#262E31] bg-[#0E1214] px-4 py-3 font-mono text-[14px] text-[#F1F3F2] outline-none focus:border-[#B4552B]"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#6C7573]">contraseña</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signIn" ? "current-password" : "new-password"}
                className="border border-[#262E31] bg-[#0E1214] px-4 py-3 font-mono text-[14px] text-[#F1F3F2] outline-none focus:border-[#B4552B]"
              />
            </label>

            {error && (
              <p className="border border-[#3A1C0C] bg-[#1C2427] px-4 py-3 font-mono text-[12px] leading-[1.6] text-[#E2A084]">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 bg-[#262E31] px-6 py-[14px] font-mono text-[12px] font-medium tracking-[0.12em] uppercase text-[#9AA3A1] hover:bg-[#2F3A3D] hover:text-[#F1F3F2] transition-colors disabled:opacity-60"
            >
              {submitting ? "un momento…" : mode === "signIn" ? "ingresar →" : "crear cuenta →"}
            </button>
          </form>
          <p className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setAuthMethod("email")}
              className="font-mono text-[11px] tracking-[0.08em] text-[#565F62] hover:text-[#9AA3A1]"
            >
              ← volver a ingresar con correo
            </button>
          </p>
        </>
      )}

      <p className="mt-6 font-mono text-[11px] tracking-[0.08em] leading-[1.7] text-[#565F62]">
        {"// al crear tu cuenta reservas cupo en el workshop; el material"}
        <br />
        {"// se desbloquea cuando se registre tu pago."}
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-6 py-16" />}>
      <SignInForm />
    </Suspense>
  );
}
