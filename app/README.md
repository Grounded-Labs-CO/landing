# GROUNDED Labs — App

Landing migrada de `workshops/finanzas-personales-ia/landing.html` a **Next.js 16 + Convex + Tailwind v4 + shadcn/ui (base-nova, neutral)** siguiendo `ARCHITECTURE_TEMPLATE.md`.

## Estructura

Ver `../docs/` (fuente de verdad) y `../AGENTS.md`.

- `app` = raíz Next.js (este directorio)
- `convex/` = schema + auth + queries/mutations (ver `../ARCHITECTURE_TEMPLATE.md`)
- `src/app/` = App Router (page.tsx = landing, /signin, /admin)
- `src/components/` = ConvexClientProvider, AuthGuard, Header, ui/*
- `src/hooks/useRole.ts` = wrapper de `api.queries.getUserRole`
- `docs/` = espejo de `../docs` (arquitectura, reglas, tareas)

## Stack

- Next.js 16 (App Router, React 19)
- Convex + @convex-dev/auth (Password)
- Tailwind v4 + shadcn/ui base-nova neutral
- next-themes, lucide-react, Recharts, clsx/tailwind-merge
- Vitest + Testing Library + jsdom

## Comandos

```bash
npx convex dev          # backend Convex (requiere CONVEX_DEPLOYMENT)
npm run dev             # Next.js (http://localhost:3000)
npm run build
npm run lint
npm run test            # vitest run
```

## Env

Copiar `.env.local.example` a `.env.local`:

```
CONVEX_DEPLOYMENT=local:local-grounded-labs
NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210
NEXT_PUBLIC_CONVEX_SITE_URL=http://127.0.0.1:3211
```

> Nota: `convex/_generated` está stubbed para permitir `next build` sin `npx convex dev`. Al correr `npx convex dev` se regenerará automáticamente.

## Landing

La landing es warm/editorial (DM Sans + Fraunces, #f6f2ea, #236b4b, #c86f3d) — 1:1 con `workshops/finanzas-personales-ia/landing.html`, pero ahora como componentes React/Tailwind. Marca: **GROUNDED Labs — No hype. Solo IA que entiende tu mundo.**

