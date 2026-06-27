// ============================================================
// Datacheck AI — Tipos del Dominio (Ley 1581 de 2012)
// ============================================================

export type RespuestaValor = 'si' | 'no' | null;

export type NivelRiesgo = 'excelente' | 'aceptable' | 'riesgo_medio' | 'riesgo_alto';

export type BloqueId = 'politica' | 'privacidad_disenio' | 'gobernanza';

// ----------------------------------------------------------
// Bloque temático
// ----------------------------------------------------------
export interface Bloque {
  id: BloqueId;
  titulo: string;
  descripcion: string;
  pesoMaximo: number; // Porcentaje máximo que aporta al score global (0-100)
  color: string;      // Clase de color Tailwind para el acento del bloque
  icono: string;      // Emoji / carácter unicode representativo
}

// ----------------------------------------------------------
// Pregunta individual
// ----------------------------------------------------------
export interface Pregunta {
  id: string;            // e.g. "Q1", "Q2", ...
  numero: number;        // 1-11
  bloqueId: BloqueId;
  texto: string;         // El enunciado de la pregunta
  peso: number;          // Porcentaje que suma al score global si respuesta=Sí (0-16)
  esComplementaria: boolean;    // true => no suma al score (Q11)
  esLlaveMaestra: boolean;      // true => si es No, bloquea dependientes (Q1)
  dependeDe?: string;           // ID de la pregunta de la que depende (Q2-Q5 dependen de Q1)
  articuloLegal: string;        // Referencia legal (ej: "Art. 13, Ley 1581/2012")
  textoLegal: string;           // Texto del artículo (lenguaje formal)
  consejoCopilot: string;       // Traducción IA a lenguaje empresarial accionable
  ejemploPractico: string;      // Ejemplo concreto para la empresa
}

// ----------------------------------------------------------
// Respuesta del usuario para una pregunta
// ----------------------------------------------------------
export interface Respuesta {
  preguntaId: string;
  valor: RespuestaValor;
  bloqueada: boolean;   // true si fue saltada por regla de exclusión
  timestamp: Date;
}

// ----------------------------------------------------------
// Resultado por bloque
// ----------------------------------------------------------
export interface ResultadoBloque {
  bloque: Bloque;
  scoreObtenido: number;    // Puntos obtenidos en este bloque
  scoreMaximo: number;      // Puntos máximos posibles en este bloque
  porcentaje: number;       // scoreObtenido / scoreMaximo * 100
  preguntasRespondidas: number;
  preguntasBloqueadas: number;
}

// ----------------------------------------------------------
// Resultado global del diagnóstico
// ----------------------------------------------------------
export interface ResultadoDiagnostico {
  scoreTotal: number;         // 0-100
  nivelRiesgo: NivelRiesgo;
  resultadosPorBloque: ResultadoBloque[];
  respuestas: Record<string, Respuesta>;
  fechaCompletado: Date;
  recomendaciones: string[];
}

// ----------------------------------------------------------
// Estado del Custom Hook
// ----------------------------------------------------------
export interface EstadoDiagnostico {
  preguntaActualIndex: number;
  respuestas: Record<string, Respuesta>;
  scoreActual: number;
  nivelRiesgo: NivelRiesgo;
  mostrandoSkipNotice: boolean;
  copilotAbierto: boolean;
  preguntaCopilot: Pregunta | null;
  completado: boolean;
  resultado: ResultadoDiagnostico | null;
}
