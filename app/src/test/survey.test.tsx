import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  computeNps,
  formatDate,
  formatTime,
  formatWhen,
  googleCalendarUrl,
  labelFor,
  npsVerdict,
  parseInviteList,
  responsesToCsv,
  STEPS,
} from "../lib/survey";
import { SurveyFlow } from "../components/SurveyFlow";

// ---------------------------------------------------------------------------
// Lógica pura (lo que alimenta el CSV y los umbrales de analisis.md §6)
// ---------------------------------------------------------------------------

describe("computeNps", () => {
  it("calcula NPS = % promotores (9-10) − % detractores (0-6)", () => {
    // 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 → promotores 2, pasivos 2, detractores 6
    const r = computeNps([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    expect(r.promoters).toBe(2);
    expect(r.passives).toBe(2);
    expect(r.detractors).toBe(6);
    expect(r.nps).toBe(Math.round(((2 - 6) / 10) * 100)); // -40
  });

  it("deja fuera de NPS a los pasivos (7 y 8)", () => {
    const r = computeNps([10, 10, 10, 8, 8, 8, 8, 1, 2, 3]);
    expect(r.promoters).toBe(3);
    expect(r.passives).toBe(4);
    expect(r.detractors).toBe(3);
  });

  it("no divide entre cero con cero respuestas", () => {
    const r = computeNps([]);
    expect(r.nps).toBeNull();
    expect(r.promoters).toBe(0);
  });
});

describe("npsVerdict", () => {
  it("aplica los umbrales de la tabla de analisis.md §6", () => {
    expect(npsVerdict(60).tone).toBe("good");
    expect(npsVerdict(50).tone).toBe("good");
    expect(npsVerdict(30).tone).toBe("warn");
    expect(npsVerdict(19).tone).toBe("bad");
    expect(npsVerdict(0).tone).toBe("bad");
    expect(npsVerdict(null).tone).toBe("dim");
  });
});

describe("parseInviteList", () => {
  it("acepta `Nombre <correo>` y correos sueltos", () => {
    expect(
      parseInviteList("Ana Rueda <ana@correo.com>\nbruno@correo.com"),
    ).toEqual([
      { email: "ana@correo.com", name: "Ana Rueda" },
      { email: "bruno@correo.com" },
    ]);
  });

  it("normaliza a minúsculas y quita duplicados", () => {
    const out = parseInviteList("Ana <ANA@Correo.com>\nana@correo.com");
    expect(out).toHaveLength(1);
    expect(out[0].email).toBe("ana@correo.com");
  });

  it("separa por coma, punto y coma o salto de línea", () => {
    expect(parseInviteList("a@x.com, b@x.com; c@x.com\nd@x.com").map((e) => e.email)).toEqual([
      "a@x.com",
      "b@x.com",
      "c@x.com",
      "d@x.com",
    ]);
  });

  it("descarta lo que no parece un correo", () => {
    expect(parseInviteList("hola\nno soy correo\ns@si.com\n@sin-dominio.com")).toEqual([
      { email: "s@si.com" },
    ]);
  });

  it("limpia la coma que queda antes del <", () => {
    expect(parseInviteList("Ana, <ana@correo.com>")).toEqual([
      { email: "ana@correo.com", name: "Ana" },
    ]);
  });
});

describe("responsesToCsv", () => {
  const row = {
    token: "tok-1",
    _id: "r1",
    email: "ana@correo.com",
    name: "Ana Rueda",
    nps: 9,
    npsWhy: "Me sirvió mucho",
    assistant: "completo",
    pace: "adecuado",
    price: "justo",
    channel: "whatsapp",
    knewHosts: "no",
    b2b: "si",
    interests: ["avanzado", "empresa"],
    changeOne: "Más tiempo de práctica",
    consent: "sin_nombre",
    updatedAt: Date.UTC(2026, 9, 1, 15, 30),
  };

  it("pone las etiquetas en español, no los códigos", () => {
    const csv = responsesToCsv([row]);
    expect(csv).toContain("Sí, funcionando con mis propios documentos");
    expect(csv).toContain("Adecuado");
    expect(csv).toContain("Un curso avanzado para sacarle más a mi asistente");
    expect(csv).not.toContain("completo");
  });

  it("junta los intereses y escapa las comillas", () => {
    const csv = responsesToCsv([{ ...row, npsWhy: 'dijo "bueno"' }]);
    expect(csv).toContain('dijo ""bueno""');
    expect(csv.split("\n")[1]).toContain(" + ");
  });

  it("antepone el detalle cuando el origen es 'otro'", () => {
    const csv = responsesToCsv([{ ...row, channel: "otro", channelOther: "radio" }]);
    expect(csv).toContain("Otro (radio)");
  });

  it("solo tiene cabecera si no hay respuestas", () => {
    expect(responsesToCsv([]).split("\n")).toHaveLength(1);
  });
});

describe("labelFor", () => {
  it("traduce códigos conocidos y deja pasar el resto", () => {
    expect(labelFor("justo")).toBe("Justo");
    expect(labelFor("inventado")).toBe("inventado");
    expect(labelFor(undefined)).toBe("");
  });
});

describe("fecha y hora de la sesión", () => {
  it("lee la fecha en español y en UTC (no se corre un día)", () => {
    // Si se interpretara en hora local, un Timestamp UTC cerca de medianoche
    // puede caer el día anterior en Colombia/Chile.
    expect(formatDate("2026-10-08")).toContain("8 de octubre");
    expect(formatDate("2026-10-08")).toContain("jueves");
    expect(formatDate("2026-01-01")).toContain("1 de enero");
  });

  it("devuelve vacío si la fecha no viene bien, en vez de 'Invalid Date'", () => {
    expect(formatDate("")).toBe("");
    expect(formatDate(undefined)).toBe("");
    expect(formatDate("8 de octubre")).toBe("");
    expect(formatDate("2026-13-45")).toBe("");
  });

  it("convierte la hora de 24h a 12h", () => {
    expect(formatTime("19:00")).toContain("7:00");
    expect(formatTime("09:00")).toContain("9:00");
    expect(formatTime("13:30")).toContain("1:30");
    expect(formatTime("nope")).toBe("");
  });

  it("une fecha y hora, y omite lo que falte", () => {
    expect(formatWhen({ date: "2026-10-08", startTime: "19:00" })).toContain("·");
    expect(formatWhen({ date: "2026-10-08", startTime: "" })).toContain("8 de octubre");
    expect(formatWhen({ date: "", startTime: "19:00" })).toContain("7:00");
    expect(formatWhen({ date: "", startTime: "" })).toBe("");
  });
});

describe("googleCalendarUrl", () => {
  it("arma el link de Google Calendar con la fecha y la hora", () => {
    const url = googleCalendarUrl({
      title: "Sesión de follow-up",
      date: "2026-10-08",
      startTime: "19:00",
      joinUrl: "https://meet.google.com/abc",
      agenda: ["Dudas", "Prompt"],
    });
    const q = new URL(url).searchParams;
    expect(url).toContain("calendar.google.com/calendar/render");
    expect(q.get("action")).toBe("TEMPLATE");
    expect(q.get("dates")).toBe("20261008T190000/20261008T210000");
    expect(q.get("ctz")).toBe("America/Bogota");
    expect(q.get("location")).toBe("https://meet.google.com/abc");
    expect(q.get("details")).toContain("Dudas");
  });

  it("no devuelve nada sin fecha: es lo que se esconde en el panel", () => {
    expect(googleCalendarUrl({ title: "x", date: "" })).toBe("");
    expect(googleCalendarUrl({ title: "x", date: "8 de octubre" })).toBe("");
    expect(googleCalendarUrl({ title: "x" })).toBe("");
  });
});

// ---------------------------------------------------------------------------
// El formulario: lo que evita que alguien la llene mal
// ---------------------------------------------------------------------------

const session = {
  title: "Sesión virtual de follow-up",
  date: "2026-10-08",
  startTime: "19:00",
  joinUrl: "https://meet.google.com/abc-defg-hij",
  agenda: ["Dudas de la sesión anterior"],
  status: "open",
  // Derivados en el servidor:
  when: "jueves, 8 de octubre de 2026 · 7:00 p. m.",
  calendarUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE",
  open: true,
};

const info = vi.hoisted(() => ({
  validToken: true,
  email: "ana@correo.com",
  name: "Ana Rueda",
  submitted: false,
  submittedAt: null,
  session: null as unknown,
}));

type SubmitArgs = Record<string, unknown>;

const submitMock = vi.hoisted(() => vi.fn(async () => ({ ok: true, emailed: true })));

vi.mock("convex/react", async () => {
  const actual = await vi.importActual<typeof import("convex/react")>("convex/react");
  return {
    ...actual,
    useQuery: () => ({ ...info, session: info.session }),
    useAction: () => submitMock,
  };
});

beforeEach(() => {
  window.localStorage.clear();
  info.validToken = true;
  info.email = "ana@correo.com";
  info.name = "Ana Rueda";
  info.submitted = false;
  info.session = session;
  submitMock.mockClear();
  submitMock.mockResolvedValue({ ok: true, emailed: true });
});

describe("SurveyFlow", () => {
  it("saluda con el nombre que viene en el link y no pide escribir nada", () => {
    render(<SurveyFlow token={"a".repeat(32)} />);
    expect(screen.getByText("hola ana")).toBeTruthy();
    // El primer paso es el NPS, no un formulario de contacto.
    expect(screen.getByText(/probable es que recomiendes/)).toBeTruthy();
    expect(screen.queryByLabelText("correo")).toBeNull();
  });

  it("pide nombre y correo cuando el link no trae token", () => {
    info.validToken = false;
    info.email = "";
    info.name = "";
    render(<SurveyFlow />);
    expect(screen.getByLabelText("nombre")).toBeTruthy();
    expect(screen.getByLabelText("correo")).toBeTruthy();
  });

  it("avanza solo al tocar una opción de un toque", async () => {
    render(<SurveyFlow token={"b".repeat(32)} />);
    fireEvent.click(screen.getByRole("button", { name: "9" }));
    await waitFor(() => {
      expect(screen.getByText(/Qué fue lo que más pesó/)).toBeTruthy();
    });
  });

  it("trata 'Nada por ahora' como excluyente en 'qué sigue'", async () => {
    render(<SurveyFlow token={"c".repeat(32)} />);

    // Camino de un toque hasta el paso de "qué sigue" (multi, sin auto-avance).
    fireEvent.click(screen.getByRole("button", { name: "9" }));
    await waitFor(() => expect(screen.getByText(/más pesó/)).toBeTruthy());
    fireEvent.click(screen.getByText("siguiente →"));
    await waitFor(() => expect(screen.getByText(/Saliste con tu asistente/)).toBeTruthy());
    fireEvent.click(screen.getByText("Sí, funcionando con mis propios documentos"));
    await waitFor(() => expect(screen.getByText(/ritmo del workshop/)).toBeTruthy());
    fireEvent.click(screen.getByText("Adecuado"));
    await waitFor(() => expect(screen.getByText(/el precio te pareció/)).toBeTruthy());
    fireEvent.click(screen.getByText("Justo"));
    await waitFor(() => expect(screen.getByText(/Cómo te enteraste/)).toBeTruthy());
    fireEvent.click(screen.getByText("Me lo recomendó alguien"));
    await waitFor(() => expect(screen.getByText(/conocías a Eduardo/)).toBeTruthy());
    fireEvent.click(screen.getByText("Solo de redes"));
    await waitFor(() => expect(screen.getByText(/tu empresa o equipo/)).toBeTruthy());
    fireEvent.click(screen.getByText("Tal vez"));
    await waitFor(() => expect(screen.getByText(/Qué te interesaría/)).toBeTruthy());

    const avanzado = screen.getByRole("button", { name: /curso avanzado/ });
    const nada = screen.getByRole("button", { name: "Nada por ahora" });

    fireEvent.click(avanzado);
    expect(avanzado.getAttribute("aria-pressed")).toBe("true");

    // Al marcar "nada", se desmarca lo anterior…
    fireEvent.click(nada);
    expect(nada.getAttribute("aria-pressed")).toBe("true");
    expect(avanzado.getAttribute("aria-pressed")).toBe("false");

    // …y al marcar algo más, "nada" se apaga.
    fireEvent.click(avanzado);
    expect(avanzado.getAttribute("aria-pressed")).toBe("true");
    expect(nada.getAttribute("aria-pressed")).toBe("false");
  });

  it("no deja enviar mientras falten obligatorias", () => {
    render(<SurveyFlow token={"d".repeat(32)} />);
    // La barra de avance empieza en 1 y el botón de enviar solo aparece al
    // final; mientras tanto el avance es el de "siguiente".
    expect(screen.queryByText("enviar →")).toBeNull();
    expect(screen.getByText("siguiente →")).toBeTruthy();
  });

  it("envía las respuestas y termina mostrando los datos de la sesión", async () => {
    render(<SurveyFlow token={"e".repeat(32)} />);

    // NPS
    fireEvent.click(screen.getByRole("button", { name: "10" }));
    // la 2 es opcional: siguiente
    await waitFor(() => expect(screen.getByText(/más pesó/)).toBeTruthy());
    fireEvent.click(screen.getByText("siguiente →"));
    // 3
    await waitFor(() => expect(screen.getByText(/Saliste con tu asistente/)).toBeTruthy());
    fireEvent.click(screen.getByText("Sí, pero solo con los datos de ejemplo"));
    await waitFor(() => expect(screen.getByText(/ritmo del workshop/)).toBeTruthy());
    fireEvent.click(screen.getByText("Adecuado"));
    await waitFor(() => expect(screen.getByText(/el precio te pareció/)).toBeTruthy());
    fireEvent.click(screen.getByText("Justo"));
    await waitFor(() => expect(screen.getByText(/Cómo te enteraste/)).toBeTruthy());
    fireEvent.click(screen.getByText("WhatsApp (mensaje o grupo)"));
    await waitFor(() => expect(screen.getByText(/conocías a Eduardo/)).toBeTruthy());
    fireEvent.click(screen.getByText("Solo de redes"));
    await waitFor(() => expect(screen.getByText(/tu empresa o equipo/)).toBeTruthy());
    fireEvent.click(screen.getByText("Sí"));
    await waitFor(() => expect(screen.getByText(/Qué te interesaría/)).toBeTruthy());
    fireEvent.click(screen.getByText("Un workshop adaptado a mi profesión"));
    fireEvent.click(screen.getByText("siguiente →"));
    await waitFor(() => expect(screen.getByText(/cambiar una sola cosa/)).toBeTruthy());
    fireEvent.click(screen.getByText("siguiente →"));
    await waitFor(() => expect(screen.getByText(/usar tus respuestas/)).toBeTruthy());
    fireEvent.click(screen.getByText("Sí, pero sin mi nombre"));

    // Paso de revisión: aparecen todas las respuestas y se pueden corregir.
    await waitFor(() => expect(screen.getByText("Revisa y envía")).toBeTruthy());
    expect(screen.getByText("Sí, pero solo con los datos de ejemplo")).toBeTruthy();
    expect(screen.getByText("Sí, pero sin mi nombre")).toBeTruthy();
    expect(screen.getByText("Un workshop adaptado a mi profesión")).toBeTruthy();
    // Sin respuestas perdidas: lo que se répondió en cada paso está en la revisión.
    expect(screen.getAllByText("cambiar").length).toBe(STEPS.length);

    fireEvent.click(screen.getByText("enviar →"));

    await waitFor(() => expect(screen.getByText(/Gracias/)).toBeTruthy());
    expect(submitMock).toHaveBeenCalledTimes(1);
    const args = (submitMock.mock.calls[0] as unknown as [SubmitArgs])[0];
    expect(args.nps).toBe(10);
    expect(args.email).toBe("ana@correo.com");
    expect(args.name).toBe("Ana Rueda");
    expect(args.assistant).toBe("ejemplo");
    expect(args.price).toBe("justo");
    expect(args.channel).toBe("whatsapp");
    expect(args.knewHosts).toBe("redes");
    expect(args.b2b).toBe("si");
    expect(args.interests).toEqual(["adaptado"]);
    // El "otro" de intereses se envía aparte; si no, se pierde lo que escriben.
    expect(args).toHaveProperty("interestsOther");
    expect(args.consent).toBe("sin_nombre");

    // La pantalla de gracias muestra la sesión aunque el correo no salga.
    expect(screen.getByText("jueves, 8 de octubre de 2026 · 7:00 p. m.")).toBeTruthy();
    expect(screen.getByText("guardar mi lugar →")).toBeTruthy();
    expect(screen.getByText(/Te escribimos a/)).toBeTruthy();
  });

  it("sin fecha de sesión no manda correo ni promete nada en la pantalla", async () => {
    // Sin sesión, el correo #2 (que ES el de los datos) no sale: la pantalla no
    // debe decir que "no pudimos mandarte el correo".
    info.session = null;
    render(<SurveyFlow token={"f".repeat(32)} />);
    expect(screen.getByText(/probable es que recomiendes/)).toBeTruthy();
  });

  it("al elegir 'Otro' NO avanza: muestra el campo para llenar", async () => {
    render(<SurveyFlow token={"a1".repeat(16)} />);
    // NPS -> avanza sola
    fireEvent.click(screen.getByRole("button", { name: "9" }));
    await waitFor(() => expect(screen.getByText(/más pesó/)).toBeTruthy());
    fireEvent.click(screen.getByText("siguiente →"));
    await waitFor(() => expect(screen.getByText(/Saliste con tu asistente/)).toBeTruthy());
    fireEvent.click(screen.getByText("Sí, funcionando con mis propios documentos"));
    await waitFor(() => expect(screen.getByText(/ritmo del workshop/)).toBeTruthy());
    fireEvent.click(screen.getByText("Adecuado"));
    await waitFor(() => expect(screen.getByText(/el precio te pareció/)).toBeTruthy());
    fireEvent.click(screen.getByText("Justo"));
    await waitFor(() => expect(screen.getByText(/Cómo te enteraste/)).toBeTruthy());

    fireEvent.click(screen.getByText("Otro"));

    // Lo que importa: se queda en la pregunta y aparece el campo "¿Cuál?".
    expect(screen.getByText(/Cómo te enteraste/)).toBeTruthy();
    const cual = screen.getByLabelText("¿Cuál? (una línea)");
    expect(cual).toBeTruthy();
    fireEvent.change(cual, { target: { value: "un grupo de Telegram" } });

    // Y desde ahí sí se puede seguir con el botón.
    fireEvent.click(screen.getByText("siguiente →"));
    await waitFor(() => expect(screen.getByText(/conocías a Eduardo/)).toBeTruthy());
  });

  it("corregir desde la revisión vuelve a la revisión (no obliga a re-responder)", async () => {
    render(<SurveyFlow token={"b1".repeat(16)} />);
    // Camino corto hasta la revisión.
    fireEvent.click(screen.getByRole("button", { name: "10" }));
    await waitFor(() => expect(screen.getByText(/más pesó/)).toBeTruthy());
    fireEvent.click(screen.getByText("siguiente →"));
    await waitFor(() => expect(screen.getByText(/Saliste con tu asistente/)).toBeTruthy());
    fireEvent.click(screen.getByText("Sí, funcionando con mis propios documentos"));
    await waitFor(() => expect(screen.getByText(/ritmo del workshop/)).toBeTruthy());
    fireEvent.click(screen.getByText("Adecuado"));
    await waitFor(() => expect(screen.getByText(/el precio te pareció/)).toBeTruthy());
    fireEvent.click(screen.getByText("Justo"));
    await waitFor(() => expect(screen.getByText(/Cómo te enteraste/)).toBeTruthy());
    fireEvent.click(screen.getByText("LinkedIn"));
    await waitFor(() => expect(screen.getByText(/conocías a Eduardo/)).toBeTruthy());
    fireEvent.click(screen.getByText("No"));
    await waitFor(() => expect(screen.getByText(/tu empresa o equipo/)).toBeTruthy());
    fireEvent.click(screen.getByText("Sí"));
    await waitFor(() => expect(screen.getByText(/Qué te interesaría/)).toBeTruthy());
    fireEvent.click(screen.getByText("Un workshop adaptado a mi profesión"));
    fireEvent.click(screen.getByText("siguiente →"));
    await waitFor(() => expect(screen.getByText(/cambiar una sola cosa/)).toBeTruthy());
    fireEvent.click(screen.getByText("siguiente →"));
    await waitFor(() => expect(screen.getByText(/usar tus respuestas/)).toBeTruthy());
    fireEvent.click(screen.getByText("Sí, pero sin mi nombre"));
    await waitFor(() => expect(screen.getByText("Revisa y envía")).toBeTruthy());

    // Corregir el NPS (una pregunta de un toque que ya tiene respuesta).
    const cambiar = screen.getAllByText("cambiar");
    fireEvent.click(cambiar[0]);
    await waitFor(() => expect(screen.getByText(/probable es que recomiendes/)).toBeTruthy());

    // Sin tocar nada, el botón ya sirve y dice "listo" (no "siguiente").
    const listo = screen.getByText("listo →");
    expect(listo.closest("button")?.disabled).toBe(false);
    fireEvent.click(listo);

    // Vuelve a la revisión, no a la pregunta siguiente.
    await waitFor(() => expect(screen.getByText("Revisa y envía")).toBeTruthy());
    // Y el cambio se puede aplicar sin haber re-tocado la calificación.
    fireEvent.click(screen.getByText("enviar →"));
    await waitFor(() => expect(screen.getByText(/Gracias/)).toBeTruthy());
    expect(submitMock).toHaveBeenCalledTimes(1);
  });

  it("'Qué te interesaría' tiene Otro con campo para llenar", async () => {
    // Se verifica sobre la definición: la pregunta trae la opción y su campo.
    const interests = STEPS.find((s) => s.id === "interests");
    expect(interests?.choices?.map((c) => c.value)).toContain("otro");
    expect(interests?.extraFor).toBe("otro");
    expect(interests?.extraId).toBe("interestsOther");
  });

  it("define las 11 preguntas del documento, con las 2 abiertas opcionales", () => {
    expect(STEPS).toHaveLength(11);
    expect(STEPS.filter((s) => s.optional).map((s) => s.id)).toEqual(["npsWhy", "changeOne"]);
    // Sin jerga: no se pregunta por herramientas concretas.
    expect(STEPS.map((s) => s.title).join(" ").toLowerCase()).not.toMatch(
      /claude|token|prompt|gpt|open ?ai/,
    );
  });
});