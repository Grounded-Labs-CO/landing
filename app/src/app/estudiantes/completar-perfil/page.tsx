"use client";
import { AuthGuard } from "@/components/AuthGuard";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isProfileComplete, resolveFieldValue } from "@/lib/onboarding";

const AI_LEVELS = ["principiante", "intermedio", "avanzado"];
const CONTACT_METHODS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "correo", label: "Correo" },
  { value: "ambos", label: "WhatsApp + correo" },
];

const label = "font-mono text-[11px] tracking-[0.12em] uppercase text-[#6C7573]";
const input =
  "border border-[#262E31] bg-[#0E1214] px-4 py-3 font-mono text-[14px] text-[#F1F3F2] outline-none focus:border-[#B4552B]";

type ProfileProps = {
  profile: { displayName: string | null; phone: string | null; hasPassword: boolean };
  professions: string[];
  aiTools: string[];
};

function ProfileForm({ profile, professions, aiTools }: ProfileProps) {
  const router = useRouter();
  const updateProfile = useMutation(api.profile.updateMyProfile);
  const setMyPassword = useAction(api.profile.setMyPassword);

  const [displayName, setDisplayName] = useState(profile.displayName ?? "");
  const [professionSel, setProfessionSel] = useState("");
  const [professionCustom, setProfessionCustom] = useState("");
  const [aiLevel, setAiLevel] = useState("");
  const [aiToolSel, setAiToolSel] = useState("");
  const [aiToolCustom, setAiToolCustom] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const needsPassword = !profile.hasPassword;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const profession = resolveFieldValue(professionSel, professionCustom);
      const aiTool = resolveFieldValue(aiToolSel, aiToolCustom);
      if (
        !isProfileComplete({ displayName: displayName.trim(), profession, aiLevel, aiTool, contactMethod })
      ) {
        setError("// completa todos los campos");
        setSaving(false);
        return;
      }
      if (needsPassword && password.length < 8) {
        setError("// crea una contraseña de al menos 8 caracteres");
        setSaving(false);
        return;
      }
      if (needsPassword) {
        await setMyPassword({ password });
      }
      await updateProfile({
        displayName: displayName.trim(),
        profession,
        aiLevel: aiLevel as "principiante" | "intermedio" | "avanzado",
        aiTool,
        contactMethod: contactMethod as "whatsapp" | "correo" | "ambos",
        phone: phone.trim() || undefined,
      });
      router.replace("/estudiantes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "// no pudimos guardar tu perfil");
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[560px] px-6 py-16">
      <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">
        Empieza bien
      </span>
      <h1 className="mt-3 font-sans text-[28px] font-light tracking-[-0.02em] text-[#F1F3F2]">
        Completa tu perfil
      </h1>
      <p className="mt-2 font-mono text-[12px] leading-[1.6] text-[#9AA3A1]">
        {"// así te recomendamos los próximos cursos."}
      </p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className={label}>nombre completo</span>
          <input required value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={input} placeholder="Ana María Pérez" />
        </label>

        <label className="flex flex-col gap-2">
          <span className={label}>profesión</span>
          <select required value={professionSel} onChange={(e) => setProfessionSel(e.target.value)} className={input}>
            <option value="">elige…</option>
            {professions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
            <option value="otro">Otro…</option>
          </select>
          {professionSel === "otro" && (
            <input required value={professionCustom} onChange={(e) => setProfessionCustom(e.target.value)} className={input} placeholder="escribe tu profesión" />
          )}
        </label>

        <label className="flex flex-col gap-2">
          <span className={label}>nivel de IA</span>
          <select required value={aiLevel} onChange={(e) => setAiLevel(e.target.value)} className={input}>
            <option value="">elige…</option>
            {AI_LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className={label}>herramienta de IA que usas</span>
          <select required value={aiToolSel} onChange={(e) => setAiToolSel(e.target.value)} className={input}>
            <option value="">elige…</option>
            {aiTools.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
            <option value="otro">Otro…</option>
          </select>
          {aiToolSel === "otro" && (
            <input required value={aiToolCustom} onChange={(e) => setAiToolCustom(e.target.value)} className={input} placeholder="escribe la herramienta" />
          )}
        </label>

        <label className="flex flex-col gap-2">
          <span className={label}>método de contacto</span>
          <select required value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} className={input}>
            <option value="">elige…</option>
            {CONTACT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className={label}>teléfono (whatsapp)</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={input} placeholder="+57 300 123 4567" />
        </label>

        {needsPassword && (
          <label className="flex flex-col gap-2">
            <span className={label}>crear contraseña</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={input} placeholder="mínimo 8 caracteres" />
          </label>
        )}

        {error && (
          <p className="border border-[#3A1C0C] bg-[#1C2427] px-4 py-3 font-mono text-[12px] text-[#E2A084]">{error}</p>
        )}

        <button type="submit" disabled={saving} className="mt-2 bg-[#B4552B] px-6 py-[14px] font-mono text-[12px] font-medium tracking-[0.12em] uppercase text-[#0E1214] hover:bg-[#9A4A24] transition-colors disabled:opacity-60">
          {saving ? "guardando…" : "listo →"}
        </button>
      </form>
    </div>
  );
}

function OnboardingForm() {
  const profile = useQuery(api.profile.getMyProfile);
  const professions = useQuery(api.profile.listProfessions);
  const aiTools = useQuery(api.profile.listAiTools);

  if (profile === undefined || professions === undefined || aiTools === undefined) {
    return (
      <div className="mx-auto max-w-[560px] px-6 py-16">
        <p className="font-mono text-[12px] text-[#6C7573]">cargando…</p>
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="mx-auto max-w-[560px] px-6 py-16">
        <p className="font-mono text-[12px] text-[#6C7573]">inicia sesión para continuar.</p>
      </div>
    );
  }
  return <ProfileForm profile={profile} professions={professions} aiTools={aiTools} />;
}

export default function CompleteProfilePage() {
  return (
    <AuthGuard>
      <OnboardingForm />
    </AuthGuard>
  );
}
