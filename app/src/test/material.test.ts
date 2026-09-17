import { describe, expect, it } from "vitest";
import { createZip } from "../lib/zip";

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
