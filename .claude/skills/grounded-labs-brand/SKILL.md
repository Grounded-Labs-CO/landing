---
name: grounded-labs-brand
description: Crea páginas HTML nuevas o adapta HTML existente con el branding de Grounded Labs Brand Book 2A — solo LOGO, COLOR, TIPOGRAFÍA e ICONOGRAFÍA (tinta/terracota, IBM Plex Sans + Mono, monograma g). Usa este skill SIEMPRE que el usuario pida crear una landing, checklist, conclusiones, plan de mercado, presupuesto, curso, o aplicar/restylear el diseño grounded_labs a un HTML ya existente — incluso si no menciona "brand book" explícitamente.
---

# Grounded Labs Brand — Páginas HTML (Brand Book 2A)

Crea páginas HTML nuevas o adapta HTML existente aplicando **solo el branding** de `marca/grounded-labs/final/Grounded Labs Brand Book 2A.html` — secciones **LOGO, COLOR, TIPOGRAFÍA, ICONOGRAFÍA** — y los assets de `marca/grounded-labs/final/assets-grounded-labs/`.

> **Regla clave:** No copies la estructura de la página web del brand book (grid 260px/sidebar, secciones Fundamento/Logo/Color...). Esa es la presentación del manual, no una plantilla. Usa solo sus tokens de marca y construye el layout que pida el contenido.

## Cuándo usar este skill

- **Modo A — Crear:** usuario pide `landing.html`, `checklist.html`, `plan-de-mercado.html`, `presupuesto.html`, `conclusiones.html` o cualquier página nueva para `workshops/*`.
- **Modo B — Adaptar:** usuario pide aplicar el branding a un HTML ya existente ("ponle el diseño de Grounded Labs a esta página", "migra este HTML a 2A", "brandea este archivo").
- Dice "usa el diseño de Grounded Labs", "con la marca 2A", "estilo tinta/terracota", "como el brand book".
- **No usar** para páginas que explícitamente pidan otro sistema (ej. landing cálida/editorial previa) — en ese caso pregunta.

## Principio de diseño (no negociable)

Antes de escribir código, responde internamente (sin preguntar al usuario):
1. ¿Cuál es el dolor concreto del público?
2. ¿Qué resultado observable obtiene en la página/workshop?
3. ¿Qué debe traer / qué riesgo percibe?
4. ¿Por qué pagar / actuar ahora?
5. ¿Cómo capturamos a quien no compra?

Si la respuesta depende de "Second Brain", "Karpathy" o jerga (LLM, RAG, tokens) para explicar valor, el posicionamiento está mal — reescribe en lenguaje de resultado ("tu asistente lee tus documentos y responde tus preguntas").

## Tokens — leer siempre antes de generar

Lee `references/design-system.md` para la fuente de verdad completa. **Solo estas 4 secciones del brand book son fuente válida** (ignora todo lo demás, incluida su estructura web):

- **LOGO** (`#logo`): wordmark `grounded_labs` en IBM Plex Mono minúsculas con `_` en `#6C7573`/`#9AA3A1`, monograma cuadrado terracota `#B4552B` con `g` 600. Ver `references/design-system.md#logos`.
- **COLOR** (`#color`): tinta `#0E1214`, panel `#1C2427`, regla `#2F3A3D`/`#262E31`, grafito `#9AA3A1`, papel `#F1F3F2`, terracota `#B4552B` (acento máx 5%), mute `#6C7573`/`#565F62`. Regla 85/10/5.
- **TIPOGRAFÍA** (`#tipografia`): IBM Plex Sans 200/300/400 + IBM Plex Mono 400/500/600. Títulos Sans nunca >300. Cargar via Google Fonts o `@font-face`.
- **ICONOGRAFÍA** (`#iconografia`): retícula 24, trazo 1.5px, sin relleno, esquinas rectas. Único sólido: punto terracota 12px.

No uses paleta/fuentes/layout de otros sistemas (Inter, JetBrains, verde `#50fa7b`, sidebar 260px). Si dudas, abre `references/design-system.md` — no improvises.

## Workflow

### 1. Determinar modo
- **Modo A — Crear nueva:** define layout según contenido (landing, checklist, plan, etc.). No repliques la web del brand book. Elige estructura libre pero brandeada (ver `references/page-types.md`).
- **Modo B — Adaptar existente:** lee el HTML actual completo (`read` sin truncar). Preserva **estructura, IDs, clases, contenido y copy**; solo sustituye tokens de marca: colores → paleta 2A, fuentes → IBM Plex, logo → monograma/wordmark 2A, iconos → trazo 1.5 recto, CTAs → terracota. No reescribas el layout ni el texto salvo que el usuario lo pida.

### 2. Base
Usa `assets/template-base.html` como punto de partida. Contiene solo branding (no layout):
- `<head>` con IBM Plex cargada, CSS vars de color/tipo, resets, `::selection` terracota
- Clases utilitarias `.mono`, `.sans`, `.terracota` y estilos de logo/icono
- Sin grid 260px, sin sidebar, sin secciones Fundamento — el layout lo creas tú

No uses frameworks, no npm, no build. Todo inline en un solo `.html`.

### 3. Construir
Diseña el layout que mejor sirva al contenido (hero, grids, tablas, checklists) y aplica los tokens:
- Fondo `#0E1214` / panel `#1C2427`, bordes `#262E31`, texto `#F1F3F2`/`#9AA3A1`, acentos `#B4552B` ≤5%
- Títulos Sans 200/300, etiquetas Mono 10-11px uppercase, CTAs `background:#B4552B; color:#0E1214`

Para snippets de logo, paleta, tipografía, iconos, ver `references/components.md`.

### 4. Logos y assets
- Ruta canónica: `marca/grounded-labs/final/assets-grounded-labs/logo/`
  - `lockup-horizontal-oscuro.png` (uso principal sobre tinta, 4x)
  - `monograma-terracota.png` (avatar/favicon)
  - `wordmark-claro/oscuro.png` + `.svg` vectoriales
- En HTML: preferir **monograma + wordmark en texto** (no depende de archivo):
  ```html
  <div style="width:40px;height:40px;background:#B4552B;display:grid;place-items:center;">
    <span style="font-family:'IBM Plex Mono',monospace;font-size:22px;font-weight:600;color:#0E1214;">g</span>
  </div>
  <span style="font-family:'IBM Plex Mono',monospace;font-size:16px;font-weight:500;">grounded<span style="color:#6C7573;">_</span>labs</span>
  ```
- Si usas SVG/PNG, copia el archivo junto al HTML o usa ruta relativa `../../marca/grounded-labs/final/assets-grounded-labs/logo/...` y advierte que el SVG requiere IBM Plex Mono instalada o texto convertido a curvas.

### 5. Tono y copy
- Voz "notación de ingeniería": verbos exactos, unidades, cero adjetivos de venta.
- Sí: "Responde con tus expedientes, no con internet." / "Sales con tu asistente funcionando."
- No: "Revoluciona tu negocio con IA infinita." / hype de productividad ilimitada.
- Ver `references/copy.md` para ejemplos por vertical (legal, salud, educación, gerencia).

### 6. Responsive y calidad
- Grids: `repeat(auto-fit, minmax(...))` o `1fr` en móvil. Diseña tu propio responsive según layout elegido.
- Verifica: sin scroll horizontal, sin texto <14px ilegible, sin terracota >5%, sin bordes redondeados (el sistema no redondea — esquinas rectas), sin copiar la estructura del brand book.
- Test en 1280×720 y 375×812.

### 7. Entrega
- Escribe el archivo en la ruta pedida (ej. `workshops/finanzas-personales-ia/checklist.html`).
- Si es landing nueva, confirma precio/copy con `AGENTS.md` (COP $400.000 lanzamiento, $800.000 referencia, 12 cupos, Wompi).

## Errores comunes

- Usar Inter/JetBrains Mono (son del sistema viejo `#0a0a16`) — en 2A es **IBM Plex**.
- Fondo `#0a0a16` / `#1a1a2e` — en 2A es `#0E1214` / `#1C2427`.
- CTA verde `#50fa7b` — en 2A es terracota `#B4552B` sobre tinta.
- Redondear todo con `border-radius:12px` — 2A usa esquinas rectas (solo `1px solid #262E31`).
- Poner terracota como fondo de sección completa — máximo 5%, solo señal/dato/acción.

## Referencias

- `references/design-system.md` — tokens, tipografía, color, layout completos (leer primero)
- `references/components.md` — sidebar, sección, cards, CTA, nav, fotografía, iconos
- `references/copy.md` — voz, ejemplos sí/no, dolores por vertical
- `references/page-types.md` — recetas por tipo de página (checklist, landing, plan, presupuesto)
- `assets/template-base.html` — esqueleto listo para copiar
