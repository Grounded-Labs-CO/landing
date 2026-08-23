import { createZip } from "@/lib/zip";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ZipRequest = { fileName?: string; files?: { name?: string; url?: string }[] };

// Empaqueta en zip archivos ya accesibles mediante URLs firmadas de Convex
// storage. Las URLs solo las entrega material.getCourse a estudiantes con
// acceso; aquí validamos que apunten al deployment de Convex (anti-SSRF).
function allowedUrl(rawUrl: string): URL | null {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.hostname !== "127.0.0.1") return null;
  const convexHost = process.env.NEXT_PUBLIC_CONVEX_URL
    ? new URL(process.env.NEXT_PUBLIC_CONVEX_URL).hostname
    : null;
  const hostOk =
    parsed.hostname === convexHost || parsed.hostname.endsWith(".convex.cloud");
  return hostOk ? parsed : null;
}

export async function POST(request: NextRequest) {
  let body: ZipRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const fileName = (body.fileName ?? "material.zip").replace(/[/\\]/g, "");
  const files = body.files ?? [];
  if (files.length === 0) {
    return Response.json({ error: "Sin archivos" }, { status: 400 });
  }
  if (files.length > 200) {
    return Response.json({ error: "Demasiados archivos" }, { status: 400 });
  }

  const entries = [];
  for (const file of files) {
    if (!file.name || !file.url) {
      return Response.json({ error: "Archivo incompleto" }, { status: 400 });
    }
    const url = allowedUrl(file.url);
    if (!url) {
      return Response.json({ error: "URL no permitida" }, { status: 400 });
    }
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = Buffer.from(await res.arrayBuffer());
      const lastModified = res.headers.get("last-modified");
      entries.push({
        name: file.name.replace(/[/\\]/g, "/"),
        data,
        mtime: lastModified ? new Date(lastModified) : new Date(),
      });
    } catch {
      return Response.json({ error: "No pudimos leer el material" }, { status: 502 });
    }
  }

  return new Response(new Uint8Array(createZip(entries)), {
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="${fileName}"`,
      "cache-control": "no-store",
    },
  });
}
