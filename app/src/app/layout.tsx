import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Header } from "@/components/Header";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GROUNDED Labs | Tu Asistente Financiero con IA — Workshop en Medellín",
  description:
    "Workshop presencial de IA aplicada para profesionales que dependen de su conocimiento. Aprende a trabajar con tu información financiera y a usar IA en tu día a día. Medellín, 26 de septiembre.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" suppressHydrationWarning className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f6f2ea] text-[#17251f]" style={{ fontFamily: "var(--font-sans)" }}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <ConvexClientProvider>
            <Header />
            <main className="flex-1">{children}</main>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
