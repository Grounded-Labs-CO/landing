import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  DELETE_COURSE_CONFIRM,
  buildCourseDoc,
  buildFollowupDoc,
  collectStorageIds,
  normalizeSlug,
  remapStorage,
} from "../../convex/cloneCourse";
import type { Id } from "../../convex/_generated/dataModel";
import { DeleteCourseDialog } from "@/components/DeleteCourseDialog";

const preview = vi.hoisted(() => ({
  value: undefined as unknown,
  deleteFn: undefined as unknown,
}));

vi.mock("convex/react", async () => {
  const actual = await vi.importActual<typeof import("convex/react")>("convex/react");
  return {
    ...actual,
    useQuery: () => preview.value,
    useMutation: () => preview.deleteFn as never,
  };
});

const course = {
  _id: "c1",
  _creationTime: 1,
  slug: "finanzas",
  title: "Finanzas",
  tagline: "t",
  schedule: "26 sep",
  price: "$400.000",
  eventInfo: [],
  status: "completed",
  brochureStorageId: "s-broch",
  calendarUrl: "https://cal",
};

describe("lógica de clonado", () => {
  it("valida el slug", () => {
    expect(normalizeSlug("  Finanzas-2 ")).toBe("finanzas-2");
    expect(() => normalizeSlug("con espacio")).toThrow();
    expect(() => normalizeSlug("")).toThrow();
  });

  it("junta los storageId sin repetir", () => {
    const ids = collectStorageIds({
      course,
      sections: [],
      items: [{ storageId: "a", imageStorageId: "b" }, { storageId: "a" }],
      profiles: [{ photoStorageId: "p", zipStorageId: undefined }],
      files: [{ storageId: "f" }],
      followup: null,
    });
    expect(ids.sort()).toEqual(["a", "b", "f", "p", "s-broch"].sort());
  });

  it("remapea y falla si falta la copia", () => {
    const map = new Map([["a", "A"]]);
    expect(remapStorage({ storageId: "a", x: 1 }, map)).toEqual({ storageId: "A", x: 1 });
    expect(() => remapStorage({ storageId: "z" }, map)).toThrow("No se pudo copiar un archivo");
  });

  it("el curso clonado queda deshabilitado, sin calendario y con el brochure copiado", () => {
    const doc = buildCourseDoc(course, { slug: "finanzas-2", title: "Finanzas II" }, new Map([["s-broch", "N"]]));
    expect(doc).toMatchObject({ slug: "finanzas-2", title: "Finanzas II", status: "disabled", brochureStorageId: "N", schedule: "26 sep", price: "$400.000" });
    expect(doc).not.toHaveProperty("calendarUrl");
    expect(doc).not.toHaveProperty("_id");
    const o = buildCourseDoc(course, { slug: "x", title: "T", schedule: "3 oct", price: "$1" }, new Map([["s-broch", "N"]]));
    expect(o).toMatchObject({ schedule: "3 oct", price: "$1" });
  });

  it("la sesión de follow-up no arrastra fecha ni link", () => {
    const f = buildFollowupDoc(
      { title: "S", agenda: ["a"], durationMinutes: 60, date: "2026-10-08", startTime: "19:00", joinUrl: "https://z" },
      "finanzas-2",
      5,
    );
    expect(f).toEqual({ courseSlug: "finanzas-2", title: "S", agenda: ["a"], durationMinutes: 60, updatedAt: 5 });
  });
});

describe("DeleteCourseDialog", () => {
  const target = { _id: "c1" as Id<"courses">, title: "Finanzas", slug: "finanzas" };
  beforeEach(() => {
    preview.deleteFn = vi.fn(async () => ({}));
    preview.value = { sections: 6, items: 40, profiles: 1, files: 17, blocked: false, blockers: { registrations: 0, invites: 0, responses: 0 } };
  });

  it("el botón solo se habilita con el texto exacto", () => {
    render(<DeleteCourseDialog course={target} onClose={() => {}} />);
    const btn = screen.getByRole("button", { name: /eliminar este curso/i });
    expect(btn).toBeDisabled();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "eliminar" } });
    expect(btn).toBeDisabled();
    fireEvent.change(input, { target: { value: DELETE_COURSE_CONFIRM } });
    expect(btn).toBeEnabled();
  });

  it("si está bloqueado no ofrece confirmar", () => {
    preview.value = { ...(preview.value as object), blocked: true, blockers: { registrations: 3, invites: 0, responses: 0 } };
    render(<DeleteCourseDialog course={target} onClose={() => {}} />);
    expect(screen.getByText(/No se puede eliminar/)).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.getByRole("button", { name: /eliminar este curso/i })).toBeDisabled();
  });
});
