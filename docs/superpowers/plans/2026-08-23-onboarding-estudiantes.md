# Onboarding de cuenta + perfil — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dos caminos de entrada (auto-registro e invitado) convergen en un perfil obligatorio que desbloquea la zona de estudiantes.

**Architecture:** Se extiende `user_profiles` y se agregan tablas `professions`/`ai_tools` (sembradas desde un módulo de catálogo). Un guard `ProfileGuard` redirige al viewer con perfil incompleto a `estudiantes/completar-perfil`. El invitado (autenticado vía magic link) además setea contraseña y teléfono; la contraseña se crea/enlaza sin duplicados vía `createAccount`/`modifyAccountCredentials` de Convex Auth. El admin queda excluido del guard.

**Tech Stack:** Next.js 16 (App Router) + Convex 1.45 + Convex Auth 0.0.95 + Tailwind v4 + Vitest.

**Comandos constantes:**
- Tests: `npm test` (vitest run) — desde `app/`
- Lint: `npm run lint`
- Build: `npm run build`
- Empujar backend a dev: `npx convex dev` / `npx convex dev --once` (desde `app/`)

---

### Task 1: Schema — tablas professions/ai_tools + extender user_profiles

**Files:**
- Modify: `app/convex/schema.ts`

- [ ] **Step 1: Añadir tablas y campos**

En `app/convex/schema.ts`, dentro del `defineSchema`, después del bloque `user_profiles`, reemplazar el bloque existente de `user_profiles` y agregar `professions` y `ai_tools`:

```ts
  // Perfil extendido del usuario (nombre, teléfono, profesión y segmentación IA)
  user_profiles: defineTable({
    userId: v.id("users"),
    displayName: v.optional(v.string()),
    phone: v.optional(v.string()),
    profession: v.optional(v.string()),
    aiLevel: v.optional(
      v.union(v.literal("principiante"), v.literal("intermedio"), v.literal("avanzado")),
    ),
    aiTool: v.optional(v.string()),
    contactMethod: v.optional(v.union(v.literal("whatsapp"), v.literal("correo"), v.literal("ambos"))),
    completed: v.optional(v.boolean()),
  }).index("by_userId", ["userId"]),

  // Profesiones para el dropdown del onboarding (sembradas)
  professions: defineTable({
    order: v.number(),
    label: v.string(),
  }).index("by_order", ["order"]),

  // Herramientas de IA para el dropdown del onboarding (sembradas)
  ai_tools: defineTable({
    order: v.number(),
    label: v.string(),
  }).index("by_order", ["order"]),
```

- [ ] **Step 2: Empujar el schema**

```
Run (desde app/): npx convex dev --once
Expected: compila schema sin errores (actualiza el deployment dev).
```

---

### Task 2: Catálogo de opciones (módulo puro) + test

**Files:**
- Create: `app/scripts/catalog-options.mjs`
- Test: `app/src/test/onboarding.test.ts` (parcial, ver Task 6 para el resto)

- [ ] **Step 1: Escribir el test (falla primero)**

Con la ruta de test existente, crear `app/src/test/onboarding.test.ts` con este bloque (se agregan más en Task 6):

```ts
import { describe, expect, it } from "vitest";
import { PROFESSIONS, AI_TOOLS } from "../../scripts/catalog-options.mjs";

describe("Catálogo de opciones del onboarding", () => {
  it("define 30 profesiones sin duplicados", () => {
    expect(PROFESSIONS).toHaveLength(30);
    expect(new Set(PROFESSIONS).size).toBe(30);
  });

  it("define herramientas de IA conocidas", () => {
    for (const t of ["Claude", "OpenAI (ChatGPT)", "OpenCode", "Gemini"]) {
      expect(AI_TOOLS).toContain(t);
    }
  });
});
```

- [ ] **Step 2: Correr el test (verifica que falle por archivo inexistente)**

```
Run: npm test -- src/test/onboarding.test.ts
Expected: FAIL — no puede resolver ../../scripts/catalog-options.mjs
```

- [ ] **Step 3: Crear `app/scripts/catalog-options.mjs`**

```js
// Catálogo de opciones del onboarding — fuente de la siembra en Convex.
// Editar aquí y correr `npm run seed-course` para actualizar el deployment.

export const PROFESSIONS = [
  "Contador(a)",
  "Auditor(a)",
  "Administrador(a) de empresas",
  "Gerente / Directivo(a)",
  "Emprendedor(a)",
  "Comerciante",
  "Desarrollador(a) de software",
  "Ingeniero(a) de sistemas",
  "Analista de datos",
  "Científico(a) de datos",
  "Ingeniero(a) industrial",
  "Ingeniero(a) civil",
  "Arquitecto(a)",
  "Diseñador(a)",
  "Mercadólogo(a)",
  "Comunicador(a)",
  "Publicista",
  "Abogado(a)",
  "Economista",
  "Analista / Asesor(a) financiero(a)",
  "Profesor(a) / Docente",
  "Médico(a)",
  "Enfermero(a)",
  "Psicólogo(a)",
  "Consultor(a)",
  "Ejecutivo(a) de ventas",
  "Asistente administrativo(a)",
  "Logística / Operaciones",
  "Recursos humanos",
  "Estudiante",
];

export const AI_TOOLS = [
  "Claude",
  "OpenAI (ChatGPT)",
  "OpenCode",
  "Gemini",
  "Copilot",
  "Cursor",
  "Perplexity",
  "Bolt",
  "Lovable",
  "Replit",
];
```

- [ ] **Step 4: Correr el test (pasa)**

```
Run: npm test -- src/test/onboarding.test.ts
Expected: PASS (2 tests)
```

---

### Task 3: Mutation de siembra de opciones + wiring en seed-course.mjs

**Files:**
- Modify: `app/convex/seed.ts`
- Modify: `app/scripts/seed-course.mjs`

- [ ] **Step 1: Añadir `seedCatalogOptions` a `app/convex/seed.ts`**

Agregar al final de `app/convex/seed.ts` (usa `requireSecret` ya existente):

```ts
export const seedCatalogOptions = mutation({
  args: {
    secret: v.string(),
    professions: v.array(v.string()),
    aiTools: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    requireSecret(args);
    await ctx.db.query("professions").collect().then((rows) => rows.map((r) => r._id))
      .then(async (ids) => { for (const id of ids) await ctx.db.delete(id); });
    await ctx.db.query("ai_tools").collect().then((rows) => rows.map((r) => r._id))
      .then(async (ids) => { for (const id of ids) await ctx.db.delete(id); });

    for (const [i, label] of args.professions.entries()) {
      await ctx.db.insert("professions", { order: i, label });
    }
    for (const [i, label] of args.aiTools.entries()) {
      await ctx.db.insert("ai_tools", { order: i, label });
    }
    return { professions: args.professions.length, aiTools: args.aiTools.length };
  },
});
```

- [ ] **Step 2: Wiring en `app/scripts/seed-course.mjs`**

Importar el catálogo y llamar la siembra al final (antes de `console.log("OK — siembra completa")`):

```js
import { COURSE, SECTIONS, PROFILES, CATEGORY_LABELS, PROFESSIONS, AI_TOOLS } from "./course-definition.mjs";
```
(esto reemplaza la línea de import actual de `./course-definition.mjs`; `PROFESSIONS` y `AI_TOOLS` vienen de `catalog-options.mjs`, ver Step 3.)

Y justo después del bloque de upload de archivos, agregar:

```js
await call("seed:seedCatalogOptions", { secret, professions: PROFESSIONS, aiTools: AI_TOOLS });
console.log(`catálogo: ${PROFESSIONS.length} profesiones · ${AI_TOOLS.length} herramientas de IA`);
```

- [ ] **Step 3: Importar catálogo correcto**

En `app/scripts/seed-course.mjs`, cambiar la línea:
```js
import { COURSE, SECTIONS, PROFILES, CATEGORY_LABELS } from "./course-definition.mjs";
```
por:
```js
import { COURSE, SECTIONS, PROFILES, CATEGORY_LABELS } from "./course-definition.mjs";
import { PROFESSIONS, AI_TOOLS } from "./catalog-options.mjs";
```

- [ ] **Step 4: Empujar backend + siembra**

```
Run (desde app/): npx convex dev --once
Run (desde app/, requiere ADMIN_BOOTSTRAP_SECRET): npm run seed-course -- --secret <SECRET>
Expected: log "catálogo: 30 profesiones · 10 herramientas de IA" y "OK — siembra completa"
```

---

### Task 4: Backend de perfil — queries, mutation y action

**Files:**
- Create: `app/convex/profile.ts`

- [ ] **Step 1: Crear `app/convex/profile.ts`**

```ts
import { action, mutation, query } from "./_generated/server";
import { getAuthUserId, createAccount, modifyAccountCredentials } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const listProfessions = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("professions").collect();
    return rows.sort((a, b) => a.order - b.order).map((r) => r.label);
  },
});

export const listAiTools = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("ai_tools").collect();
    return rows.sort((a, b) => a.order - b.order).map((r) => r.label);
  },
});

export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId).eq("provider", "password"))
      .collect();
    const p = profile ?? {};
    return {
      email: user?.email ?? null,
      phone: (user as any)?.phone ?? null,
      displayName: p.displayName ?? null,
      profession: p.profession ?? null,
      aiLevel: p.aiLevel ?? null,
      aiTool: p.aiTool ?? null,
      contactMethod: p.contactMethod ?? null,
      completed: p.completed === true,
      hasPassword: accounts.length > 0,
    };
  },
});

export const hasPassword = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", args.userId).eq("provider", "password"))
      .collect();
    return accounts.length > 0;
  },
});

export const getUserEmail = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const u = await ctx.db.get(args.userId);
    return { email: u?.email ?? null };
  },
});

export const updateMyProfile = mutation({
  args: {
    displayName: v.string(),
    profession: v.string(),
    aiLevel: v.union(v.literal("principiante"), v.literal("intermedio"), v.literal("avanzado")),
    aiTool: v.string(),
    contactMethod: v.union(v.literal("whatsapp"), v.literal("correo"), v.literal("ambos")),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("No autenticado");
    const existing = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    const data = {
      userId,
      displayName: args.displayName,
      profession: args.profession,
      aiLevel: args.aiLevel,
      aiTool: args.aiTool,
      contactMethod: args.contactMethod,
      phone: args.phone,
      completed: true,
    };
    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("user_profiles", data);
    }
    if (args.phone) {
      await ctx.db.patch(userId, { name: args.displayName, phone: args.phone } as any);
    } else {
      await ctx.db.patch(userId, { name: args.displayName } as any);
    }
    return true;
  },
});

export const setMyPassword = action({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    if (args.password.length < 8) throw new Error("Mínimo 8 caracteres");
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("No autenticado");
    const { email } = await ctx.runQuery(api.profile.getUserEmail, { userId });
    if (!email) throw new Error("Usuario sin email");
    const e = email.toLowerCase();
    const already = await ctx.runQuery(api.profile.hasPassword, { userId });
    if (already) {
      await modifyAccountCredentials(ctx, {
        provider: "password",
        account: { id: e, secret: args.password },
      });
    } else {
      await createAccount(ctx, {
        provider: "password",
        account: { id: e, secret: args.password },
        profile: { email: e } as any,
        shouldLinkViaEmail: true,
      });
    }
    return true;
  },
});
```

Nota: `profile.ts` necesita `import { api } from "./_generated/api";` para `ctx.runQuery(api.profile...)`. Añadir al inicio:
```ts
import { api } from "./_generated/api";
```

- [ ] **Step 2: Empujar backend**

```
Run (desde app/): npx convex dev --once
Expected: compila sin errores.
```

---

### Task 5: Persistir teléfono en el auto-registro

**Files:**
- Modify: `app/convex/auth.ts`
- Modify: `app/src/app/signin/page.tsx`

- [ ] **Step 1: Añadir callback `profile` al provider `Password` en `app/convex/auth.ts`**

Cambiar `Password,` (línea 62) por:

```ts
    Password({
      profile: (params) => ({
        email: (params.email as string)?.toLowerCase(),
        ...(params.phone ? { phone: params.phone as string } : {}),
      }),
    }),
```

- [ ] **Step 2: Pasar `phone` al signIn de password en `app/src/app/signin/page.tsx`**

En `handlePasswordSubmit`, cambiar:
```ts
      await signIn("password", {
        email: email.trim().toLowerCase(),
        password,
        flow: mode,
      });
```
por:
```ts
      await signIn("password", {
        email: email.trim().toLowerCase(),
        password,
        flow: mode,
        phone: mode === "signUp" && phone.trim() ? phone.trim() : undefined,
      });
```

- [ ] **Step 3: Empujar backend**

```
Run (desde app/): npx convex dev --once
Expected: compila sin errores.
```

---

### Task 6: Helpers puros del onboarding + tests

**Files:**
- Create: `app/src/lib/onboarding.ts`
- Test: `app/src/test/onboarding.test.ts` (agrega bloque)

- [ ] **Step 1: Escribir los tests (fallan primero)**

Agregar a `app/src/test/onboarding.test.ts`:

```ts
import {
  shouldRequireOnboarding,
  isProfileComplete,
  resolveFieldValue,
} from "../lib/onboarding";

describe("Onboarding helpers", () => {
  it("exige perfil solo a los viewer con perfil incompleto", () => {
    expect(shouldRequireOnboarding({ isAdmin: false, isPending: false, completed: false })).toBe(true);
    expect(shouldRequireOnboarding({ isAdmin: true, completed: false })).toBe(false);
    expect(shouldRequireOnboarding({ isAdmin: false, completed: true })).toBe(false);
  });

  it("considera completo un perfil con los 5 campos", () => {
    expect(
      isProfileComplete({
        displayName: "Ana",
        profession: "Contador(a)",
        aiLevel: "intermedio",
        aiTool: "Claude",
        contactMethod: "whatsapp",
      }),
    ).toBe(true);
    expect(isProfileComplete({ displayName: "Ana", profession: "", aiLevel: null, aiTool: null, contactMethod: null })).toBe(false);
  });

  it("resuelve el valor de un <select> con 'Otro'", () => {
    expect(resolveFieldValue("otro", "Mi profesión")).toBe("Mi profesión");
    expect(resolveFieldValue("Claude", "")).toBe("Claude");
  });
});
```

- [ ] **Step 2: Correr (falla por helpers inexistentes)**

```
Run: npm test -- src/test/onboarding.test.ts
Expected: FAIL — cannot resolve ../lib/onboarding
```

- [ ] **Step 3: Crear `app/src/lib/onboarding.ts`**

```ts
export type OnboardingProfile = {
  displayName: string | null | undefined;
  profession: string | null | undefined;
  aiLevel: string | null | undefined;
  aiTool: string | null | undefined;
  contactMethod: string | null | undefined;
};

export type OnboardingViewer = {
  isAdmin: boolean;
  isPending?: boolean;
  completed: boolean;
};

export function shouldRequireOnboarding({ isAdmin, completed }: OnboardingViewer): boolean {
  return !isAdmin && completed !== true;
}

export function isProfileComplete(p: OnboardingProfile): boolean {
  return !!(p.displayName && p.profession && p.aiLevel && p.aiTool && p.contactMethod);
}

export function resolveFieldValue(selectValue: string, custom: string): string {
  return selectValue !== "otro" ? selectValue : custom.trim();
}
```

Nota: el test usa `shouldRequireOnboarding({ isAdmin: false, isPending: false, completed: false })`. La implementación ignora `isPending`; el test solo requiere que con viewer+incompleto devuelva true. OK.

- [ ] **Step 4: Correr (pasa)**

```
Run: npm test -- src/test/onboarding.test.ts
Expected: PASS (2 describes)
```

---

### Task 7: Página de onboarding `/estudiantes/completar-perfil`

**Files:**
- Create: `app/src/app/estudiantes/completar-perfil/page.tsx`

- [ ] **Step 1: Crear la página**

Formulario tipo onboarding, estilo brand (mono/terracota). Usa `useQuery(api.profile.getMyProfile)`, `useQuery(api.profile.listProfessions)`, `useQuery(api.profile.listAiTools)`, `useMutation(api.profile.updateMyProfile)` y, si `!hasPassword`, `useAction(api.profile.setMyPassword)`.

```tsx
"use client";
import { AuthGuard } from "@/components/AuthGuard";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { resolveFieldValue } from "@/lib/onboarding";

const AI_LEVELS = ["principiante", "intermedio", "avanzado"];
const CONTACT_METHODS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "correo", label: "Correo" },
  { value: "ambos", label: "WhatsApp + correo" },
];

const label = "font-mono text-[11px] tracking-[0.12em] uppercase text-[#6C7573]";
const input =
  "border border-[#262E31] bg-[#0E1214] px-4 py-3 font-mono text-[14px] text-[#F1F3F2] outline-none focus:border-[#B4552B]";

function OnboardingForm() {
  const router = useRouter();
  const profile = useQuery(api.profile.getMyProfile);
  const professions = useQuery(api.profile.listProfessions);
  const aiTools = useQuery(api.profile.listAiTools);
  const updateProfile = useMutation(api.profile.updateMyProfile);
  const setMyPassword = useAction(api.profile.setMyPassword);

  const [displayName, setDisplayName] = useState("");
  const [professionSel, setProfessionSel] = useState("");
  const [professionCustom, setProfessionCustom] = useState("");
  const [aiLevel, setAiLevel] = useState("");
  const [aiToolSel, setAiToolSel] = useState("");
  const [aiToolCustom, setAiToolCustom] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const prefilled = useRef(false);

  useEffect(() => {
    if (prefilled.current || profile === undefined || !profile) return;
    prefilled.current = true;
    if (profile.displayName) setDisplayName(profile.displayName);
    if (profile.phone) setPhone(profile.phone);
  }, [profile]);

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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const profession = resolveFieldValue(professionSel, professionCustom);
      const aiTool = resolveFieldValue(aiToolSel, aiToolCustom);
      if (!displayName.trim() || !profession || !aiLevel || !aiTool || !contactMethod) {
        setError("// completa todos los campos");
        setSaving(false);
        return;
      }
      if (!profile.hasPassword && password.length < 8) {
        setError("// crea una contraseña de al menos 8 caracteres");
        setSaving(false);
        return;
      }
      if (!profile.hasPassword) {
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
    } catch (err: any) {
      setError(err?.message ?? "// no pudimos guardar tu perfil");
      setSaving(false);
    }
  }

  const needsPassword = !profile.hasPassword;

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
            {(professions ?? []).map((p) => (
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
            {(aiTools ?? []).map((t) => (
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

export default function CompleteProfilePage() {
  return (
    <AuthGuard>
      <OnboardingForm />
    </AuthGuard>
  );
}
```

Nota: el proyecto usa `useAction` desde `convex/react` (la API de Convex para actions). Verificar que la importación de `useAction` exista:
```ts
import { useAction, useMutation, useQuery } from "convex/react";
```

- [ ] **Step 2: Build**

```
Run: npm run build
Expected: compila y genera la ruta /estudiantes/completar-perfil.
```

---

### Task 8: ProfileGuard + wiring en /estudiantes y curso

**Files:**
- Create: `app/src/components/ProfileGuard.tsx`
- Modify: `app/src/app/estudiantes/page.tsx`
- Modify: `app/src/app/estudiantes/cursos/[slug]/page.tsx`

- [ ] **Step 1: Crear `app/src/components/ProfileGuard.tsx`**

```tsx
"use client";
import { AuthGuard } from "@/components/AuthGuard";
import { useRole } from "@/hooks/useRole";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { api } from "../../convex/_generated/api";
import { shouldRequireOnboarding } from "@/lib/onboarding";

export function ProfileGuard({ children }: { children: ReactNode }) {
  const { isAdmin, isLoading: roleLoading } = useRole();
  const profile = useQuery(api.profile.getMyProfile);
  const router = useRouter();

  useEffect(() => {
    if (roleLoading || profile === undefined) return;
    if (shouldRequireOnboarding({ isAdmin, completed: profile.completed })) {
      router.replace("/estudiantes/completar-perfil");
    }
  }, [roleLoading, profile, isAdmin, router]);

  if (roleLoading || profile === undefined) {
    return <div className="p-8 font-mono text-[12px] text-[#565F62]">cargando…</div>;
  }
  if (shouldRequireOnboarding({ isAdmin, completed: profile.completed })) return null;
  return <>{children}</>;
}
```

- [ ] **Step 2: Envolver `/estudiantes` con ProfileGuard**

En `app/src/app/estudiantes/page.tsx`, cambiar el export default:

```tsx
export default function EstudiantesPage() {
  return (
    <AuthGuard>
      <ProfileGuard>
        <StudentHome />
      </ProfileGuard>
    </AuthGuard>
  );
}
```
y añadir el import `import { ProfileGuard } from "@/components/ProfileGuard";`.

- [ ] **Step 3: Envolver la página del curso con ProfileGuard**

En `app/src/app/estudiantes/cursos/[slug]/page.tsx`, cambiar:

```tsx
export default function CourseMaterialPage() {
  return (
    <AuthGuard>
      <CourseMaterial />
    </AuthGuard>
  );
}
```
por:
```tsx
export default function CourseMaterialPage() {
  return (
    <AuthGuard>
      <ProfileGuard>
        <CourseMaterial />
      </ProfileGuard>
    </AuthGuard>
  );
}
```
y añadir `import { ProfileGuard } from "@/components/ProfileGuard";`.

- [ ] **Step 4: Build + verificación**

```
Run: npm run build
Expected: compila sin errores.
```

---

### Task 9: Verificación final

**Files:**
- N/A

- [ ] **Step 1: Tests**

```
Run: npm test
Expected: PASS (todos los tests, incluidos onboarding.test.ts).
```

- [ ] **Step 2: Build**

```
Run: npm run build
Expected: PASS.
```

- [ ] **Step 3: Lint (solo mis archivos nuevos)**

```
Run: npx eslint src/lib/onboarding.ts src/app/estudiantes/completar-perfil/page.tsx src/components/ProfileGuard.tsx convex/profile.ts
Expected: sin errores (los errores preexistentes en admin.ts/admin/page.tsx quedan fuera).
```

- [ ] **Step 4: Verificación manual del flujo**

1. Nuevo usuario: `/signin` → crear cuenta (email/pass/phone) → debe aterrizar en `/estudiantes/completar-perfil` → completar → `/estudiantes`.
2. Invitado: admin lo invita con email → invitado entra a `/signin` → magic link → onboarding → se le pide contraseña + teléfono → completa → ve su curso.
3. Admin: no se le exige onboarding; sigue viendo `/admin` y `/estudiantes`.

---

## Self-Review

- **Cobertura del spec:** perfil obligatorio (Task 6/7/8), invitado con contraseña+teléfono (Task 5/7), drop de profesiones/ai_tools desde BD (Task 2/3/4), método de contacto y nivel IA (Task 4/7), admin excluido (Task 8), tablas y campos (Task 1), persistir phone en auto-registro (Task 5).
- **Consistencia de tipos:** `updateMyProfile` espera `aiLevel`/`contactMethod` como unions — el form las castea. `getMyProfile` devuelve `completed` booleano y `hasPassword` booleano, usados por guard/form.
- **Sin placeholders:** todas las tareas traen código y comandos exactos.
