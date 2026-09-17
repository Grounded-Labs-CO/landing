// Catálogo de opciones del onboarding (fixture de referencia).
// La fuente de verdad es la BD del deployment: tablas `professions` y `ai_tools`.
// Este archivo solo alimenta el test de onboarding; si cambiás las listas en la
// BD, actualizá acá para que el test siga reflejando la realidad.

export const PROFESSIONS = [
  "Contador(a)",
  "Auditor(a)",
  "Administrador(a) de empresas",
  "Gerente / Directivo(a)",
  "Emprendedor(a)",
  "Comerciante",
  "Desarrollador(a) de software",
  "Ingeniero(a) de sistemas",
  "Analista de datos",
  "Científico(a) de datos",
  "Ingeniero(a) industrial",
  "Ingeniero(a) civil",
  "Arquitecto(a)",
  "Diseñador(a)",
  "Mercadólogo(a)",
  "Comunicador(a)",
  "Publicista",
  "Abogado(a)",
  "Economista",
  "Analista / Asesor(a) financiero(a)",
  "Profesor(a) / Docente",
  "Médico(a)",
  "Enfermero(a)",
  "Psicólogo(a)",
  "Consultor(a)",
  "Ejecutivo(a) de ventas",
  "Asistente administrativo(a)",
  "Logística / Operaciones",
  "Recursos humanos",
  "Estudiante",
];

export const AI_TOOLS = [
  "Claude",
  "OpenAI (ChatGPT)",
  "OpenCode",
  "Gemini",
  "Copilot",
  "Cursor",
  "Perplexity",
  "Bolt",
  "Lovable",
  "Replit",
];
