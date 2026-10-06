// Lógica pura de "clonar curso" (sin ctx, sin ids nuevos): se prueba con vitest
// y la usan `admin.cloneCourse` / `admin.cloneApply`. Docs: docs/clonar-curso.md.

/** Texto que el admin debe escribir para borrar un curso (estilo GitHub). */
export const DELETE_COURSE_CONFIRM = "eliminar-curso";

const SLUG_RE = /^[a-z0-9-]+$/;

/** Normaliza y valida el slug; lanza con mensaje en español si no sirve. */
export function normalizeSlug(raw: string): string {
  const slug = (raw ?? "").toLowerCase().trim();
  if (!slug || !SLUG_RE.test(slug)) throw new Error("Slug solo a-z, 0-9 y -");
  return slug;
}

type Doc = Record<string, any>;

export type CourseTree = {
  course: Doc;
  sections: Doc[];
  items: Doc[]; // todos los ítems de todas las secciones
  profiles: Doc[];
  files: Doc[]; // todos los archivos de todos los perfiles
  followup: Doc | null;
};

/** Quita los campos de sistema de Convex para poder reinsertar el documento. */
export function stripSystem(doc: Doc): Doc {
  const { _id, _creationTime, ...rest } = doc;
  return rest;
}

/** Cada `storageId` distinto referenciado por el curso (para copiar una vez c/u). */
export function collectStorageIds(tree: CourseTree): string[] {
  const ids = new Set<string>();
  const add = (doc: Doc | null) => {
    if (!doc) return;
    for (const [k, val] of Object.entries(doc)) {
      if (k.endsWith("StorageId") || k === "storageId") if (val) ids.add(val as string);
    }
  };
  add(tree.course);
  tree.items.forEach(add);
  tree.profiles.forEach(add);
  tree.files.forEach(add);
  return [...ids];
}

/** Reemplaza cada campo `*StorageId` por su copia según `map` (old → new). */
export function remapStorage(doc: Doc, map: Map<string, string>): Doc {
  const out: Doc = { ...doc };
  for (const [k, val] of Object.entries(out)) {
    if ((k.endsWith("StorageId") || k === "storageId") && val) {
      const copy = map.get(val as string);
      if (!copy) throw new Error("No se pudo copiar un archivo");
      out[k] = copy;
    }
  }
  return out;
}

export type CloneOptions = {
  slug: string;
  title: string;
  schedule?: string;
  price?: string;
};

/** Fila nueva de `courses`: deshabilitada y sin el link de calendario viejo. */
export function buildCourseDoc(course: Doc, opts: CloneOptions, map: Map<string, string>): Doc {
  const { calendarUrl: _calendarUrl, ...rest } = stripSystem(course);
  return remapStorage(
    {
      ...rest,
      slug: opts.slug,
      title: opts.title,
      schedule: opts.schedule?.trim() ? opts.schedule : course.schedule,
      price: opts.price?.trim() ? opts.price : course.price,
      status: "disabled",
    },
    map,
  );
}

/** Sesión de follow-up del clon: solo título, agenda y duración (sin fecha ni link). */
export function buildFollowupDoc(followup: Doc, slug: string, now: number): Doc {
  const doc: Doc = {
    courseSlug: slug,
    title: followup.title,
    agenda: followup.agenda ?? [],
    updatedAt: now,
  };
  if (followup.durationMinutes !== undefined) doc.durationMinutes = followup.durationMinutes;
  return doc;
}
