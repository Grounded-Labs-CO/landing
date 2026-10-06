# GROUNDED Labs — AGENTS

Guía para que cualquier agente/IA retome este repo rápidamente. Fuente de verdad visual: `docs/index.html`. Detalle operativo completo: `app/README.md`.

## Qué hay aquí

Landing comercial + **zona de estudiantes** (login → perfil → recursos del curso) para el workshop "Aprende IA construyendo tu Financial Advisor". Stack: **Next.js 16 (App Router) + Convex + Convex Auth (Password) + Tailwind v4** (estilo mono/oscuro, acento `#B4552B`; sin shadcn visible en las páginas nuevas — marcado propio con `font-mono` y `[brackets]`).

- `app/` = raíz Next.js. Todo el código vive acá.
- `app/src/app/page.tsx` = landing. `workshops/finanzas-personales-ia/` = landing del workshop.
- `app/src/app/signin/` = login/registro (pestañas ingresar/crear cuenta).
- `app/src/app/estudiantes/` = perfil (mis cursos) y `estudiantes/cursos/[slug]/` = página del curso: **[workshop]** (pase de abordar con fecha/formato/lugar/duración) + **[recursos]** (secciones 01–N como sellos).
- `app/src/app/admin/` = panel: aprobar cuentas pendientes y marcar pagos.
- `app/convex/` = backend: `schema.ts`, `auth.ts`, `courses.ts`, `material.ts`, `admin.ts`, `queries.ts`, `http.ts`, `mailer.ts`, `survey.ts`.
- `app/scripts/catalog-options.mjs` = listas del onboarding (profesiones, herramientas de IA).
- Header global: botón "Estudiantes →" (con sesión: "Perfil →").

## Arquitectura de la zona de estudiantes

1. **Auth**: Convex Auth Password. Al crear cuenta, el callback en `convex/auth.ts` crea `user_roles` (pending) y `workshop_registrations` (pending) para el curso sembrado.
2. **Acceso al material**: `api.material.getCourse` solo devuelve contenido con cuenta **active** + registro **paid** (check en `requireMaterialAccess`).
3. **Contenido en BD** (nada de material en el repo): tablas `courses`, `course_sections` (kind: info|articles|checklist|sample-data|docs|links), `course_items` (artículos/docs/links/checklist, con `group` e `imageStorageId`), `sample_profiles`, `sample_files`. Los archivos viven en **Convex storage**; la query entrega URLs que el estudiante usa directo. `courses.eventInfo` acepta `url` por fila (link en la ficha: mapa, calendario) y `courses.calendarUrl` alimenta el botón "agregar al calendario" del pase.
4. **ZIP por perfil**: `POST /api/material/zip` (Next) descarga esas URLs y empaqueta sin dependencias (`src/lib/zip.ts`, método STORE). Valida anti-SSRF: solo host del deployment o `*.convex.cloud`.
5. **Cierre de sesión** y guard de autocuración de cookies viciadas en `ConvexClientProvider`.

## Encuesta de cierre + sesión de follow-up

Mide lo que el piloto del 26-sep dejó sin medir (NPS, finalización, precio, origen, señal B2B,
demanda). Fuente: `workshop/workshops/AI-Financial-Advisor/encuesta-cierre/encuesta-cierre.md`
(repositorio hermano `workshop/`) y sus umbrales en `cierre-financiero-26-sep/analisis.md` §6.

Todo se opera desde `/admin` → pestaña *encuesta*, que son **tres sub-tabs numerados, uno a la
vez** (apilados había que hacer mucho scroll para llegar al botón de enviar):

1. **Sesión** — **una sola por workshop**, no varias. Cambiar la fecha es editar la misma fila.
   Campos: título, **fecha** (`<input type="date">`), **hora** (`<input type="time">`), link,
   **cuánto dura** (desplegable: 30 min … 3 h, por defecto 1 hora) y agenda. **La fecha es lo único
   obligatorio.** Fecha y hora son ISO / `HH:MM`, no texto libre: nada de escribir "jueves 8 de
   octubre" a mano. Todo lo legible se formatea desde ahí (`formatDate`/`formatTime`). El link de
   **agendar** en Google Calendar **se arma solo** desde fecha+hora+duración (`googleCalendarUrl`):
   así no se puede quedar viejo ni durar lo que no dura. `durationMinutes` es solo para el evento
   del calendario, no sale en el texto del correo.
   Sin campo de estado: **si tiene `date`, la sesión existe**; si ya pasó la fecha, `isPast()` la
   da por terminada y se deja de invitar y de recordar.
2. **Invitar** — la lista real de inscritos, con casillas. Cada persona recibe un **link con
   token** (`/encuesta?t=<token>`), así que **nadie escribe su nombre ni su correo** (ahí es donde
   más se equivocan). Estados: `sin enviar` / `enviado · sin responder` / `respondió`. Marcar a
   alguien que ya recibió el correo **reenvía**; a los que respondieron no se les puede volver a
   invitar, pero sí "reenviar info".
3. **Respuestas** — NPS con los umbrales de §6 ya calculados, conteos por pregunta, respuestas
   abiertas y export a **CSV** (punto y coma, para abrirlo en la hoja de `comercial/inscripciones/`).

**Sin fecha de sesión no se puede invitar, y es por diseño**: el correo #1 promete que con la
respuesta llega la fecha y el link, así que sin fecha sería una promesa falsa. Bloquea en las tres
capas — el panel abre directo en *sesión* y deja el botón en "sin fecha de sesión", y
`survey:sendInvites` **lanza** si no hay fecha aunque se llame por debajo del panel.

**Correos** (`convex/survey.ts`, armados con el shell de `convex/mailer.ts`). **Solo dos, y el
primero no es una puerta:**

- `#1` — encabezado *"Gracias por haber estado con nosotros"*, asunto *"Gracias por venir — ¿nos
  ayudas con 3 minutos?"*. Tono: agradecimiento primero, el favor después y salida libre explícita
  ("si no tienes esos 3 minutos, escríbenos por WhatsApp y te guardamos el lugar igual"). Pide
  feedback, avisa que con eso llega la fecha y el link. No condiciona nada.
- `#2` — *"Ya tienes tu lugar para la sesión"*: panel con fecha/hora y link, la agenda, y botones
  de entrar y de agendar. **Solo la primera vez** y **solo si hay sesión fechada**: es el correo de
  los datos, sin ellos no hay nada que mandar (`sendConfirmation` devuelve `false` y la pantalla de
  gracias no promete nada). Ya no existe el correo de "recibimos tu respuesta".

**Formulario** (`src/components/SurveyFlow.tsx`): una pregunta por pantalla, un toque avanza,
`atrás` siempre, autoguardado en `localStorage`, paso de **revisión** antes de enviar y botón de
enviar bloqueado mientras falte una obligatoria (las 2 abiertas son opcionales). Es pública y sin
login (`robots: noindex`). El `?t=` solo se acepta si es hex de 16–64 chars; cualquier otra cosa
cae al modo anónimo (pide nombre y correo).

**Recordatorio en "mis cursos"** (`SurveyNudge`, `survey.mySurveyStatus`): aparece **solo** si ya
se le mandó el correo, sigue sin responder y la fecha de la sesión no pasó. Es una línea, tiene
"ahora no" (un **snooze de 7 días**, no un borrado) y no bloquea nada. No modal, no insiste.

Tablas: `survey_invites` (token + email + `sentAt`), `survey_responses` (una por token, se
actualiza si reenvían), `followup_sessions` (uno por curso).

## Despliegue — el orden importa

`convex/` y el Next **se despliegan por caminos separados**:

- **Convex**: `npx convex dev --once` (dev) · `CONVEX_DEPLOYMENT=careful-spaniel-774 npx convex deploy` (prod).
- **Next**: Vercel, al hacer `git push` a `main`.

**El dominio de producción es `https://www.grounded-labs.com/`** (`SITE_URL` de prod). Ojo:
`grounded-labs.vercel.app` también responde, pero es un deploy viejo y **no** es el que se usa.

**Regla: primero Convex, después el frontend.** Si el frontend llega antes, queda llamando
funciones que el backend no conoce — y `useQuery` **lanza** el error en render, así que no degrada:
rompe la página entera. Pasó el 2026-09-30: `/estudiantes` cayó para todos los alumnos porque
`SurveyNudge` pedía `survey:mySurveyStatus` y prod todavía no la tenía.

Y al revés: un `convex deploy` empuja **todo** `convex/`, incluido lo que esté sin commitear. Antes
de deployar a prod, sacar del medio lo que no sea de ese cambio
(`git stash push -- app/convex/<archivo>`) y devolverlo después con `git stash pop`.

## Estado (2026-08-22)

- **Deployment activo: `dev:flippant-dog-457`** (Convex nube, equipo `grounded-labs`). `.env.local` (gitignored) apunta ahí. Verificado end-to-end: signup → admin aprueba + marca pago → material → descargas → zip.
- Cuentas demo en ese deployment: `admin@groundedlabs.ai` (admin) y `estudiante@groundedlabs.ai` (activa + pagada), contraseña `demo1234`. El valor de `ADMIN_BOOTSTRAP_SECRET` está seteado en el deployment (no se commitea).
- El deployment local anterior está en desuso (existe: `local:…local_grounded_labs`).
- Tests: 11 pasando (`npm test` en `app/`): lógica de onboarding, zip y render de landings. Lint/tsc/build limpios.
- **Contenido (2026-09-17): sin seed ni archivos de definición.** Curso (título, precio, horario, eventInfo, estado) y **brochure PDF** se administran desde `/admin` → *cursos*; el brochure se sirve con nombre legible en `/api/brochure/<slug>`. Secciones, ítems, links y sample data: dashboard de Convex. Para un deployment nuevo: `npx convex export` → `npx convex import --replace-all`.
- **Contenido del workshop (2026-09-16)**: 6 secciones — 01 Qué necesitas saber (Tinkko Coworking · Milla de Oro, con dirección + link a mapa, parqueadero en modal, agregar-al-calendario) · 02 Antes de · 03 Qué documentos traer (checklist de 17 ítems con marcas en localStorage) · 04 Datos de prueba (expediente **Andrés Felipe Restrepo**: foto, ficha, bio y 17 documentos que se descargan en un solo .zip) · 05 Presentación y artículos · 06 Links de interés. Soportes: WhatsApp +57 323 908 5619 en mis cursos, curso y material bloqueado.
- **Prod (2026-09-16)**: `careful-spaniel-774` ya tiene el código nuevo (functions+schema) y el mismo contenido (48 docs + 20 archivos de storage, sin tocar usuarios ni registros). El Next de Vercel producción toma el código al hacer push de `main` a origin.
- **Post-workshop (2026-09-26)**: curso `finanzas-personales-ia` en `completed` (dev y prod). La landing cierra con **lista de espera** (`WaitlistForm` → tabla `leads`, visible en `/admin` → dashboard) y fechas/precio leídos de la BD, sin hardcodes. Las ediciones dictadas se pintan en "próximos eventos" como tarjeta `ya dictado` con "me interesa" (query pública `courses:listPast`). Tests: 13 pasando (el lint sigue con errores `no-explicit-any` preexistentes en `admin/page.tsx` y `PhoneInput.tsx`).
- **Encuesta de cierre (2026-09-30)**: live en `dev:flippant-dog-457` (tablas `survey_*` + `followup_sessions` creadas, funciones empujadas). Verificado end-to-end por CLI: submit real guarda la respuesta, **no duplica al reenviar**, `nps`/códigos inválidos se rechazan y el fallo de Resend devuelve `emailed:false` sin romper la pantalla. Faltan 2 cosas antes de mandar invitaciones de verdad: (a) poner la **fecha/link de la sesión** en `/admin` → *encuesta* → 1; (b) **`SITE_URL` sigue en `http://localhost:3000`** en ese deployment — los links del correo saldrían apuntando a localhost (`CONVEX_DEPLOYMENT=flippant-dog-457 npx convex env set SITE_URL https://<dominio-real>` + `npx convex dev --once`). Tests: **35 pasando**.

## Comandos (desde `app/`)

```bash
npx convex dev                      # watcher: empuja funciones a dev (requiere sesión: npx convex logout + cualquier comando abre browser)
npm run dev                         # Next en :3000
npm test / npm run lint / npm run build
npx convex run admin:promoteByEmail -- '{"email":"…","secret":"…","role":"admin"}'  # bootstrap de admin
npx convex env set X valor          # variables del deployment (JWT_PRIVATE_KEY necesita " -- " antes del valor)
```

## Operación del negocio

- **Nuevo estudiante**: crea cuenta en /signin → queda pending → admin entra a `/admin` → "aprobar" + "marcar pagado" → material desbloqueado (y "quitar pago" si hay que revertirlo).
- **Cambiar contenido del curso**: la BD es la fuente de verdad. Título, tagline, slug, horario, precio, eventInfo, link de calendario, **estado** y **brochure** desde `/admin` → *cursos*; secciones, ítems, links y sample data desde el dashboard de Convex. El título alimenta además el hero de la landing del workshop (query en vivo) y el `<title>` SEO (ISR ~5 min).
- **Publicar un artículo/doc real** (pasa de "próximamente" a descargable): hoy solo por dashboard (`course_items`: `storageId` + `status: published`). Falta UI en `/admin`.
- **Cambiar sample data**: hoy por dashboard de Convex (tablas `sample_profiles`/`sample_files` + storage) — el flujo viejo de `sample-data` + re-sembrar ya no existe. Atajos admin: `admin:setSampleProfileZip` (ZIP del expediente), `admin:replaceSampleFiles` (reemplaza el set de archivos; se suben con `admin:generateSampleFileUploadUrls`) y `admin:purgeOrphanStorage` (limpieza de archivos sin referencia, acepta `dryRun`).
- **Clonar un curso (nueva edición)**: `/admin` → *cursos* → `clonar`. Pide slug nuevo (único), título,
  fecha y precio. Copia secciones, ítems, sample data y **copia** los archivos de storage (no los
  comparte: los borrados/reemplazos no miran referencias cruzadas). El clon queda `disabled`, sin
  `calendarUrl` y con la sesión de follow-up sin fecha ni link; no copia inscritos ni encuestas. Es una
  action (`admin:cloneCourse`) porque copia blobs. No tiene landing propia (`workshops/` está atado al
  slug de finanzas). Diseño: `docs/clonar-curso.md`.
- **Eliminar un curso**: `/admin` → *cursos* → `eliminar` → escribir `eliminar-curso`. Borra el curso y
  su contenido con sus archivos. **Se niega** si hay inscripciones, invitaciones o respuestas de encuesta.
- **Invitar a la encuesta + abrir la sesión de follow-up**: `/admin` → *encuesta*. Orden: (1)
  *sesión* → poner la fecha (lo único obligatorio), hora, link y agenda, y guardar; (2) *invitar* →
  marcar a la gente y enviar. Cada fila muestra si ya se envió y si respondió, así que reenviar es
  volver a marcar la casilla; los que ya respondieron no se re-invitan. Todo por correo con Resend,
  sin salir de la app.
- **Cambiar la fecha de la sesión**: se edita la misma fila (no hay historial de fechas). Los links
  del correo no se rompen porque se arman en el momento, no se guardan. Si ya se mandó la
  invitación, la fecha nueva no le llega a nadie solo: hay que reenviar con "reenviar info".

## Gotchas de Next 16 (aprendidos aquí)

- **`"use client"` + `export default async` rompe la página**: *"X is an async Client Component.
  Only Server Components can be async"*. En Next 16 no compila al build, **solo revienta en la
  consola del navegador** — el build y `tsc` pasan limpios. Para leer query params en una página
  cliente, leerlos con `useSearchParams()` **dentro** de un hijo envuelto en `<Suspense>`, no con
  `await searchParams` en el default export. Así lo hace `signin/page.tsx`.
- Cuando se arregla con `useSearchParams`, la página pasa de `ƒ (Dynamic)` a `○ (Static)`: mejor.

## Gotchas de Convex (aprendidos aquí)

- **`internalMutation` NO se puede pasar a `ctx.runMutation`**: devuelve un callable plano (con
  `isInternal`), no una `FunctionReference`, y el runtime lo rechaza con *"is not a
  functionReference"*. Para invocar una función interna desde una **action** (que no tiene
  `ctx.db`) hay que pasar una referencia por path: `anyApi.modulo.fn` de `convex/server`.
- **Nunca importar `api` desde un archivo de `convex/` que tenga auto-referencias**: `api.d.ts`
  importa todos los archivos de `convex/`, así que importar `api` de vuelta arma un ciclo
  (api.d.ts → survey.ts → api.d.ts) y **colapsa el tipo `api` a `any` en TODO el repo** — se
  mince el tipocheck con `TS7006` en archivos que ni tocaste, sin error visible que lo explique.
  `profile.ts` tiene una auto-referencia y aguanta, pero no abusar: usar `anyApi` de
  `convex/server` (sin tipos, sin ciclo). Ver `convex/survey.ts`.
- Una función interna usada por `anyApi` debe estar **`export`ada**, si no existe como función
  desplegada y sale *"Couldn't resolve api.modulo.fn"*.
- Los **actions no tienen `ctx.db`** directo: usar `ctx.runQuery`/`ctx.runMutation`. Igual los httpActions.
- HTTP API distingue `/api/mutation` de `/api/action` (matters al llamar funciones por fetch).
- Variables (`JWKS`, `JWT_PRIVATE_KEY`, `SITE_URL`, `ADMIN_BOOTSTRAP_SECRET`) se incrustan al **empujar**: tras cambiarlas, correr `npx convex dev --once` de nuevo.
- En local, los httpActions/storage se sirven en `127.0.0.1:3210/3211`; cookies `__session` de deployments anteriores provocan `Can't parse refresh token` (hay autocuración en `ConvexClientProvider`).
- **`JWT_PRIVATE_KEY` corrupto = login colgado**: si se setea en una sola línea (con espacios) o con padding inválido, la verificación del magic link muere con `atob: Invalid byte 61` (Server Error) → "cargando" infinito. Setear SIEMPRE multilínea: `npx convex env set JWT_PRIVATE_KEY -- "$(cat ruta.pem)"` (con `--`; y re-setear `JWKS` a juego).
- **Usuarios duplicados por email**: sign-Ins repetidos del mismo email pueden crear `users` duplicados → `admin:promoteByEmail` revienta con `unique() returned more than one result`. Dedupear (conservar el user vinculado a la authAccount, promover, borrar huérfanos + roles/sessions/refreshTokens) antes de promover.
- **Apuntar comandos a prod**: `env set` no acepta `--deployment`; usar `CONVEX_DEPLOYMENT=careful-spaniel-774 npx convex env set ...` (igual `deploy`/`run` con `--deployment`). `npx convex run auth:signIn` funciona (público) pero `auth:store` es interna (no llamable por HTTP directo).
- **BD local sin cloud**: `CONVEX_AGENT_MODE=anonymous npx convex dev` corre un backend 100% local (sin cuenta/cloud) en `3210/3211`; datos → `npx convex export` (cloud) → `import --replace-all`. Dashboard: `npx convex dashboard` en `:6790`. Env vars del deployment local se setean igual con `npx convex env set`.
- **DNS Umbrella bloquea `*.convex.cloud`** (resolver `192.168.40.1` → IPs sinkhole `146.112.x`): para operar cloud sin sudo, preload de Node que parchea `dns.lookup` → `NODE_OPTIONS="--require /tmp/dns-fix.js" npx convex ...`. En el navegador: Firefox con DoH, o red sin Umbrella.

## Pendientes / siguientes pasos

1. **Artículos "Antes de"** (Configurar Claude Code / Claude Desktop): sin escribir — están como "próximamente".
2. **Presentación y artículos del workshop**: publicar después de la sesión (sello 05).
3. ~~Sede y hora exactas~~ → resuelto: **Tinkko Coworking · Milla de Oro** (Cra 42 #3 Sur 81, torre 1, piso 8), 8:00 a.m.
4. **`SITE_URL`** en Convex: en `flippant-dog-457` sigue en `http://localhost:3000`. Es lo que arma los links del correo de la encuesta, así que hay que ponerlo al dominio real **antes** de mandar invitaciones.
5. **Deployment de producción**: Convex ya está deployado y con la data; falta `git push origin main` para que Vercel producción reconstruya el Next.
6. No hay E2E automatizado del flujo (solo verificación manual en navegador; se usó una cuenta de prueba en dev que ya se limpió).

## Convenciones

- Español en UI y docs. Estilo: `font-mono`, colores `#0E1214/#111719/#1C2427/#262E31/#9AA3A1/#B4552B`, textos decorativos `// como comentarios` y `[brackets]`.
- El bloque `nextjs-agent-rules` en `app/AGENTS.md` lo reescribe `next dev` — commitearlo tal cual.
- No commitear secretos ni `.env*` (están gitignored).
