// Definición del catálogo del workshop — fuente de la siembra en Convex.
// Editar aquí y correr `npm run seed-course` para actualizar el deployment.

export const COURSE = {
  slug: "finanzas-personales-ia",
  title: "Tu Asistente Financiero con IA",
  tagline: "Workshop 100% práctico: sales con tu asistente andando, no con apuntes.",
  schedule: "Presencial en Medellín · sábado 26 de septiembre · 4 horas",
  price: "$400k",
  eventInfo: [
    { label: "fecha", value: "sábado 26 de septiembre de 2026" },
    { label: "formato", value: "presencial" },
    { label: "lugar", value: "Medellín · sede por confirmar" },
    { label: "duración", value: "4 horas, con pausas" },
    { label: "qué llevar", value: "laptop con tu cuenta de IA lista" },
  ],
};

export const SECTIONS = [
  {
    order: 1,
    kind: "info",
    title: "Qué necesitas saber",
    hint: "fecha, sede, qué llevar",
    items: [],
  },
  {
    order: 2,
    kind: "articles",
    title: "Antes de",
    hint: "artículos para llegar preparado",
    items: [
      {
        order: 1,
        title: "Configurar Claude Code",
        description: "Instalación y cuenta para usar Claude Code como asistente en el workshop.",
        status: "proximo",
      },
      {
        order: 2,
        title: "Configurar OpenCode",
        description: "Alternativa open source: instalación y conexión del proveedor de tu elección.",
        status: "proximo",
      },
      {
        order: 3,
        title: "Configurar Z.ai",
        description: "Creación de cuenta y API key para trabajar con los modelos de Z.ai.",
        status: "proximo",
      },
    ],
  },
  {
    order: 3,
    kind: "sample-data",
    title: "Sample data",
    hint: "3 perfiles con sus documentos",
    items: [],
  },
  {
    order: 4,
    kind: "docs",
    title: "Presentación y artículos",
    hint: "material de la sesión",
    items: [
      {
        order: 1,
        title: "Presentación del workshop",
        description: "Las láminas que usamos en sala, listas para consultar.",
        status: "proximo",
      },
      {
        order: 2,
        title: "Artículos y guías entregadas",
        description: "Material complementario que se publica durante la sesión.",
        status: "proximo",
      },
    ],
  },
  {
    order: 5,
    kind: "links",
    title: "Links de interés",
    hint: "dónde conseguir las herramientas",
    items: [
      {
        order: 1,
        title: "Claude Code",
        url: "https://claude.com/product/claude-code",
        note: "Requiere plan de pago de Anthropic (Pro o Max).",
      },
      {
        order: 2,
        title: "OpenCode",
        url: "https://opencode.ai",
        note: "Open source; pagas por el proveedor de modelos que conectes.",
      },
      {
        order: 3,
        title: "Z.ai",
        url: "https://z.ai",
        note: "Cuenta y API key con costo por uso.",
      },
    ],
  },
];

export const PROFILES = [
  {
    order: 1,
    slug: "familia-simpson",
    name: "Familia Simpson",
    tagline: "Hogar compartido: nómina + negocio independiente, tres hijos e hipoteca.",
    introFile: "perfil-familia.md",
  },
  {
    order: 2,
    slug: "michael-scott",
    name: "Michael Scott",
    tagline: "Asalariado con libranza, tarjeta de crédito, inversiones y metas de ahorro.",
    introFile: "notas-propias.md",
  },
  {
    order: 3,
    slug: "phoebe-buffay",
    name: "Phoebe Buffay",
    tagline: "Independiente con negocio propio; cuenta única con gastos personales y del negocio mezclados.",
    introFile: "perfil.md",
  },
];

export const CATEGORY_LABELS = {
  banca: "Banca",
  deudas: "Deudas",
  historial: "Historial crediticio",
  inversiones: "Inversiones",
  negocio: "Negocio",
  nomina: "Nómina",
  servicios: "Servicios",
  metas: "Metas",
  eps: "EPS",
  hijos: "Hijos",
  seguros: "Seguros",
  "hogar-compartido": "Hogar compartido",
  homero: "Homero",
  marge: "Marge",
};
