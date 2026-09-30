# Changelog

## 2026-09-30 — Encuesta de cierre y sesión de follow-up

Mide lo que el piloto del 26-sep dejó sin medir: NPS, finalización, percepción de precio,
origen de la venta, señal B2B y demanda de lo que sigue.

### Encuesta (`/encuesta`)
- Pública y sin login (`noindex`). Una pregunta por pantalla, un toque avanza, `atrás` siempre,
  autoguardado en `localStorage`, paso de **revisión** antes de enviar y botón de enviar bloqueado
  mientras falte una obligatoria (las 2 abiertas son opcionales).
- **Link con token por persona** (`?t=<token>`): nombre y correo ya vienen puestos, así nadie los
  escribe mal. Un token que no sea hex de 16–64 caracteres cae a modo anónimo en vez de romperse.
- Las 11 preguntas del documento (`encuesta-cierre.md`), con campo "¿cuál?" cuando el origen es
  *Otro*. El servidor revalida `nps` y los códigos: una respuesta incompleta no entra a la BD.
- Volver a enviar **actualiza la misma fila**, no duplica.

### Correos
- Dos correos con el shell de marca. El **#1** pide el favor (agradecimiento primero, salida libre
  por WhatsApp) y es dinámico: asunto, preheader y la frase de la sesión se arman desde la fecha y
  la agenda. El **#2** entrega fecha, hora, link y agenda; sale solo la primera vez y solo si hay
  sesión fechada.
- `convex/templates.ts` es **puro** y lo comparten el servidor y el preview de `/admin`, así que lo
  que se ve en el panel es exactamente lo que sale por Resend.

### Admin (`/admin` → *encuesta*)
- Tres sub-tabs: **sesión** (fecha, hora, link, agenda — una sola por workshop), **invitar**
  (los inscritos reales con casillas, estado por persona y reenvío) y **respuestas** (NPS con los
  umbrales de §6, conteos por pregunta y export CSV).
- Preview del correo de confirmación, colapsado.
- Sin fecha de sesión **no se puede invitar**: el bloqueo va en el panel y en `survey:sendInvites`.

### Recordatorio
- `SurveyNudge` en "mis cursos": aparece solo si ya se envió, sigue sin responder y la sesión no
  pasó. "ahora no" es un **snooze de 7 días**, no un borrado permanente.

### Arreglos de paso
- `src/app/signin/page.tsx`: `"use client"` + `export default async` rompía la página — y **solo en
  runtime**, porque el build y `tsc` pasaban. En Next 16 solo los Server Components pueden ser
  async. El `?code=` se lee ahora con `useSearchParams`, y la página pasa a estática.
- `convex/survey.ts` queda **sin `@ts-nocheck`**: quitarlo hizo que `tsc` volviera a validar el
  archivo (con él, una función borrada por error llegaba hasta producción).

### Pendiente
- **`SITE_URL` en `flippant-dog-457` sigue en `http://localhost:3000`**: es el link que va en los
  correos, hay que apuntarlo al dominio real antes de mandar invitaciones.
- El flujo no se ha verificado en navegador: se probó por CLI contra el deployment, más tests,
  tipos y build.

## 2026-09-08 — Landing y marca visual

### Landing corporativa
- Hero: el placeholder `[foto] sesión 4:5 — Medellín presencial` ahora muestra una foto real del espacio (`/assets/lobby.jpeg`, 1024×1280) con chip superpuesto "Medellín · presencial" (`src/app/page.tsx`).
- Equipo: la foto de Eduardo Castillo era la de Carlos — corregida (`/assets/eduardo-castillo.jpeg`) y fotos del equipo más grandes en la landing y el workshop.

### Marca
- Favicon reemplazado por el ícono de marca en PNG (`src/app/favicon.ico`, 16/32/48 px) en lugar del `.ico` clásico de Next.

## 2026-08-23 — Zona de estudiantes y perfil

### Nuevos componentes reutilizables
- `src/components/ProfileForm.tsx` — formulario de perfil compartido (onboarding y edición).
- `src/components/PhoneInput.tsx` — teléfono con selector de país (banderas SVG) + número, default Colombia, salida E.164. Motor: `react-phone-number-input`.
- `src/components/DropdownSelect.tsx` — dropdown estilizado a la marca (popover propio, búsqueda opcional vía `searchable`).
- `src/components/ConfirmDialog.tsx` — diálogo de confirmación (reemplaza `confirm()`/`alert()` de JS).
- `src/components/ui/radio-group.tsx`, `src/components/ui/button.tsx` — primitivas shadcn (Base UI).

### Perfil
- Editar/ver datos propios en `/estudiantes/perfil` (correo read-only).
- Método de contacto como radio group con ícono (WhatsApp, Correo, Ambos); logo real de WhatsApp inline.
- Reorden de campos: nombre → correo → teléfono → contacto → contraseña → profesión → nivel IA → herramienta IA.
- Teléfono split (país + número) con banderas.
- Dropdowns (profesión/nivel/herramienta) reemplazados; profesión con búsqueda.

### Cursos
- Estados: `active | full | completed | disabled` (antes `active | archived`).
- `courses.list` público devuelve solo `active`/`full` con `status`/`tagline`; `getBySlug` expone `status`.
- Landing raíz y del workshop ahora leen el estado (ocultan dictado/desactivado, no muestran cupo si lleno).
- "Mis cursos": secciones "tus cursos" (oculta desactivados, marca dictado) y "workshops disponibles".
- Admin: `setCourseStatus` (selector 4 estados); dropdown de invitar oculta solo desactivados; bloqueo de auto-borrado de cuenta; precio con separador de miles.
- `requireMaterialAccess` rechaza acceso si el curso está `desactivado`.

### Auth / correos
- Correo context-aware: bienvenida (invitado), validación (registro), login.
