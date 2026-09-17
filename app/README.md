# GROUNDED Labs — App

Landing migrada de `workshops/finanzas-personales-ia/landing.html` a **Next.js 16 + Convex + Tailwind v4 + shadcn/ui (base-nova, neutral)** siguiendo `ARCHITECTURE_TEMPLATE.md`.

## Estructura

Ver `../docs/` (fuente de verdad) y `../AGENTS.md`.

- `app` = raíz Next.js (este directorio)
- `convex/` = schema + auth + queries/mutations (ver `../ARCHITECTURE_TEMPLATE.md`)
- `src/app/` = App Router (page.tsx = landing, /signin, /estudiantes, /estudiantes/cursos/[slug], /admin)
- `src/components/` = ConvexClientProvider, AuthGuard, Header, ui/*
- `src/hooks/useRole.ts` = wrapper de `api.queries.getUserRole`
- `scripts/catalog-options.mjs` = listas del onboarding (profesiones, herramientas de IA)
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

## Zona de estudiantes

Flujo (auto-registro + aprobación de admin):

1. El botón **Estudiantes** del header (→ **Perfil** con sesión) lleva a `/estudiantes` → si no hay sesión, redirige a `/signin`.
2. El estudiante crea cuenta (email + contraseña). El callback de auth crea `user_roles` (pending) y `workshop_registrations` (pending) para el curso sembrado.
3. Un admin entra a `/admin`: **aprobar** la cuenta y **marcar pagado** el registro.
4. Con cuenta activa + curso pagado, el estudiante ve el curso: **workshop** (pase de abordar con fecha, formato, lugar, duración) + **recursos** (secciones dinámicas 01–N desde la BD: qué necesitas saber, antes de, sample data, presentación y artículos, links de interés).

Todo el contenido viene de Convex: tablas `courses`, `course_sections`, `course_items`, `sample_profiles`, `sample_files`. Los archivos viven en **Convex storage** (no en el repo); `api.material.getCourse` entrega URLs firmadas solo a estudiantes con acceso. El ZIP por perfil lo arma `POST /api/material/zip` (Next) descargando esas URLs firmadas, con validación anti-SSRF del host Convex.

### Contenido del curso (todo en BD, sin seed)

No hay archivo de definición ni script de siembra: **la base de datos es la única
fuente de verdad** del contenido (tablas `courses`, `course_sections`,
`course_items`, `sample_profiles`, `sample_files`).

- **Curso** (título, tagline, slug, horario, precio, eventInfo) y **estado**: editable en `/admin` → pestaña *cursos*.
- **Brochure** (PDF que la landing muestra en el hero): se sube en `/admin` → *cursos* → **editar** → *brochure*. El archivo va a Convex storage y la landing lo abre con el visor del navegador vía `/api/brochure/<slug>?disposition=inline`; sin ese parámetro la misma ruta lo descarga con nombre legible. Mientras no haya brochure, el botón no se pinta.
- **Secciones, ítems, links y sample data**: se editan directo en el dashboard de Convex (no hay UI todavía).
- **Deployment nuevo**: reemplazar la siembra con un snapshot de la BD real —
  `npx convex export --path backup.zip` en el deployment actual y
  `npx convex import --replace-all backup.zip` en el nuevo (excluir tablas de auth/usuarios si no querés clonar cuentas).

### Bootstrap del primer admin

```bash
# una vez creada la cuenta en /signin:
npx convex env set ADMIN_BOOTSTRAP_SECRET <secreto>   # una sola vez por deployment
npx convex run admin:promoteByEmail -- '{"email":"tu@email.com","secret":"<secreto>","role":"admin"}'
```

### Pasar de Convex local a Convex nube

1. `npx convex dev` → login y crear/elegir deployment en la nube (reescribe `.env.local`).
2. Setear en el deployment: `ADMIN_BOOTSTRAP_SECRET`, y para auth `JWKS` + `JWT_PRIVATE_KEY` (RS256; ver `labs.convex.dev/auth/setup/manual` — el wizard `npx @convex-dev/auth` también lo hace) y `SITE_URL` con la URL real del sitio.
3. `npx convex dev` de nuevo para que las funciones empaqueten las variables nuevas.
4. Cargar el contenido: `npx convex import --replace-all <backup.zip>` (snapshot de un deployment que ya lo tenga) o crearlo a mano desde el dashboard.
5. Promover tu cuenta a admin (ver arriba) y operar desde `/admin`.

> Ojo: `JWT_PRIVATE_KEY` empieza con `-----`; con la CLI pásalo con `--`: `npx convex env set JWT_PRIVATE_KEY -- "<pem>"`.

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

