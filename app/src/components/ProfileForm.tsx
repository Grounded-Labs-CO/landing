"use client";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isProfileComplete, resolveFieldValue } from "@/lib/onboarding";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PhoneInput } from "@/components/PhoneInput";
import { DropdownSelect } from "@/components/DropdownSelect";
import { Mail, MessagesSquare } from "lucide-react";

const AI_LEVELS = ["principiante", "intermedio", "avanzado"];

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const CONTACT_METHODS = [
  { value: "whatsapp", label: "WhatsApp", icon: WhatsappIcon },
  { value: "correo", label: "Correo", icon: Mail },
  { value: "ambos", label: "Ambos", icon: MessagesSquare },
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
        <span className={label}>teléfono (whatsapp)</span>
        <PhoneInput value={phone ?? ""} onChange={(v) => setPhone(v)} placeholder="300 123 4567" />
      </label>

      <label className="flex flex-col gap-2">
        <span className={label}>método de contacto</span>
        <RadioGroup
          value={contactMethod}
          onValueChange={(v) => setContactMethod(v as "whatsapp" | "correo" | "ambos")}
          className="grid gap-2 sm:grid-cols-3"
        >
          {CONTACT_METHODS.map((m) => {
            const Icon = m.icon;
            const active = contactMethod === m.value;
            return (
              <label
                key={m.value}
                onClick={() => setContactMethod(m.value as "whatsapp" | "correo" | "ambos")}
                className={`flex cursor-pointer items-center justify-center gap-2 border px-4 py-3 transition-colors ${
                  active
                    ? "border-[#B4552B] bg-[#1C2427]"
                    : "border-[#262E31] bg-[#0E1214] hover:border-[#9AA3A1]"
                }`}
              >
                <RadioGroupItem value={m.value} className="sr-only" />
                <Icon className={`size-4 ${active ? "text-[#B4552B]" : "text-[#9AA3A1]"}`} />
                <span className="font-mono text-[13px] text-[#F1F3F2]">{m.label}</span>
              </label>
            );
          })}
        </RadioGroup>
      </label>

      <label className="flex flex-col gap-2">
        <span className={label}>
          {passwordRequired ? "crear contraseña" : needsCreatePassword ? "crear contraseña (opcional)" : "cambiar contraseña (opcional)"}
        </span>
        <input type="password" required={passwordRequired} value={password} onChange={(e) => setPassword(e.target.value)} className={input} placeholder={passwordRequired ? "mínimo 8 caracteres" : "dejar vacío para no cambiar"} />
      </label>

      <label className="flex flex-col gap-2">
        <span className={label}>profesión</span>
        <DropdownSelect
          options={[
            ...professions.map((p) => ({ value: p, label: p })),
            { value: "otro", label: "Otro…" },
          ]}
          value={professionSel}
          onChange={(v) => setProfessionSel(v)}
          placeholder="elige…"
        />
        {professionSel === "otro" && (
          <input required value={professionCustom} onChange={(e) => setProfessionCustom(e.target.value)} className={input} placeholder="escribe tu profesión" />
        )}
      </label>

      <label className="flex flex-col gap-2">
        <span className={label}>nivel de IA</span>
        <DropdownSelect
          options={AI_LEVELS.map((l) => ({ value: l, label: l }))}
          value={aiLevel}
          onChange={(v) => setAiLevel(v)}
          placeholder="elige…"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={label}>herramienta de IA que usas</span>
        <DropdownSelect
          options={[
            ...aiTools.map((t) => ({ value: t, label: t })),
            { value: "otro", label: "Otro…" },
          ]}
          value={aiToolSel}
          onChange={(v) => setAiToolSel(v)}
          placeholder="elige…"
        />
        {aiToolSel === "otro" && (
          <input required value={aiToolCustom} onChange={(e) => setAiToolCustom(e.target.value)} className={input} placeholder="escribe la herramienta" />
        )}
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
