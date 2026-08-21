# Componentes — Grounded Labs 2A (solo branding)

Solo LOGO, COLOR, TIPOGRAFÍA, ICONOGRAFÍA del brand book. Sin estructura del manual. Todos los snippets son inline, zero-dependency — cópialos tal cual y colócalos en el layout que pida el contenido.

## LOGO — monograma

Cuadrado terracota, única forma llena del sistema. Letra `g` en IBM Plex Mono 600 sobre tinta.

```html
<!-- 40px (header) / 52px / 84px (hero) -->
<div style="width: 40px; height: 40px; background: #B4552B; display: grid; place-items: center;">
  <span style="font-family: 'IBM Plex Mono', monospace; font-size: 22px; font-weight: 600; color: #0E1214; line-height: 1;">g</span>
</div>
```

Wordmark — siempre minúsculas mono, guion bajo en `#6C7573` (sobre tinta) o `#9AA3A1` (sobre papel):

```html
<span style="font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 500; letter-spacing: 0.02em;">grounded<span style="color: #6C7573;">_</span>labs</span>
```

Lockup horizontal (uso principal):

```html
<div style="display: flex; align-items: center; gap: 26px;">
  <div style="width: 52px; height: 52px; background: #B4552B; display: grid; place-items: center;">
    <span style="font-family: 'IBM Plex Mono', monospace; font-size: 28px; font-weight: 600; color: #0E1214; line-height: 1;">g</span>
  </div>
  <span style="font-family: 'IBM Plex Mono', monospace; font-size: 22px; font-weight: 500;">grounded<span style="color: #9AA3A1;">_</span>labs</span>
</div>
```

Fondos:
- Sobre tinta `#0E1214` / panel `#1C2427`: monograma terracota + wordmark papel.
- Sobre papel `#F1F3F2`: wordmark tinta (`color:#0E1214`) + `_` en `#9AA3A1`.
- Sobre terracota: solo wordmark en tinta, sin monograma.

Usos incorrectos: mayúsculas (`GROUNDED_LABS`), otra tipografía (Sans), sin guion bajo (`grounded labs`), skew/deformar. Ver brand book `02 — Logo > Usos incorrectos`.

Assets: `marca/grounded-labs/final/assets-grounded-labs/logo/` — `monograma-terracota.png`, `wordmark-*.png`, `*.svg` (SVG usa IBM Plex Mono — convertir a curvas si no está instalada).

## COLOR — paleta

Tokens:

| token | hex | uso |
|-------|-----|-----|
| tinta | `#0E1214` | fondo base |
| panel | `#1C2427` | superficies elevadas / tarjetas |
| regla | `#2F3A3D` / `#262E31` | bordes y separadores |
| grafito | `#9AA3A1` | texto secundario |
| papel | `#F1F3F2` | texto principal |
| terracota | `#B4552B` | acento único — máx 5% |
| mute | `#6C7573` / `#565F62` | labels, `_` |

Regla 85/10/5: 85% tinta+panel, 10% papel, 5% terracota.

Swatch:

```html
<div style="display: flex; flex-direction: column; border: 1px solid #262E31;">
  <div style="height: 150px; background: #B4552B;"></div>
  <div style="padding: 18px 20px; display: flex; flex-direction: column; gap: 6px; background: #0E1214;">
    <span style="font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 500; color: #F1F3F2;">terracota</span>
    <span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.08em; color: #9AA3A1;">#B4552B</span>
    <span style="font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: #6C7573;">Acento único: señal, dato, acción</span>
  </div>
</div>
```

Barra 85/10/5:

```html
<div style="display: flex; height: 56px; border: 1px solid #262E31;">
  <div style="flex: 85; background: #0E1214; display: grid; place-items: center; font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: #6C7573;">85% TINTA + PANEL</div>
  <div style="flex: 10; background: #F1F3F2; display: grid; place-items: center; font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: #0E1214;">10%</div>
  <div style="flex: 5; background: #B4552B;"></div>
</div>
```

Nunca usar terracota como fondo de sección completa, ni degradados morados/neón.

## TIPOGRAFÍA

Familias: **IBM Plex Sans 200/300/400** (títulos, cuerpo) + **IBM Plex Mono 400/500/600** (etiquetas, sistema, logo). Carga:

```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@200;300;400&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

Regla: títulos Sans nunca >300. Mono 500/600 para énfasis.

Escala del brand book:

```html
<!-- Display 88px/200 -->
<h1 style="margin:0; font-size: 88px; line-height:0.98; font-weight:200; letter-spacing:-0.035em; font-family:'IBM Plex Sans',sans-serif;">Tu información es el modelo.</h1>
<!-- Título 44px/300 -->
<h2 style="margin:0; font-size:44px; font-weight:300; letter-spacing:-0.025em; font-family:'IBM Plex Sans',sans-serif;">Wordmark y monograma</h2>
<!-- Mono etiqueta 11px -->
<span style="font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#B4552B;">01 — Fundamento</span>
<!-- Cuerpo 18px/400 -->
<p style="font-size:18px; line-height:1.65; color:#DDE2E0; font-family:'IBM Plex Sans',sans-serif;">Texto corrido. Máx 60-66ch.</p>
<!-- Sistema 14px mono -->
<span style="font-family:'IBM Plex Mono',monospace; font-size:14px; color:#9AA3A1;">// nota técnica · [metadato]</span>
```

Muestras como en brand book:

```html
<div style="border: 1px solid #262E31; background: #1C2427; padding: 44px 40px; display: flex; flex-direction: column; gap: 28px;">
  <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #2F3A3D; padding-bottom: 14px;">
    <span style="font-size: 28px; font-weight: 300; font-family:'IBM Plex Sans',sans-serif;">IBM Plex Sans</span>
    <span style="font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #6C7573;">ExtraLight 200 · Light 300 · Regular 400</span>
  </div>
  <span style="font-size: 60px; line-height: 1.05; font-weight: 200; letter-spacing: -0.03em;">Aa Bb Cc — 0123456789</span>
</div>
```

## ICONOGRAFÍA

Retícula 24, trazo 1.5px, sin relleno, esquinas rectas. Único sólido: punto terracota 12px.

```html
<div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 1px; background: #262E31; border: 1px solid #262E31;">
  <div style="background: #1C2427; aspect-ratio: 1; display: grid; place-items: center;"><div style="width: 44px; height: 44px; border: 1.5px solid #F1F3F2;"></div></div>
  <div style="background: #1C2427; aspect-ratio: 1; display: grid; place-items: center;"><div style="width: 44px; height: 44px; border: 1.5px solid #F1F3F2; border-radius: 50%;"></div></div>
  <div style="background: #1C2427; aspect-ratio: 1; display: grid; place-items: center;"><div style="width: 34px; height: 34px; border: 1.5px solid #F1F3F2; transform: rotate(45deg);"></div></div>
  <div style="background: #1C2427; aspect-ratio: 1; display: grid; place-items: center;"><div style="display: flex; flex-direction: column; gap: 7px;"><div style="width: 44px; height: 1.5px; background: #F1F3F2;"></div><div style="width: 30px; height: 1.5px; background: #F1F3F2;"></div><div style="width: 38px; height: 1.5px; background: #F1F3F2;"></div></div></div>
  <div style="background: #1C2427; aspect-ratio: 1; display: grid; place-items: center;"><div style="width: 44px; height: 44px; border: 1.5px solid #F1F3F2; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr;"><div style="border-right:1.5px solid #F1F3F2;border-bottom:1.5px solid #F1F3F2;"></div><div style="border-bottom:1.5px solid #F1F3F2;"></div><div style="border-right:1.5px solid #F1F3F2;"></div><div></div></div></div>
  <div style="background: #1C2427; aspect-ratio: 1; display: grid; place-items: center;"><div style="width: 44px; height: 44px; border: 1.5px solid #F1F3F2; display: grid; place-items: center;"><div style="width: 12px; height: 12px; background: #B4552B;"></div></div></div>
</div>
```

## CTAs y superficies (combinan los 4 tokens)

```html
<span style="background: #B4552B; color: #0E1214; padding: 13px 26px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;">ver el temario</span>
<span style="border: 1px solid #2F3A3D; color: #9AA3A1; padding: 13px 26px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;">hablar con el equipo</span>
```

Tarjeta genérica (usa COLOR + TIPOGRAFÍA, layout libre):

```html
<div style="background: #1C2427; border: 1px solid #262E31; padding: 34px 32px; display: flex; flex-direction: column; gap: 12px;">
  <span style="font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #6C7573;">[etiqueta]</span>
  <p style="margin: 0; font-size: 18px; line-height: 1.65; color: #DDE2E0;">Contenido</p>
</div>
```

## Anti-patrones

- No `border-radius` (sistema recto), no sombras suaves, no gradientes.
- No Inter / JetBrains Mono (sistema viejo `#0a0a16`), no verde `#50fa7b`.
- No terracota >5% ni como fondo de sección.
- No copiar la web del brand book (sidebar, Fundamento...) — solo sus 4 tokens.
