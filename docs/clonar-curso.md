# Clonar curso — especificación, diseño y plan

Estado: **propuesta, sin implementar**. Fecha: 2026-10-06.

## 1. Objetivo

Que un admin pueda crear una nueva edición de un curso (misma temática, otra fecha) a partir de uno existente, reutilizando todo el material, sin tocar inscripciones, pagos ni encuestas de la edición original.

## 2. Hallazgos que condicionan el diseño

- Hoy **no existe ninguna mutación que cree o borre** cursos, secciones, perfiles de sample data ni `followup_sessions`; todo se hace en el dashboard de Convex. Clonar será la primera que inserta en `courses`, `course_sections` y `sample_profiles`.
- **Compartir `storageId` entre cursos es peligroso**: `deleteItem`, `setCourseBrochure`, `removeCourseBrochure`, `setSampleProfileZip` y `replaceSampleFiles` hacen `storage.delete` sin comprobar si otro documento usa el archivo. Editar el clon rompería el original (y al revés).
- Todo lo que busca por slug usa `.unique()` (`courses.ts`, `material.ts`, `queries.ts`): un slug duplicado rompe lecturas. El slug nuevo debe validarse antes de insertar.
- `courses.list` trata `status` ausente como `active` y ordena por `schedule` (string). Un clon visible aparece duplicado en la landing.
- `/workshops/finanzas-personales-ia` tiene el slug hardcodeado: **el clon no tendrá landing propia**. Sí tiene página de estudiantes (`estudiantes/cursos/[slug]`, dinámica) y aparece en las listas públicas del home cuando esté `active`/`full`.
- Los vínculos por `courseSlug`/`workshopSlug` (inscripciones, encuesta, sesión de follow-up) no tienen integridad referencial: el slug nuevo parte limpio en esas tablas.

## 3. Especificación funcional

**Entrada** (desde `/admin` → *cursos*, botón `clonar` junto a `editar`):

| Campo | Obligatorio | Por defecto |
|---|---|---|
| slug nuevo | sí | `<slug-origen>-2` |
| título | sí | `<título> (copia)` |
| fecha / horario (`schedule`) | no | el del origen |
| precio | no | el del origen |

Validaciones del slug: minúsculas, `/^[a-z0-9-]+$/`, único en `courses` (misma regla que `updateCourse`).

**Qué se clona**

| Dato | Regla |
|---|---|
| `courses` | tagline, schedule, price, eventInfo, brochure (archivo copiado). |
| `course_sections` | todas, mismo `order`/`kind`/`title`/`hint`. |
| `course_items` | todos, con `sectionId` remapeado; `storageId` e `imageStorageId` copiados. Se conserva `status`. |
| `sample_profiles` + `sample_files` | todos, con `courseId`/`profileId` remapeados; foto, intro, zip y archivos copiados. |
| `followup_sessions` | solo `title`, `agenda`, `durationMinutes`. Sin `date`, `startTime` ni `joinUrl` (así no se puede invitar a la encuesta sin fecha nueva). |

**Qué se resetea**

- `status` → `disabled` (invisible en landing y material hasta que el admin lo active).
- `calendarUrl` → vacío (apunta a la edición anterior).
- `eventInfo` se copia (conserva la estructura) pero la UI avisa: *"revisa sede, fecha y links"*.

**Qué NO se clona:** `workshop_registrations`, `survey_invites`, `survey_responses`, `leads`, usuarios, roles, perfiles de usuario.

**Resultado:** el clon queda en `disabled`; la UI lo muestra en la lista con su estado y abre el modo edición para ajustar fecha, sede, calendario y activarlo.

**Errores** (mensajes en español, mostrados inline): `No autorizado`, `Curso no encontrado`, `Slug inválido`, `Ese slug ya existe`, `No se pudo copiar un archivo`.

**Atomicidad:** o queda el clon completo o no queda nada. Si falla, se borran los blobs ya copiados.

## 4. Diseño técnico

### 4.1 Por qué una action

Copiar blobs exige `ctx.storage.get` + `ctx.storage.store`, solo disponibles en actions. Una mutación única no puede. Se orquesta en tres pasos:

```
admin:cloneCourse (action pública)
 1. runQuery   internal cloneSnapshot   → verifica admin + valida slug + lee curso/secciones/ítems/perfiles/archivos
 2. por cada storageId distinto (dedupe en Map<old,new>): storage.get → storage.store
 3. runMutation internal cloneApply     → vuelve a validar slug (carrera) e inserta todo en UNA transacción con ids remapeados
 4. si 2 o 3 fallan: storage.delete de los blobs ya copiados; relanzar el error
```

### 4.2 Reglas de implementación (gotchas del repo)

- Las funciones internas llamadas desde la action van **`export`adas** y se referencian con `anyApi` de `convex/server`, **no** con `api` (evita el ciclo de tipos y el colapso a `any`). Ver `convex/survey.ts`.
- Autorización: la action valida con el patrón de `sendInviteEmail` (`getUserRole` → `admin` + `active`); además `cloneSnapshot` y `cloneApply` llaman a su propio `requireActiveAdmin` (las internas se ejecutan sin sesión desde `runQuery`, así que el chequeo real va en la action y se pasa por argumento solo lo necesario; seguir el patrón `assertAdminInternal` de `survey.ts:481`).
- El slug se valida dos veces: en el snapshot (fallo rápido, antes de copiar archivos) y en `cloneApply` (por si otro admin lo tomó mientras tanto).
- Orden de inserción: `courses` → `course_sections` (mapa) → `course_items` → `sample_profiles` (mapa) → `sample_files` → `followup_sessions`.
- Un solo curso por llamada; los archivos se copian en serie o con concurrencia pequeña (≤ 5) para no pasar el límite de tiempo/memoria de la action.

### 4.3 UI (`src/app/admin/page.tsx`, tab *cursos*)

- Botón `clonar` en la fila de acciones (1266-1294), mismo estilo secundario que `editar`.
- Formulario inline (patrón `editCourseId`): slug, título, schedule, precio; botón primario `clonar curso`, estado `clonando…` (deshabilitado), error en el bloque `border-[#3A1C0C]`.
- **try/catch obligatorio** con `setError(e.message)` (el guardar actual no lo tiene).
- Al terminar: cerrar el formulario y abrir edición del curso nuevo.
- Texto de ayuda `// se copia el material; no se copian inscritos ni encuestas. Queda deshabilitado.`

### 4.4 Eliminar curso (`deleteCourse`)

Incluido en esta entrega para poder deshacer un clon. Es la primera mutación de borrado de cursos.

**Backend** (`admin.deleteCourse`, mutation, `requireActiveAdmin`). Args: `courseId`, `confirm`.
- Rechaza si `confirm !== "eliminar-curso"` (se valida también en servidor, no solo en la UI).
- **Bloquea si el curso tiene datos de personas**: cualquier `workshop_registrations` (`by_workshop`), `survey_invites` o `survey_responses` (`by_course`) con ese slug. Error: `Este curso tiene inscritos o respuestas de encuesta; no se puede eliminar`. Así nunca se borra un curso real por accidente y no se pierden pagos ni respuestas. El caso de uso (borrar un clon o un curso creado por error) no los tiene.
- Cascada en una sola transacción, en este orden: `sample_files` → `sample_profiles` → `course_items` → `course_sections` → `followup_sessions` → `courses`.
- Borra los blobs referenciados por lo que elimina (`storageId`, `imageStorageId`, foto/intro/zip, archivos, brochure), cada `storage.delete` en `try/catch` como el resto del repo. Es seguro porque el clon **copia** archivos y no los comparte.
- Devuelve el conteo de lo borrado (`{secciones, items, perfiles, archivos}`).
- Un helper de conteo (`deleteCoursePreview`, query admin) alimenta el modal para mostrar qué se va a borrar y si está bloqueado.

**UI**: botón `eliminar` (rojo tenue) en la fila de acciones, abre un modal estilo GitHub:
- Título `Eliminar curso`, descripción con el título y slug, y el conteo de lo que se borrará (`N secciones · N ítems · N perfiles · N archivos`).
- Si está bloqueado: mensaje explicando por qué y sin campo de confirmación.
- Si no: texto *"Escribe **eliminar-curso** para confirmar"*, un input, y botón `eliminar este curso` **deshabilitado hasta que el texto coincida exactamente**.
- Estado `eliminando…` y error inline con try/catch.
- Se implementa como componente propio (`DeleteCourseDialog`) basado en el estilo de `ConfirmDialog`, que no admite input de confirmación.

### 4.5 Limitaciones asumidas (fuera de alcance)

- El clon no tiene landing pública propia (`workshops/[slug]` no existe). Se documenta; es otra feature.
- No se corrige el hueco existente de `deleteItem` (no borra `imageStorageId`).
- Los defaults de `survey.ts` y `inviteStudent`/`addStudent` con `"finanzas-personales-ia"` hardcodeado no se tocan; el clon se opera eligiéndolo en los selectores del admin.

## 5. Plan de implementación

1. **Backend — snapshot y apply** (`convex/admin.ts`): `cloneSnapshot` (internalQuery) y `cloneApply` (internalMutation), ambas `export`adas; validación de slug compartida en un helper.
2. **Backend — action** `cloneCourse`: valida admin, snapshot, copia de blobs con dedupe y limpieza en fallo, apply.
2b. **Backend — borrado**: `deleteCourse` (con bloqueo por inscritos/encuestas y confirmación `eliminar-curso` validada en servidor) y `deleteCoursePreview`.
3. **Pruebas de lógica**: extraer el remapeo de ids y la construcción de filas nuevas a una función pura (`src/lib/` o `convex/lib`) y probarla con vitest: remapeo section/profile, dedupe de storage, resets (`status`, `calendarUrl`, `followup`), slug inválido/duplicado. (No hay `convex-test` en el repo; no añadirlo salvo que se decida.)
4. **UI**: botón + formulario inline + manejo de errores en la pestaña *cursos*; botón `eliminar` + `DeleteCourseDialog` (botón deshabilitado hasta escribir `eliminar-curso`); tests de render con el patrón de mocks de `page.test.tsx` (mockear `useRole`/`AuthGuard`), incluyendo el modal: botón deshabilitado con texto incorrecto, habilitado con el correcto, y estado bloqueado.
5. **Verificación manual en dev** (`dev:flippant-dog-457`): clonar el curso real, comprobar que (a) quedan `disabled`, (b) secciones/ítems/zip/foto/brochure descargan, (c) borrar un ítem del clon no afecta al original, (d) slug duplicado falla sin dejar filas ni blobs, (e) `purgeOrphanStorage` con `dryRun` no marca nada del clon, (f) eliminar el clon deja el original intacto (secciones, archivos descargables) y `purgeOrphanStorage --dryRun` no encuentra huérfanos, (g) eliminar un curso con inscritos queda bloqueado.
6. **Despliegue** (orden del repo): primero Convex (`CONVEX_DEPLOYMENT=careful-spaniel-774 npx convex deploy`, sacando antes del medio cambios ajenos), después push a `main` para Vercel.
7. **Docs**: actualizar `AGENTS.md` (operación del negocio: "Clonar un curso") y el changelog.

## 6. Decisiones

Confirmadas por el usuario el 2026-10-06:

1. **Archivos**: se copian, no se comparten.
2. **Estado inicial del clon**: `disabled`.
3. **`followup_sessions`**: se clonan solo título, agenda y duración.
4. **`deleteCourse` incluido**, con modal que exige escribir `eliminar-curso` (estilo GitHub).

Supuesto mío, pendiente de confirmar: `deleteCourse` **se niega** a borrar cursos con inscripciones o datos de encuesta (en vez de borrarlos en cascada), para no perder pagos ni respuestas.
