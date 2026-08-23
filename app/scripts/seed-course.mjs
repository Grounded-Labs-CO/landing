// Siembra el curso y su sample data en Convex (tablas + storage).
//
// Uso: npm run seed-course [-- --secret <ADMIN_BOOTSTRAP_SECRET>] [--source <ruta>]
// - URL del deployment y secreto se toman de .env.local / --secret / env.
// - Fuente por defecto: ../../workshop/sample-data (Grounded Labs/workshop).
// - Borra y recrea el curso completo (idempotente).

import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COURSE, SECTIONS, PROFILES, CATEGORY_LABELS } from "./course-definition.mjs";

const appRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
};

const secret = flag("--secret") ?? process.env.ADMIN_BOOTSTRAP_SECRET;
const source =
  flag("--source") ?? path.resolve(appRoot, "..", "..", "workshop", "sample-data");

if (!existsSync(source)) {
  console.error(`Fuente no encontrada: ${source}`);
  process.exit(1);
}

async function convexUrl() {
  const envPath = path.join(appRoot, ".env.local");
  let url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url && existsSync(envPath)) {
    const env = await readFile(envPath, "utf8");
    url = env.match(/^NEXT_PUBLIC_CONVEX_URL=(.+)$/m)?.[1]?.trim();
  }
  if (!url) {
    console.error("NEXT_PUBLIC_CONVEX_URL no configurado (.env.local o env)");
    process.exit(1);
  }
  return url.replace(/\/$/, "");
}
const baseUrl = await convexUrl();

async function call(functionPath, args, kind = "mutation") {
  const res = await fetch(`${baseUrl}/api/${kind}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ path: functionPath, args }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.status === "error") {
    throw new Error(`${functionPath}: ${body.errorMessage ?? res.status}`);
  }
  return body.value;
}

const MIME = { ".md": "text/markdown", ".csv": "text/csv", ".txt": "text/plain" };

async function walk(dir, prefix = []) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) out.push(...(await walk(path.join(dir, entry.name), [...prefix, entry.name])));
    else out.push({ rel: [...prefix, entry.name].join("/"), full: path.join(dir, entry.name) });
  }
  return out;
}

function humanize(fileName) {
  const { name, ext } = path.parse(fileName);
  const label = name
    .split("-")
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
  const extLabel = ext === ".csv" ? "CSV" : ext === ".md" ? "MD" : ext.slice(1).toUpperCase();
  return `${label} (${extLabel})`;
}

// 1) limpiar siembra anterior
const cleared = await call("seed:clearCourse", { secret, courseSlug: COURSE.slug });
console.log(`limpieza: ${cleared.deleted} documentos/filas eliminadas`);

// 2) crear curso, secciones, ítems y perfiles
await call("seed:seedCourse", {
  secret,
  course: COURSE,
  sections: SECTIONS,
  profiles: PROFILES.map(({ order, slug, name, tagline, introFile }) => ({
    order,
    slug,
    name,
    tagline,
    introFileName: introFile ?? null,
  })),
});
console.log(`curso creado: ${COURSE.slug} · ${SECTIONS.length} secciones · ${PROFILES.length} perfiles`);

// 3) subir archivos del sample data a storage
let uploaded = 0;
for (const profile of PROFILES) {
  const profileDir = path.join(source, profile.slug);
  if (!existsSync(profileDir)) {
    console.warn(`⚠ perfil sin carpeta en la fuente: ${profile.slug}`);
    continue;
  }
  const files = await walk(profileDir);
  let order = 0;
  for (const file of files) {
    const ext = path.extname(file.rel).toLowerCase();
    if (!MIME[ext]) {
      console.warn(`⚠ tipo no soportado, omitido: ${file.rel}`);
      continue;
    }
    const contentBase64 = (await readFile(file.full)).toString("base64");
    const isRoot = !file.rel.includes("/");
    const isIntro = isRoot && file.rel === profile.introFile;
    const rawCategory = isRoot ? "otros" : file.rel.split("/")[0];
    const category = CATEGORY_LABELS[rawCategory] ?? rawCategory;
    const label = humanize(path.basename(file.rel));
    await call(
      "seed:attachProfileFile",
      {
        secret,
        courseSlug: COURSE.slug,
        profileSlug: profile.slug,
        category,
        order: order++,
        label,
        fileName: path.basename(file.rel),
        contentType: MIME[ext],
        contentBase64,
        isIntro,
      },
      "action",
    );
    uploaded++;
  }
}
console.log(`storage: ${uploaded} archivos subidos`);
console.log("OK — siembra completa");
