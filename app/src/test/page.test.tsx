import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";
import FinanzasPage from "../app/workshops/finanzas-personales-ia/page";

vi.mock("convex/react", async () => {
  const actual = await vi.importActual<typeof import("convex/react")>("convex/react");
  return {
    ...actual,
    useQuery: (_fn: any, args?: any) => {
      if (args && typeof args === "object" && "slug" in args) {
        return { status: "active", title: "Tu Asistente Financiero con IA" };
      }
      return [
        {
          slug: "finanzas-personales-ia",
          title: "Tu Asistente Financiero con IA",
          tagline: "Presupuesto, deudas, inversiones y tu marco de análisis — con tus datos.",
          schedule: "Presencial en Medellín · sábado 26 de septiembre · 4 horas",
          price: "$400k",
          status: "active",
        },
      ];
    },
  };
});

describe("Corporate", () => {
  it("renders GROUNDED Labs brand and manifiesto", () => {
    render(<Home />);
    expect(screen.getAllByText(/Inteligencia Artificial para profesionales/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/No hype/).length).toBeGreaterThan(0);
  });
  it("shows workshop destacado", () => {
    render(<Home />);
    expect(screen.getByText(/Asistente Financiero/)).toBeInTheDocument();
    expect(screen.getAllByText(/\$400k/).length).toBeGreaterThan(0);
  });
});

describe("Landing Finanzas", () => {
  it("renders finanzas landing", () => {
    render(<FinanzasPage />);
    expect(screen.getAllByText(/Asistente Financiero/).length).toBeGreaterThan(0);
  });
  it("shows precio de lanzamiento en landing", () => {
    render(<FinanzasPage />);
    expect(screen.getAllByText(/\$400k/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Precio de lanzamiento").length).toBeGreaterThan(0);
  });
});
