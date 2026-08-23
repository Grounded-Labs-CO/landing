import { describe, expect, it } from "vitest";
import { PROFESSIONS, AI_TOOLS } from "../../scripts/catalog-options.mjs";
import {
  shouldRequireOnboarding,
  isProfileComplete,
  resolveFieldValue,
} from "../lib/onboarding";

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
