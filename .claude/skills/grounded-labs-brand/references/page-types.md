# Recetas por tipo de página — Grounded Labs 2A

Todas usan el mismo sistema (tinta/terracota/Plex). Cambia contenido y secciones, no tokens.

## 1. Checklist (`checklist.html`)

Objetivo: que el participante llegue con equipo listo. Tono checklist de ingeniería.

Secciones sugeridas (layout libre, numeración mono si aplica):
- 01 — Antes de venir (qué traer: laptop, cargador, archivos)
- 02 — Archivos (tipos: PDF, DOCX, notas, dónde reunirlos)
- 03 — Instalación previa (pasos verificables, no "instala X" sin comando)
- 04 — Verificación (checklist final, test de 2 min)

Patrón: cada item con checkbox `□` mono, estado `[ok]` terracota vs `[pendiente]` grafito. Usar grids de 1px sobre #262E31 para agrupar pasos. Incluir `// nota` mono para advertencias.

## 2. Conclusiones / aprendizajes (`conclusiones.html`)

Resumen post-workshop.

Secciones:
- 01 — Qué construiste (captura placeholder + bullets de resultado)
- 02 — Qué sigue (3 rutas: seguir solo, curso avanzado, consultoría)
- 03 — Recursos (links a guías, soporte)

Usar bloque de principios con borde superior terracota para "anclado / sin_humo / aplicable_hoy".

## 3. Plan de mercado (`plan-de-mercado.html`)

Documento interno/estratégico.

Secciones:
- 01 — Hipótesis y validación (métrica: 10-15 pagos)
- 02 — Canales (LinkedIn principal, demos con info ficticia, outreach personalizado)
- 03 — Captura (lista de espera, recurso gratuito, segmentación por profesión/dolor)
- 04 — Métricas (conversión landing→pago, no-shows, NPS, B2B)

Usar tablas con `gap 1px` sobre #262E31: header mono `10px #6C7573`, celdas `16px #DDE2E0`.

## 4. Presupuesto (`presupuesto.html`)

Transparente, sin humo. Mostrar costos fijos/variables, punto de equilibrio.

Secciones:
- 01 — Supuestos (aforo 12, precio $400k, referencia $800k)
- 02 — Costos (venue, café, facilitadores, Wompi, marketing)
- 03 — Escenarios (6 / 9 / 12 inscritos) con resaltado terracota en escenario base
- 04 — Decisión (si <6, mover a casa/café y analizar fallo: mensaje, segmento, precio, confianza, canal)

Usar barra 85/10/5 para visualizar margen.

## 5. Landing comercial (`landing.html`)

Mismo 2A (no el cálido viejo). Estructura:

- Hero: `01 — Fundamento` + `h1 88px` + subtítulo mono + CTAs terracota + meta `Presencial · Medellín · 4h`
- Problema: 4 pains con `> ` naranja/terracota y cierre en terracota
- Lo que te llevas: 3 cards (conoce tu mundo / responde con lo tuyo / es tuyo)
- Agenda: 4 items con número grande mono terracota + hito `Sales con...`
- Para quién: 3 cards por vertical + "no es para ti si..."
- Quién enseña: 2 perfiles con avatar círculo `64px #24353e` + inicial
- Precio: caja con borde `2px solid #B4552B` + tachado referencia + `COP $400.000`
- FAQ y cierre: acordeón simple con `border 1px solid #2F3A3D`

CTA siempre: `Reservar mi cupo →` fondo terracota `#B4552B` texto `#0E1214`.

## 6. Curso / programa (`curso-*.html`)

Similar a landing pero con temario por semanas, entregables por hito, y bloque de aplicación (mock browser con nav mono).

## Checklist de entrega (todas)

- [ ] `<title>` y `<meta viewport>` presentes
- [ ] IBM Plex Sans+Mono cargadas, sin Inter/JetBrains
- [ ] Paleta exacta (tinta/panel/regla/grafito/papel/terracota, no verde #50fa7b)
- [ ] Logo correcto (monograma terracota `g` + wordmark mono, `_` en #6C7573)
- [ ] Iconos trazo 1.5px, esquinas rectas, punto terracota si aplica
- [ ] Layout propio (no copia de la web del brand book)
- [ ] Terracota ≤5%, solo en datos/estados/CTAs
- [ ] Responsive sin scroll horizontal
- [ ] Copy sin hype, con dolor concreto y resultado observable
