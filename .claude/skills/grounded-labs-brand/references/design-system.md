# Design System — Grounded Labs Brand Book 2A

Fuente: `marca/grounded-labs/final/Grounded Labs Brand Book 2A.html` (exportado 2026-08-20) — **solo secciones LOGO, COLOR, TIPOGRAFÍA, ICONOGRAFÍA**. La estructura web del manual (grid 260px, sidebar, secciones Fundamento...) NO es parte del branding y no debe copiarse.

No improvisar valores.

## Paleta

| token | hex | uso |
|-------|-----|-----|
| tinta | `#0E1214` | fondo base, canvas |
| panel | `#1C2427` | superficies elevadas, tarjetas oscuras |
| regla | `#2F3A3D` | bordes y separadores (alternativo `#262E31` en grids) |
| grafito | `#9AA3A1` | texto secundario, metadatos, párrafos de apoyo |
| papel | `#F1F3F2` | texto principal, piezas en positivo |
| terracota | `#B4552B` | acento único — señal, dato, acción. Máx 5% superficie |
| mute-1 | `#6C7573` | guion bajo, labels secundarios |
| mute-2 | `#565F62` | numeración nav, footer |
| claro | `#DDE2E0` | cuerpo sobre tinta (variante papel) |
| ok | `#8FA98F` | etiqueta "SÍ" en comparativas |

Regla 85/10/5: 85% tinta+panel, 10% papel, 5% terracota. Barra demostrativa en sección Color: `flex 85 / 10 / 5`.

Prohibido: terracota como fondo de sección completa, degradados morados, neón.

## Tipografía

### Familias

- **IBM Plex Sans** — display, títulos, cuerpo. Pesos: 200 ExtraLight, 300 Light, 400 Regular.
- **IBM Plex Mono** — etiquetas, navegación, metadatos, sistema, wordmark. Pesos: 400 Regular, 500 Medium, 600 SemiBold.

Carga: Google Fonts `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@200;300;400&family=IBM+Plex+Mono:wght@400;500;600&display=swap` o `@font-face` con `woff2` del bundle (ver brand book para unicode-range).

### Escala (del brand book)

| tag | fuente | peso | tamaño | muestra |
|-----|--------|------|--------|---------|
| display | Sans | 200 | 64px | Tu información |
| título | Sans | 300 | 40px | Sección del documento |
| subtítulo | Sans | 300 | 24px | Introducción de bloque |
| cuerpo | Sans | 400 | 18px | Texto corrido largo |
| sistema | Mono | 400 | 14px | // nota técnica · [metadato] |
| hero | Sans | 200 | 88px | Tu información es el modelo. |
| sección h2 | Sans | 300 | 44px | Wordmark y monograma |

Regla: títulos nunca >300 en Sans. Mono usa 500/600 para énfasis (wordmark, g del monograma).

### Estilos globales

```css
html { scroll-behavior: smooth; }
body { margin: 0; background: #0E1214; color: #F1F3F2; font-family: 'IBM Plex Sans', sans-serif; }
a { color: #B4552B; text-decoration: none; }
a:hover { color: #F1F3F2; }
::selection { background: #B4552B; color: #0E1214; }
```

## Layout — no es parte del branding

No repliques el layout del brand book (grid 260px + sidebar, secciones con `padding 96px 88px`). Ese es el contenedor del manual, no un token. El layout lo decides según el contenido (ver `page-types.md` y `components.md`).

Principios generales si necesitas guía: fondos `#0E1214`, paneles `#1C2427`, bordes `1px solid #262E31`, texto `max 60-66ch`, sin bordes redondeados.

## Iconografía

- Retícula 24, trazo 1.5px, sin relleno, esquinas rectas.
- Único sólido permitido: punto terracota `12px` centrado.
- Ejemplos: cuadrado `44px` borde 1.5px, círculo `44px`, diamante `34px rotate(45deg)`, líneas `44/30/38px × 1.5px`.

## Logos

Ver `LEEME.md` en `marca/grounded-labs/final/assets-grounded-labs/`. SVG usa `IBM Plex Mono` — instalar fuente o convertir a curvas.

Uso principal: monograma terracota `40-84px` + wordmark mono `grounded_labs` (guion bajo `#6C7573` o `#9AA3A1` sobre papel). Lockup horizontal: monograma + wordmark con `gap 26px`.

## Voz

Ver `copy.md`. Principio: "Tu información es el modelo." — anclado, sin humo, aplicable hoy.
