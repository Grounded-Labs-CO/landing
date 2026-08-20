# GROUNDED Labs — Landing

> ***No hype.* Solo inteligencia artificial que entiende tu mundo.**

Landing corporativa + workshop **Finanzas Personales con Inteligencia Artificial** para profesionales que dependen de su conocimiento. Construida como base reutilizable para verticales por profesión.

**Live:** `grounded-labs` en Vercel (project `prj_GQYsirzz8VLhQnIF0k3ihCTMOrnx`) · **Stack:** Next.js 16 + Convex + Tailwind v4 + shadcn/ui `base-nova` `neutral`

## Stack

- **Framework:** Next.js 16 (App Router, React 19, Turbopack)
- **Backend/DB:** Convex + `@convex-dev/auth` (Password provider)
- **Styling:** Tailwind CSS v4 + shadcn/ui (`base-nova`, `neutral`) + `tw-animate-css`
- **UI:** `lucide-react`, `next-themes` (light), `recharts`
- **Tests:** Vitest + Testing Library + jsdom + `@vitejs/plugin-react`
- **Fonts:** DM Sans + Fraunces (warm editorial `#f6f2ea`, `#236b4b`, `#c86f3d`)

## Estructura

```
landing/                      # repo root (este directorio)
├── README.md                 # este archivo
├── AGENTS.md                 # puntero a docs/ (fuente de verdad)
├── CLAUDE.md                 # @AGENTS.md
├── ARCHITECTURE_TEMPLATE.md  # plantilla reutilizable Next+Convex+Tailwind
├── docs/                     # documentación HTML interactiva (fuente de verdad)
│   ├── index.html
│   ├── architecture.html
│   ├── rules.html
│   └── tasks.html
└── app/                      # app Next.js (todo el código vive acá)
    ├── package.json
    ├── next.config.ts
    ├── components.json
    ├── convex/               # schema + auth + queries/mutations
    │   ├── schema.ts         # user_roles, leads, workshop_registrations
    │   ├── auth.ts           # Password + afterUserCreatedOrUpdated -> pending
    │   ├── queries.ts        # getUserRole, listLeads (admin-only)
    │   ├── mutations.ts      # createLead
    │   ├── admin.ts          # approveUser
    │   └── _generated/       # stub para next build sin convex dev
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx    # fonts, ThemeProvider, ConvexClientProvider, Header
    │   │   ├── page.tsx      # landing corporativa (warm editorial)
    │   │   ├── signin/       # login Password
    │   │   ├── admin/        # dashboard admin
    │   │   └── workshops/finanzas-personales-ia/ # landing workshop
    │   ├── components/       # ui/button, Header, AuthGuard, ConvexClientProvider
    │   ├── hooks/useRole.ts
    │   ├── lib/utils.ts
    │   └── test/             # page.test.tsx + setup
    └── public/
```

> **Nota monorepo ligero:** el código Next.js está en `app/` (ver `AGENTS.md`). Vercel está configurado con **Root Directory = `app`** (dashboard). Localmente corre `npm` desde `app/`.

## Desarrollo

```bash
cd app
npm install          # instala deps
npx convex dev       # levanta Convex (requiere CONVEX_DEPLOYMENT en .env.local)
npm run dev          # Next.js http://localhost:3000
npm run build        # build producción (Turbopack, genera .next)
npm run lint         # eslint (next)
npm run test         # vitest run (4 tests)
```

## Variables de entorno

Copiar `app/.env.local.example` a `app/.env.local`:

```
CONVEX_DEPLOYMENT=local:local-grounded-labs
NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210
NEXT_PUBLIC_CONVEX_SITE_URL=http://127.0.0.1:3211
```

> `.env.local` está ignorado por `.gitignore`. Nunca commitear secretos. Para producción, configurar envs en Vercel + despliegue Convex.

## Deploy

- **Vercel:** proyecto `grounded-labs` (`team_WTgWb5l8KQf6sv6G34gZ1DhT`). Root Directory = `app`. Build command por defecto `next build` (Turbopack).
- **Convex:** `npx convex deploy` o `npx convex dev` conectado al deployment remoto.

## Documentación

Fuente de verdad en `docs/` (HTML interactivo, no markdown):

- `docs/index.html` — índice
- `docs/architecture.html` — stack, schema, componentes, convenciones
- `docs/rules.html` — reglas de negocio y filosofía (cero humo)
- `docs/tasks.html` — roadmap (Wompi, lead magnet, verticales, E2E)

`app/docs/` es espejo de `docs/` para que Next.js lo sirva si se necesita.

## Contenido actual

- `/` — corporativa: manifiesto, problema, método, próximos eventos (cards), quiénes somos, recurso gratuito
- `/workshops/finanzas-personales-ia` — landing transaccional (agenda 4h, precio $400k lanzamiento, checkpoints, FAQ)
- `/signin` y `/admin` — auth `viewer`/`pending`/`active` vía `user_roles`
- **Footer:** LinkedIn, Instagram y `groundedlabsco@gmail.com` (sin sección empresas por ahora)

## Público

Repo **público** (`Grounded-Labs-CO/landing`). No contiene secretos, tokens ni datos reales. `research-paginas-inspiracion.md` es análisis de referentes (Maven, Reforge, Section, Le Wagon, Coderhouse) y propuesta de estructura corporativa — sin copy final ni datos sensibles.

## Licencia

Privado — GROUNDED Labs. No reutilizar sin permiso.
