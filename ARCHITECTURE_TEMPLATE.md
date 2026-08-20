# Tech Stack Template — Next.js + Convex + Tailwind

Plantilla de arquitectura reutilizable para nuevos proyectos, extraída de este dashboard.
Copia este archivo al root del nuevo proyecto y dile a Claude Code: *"usa esta arquitectura como base"*.

## Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Backend/DB**: Convex (base de datos reactiva + funciones serverless, todo en TypeScript)
- **Auth**: `@convex-dev/auth` con provider `Password` (email/password), fácilmente cambiable a OAuth
- **Styling**: Tailwind CSS v4 + shadcn/ui (`base-nova` style, `neutral` base color)
- **Iconos**: lucide-react
- **Charts**: Recharts (si el proyecto necesita gráficos)
- **Tests**: Vitest + Testing Library + jsdom
- **Otros**: `next-themes` (dark/light mode), `clsx` + `tailwind-merge` (className utils vía `cn()`)

## Estructura de carpetas

```
project-root/
├── AGENTS.md              # Puntero a docs/ (ver abajo)
├── CLAUDE.md               # @AGENTS.md (import simple)
├── docs/                   # Documentación HTML interactiva (fuente de verdad)
│   ├── index.html
│   ├── architecture.html   # Stack, schema, componentes, convenciones
│   ├── rules.html          # Reglas de negocio, fórmulas
│   └── tasks.html          # Roadmap, tech debt
├── app/                     # App Next.js (todo el código vive acá)
│   ├── convex/
│   │   ├── schema.ts        # Definición de tablas
│   │   ├── auth.ts          # convexAuth() con providers
│   │   ├── auth.config.ts   # Config de dominio para auth
│   │   ├── http.ts          # HTTP endpoints de Convex (webhooks, etc.)
│   │   ├── queries.ts       # Queries (lecturas reactivas)
│   │   ├── mutations.ts     # Mutations (escrituras)
│   │   ├── admin.ts         # Lógica admin-only
│   │   └── seed.ts          # Script de datos semilla
│   ├── src/
│   │   ├── app/              # App Router: cada carpeta = ruta
│   │   │   ├── layout.tsx    # Root layout (fonts, ThemeProvider, ConvexClientProvider, Header)
│   │   │   ├── page.tsx
│   │   │   ├── signin/
│   │   │   ├── admin/         # Rutas protegidas por rol
│   │   │   └── api/           # Route handlers (ej: /api/sync)
│   │   ├── components/
│   │   │   ├── ui/            # Componentes shadcn (button, etc.)
│   │   │   ├── AuthGuard.tsx  # Wrapper que redirige a /signin si no autenticado
│   │   │   ├── ConvexClientProvider.tsx
│   │   │   └── Header.tsx
│   │   ├── hooks/
│   │   │   └── useRole.ts     # Hook custom sobre useQuery(api.queries.X)
│   │   ├── lib/
│   │   │   └── utils.ts       # cn() y helpers
│   │   └── test/
│   │       └── setup.ts
│   ├── components.json       # Config shadcn
│   ├── vitest.config.ts
│   └── package.json
```

## Convex — patrones clave

- **Schema** (`convex/schema.ts`): tablas tipadas con `defineTable` + índices (`.index("by_x", ["x"])`) para todas las queries filtradas.
- **Auth**: `convexAuth({ providers: [Password], callbacks: { afterUserCreatedOrUpdated } })`. El callback crea automáticamente un registro en una tabla de roles (`user_roles`) con estado `pending` para nuevos usuarios — requiere aprobación manual de un admin.
- **Roles**: patrón simple de tabla `user_roles` con `role` (`viewer`/`admin`) y `status` (`pending`/`active`), consultado vía `api.queries.getUserRole` y expuesto con el hook `useRole()`.
- **Queries/Mutations**: separadas en `queries.ts` (solo lectura) y `mutations.ts` (escritura). Nunca lógica de negocio pesada en componentes — todo vive en Convex.
- **Cache/agregados**: si hay cálculos costosos, usar una tabla de cache (`cache.ts`) que se reconstruye con una función Convex ejecutable manualmente (`npx convex run cache:rebuildX`) en vez de recalcular en cada query.

## Frontend — patrones clave

- **`ConvexClientProvider`**: wrappea la app con `ConvexAuthProvider` + `ConvexReactClient`, inicializado desde `NEXT_PUBLIC_CONVEX_URL`.
- **`AuthGuard`**: componente cliente que usa `useConvexAuth()` y redirige a `/signin` si `!isAuthenticated`. Se envuelve en cada layout de sección protegida.
- **`useRole()`**: hook que envuelve `useQuery(api.queries.getUserRole)` y expone `{ role, isAdmin, isPending, isLoading }`.
- **Layout raíz**: fonts (Geist Sans/Mono vía `next/font/google`), `ThemeProvider` de `next-themes`, `Header` global, `main` con `max-w-[1400px] mx-auto`.
- **shadcn/ui**: instalar componentes con `npx shadcn add <componente>`, quedan en `src/components/ui/`. Alias configurados: `@/components`, `@/lib`, `@/hooks`, `@/components/ui`.

## Variables de entorno (`.env.local`)

```
CONVEX_DEPLOYMENT=local:local-{team}-{project}
NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210
NEXT_PUBLIC_CONVEX_SITE_URL=http://127.0.0.1:3211
```

## Comandos base

```bash
npx convex dev          # levanta backend Convex en modo dev (watch de convex/)
npm run dev              # levanta Next.js
npm run test             # vitest run
npm run lint
```

## Documentación

Toda la documentación de negocio/arquitectura vive en `docs/*.html` (interactivo, no `.md`), con `AGENTS.md` en el root como puntero simple. `CLAUDE.md` solo importa `AGENTS.md` con `@AGENTS.md`.

## Cómo reusar esto en un proyecto nuevo

1. `npx create-next-app@latest` con TypeScript + Tailwind + App Router.
2. `npm install convex @convex-dev/auth @auth/core` y `npx convex dev` para inicializar `convex/`.
3. Copiar patrones de `auth.ts`, `auth.config.ts`, `schema.ts` (tabla `user_roles`) y el flujo de `AuthGuard` + `useRole`.
4. `npx shadcn init` con `base-nova` / `neutral`, agregar componentes según necesidad.
5. Adaptar `schema.ts` al dominio del nuevo proyecto (tablas propias en vez de usage/tokens/etc.).
6. Crear `docs/` con la misma estructura HTML si el proyecto lo amerita.
