import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

// Fallback si Convex no responde en build/ISR.
const FALLBACK_TITLE =
  "GROUNDED Labs | Aprende IA construyendo tu Financial Advisor — Workshop en Medellín";

// El título del curso vive en la BD (editable en /admin). Con ISR corto, un
// renombre se refleja en el <title> sin redeploy del Next.
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? "");
    const course = await client.query(api.courses.getBySlug, {
      slug: "finanzas-personales-ia",
    });
    if (course?.title) {
      return { title: `GROUNDED Labs | ${course.title} — Workshop en Medellín` };
    }
  } catch {
    // Sin conexión: cae al título fijo.
  }
  return { title: FALLBACK_TITLE };
}

export default function FinanzasWorkshopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
