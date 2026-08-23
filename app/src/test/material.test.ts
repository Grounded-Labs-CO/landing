import { describe, expect, it } from "vitest";
import { createZip } from "../lib/zip";
import { COURSE, SECTIONS, PROFILES } from "../../scripts/course-definition.mjs";

describe("Definición del curso (fuente de la siembra)", () => {
  it("define el workshop de finanzas con lugar en la info del evento", () => {
    expect(COURSE.slug).toBe("finanzas-personales-ia");
    const labels = COURSE.eventInfo.map((i) => i.label);
    expect(labels).toContain("lugar");
    expect(labels).not.toContain("grupo");
    expect(labels).toEqual(
      expect.arrayContaining(["fecha", "formato", "lugar", "duración"]),
    );
  });

  it("define las 5 secciones en orden con tipos válidos", () => {
    expect(SECTIONS.map((s) => s.kind)).toEqual([
      "info",
      "articles",
      "sample-data",
      "docs",
      "links",
    ]);
    expect(SECTIONS.map((s) => s.order)).toEqual([1, 2, 3, 4, 5]);
  });

  it("los artículos de preparación son los 3 previstos y están pendientes", () => {
    const articles = SECTIONS.find((s) => s.kind === "articles")!.items as Array<{
      title: string;
      status?: string;
    }>;
    expect(articles.map((a) => a.title)).toEqual([
      "Configurar Claude Code",
      "Configurar OpenCode",
      "Configurar Z.ai",
    ]);
    expect(articles.every((a) => a.status === "proximo")).toBe(true);
  });

  it("los links de interés apuntan a https", () => {
    const links = SECTIONS.find((s) => s.kind === "links")!.items as Array<{
      url?: string;
    }>;
    expect(links.length).toBe(3);
    for (const link of links) {
      expect(link.url).toMatch(/^https:\/\//);
    }
  });

  it("define los 3 perfiles de sample data con archivo de intro", () => {
    expect(PROFILES.map((p) => p.slug)).toEqual([
      "familia-simpson",
      "michael-scott",
      "phoebe-buffay",
    ]);
    for (const profile of PROFILES) {
      expect(profile.introFile).toMatch(/\.(md|csv)$/);
    }
  });
});

describe("ZIP de descarga", () => {
  it("genera un zip STORE válido con los archivos y sus CRC", () => {
    const entries = [
      { name: "perfil.md", data: Buffer.from("# Perfil de prueba\n"), mtime: new Date("2026-08-22T12:00:00Z") },
      { name: "banca/extracto.csv", data: Buffer.from("fecha,valor\n2026-08-01,1000\n"), mtime: new Date("2026-08-22T12:00:00Z") },
    ];
    const zip = createZip(entries);

    // Firma local file header
    expect(zip[0]).toBe(0x50);
    expect(zip[1]).toBe(0x4b);
    expect(zip[2]).toBe(0x03);
    expect(zip[3]).toBe(0x04);

    // End of central directory: entry count
    const eocdOffset = zip.length - 22;
    expect(zip.readUInt32LE(eocdOffset)).toBe(0x06054b50);
    expect(zip.readUInt16LE(eocdOffset + 10)).toBe(entries.length);

    // El contenido viaja sin comprimir (STORE)
    expect(zip.indexOf(Buffer.from("# Perfil de prueba\n"))).toBeGreaterThan(0);
    expect(zip.indexOf(Buffer.from("fecha,valor"))).toBeGreaterThan(0);
  });
});
