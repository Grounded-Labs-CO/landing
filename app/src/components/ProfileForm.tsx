"use client";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
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

export type ProfileData = {
  email: string | null;
  phone: string | null;
  displayName: string | null;
  profession: string | null;
  aiLevel: string | null;
  aiTool: string | null;
  contactMethod: string | null;
  hasPassword: boolean;
};

export type ProfileFormProps = {
  profile: ProfileData;
  professions: string[];
  aiTools: string[];
  mode: "onboarding" | "edit";
};

function initSelect(stored: string | null, list: string[]): { sel: string; custom: string } {
  if (!stored) return { sel: "", custom: "" };
  if (list.includes(stored)) return { sel: stored, custom: "" };
  return { sel: "otro", custom: stored };
}

export function ProfileForm({ profile, professions, aiTools, mode }: ProfileFormProps) {
  const router = useRouter();
  const updateProfile = useMutation(api.profile.updateMyProfile);
  const setMyPassword = useAction(api.profile.setMyPassword);

  const pInit = initSelect(profile.profession, professions);
  const tInit = initSelect(profile.aiTool, aiTools);

  const [displayName, setDisplayName] = useState(profile.displayName ?? "");
  const [professionSel, setProfessionSel] = useState(pInit.sel);
  const [professionCustom, setProfessionCustom] = useState(pInit.custom);
  const [aiLevel, setAiLevel] = useState(profile.aiLevel ?? "");
  const [aiToolSel, setAiToolSel] = useState(tInit.sel);
  const [aiToolCustom, setAiToolCustom] = useState(tInit.custom);
  const [contactMethod, setContactMethod] = useState(profile.contactMethod ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const needsCreatePassword = !profile.hasPassword;
  const passwordRequired = mode === "onboarding" && needsCreatePassword;
  const passwordActive = passwordRequired || password.length > 0;

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
      if (passwordActive && password.length < 8) {
        setError(passwordRequired ? "// crea una contraseña de al menos 8 caracteres" : "// la contraseña debe tener al menos 8 caracteres");
        setSaving(false);
        return;
      }
      if (passwordActive) {
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
    <form onSubmit={submit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className={label}>nombre completo</span>
        <input required value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={input} placeholder="Ana María Pérez" />
      </label>

      <label className="flex flex-col gap-2">
        <span className={label}>correo</span>
        <input
          value={profile.email ?? ""}
          readOnly
          disabled
          className={input + " cursor-not-allowed border-dashed border-[#2F3A3D] bg-[#111719] text-[#565F62] opacity-80"}
        />
        <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[#565F62]">
          {"// no se puede cambiar"}
        </span>
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

      <label className="flex flex-col gap-2">
        <span className={label}>
          {passwordRequired ? "crear contraseña" : needsCreatePassword ? "crear contraseña (opcional)" : "cambiar contraseña (opcional)"}
        </span>
        <input type="password" required={passwordRequired} value={password} onChange={(e) => setPassword(e.target.value)} className={input} placeholder={passwordRequired ? "mínimo 8 caracteres" : "dejar vacío para no cambiar"} />
      </label>

      {error && (
        <p className="border border-[#3A1C0C] bg-[#1C2427] px-4 py-3 font-mono text-[12px] text-[#E2A084]">{error}</p>
      )}

      <button type="submit" disabled={saving} className="mt-2 bg-[#B4552B] px-6 py-[14px] font-mono text-[12px] font-medium tracking-[0.12em] uppercase text-[#0E1214] hover:bg-[#9A4A24] transition-colors disabled:opacity-60">
        {saving ? "guardando…" : "guardar →"}
      </button>
    </form>
  );
}
