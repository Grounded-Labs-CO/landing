import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";
import FinanzasPage from "../app/workshops/finanzas-personales-ia/page";

describe("Corporate", () => {
  it("renders GROUNDED Labs brand and manifiesto", () => {
    render(<Home />);
    expect(screen.getAllByText(/Hay mucho material/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/No hype/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Workshops prácticos de inteligencia artificial aplicada/).length).toBeGreaterThan(0);
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
