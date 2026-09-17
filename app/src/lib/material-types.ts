// Formas devueltas por api.material.getCourse y api.courses.list
// (espejo manual de convex/material.ts y convex/courses.ts).

export type SectionKind = "info" | "articles" | "checklist" | "sample-data" | "docs" | "links";

export type CourseItem = {
  title: string;
  description: string | null;
  url: string | null;
  note: string | null;
  status: "proximo" | "published" | null;
  downloadUrl: string | null;
  group: string | null;
};

export type SampleFile = {
  category: string;
  label: string;
  fileName: string;
  url: string | null;
};

export type SampleCategory = { label: string; files: SampleFile[] };

export type SampleProfile = {
  slug: string;
  name: string;
  tagline: string;
  role: string | null;
  meta: string | null;
  bio: string | null;
  facts: { label: string; value: string }[];
  quote: string | null;
  introUrl: string | null;
  introName: string | null;
  photoUrl: string | null;
  photoName: string | null;
  categories: SampleCategory[];
  fileCount: number;
};

export type CourseSection = {
  order: number;
  kind: SectionKind;
  title: string;
  hint: string;
  items: CourseItem[];
  sampleData: SampleProfile[] | null;
};

export type CourseMaterial = {
  slug: string;
  title: string;
  tagline: string;
  schedule: string;
  price: string;
  eventInfo: { label: string; value: string }[];
  email: string | null;
  /** Nombre del perfil para el pase de abordar (cae al email si no hay). */
  passengerName?: string | null;
  /** Link "agregar al calendario" (opcional). */
  calendarUrl?: string | null;
  sections: CourseSection[];
};

export type CourseSummary = {
  slug: string;
  title: string;
  tagline?: string;
  schedule: string;
  price: string;
  status?: "active" | "full" | "completed" | "disabled";
};
