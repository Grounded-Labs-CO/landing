# Changelog

## 2026-10-01 — Duración del evento y limpieza de la pantalla de gracias

### Sesión de seguimiento
- **La duración del evento de Google Calendar ya no está fija en el código**: estaba en 2 h y el
  taller dura 1. Ahora se elige en `/admin` → *encuesta* → *sesión* ("cuánto dura": 30 min, 45 min,
  1 hora, 1 h y media, 2 h, 3 h), con **1 hora por defecto**. Columna nueva `durationMinutes` en
  `followup_sessions`.
- Es solo para el evento del calendario: el texto del correo no menciona la duración.

### Pantalla de gracias de la encuesta
- Fuera el botón **"guardar mi lugar"**: el lugar ya es suyo por haber respondido, y el enlace de la
  sesión va en el correo de confirmación. Queda **"agendar en mi calendario →"** como única acción.
- La ficha decía "el botón de abajo tiene el enlace" (ya no era cierto): ahora dice que el enlace
  llega por correo.

## 2026-09-30 — Ajustes de la encuesta, borrado y susto en producción

### Encuesta (texto y comportamiento)
- "¿Qué fue lo que más pesó en tu **calificación anterior**?" (antes: "en tu nota").
- Fuera las frases que eran notas para nosotros: la justificación del analista en "¿conocías a
  Eduardo?", la aclaración del paso de contacto y el pie "tu nombre y tu correo ya vienen puestos".
- Etiquetas de la revisión en lenguaje normal: "NPS" → **Calificación general**, "Origen" → "Cómo
  nos encontraste", "Red cercana" → "¿Nos conocías?".
- Consentimiento más general: "¿Podemos usar **tus respuestas** en nuestras redes o en la web?".
- "Qué te interesaría tomar después" suma **Otro** con campo para llenar (columna nueva
  `interestsOther` en `survey_responses`).

### Arreglos
- **"Otro" se saltaba el "¿Cuál?"**: en las preguntas de un toque el auto-avance se disparaba antes
  de mostrar el campo. Ahora, si la opción pide llenar algo, la pregunta espera.
- **Corregir desde la revisión**: el botón "siguiente" está deshabilitado en las preguntas de un
  toque (avanzan solas), así que corregir obligaba a volver a tocar una opción y, peor, mandaba a
  la pregunta siguiente en vez de volver. Ahora entra en modo corrección: el botón dice
  **"listo →"**, se habilita sin tocar nada y vuelve a la revisión.
- El formulario no enviaba `interestsOther`: lo que escribían se perdía.

### Admin
- **Borrar la encuesta de alguien**, con doble confirmación (`survey:deleteResponse`). La invitación
  queda viva a propósito, para poder reenviar el link y que la persona vuelva a responder.

### Correos
- "**Contanos** qué te pareció" (antes "Contarnos").
- "follow-up" → "**seguimiento**" en todo el texto visible (la tabla `followup_sessions` se queda
  en inglés: renombrarla es una migración y no aporta nada al usuario).
- El WhatsApp de respaldo ahora aclara que el link que se manda es el de la sesión de seguimiento.

### Producción
- **`https://www.grounded-labs.com/` es el dominio real** (no `grounded-labs.vercel.app`, que es un
  deploy viejo). Documentado en AGENTS.md.
- **Incidente**: el push del frontend llegó a prod antes que las funciones de Convex. Como `useQuery`
  lanza el error en render, `/estudiantes` cayó para todos los alumnos (`SurveyNudge` pedía
  `survey:mySurveyStatus`). Se resolvió con `convex deploy`. Regla nueva: **Convex primero, frontend
  después**.

### Pendiente
- El **título de la sesión** guardado sigue diciendo "Sesión virtual de follow-up" en dev y prod (es
  el que va al evento de Google Calendar). Se cambia a mano en `/admin` → *encuesta* → *sesión*.

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

## 2026-09-26 — Cierre del workshop de finanzas (post-sesión)

### Landing
- Curso `finanzas-personales-ia` marcado `completed` en dev (`flippant-dog-457`) y prod (`careful-spaniel-774`): sale de "próximos eventos" y los estudiantes conservan el material (solo `disabled` bloquea).
- Home y landing del workshop en modo cierre: copy "edición finalizada"/"curso ya dictado" en vez de "no disponible".
- Fecha, horario y precio se leen de la BD (`schedule`/`price`), sin hardcodes de "26 sep"/"$400k".
- Sin ciudad en la landing: "Medellín" → "presencial" (horario actualizado en la BD de dev y prod). El precio solo se muestra con edición abierta; en modo cerrado dice "Precio de la próxima edición: por anunciar".
- **Lista de espera** para la próxima edición: `WaitlistForm` (correo → `leads` + fallback WhatsApp) en el CTA final del home y el bloque de precio del workshop.
- Las ediciones ya dictadas se listan en "próximos eventos" como tarjeta con sello `ya dictado` y CTA "me interesa la próxima edición →" que lleva al bloque de precio del workshop (nueva query pública `courses.listPast`).
- Dashboard de `/admin`: tarjeta "lista de espera" con los correos capturados (`api.queries.listLeads`).
- SEO sin fecha fija (`layout.tsx`).

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
