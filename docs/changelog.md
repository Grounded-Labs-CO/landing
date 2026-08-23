# Changelog

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
