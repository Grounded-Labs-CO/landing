# Diseño — Onboarding de cuenta + perfil (zona de estudiantes)

Fecha: 2026-08-23
Estado: aprobado (pendiente de implementación)

## Objetivo

Dos caminos de entrada a la zona de estudiantes, que convergen en un perfil
obligatorio para llegar a ver los cursos:

1. **Auto-registro** ("crear cuenta"): email + contraseña + teléfono, luego
   completar el perfil.
2. **Invitado por admin**: el admin solo conoce su email; el invitado autentica
   por magic link, crea contraseña y completa el perfil, y ya tiene un curso activo.

El perfil es **obligatorio** (bloquea ver los cursos hasta completarlo). El
admin queda excluido del guard.

## Flujo auto-registro

1. `/signin` → pestaña "crear cuenta" → email + contraseña + teléfono.
2. Al loguear, `ProfileGuard` en `/estudiantes` ve perfil incompleto → redirige a
   `/estudiantes/completar-perfil`.
3. Formulario (obligatorio): nombre, profesión (select BD + "Otro" editable),
   nivel de IA (select), herramienta de IA (select BD + "Otro" editable),
   método de contacto (select). El teléfono se prefill desde `user_profiles.phone`
   cuando ya existe. (El teléfono se persiste en `user_profiles.phone`; hoy el form
   de crear cuenta lo captura pero no lo guarda → hay que persistirlo al crear la cuenta.)
4. Guardar → `completed: true` → `/estudiantes` muestra sus cursos (activo si
   `paid`; "en verificación" si `pending`, según lo que el admin configure).

## Flujo invitado

1. Admin invita (`/admin` → invitar): email + workshop + `asPaid`. Crea el user
   (solo email) + registration. (El correo de bienvenida queda para una fase futura.)
2. El invitado entra a `/signin`, escribe su email → **magic link** (Resend) → autentica.
3. `ProfileGuard` ve perfil incompleto + sin contraseña → `/completar-perfil`.
4. El formulario además muestra **crear contraseña** (obligatoria) y **teléfono**
   (vacío) + los campos de perfil.
5. Guardar → se setea contraseña (vía API de credenciales de Convex Auth,
   enlazada por email verificado, sin duplicados) + se guarda el perfil →
   `/estudiantes` ve su curso activo (el del workshop que lo invitó).

## Modelo de datos

- **`user_profiles`** (extender):
  - `displayName` (nombre), `phone` (teléfono), `profession` (string, libre u "Otro")
  - `aiLevel` (union: `principiante` | `intermedio` | `avanzado`)
  - `aiTool` (string, desde `ai_tools` o "Otro")
  - `contactMethod` (union: `whatsapp` | `correo` | `ambos`)
  - `completed` (boolean)
- **Nueva `professions`** (label, order): **30 profesiones más comunes** (es-SP / Colombia).
- **Nueva `ai_tools`** (label, order): **Claude, OpenAI, OpenCode, Gemini, Cursor,
  Copilot** + el campo "Otro" se maneja como texto libre en el formulario.

## Backend

- `queries.getMyProfile`: devuelve `user_profiles` del usuario + `hasPassword`
  (existe auth_account provider `password`) + rol.
- `mutations.updateMyProfile`: upsert de `user_profiles`, marca `completed: true`.
- `action.setMyPassword`: setea la contraseña para el email autenticado usando
  `createAccount`/`modifyAccountCredentials` con `shouldLinkViaEmail` (email ya
  verificado por magic link) → **sin crear duplicados**.

## Guard

- Componente `ProfileGuard`: envuelve `/estudiantes` y `/estudiantes/cursos/[slug]`.
  - Si el usuario es **viewer** y `!completed` → `router.replace("/estudiantes/completar-perfil")`.
  - El **admin** queda excluido (no se le exige perfilar).
- El usuario queda atrapado en el onboarding hasta completar el perfil.

## Decisiones confirmadas

- La lista de 30 profesiones y las herramientas de IA las armo yo y son
  editables/reescalables (tablas sembradas).
- Usuarios existentes (backend también) pasan por el flujo: se les fuerza a
  completar (`completed` en `false` / sin fila), incluso si ya tienen `displayName`.

## Fuera de alcance (ahora)

- Envío de correo de bienvenida al invitar (fase futura).
- Industria, nivel de finanzas, ciudad, "cómo se enteró".
