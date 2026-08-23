# GROUNDED Labs — AGENTS

Guía para que cualquier agente/IA retome este repo rápidamente. Fuente de verdad visual: `docs/index.html`. Detalle operativo completo: `app/README.md`.

## Qué hay aquí

Landing comercial + **zona de estudiantes** (login → perfil → recursos del curso) para el workshop "Tu Asistente Financiero con IA". Stack: **Next.js 16 (App Router) + Convex + Convex Auth (Password) + Tailwind v4** (estilo mono/oscuro, acento `#B4552B`; sin shadcn visible en las páginas nuevas — marcado propio con `font-mono` y `[brackets]`).

- `app/` = raíz Next.js. Todo el código vive acá.
- `app/src/app/page.tsx` = landing. `workshops/finanzas-personales-ia/` = landing del workshop.
- `app/src/app/signin/` = login/registro (pestañas ingresar/crear cuenta).
- `app/src/app/estudiantes/` = perfil (mis cursos) y `estudiantes/cursos/[slug]/` = página del curso: **[workshop]** (pase de abordar con fecha/formato/lugar/duración) + **[recursos]** (secciones 01–N como sellos).
- `app/src/app/admin/` = panel: aprobar cuentas pendientes y marcar pagos.
- `app/convex/` = backend: `schema.ts`, `auth.ts`, `courses.ts`, `material.ts`, `admin.ts`, `queries.ts`, `seed.ts`, `http.ts`.
- `app/scripts/course-definition.mjs` = **definición del catálogo** (curso, secciones, artículos, links, perfiles) — editar aquí y re-sembrar.
- `app/scripts/seed-course.mjs` = siembra hacia Convex (tablas + archivos).
- Header global: botón "Estudiantes →" (con sesión: "Perfil →").

## Arquitectura de la zona de estudiantes

1. **Auth**: Convex Auth Password. Al crear cuenta, el callback en `convex/auth.ts` crea `user_roles` (pending) y `workshop_registrations` (pending) para el curso sembrado.
2. **Acceso al material**: `api.material.getCourse` solo devuelve contenido con cuenta **active** + registro **paid** (check en `requireMaterialAccess`).
3. **Contenido en BD** (nada de material en el repo): tablas `courses`, `course_sections` (kind: info|articles|sample-data|docs|links), `course_items` (artículos/docs/links), `sample_profiles`, `sample_files`. Los archivos viven en **Convex storage**; la query entrega URLs que el estudiante usa directo.
4. **ZIP por perfil**: `POST /api/material/zip` (Next) descarga esas URLs y empaqueta sin dependencias (`src/lib/zip.ts`, método STORE). Valida anti-SSRF: solo host del deployment o `*.convex.cloud`.
5. **Cierre de sesión** y guard de autocuración de cookies viciadas en `ConvexClientProvider`.

## Estado (2026-08-22)

- **Deployment activo: `dev:flippant-dog-457`** (Convex nube, equipo `grounded-labs`). `.env.local` (gitignored) apunta ahí. Verificado end-to-end: signup → admin aprueba + marca pago → material → descargas → zip.
- Cuentas demo en ese deployment: `admin@groundedlabs.ai` (admin) y `estudiante@groundedlabs.ai` (activa + pagada), contraseña `demo1234`. El valor de `ADMIN_BOOTSTRAP_SECRET` está seteado en el deployment (no se commitea).
- El deployment local anterior está en desuso (existe: `local:…local_grounded_labs`).
- Tests: 10 pasando (`npm test` en `app/`): definición del curso, links https, zip. Lint/tsc/build limpios.

## Comandos (desde `app/`)

```bash
npx convex dev                      # watcher: empuja funciones a dev (requiere sesión: npx convex logout + cualquier comando abre browser)
npm run dev                         # Next en :3000
npm test / npm run lint / npm run build
npm run seed-course -- --secret <ADMIN_BOOTSTRAP_SECRET>   # re-siembra el catálogo (idempotente: borra y recrea)
npx convex run admin:promoteByEmail -- '{"email":"…","secret":"…","role":"admin"}'  # bootstrap de admin
npx convex env set X valor          # variables del deployment (JWT_PRIVATE_KEY necesita " -- " antes del valor)
```

## Operación del negocio

- **Nuevo estudiante**: crea cuenta en /signin → queda pending → admin entra a `/admin` → "aprobar" + "marcar pagado" → material desbloqueado.
- **Cambiar contenido del curso** (textos, secciones, links, perfiles): editar `scripts/course-definition.mjs` y correr `npm run seed-course --`.
- **Publicar un artículo/doc real** (pasa de "próximamente" a descargable): definirlo en la definición + subir archivo con `seed:attachItemFile` (action, args en `convex/seed.ts`).
- **Cambiar sample data**: reemplazar archivos en `../../workshop/sample-data` y re-sembrar (las guías del facilitador y README quedan excluidos automáticamente).

## Gotchas de Convex (aprendidos aquí)

- Los **actions no tienen `ctx.db`** directo: usar `ctx.runQuery`/`ctx.runMutation` (helpers exportados en `convex/seed.ts`). Igual los httpActions.
- HTTP API distingue `/api/mutation` de `/api/action` (matters al llamar funciones por fetch, como hace `seed-course.mjs`).
- Variables (`JWKS`, `JWT_PRIVATE_KEY`, `SITE_URL`, `ADMIN_BOOTSTRAP_SECRET`) se incrustan al **empujar**: tras cambiarlas, correr `npx convex dev --once` de nuevo.
- En local, los httpActions/storage se sirven en `127.0.0.1:3210/3211`; cookies `__session` de deployments anteriores provocan `Can't parse refresh token` (hay autocuración en `ConvexClientProvider`).
- **`JWT_PRIVATE_KEY` corrupto = login colgado**: si se setea en una sola línea (con espacios) o con padding inválido, la verificación del magic link muere con `atob: Invalid byte 61` (Server Error) → "cargando" infinito. Setear SIEMPRE multilínea: `npx convex env set JWT_PRIVATE_KEY -- "$(cat ruta.pem)"` (con `--`; y re-setear `JWKS` a juego).
- **Usuarios duplicados por email**: sign-Ins repetidos del mismo email pueden crear `users` duplicados → `admin:promoteByEmail` revienta con `unique() returned more than one result`. Dedupear (conservar el user vinculado a la authAccount, promover, borrar huérfanos + roles/sessions/refreshTokens) antes de promover.
- **Apuntar comandos a prod**: `env set` no acepta `--deployment`; usar `CONVEX_DEPLOYMENT=careful-spaniel-774 npx convex env set ...` (igual `deploy`/`run` con `--deployment`). `npx convex run auth:signIn` funciona (público) pero `auth:store` es interna (no llamable por HTTP directo).
- **BD local sin cloud**: `CONVEX_AGENT_MODE=anonymous npx convex dev` corre un backend 100% local (sin cuenta/cloud) en `3210/3211`; datos → `npx convex export` (cloud) → `import --replace-all`. Dashboard: `npx convex dashboard` en `:6790`. Env vars del deployment local se setean igual con `npx convex env set`.
- **DNS Umbrella bloquea `*.convex.cloud`** (resolver `192.168.40.1` → IPs sinkhole `146.112.x`): para operar cloud sin sudo, preload de Node que parchea `dns.lookup` → `NODE_OPTIONS="--require /tmp/dns-fix.js" npx convex ...`. En el navegador: Firefox con DoH, o red sin Umbrella.

## Pendientes / siguientes pasos

1. **Artículos "Antes de"** (Configurar Claude Code / OpenCode / Z.ai): sin escribir — están como "próximamente".
2. **Presentación y artículos del workshop**: publicar después de la sesión (sello 04).
3. **Sede y hora exactas**: hoy dice "Medellín · sede por confirmar" (`course-definition.mjs` → re-sembrar).
4. **`SITE_URL`** en Convex sigue en `http://localhost:3000`: actualizar al publicar el Next con dominio real.
5. **Deployment de producción**: `npx convex deploy` (repetir variables + seed) y deploy del Next (no hay config de Vercel todavía).
6. No hay E2E automatizado del flujo (solo verificación manual en navegador).

## Convenciones

- Español en UI y docs. Estilo: `font-mono`, colores `#0E1214/#111719/#1C2427/#262E31/#9AA3A1/#B4552B`, textos decorativos `// como comentarios` y `[brackets]`.
- El bloque `nextjs-agent-rules` en `app/AGENTS.md` lo reescribe `next dev` — commitearlo tal cual.
- No commitear secretos ni `.env*` (están gitignored).
