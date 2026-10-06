import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { getFunctionName } from "convex/server";
import Home from "../app/page";
import FinanzasPage from "../app/workshops/finanzas-personales-ia/page";

// Curso mutable: el mismo mock cubre la landing abierta y la cerrada
// (status `completed`), que ahora ofrece lista de espera.
const course = vi.hoisted(() => ({
  status: "active",
  title: "Aprende IA construyendo tu Financial Advisor",
  tagline: "Workshop 100% práctico: sales con tu asistente andando, no con apuntes.",
  schedule: "Presencial · sábado 26 de septiembre · 4 horas",
  price: "$400.000",
}));

vi.mock("convex/react", async () => {
  const actual = await vi.importActual<typeof import("convex/react")>("convex/react");
  return {
    ...actual,
    useMutation: () => async () => undefined,
    useQuery: (_fn: unknown, args?: unknown) => {
      if (args && typeof args === "object" && "slug" in args) {
        return {
          status: course.status,
          title: course.title,
          slug: "finanzas-personales-ia",
          schedule: course.schedule,
          price: course.price,
          brochureUrl:
            "https://flippant-dog-457.convex.cloud/api/storage/kg2btrj1fx9habve4t6dpnnaqh8ej1m3",
          brochureFileName: "Grounded Labs - Workshop AI Financial Advisor.pdf",
        };
      }
      const card = {
        slug: "finanzas-personales-ia",
        title: course.title,
        tagline: course.tagline,
        schedule: course.schedule,
        price: course.price,
        status: course.status,
      };
      // `courses.listPast` solo devuelve ediciones dictadas. `api` es un Proxy
      // de Convex: la referencia es nueva en cada acceso, así que comparamos
      // por nombre de función.
      const fnName = getFunctionName(_fn as Parameters<typeof getFunctionName>[0]);
      if (fnName === "courses:listPast") {
        return course.status === "completed" ? [{ ...card, status: "completed" }] : [];
      }
      // `courses.list` solo devuelve cursos abiertos (active/full).
      if (course.status !== "active" && course.status !== "full") return [];
      return [card];
    },
  };
});

beforeEach(() => {
  course.status = "active";
});

describe("Corporate", () => {
  it("renders GROUNDED Labs brand and manifiesto", () => {
    render(<Home />);
    expect(screen.getAllByText(/Inteligencia Artificial para profesionales/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/No hype/).length).toBeGreaterThan(0);
  });
  it("shows workshop destacado", () => {
    render(<Home />);
    expect(screen.getByText(/Financial Advisor/)).toBeInTheDocument();
    expect(screen.getAllByText(/\$400\.000/).length).toBeGreaterThan(0);
  });
  it("en modo cerrado, el home muestra la tarjeta como dictada con lista de espera", () => {
    course.status = "completed";
    render(<Home />);
    expect(screen.getByText(/workshop · ya dictado/i)).toBeInTheDocument();
    const interes = screen.getByRole("link", { name: /me interesa la próxima edición/i });
    expect(interes).toHaveAttribute("href", "/workshops/finanzas-personales-ia#precio");
    expect(screen.getAllByPlaceholderText(/tu@correo\.com/i).length).toBeGreaterThan(0);
    // Sin ciudad ni precio de la próxima edición.
    expect(screen.queryByText(/Medellín/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\$400\.000/)).not.toBeInTheDocument();
  });
});

describe("Landing Finanzas", () => {
  it("renders finanzas landing", () => {
    render(<FinanzasPage />);
    expect(screen.getAllByText(/Financial Advisor/).length).toBeGreaterThan(0);
  });
  it("muestra fecha y precio que vienen de la BD", () => {
    render(<FinanzasPage />);
    expect(screen.getAllByText(/sábado 26 de septiembre/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$400\.000/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/precio de lanzamiento/i).length).toBeGreaterThan(0);
  });
  it("con el curso ya dictado, muestra cierre, precio por anunciar y lista de espera", () => {
    course.status = "completed";
    render(<FinanzasPage />);
    expect(screen.getAllByText(/edición finalizada/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/curso ya dictado/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/precio de la próxima edición: por anunciar/i)).toBeInTheDocument();
    expect(screen.queryByText(/\$400\.000/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Medellín/i)).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tu@correo\.com/i)).toBeInTheDocument();
  });
  it("abre el brochure del curso desde el hero", () => {
    render(<FinanzasPage />);
    const boton = screen.getByRole("link", { name: /ver brochure/i });
    expect(boton).toHaveAttribute(
      "href",
      "/api/brochure/finanzas-personales-ia?disposition=inline",
    );
  });
});
