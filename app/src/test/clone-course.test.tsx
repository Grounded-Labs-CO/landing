import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  DELETE_COURSE_CONFIRM,
  buildCourseDoc,
  buildFollowupDoc,
  collectStorageIds,
  normalizeSlug,
  remapStorage,
  stripSystem,
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

  it("curso sin brochure: no inventa brochureStorageId y no exige copia", () => {
    const sinBrochure: Record<string, unknown> = { ...course };
    delete sinBrochure.brochureStorageId;
    const doc = buildCourseDoc(sinBrochure, { slug: "x", title: "T" }, new Map());
    expect(doc).not.toHaveProperty("brochureStorageId");
    expect(doc.status).toBe("disabled");
  });

  it("brochureStorageId vacío/undefined no se trata como archivo", () => {
    const doc = buildCourseDoc({ ...course, brochureStorageId: undefined }, { slug: "x", title: "T" }, new Map());
    expect(doc.brochureStorageId).toBeUndefined();
    expect(collectStorageIds({ course: { ...course, brochureStorageId: undefined }, sections: [], items: [], profiles: [], files: [], followup: null })).toEqual([]);
  });

  it("sin followup, con ítems sin storage y perfiles sin zip: no hay ids que copiar", () => {
    const tree = {
      course: { ...course, brochureStorageId: undefined },
      sections: [{ _id: "s1" }],
      items: [{ title: "link", url: "https://x" }, { title: "doc", storageId: undefined }],
      profiles: [{ photoStorageId: undefined, introStorageId: undefined, zipStorageId: undefined }],
      files: [],
      followup: null,
    };
    expect(collectStorageIds(tree)).toEqual([]);
  });

  it("perfil con foto pero sin zip: remapea solo lo que existe", () => {
    const out = remapStorage({ photoStorageId: "p", zipStorageId: undefined, name: "A" }, new Map([["p", "P"]]));
    expect(out).toEqual({ photoStorageId: "P", zipStorageId: undefined, name: "A" });
  });

  it("collectStorageIds incluye imageStorageId, intro y zip de perfiles, y brochure", () => {
    const ids = collectStorageIds({
      course,
      sections: [],
      items: [{ imageStorageId: "img" }],
      profiles: [{ introStorageId: "intro", zipStorageId: "zip", photoStorageId: "foto" }],
      files: [],
      followup: null,
    });
    expect(ids.sort()).toEqual(["foto", "img", "intro", "s-broch", "zip"].sort());
  });

  it("el mismo blob usado en varios campos se copia una sola vez", () => {
    const ids = collectStorageIds({
      course: { ...course, brochureStorageId: "x" },
      sections: [],
      items: [{ storageId: "x" }],
      profiles: [{ zipStorageId: "x" }],
      files: [{ storageId: "x" }],
      followup: null,
    });
    expect(ids).toEqual(["x"]);
  });

  it("slug: mayúsculas se normalizan, espacios internos y símbolos se rechazan", () => {
    expect(normalizeSlug("FINANZAS-2")).toBe("finanzas-2");
    expect(normalizeSlug("\tfinanzas-2\n")).toBe("finanzas-2");
    for (const bad of ["finanzas 2", "finanzas_2", "ñandú", "a/b", "a.b", "   ", "../x", "x?y=1", "x\ny"]) {
      expect(() => normalizeSlug(bad), bad).toThrow("Slug solo a-z, 0-9 y -");
    }
  });

  it("slug: entradas no string (undefined/null) lanzan el error de slug, no un TypeError", () => {
    expect(() => normalizeSlug(undefined as unknown as string)).toThrow("Slug solo");
    expect(() => normalizeSlug(null as unknown as string)).toThrow("Slug solo");
  });

  it("slug: hoy se aceptan guiones sueltos ('-', '--', '-a-') [comportamiento documentado, ver informe]", () => {
    expect(normalizeSlug("-")).toBe("-");
    expect(normalizeSlug("-a-")).toBe("-a-");
  });

  it("schedule/precio vacíos o solo espacios caen al del origen", () => {
    const doc = buildCourseDoc(course, { slug: "x", title: "T", schedule: "   ", price: "" }, new Map([["s-broch", "N"]]));
    expect(doc).toMatchObject({ schedule: "26 sep", price: "$400.000" });
  });

  it("buildCourseDoc no muta el original y conserva eventInfo y tagline", () => {
    const original = { ...course, eventInfo: [{ label: "Sede", value: "Tinkko", url: "https://m" }] };
    const copy = JSON.parse(JSON.stringify(original));
    const doc = buildCourseDoc(original, { slug: "x", title: "T" }, new Map([["s-broch", "N"]]));
    expect(original).toEqual(copy);
    expect(doc.eventInfo).toEqual(original.eventInfo);
    expect(doc.tagline).toBe("t");
  });

  it("curso con status ausente o 'active' también queda disabled", () => {
    const sinStatus: Record<string, unknown> = { ...course };
    delete sinStatus.status;
    expect(buildCourseDoc(sinStatus, { slug: "x", title: "T" }, new Map([["s-broch", "N"]])).status).toBe("disabled");
    expect(buildCourseDoc({ ...course, status: "active" }, { slug: "x", title: "T" }, new Map([["s-broch", "N"]])).status).toBe("disabled");
  });

  it("followup sin durationMinutes ni agenda: no inventa duración y agenda queda []", () => {
    const f = buildFollowupDoc({ title: "S" }, "x", 9);
    expect(f).toEqual({ courseSlug: "x", title: "S", agenda: [], updatedAt: 9 });
    expect(f).not.toHaveProperty("durationMinutes");
  });

  it("followup con durationMinutes 0 lo conserva (no lo trata como ausente)", () => {
    expect(buildFollowupDoc({ title: "S", durationMinutes: 0 }, "x", 1).durationMinutes).toBe(0);
  });

  it("stripSystem quita _id y _creationTime sin tocar el resto", () => {
    expect(stripSystem({ _id: "a", _creationTime: 1, x: 2, y: undefined })).toEqual({ x: 2, y: undefined });
  });

  it("remapStorage deja intactos campos sin storage y no muta la entrada", () => {
    const input = { storageId: "a", title: "t" };
    const out = remapStorage(input, new Map([["a", "A"]]));
    expect(input.storageId).toBe("a");
    expect(out).not.toBe(input);
    expect(remapStorage({ title: "solo texto" }, new Map())).toEqual({ title: "solo texto" });
  });

  it("DELETE_COURSE_CONFIRM es exactamente 'eliminar-curso'", () => {
    expect(DELETE_COURSE_CONFIRM).toBe("eliminar-curso");
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

  const type = (value: string) => fireEvent.change(screen.getByRole("textbox"), { target: { value } });
  const submitBtn = () => screen.getByRole("button", { name: /eliminar este curso|eliminando/i });

  it("no llama a la mutación si el texto no coincide (ni con espacios, mayúsculas o prefijo)", () => {
    render(<DeleteCourseDialog course={target} onClose={() => {}} />);
    for (const v of ["", "eliminar", "Eliminar-curso", " eliminar-curso", "eliminar-curso ", "eliminar-cursos"]) {
      type(v);
      expect(submitBtn()).toBeDisabled();
      fireEvent.click(submitBtn());
    }
    expect(preview.deleteFn).not.toHaveBeenCalled();
  });

  it("al confirmar llama a la mutación con courseId y confirm, y cierra", async () => {
    const onClose = vi.fn();
    render(<DeleteCourseDialog course={target} onClose={onClose} />);
    type(DELETE_COURSE_CONFIRM);
    fireEvent.click(submitBtn());
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(preview.deleteFn).toHaveBeenCalledWith({ courseId: "c1", confirm: "eliminar-curso" });
  });

  it("Escape cierra el modal", () => {
    const onClose = vi.fn();
    render(<DeleteCourseDialog course={target} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("otras teclas no cierran el modal", () => {
    const onClose = vi.fn();
    render(<DeleteCourseDialog course={target} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Enter" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("cancelar y clic en el fondo cierran; clic dentro del diálogo no", () => {
    const onClose = vi.fn();
    render(<DeleteCourseDialog course={target} onClose={onClose} />);
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("dialog").parentElement as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("si el servidor falla, muestra el mensaje, no cierra y re-habilita el botón", async () => {
    preview.deleteFn = vi.fn(async () => {
      throw new Error("Este curso tiene inscritos o respuestas de encuesta; no se puede eliminar");
    });
    const onClose = vi.fn();
    render(<DeleteCourseDialog course={target} onClose={onClose} />);
    type(DELETE_COURSE_CONFIRM);
    fireEvent.click(submitBtn());
    expect(await screen.findByText(/no se puede eliminar$/)).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
    expect(submitBtn()).toBeEnabled();
    expect(submitBtn()).toHaveTextContent(/eliminar este curso/i);
  });

  it("un rechazo que no es Error muestra el texto genérico 'error'", async () => {
    preview.deleteFn = vi.fn(async () => {
      throw "boom";
    });
    render(<DeleteCourseDialog course={target} onClose={() => {}} />);
    type(DELETE_COURSE_CONFIRM);
    fireEvent.click(submitBtn());
    expect(await screen.findByText("error")).toBeInTheDocument();
  });

  it("mientras borra: botón deshabilitado 'eliminando…', no hay doble envío, Escape y fondo no cierran", async () => {
    let resolve!: () => void;
    preview.deleteFn = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    const onClose = vi.fn();
    render(<DeleteCourseDialog course={target} onClose={onClose} />);
    type(DELETE_COURSE_CONFIRM);
    fireEvent.click(submitBtn());
    await waitFor(() => expect(submitBtn()).toHaveTextContent(/eliminando/i));
    expect(submitBtn()).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeDisabled();
    fireEvent.click(submitBtn());
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByRole("dialog").parentElement as HTMLElement);
    expect(preview.deleteFn).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    resolve();
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("el error previo se limpia al reintentar", async () => {
    const fn = vi.fn().mockRejectedValueOnce(new Error("falló uno")).mockResolvedValueOnce({});
    preview.deleteFn = fn;
    const onClose = vi.fn();
    render(<DeleteCourseDialog course={target} onClose={onClose} />);
    type(DELETE_COURSE_CONFIRM);
    fireEvent.click(submitBtn());
    expect(await screen.findByText("falló uno")).toBeInTheDocument();
    fireEvent.click(submitBtn());
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(screen.queryByText("falló uno")).toBeNull();
  });

  it("muestra el conteo de lo que se borra", () => {
    render(<DeleteCourseDialog course={target} onClose={() => {}} />);
    expect(screen.getByText(/6 secciones · 40 ítems · 1\s+perfiles · 17 archivos/)).toBeInTheDocument();
  });

  it("mientras carga el preview (undefined) no hay input y el botón está deshabilitado", () => {
    preview.value = undefined;
    render(<DeleteCourseDialog course={target} onClose={() => {}} />);
    expect(screen.getByText(/cargando/)).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(submitBtn()).toBeDisabled();
  });

  it("preview null (no admin): sin input, botón deshabilitado", () => {
    preview.value = null;
    render(<DeleteCourseDialog course={target} onClose={() => {}} />);
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(submitBtn()).toBeDisabled();
  });

  it("bloqueado: el mensaje lista inscritos, invitaciones y respuestas", () => {
    preview.value = { ...(preview.value as object), blocked: true, blockers: { registrations: 3, invites: 2, responses: 1 } };
    render(<DeleteCourseDialog course={target} onClose={() => {}} />);
    expect(screen.getByText(/3 inscritos,\s+2 invitaciones y 1 respuestas/)).toBeInTheDocument();
  });

  it("course=null no renderiza nada", () => {
    const { container } = render(<DeleteCourseDialog course={null} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("Escape no cierra con course=null (no hay listener)", () => {
    const onClose = vi.fn();
    render(<DeleteCourseDialog course={null} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("muestra título y slug del curso", () => {
    render(<DeleteCourseDialog course={target} onClose={() => {}} />);
    expect(screen.getByText("[finanzas]")).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Eliminar curso" })).toBeInTheDocument();
  });
});
