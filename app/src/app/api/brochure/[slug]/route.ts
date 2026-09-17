import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Descarga del brochure comercial del curso con nombre de archivo legible.
// La URL del archivo se resuelve en el servidor (material público del curso):
// el slug se consulta contra la base de datos, nunca llega una URL del cliente.
function convexStorageUrl(rawUrl: string): URL | null {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.hostname !== "127.0.0.1") return null;
  const configuredHost = process.env.NEXT_PUBLIC_CONVEX_URL
    ? new URL(process.env.NEXT_PUBLIC_CONVEX_URL).hostname
    : null;
  const hostOk = parsed.hostname === configuredHost || parsed.hostname.endsWith(".convex.cloud");
  return hostOk ? parsed : null;
}

function safeFileName(raw: string) {
  // Sin comillas, saltos de línea ni barras: viaja en Content-Disposition.
  return raw.replace(/[\r\n"\\/]/g, "").trim() || "brochure.pdf";
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // ?disposition=inline → se abre en el visor de PDF del navegador ("ver");
  // sin el parámetro se descarga con nombre legible ("descargar").
  const inline = new URL(request.url).searchParams.get("disposition") === "inline";

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return new Response("Convex no configurado", { status: 500 });
  }

  const client = new ConvexHttpClient(convexUrl);
  const course = await client.query(api.courses.getBySlug, { slug });
  if (!course?.brochureUrl) {
    return new Response("Brochure no disponible", { status: 404 });
  }

  const url = convexStorageUrl(course.brochureUrl);
  if (!url) {
    return new Response("URL no permitida", { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(url, { cache: "no-store" });
  } catch {
    return new Response("No pudimos leer el brochure", { status: 502 });
  }
  if (!upstream.ok || !upstream.body) {
    return new Response("No pudimos leer el brochure", { status: 502 });
  }

  const fileName = safeFileName(course.brochureFileName ?? `${slug}.pdf`);
  const asciiName = fileName.replace(/[^\x20-\x7E]/g, "_");
  const headers = new Headers({
    "content-type": upstream.headers.get("content-type") ?? "application/pdf",
    // filename* cubre tildes/ñ; filename es el fallback para clientes viejos.
    "content-disposition": `${inline ? "inline" : "attachment"}; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    "cache-control": "no-store",
  });
  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("content-length", contentLength);

  return new Response(upstream.body, { headers });
}
