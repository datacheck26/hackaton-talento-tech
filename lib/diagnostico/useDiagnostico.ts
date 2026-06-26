'use client';

// ============================================================
// Datacheck AI — Custom Hook: useDiagnostico
// Toda la lógica de negocio aislada del componente de vista
// ============================================================

import { useState, useCallback, useMemo } from 'react';
import { PREGUNTAS, BLOQUES } from '../diagnostico/preguntas';
import type {
  EstadoDiagnostico,
  Respuesta,
  RespuestaValor,
  ResultadoDiagnostico,
  ResultadoBloque,
  NivelRiesgo,
  Pregunta,
} from '../diagnostico/types';

// ----------------------------------------------------------
// Utilidad: calcular nivel de riesgo según score
// ----------------------------------------------------------
function calcularNivelRiesgo(score: number): NivelRiesgo {
  if (score < 40) return 'critico';
  if (score < 70) return 'en_proceso';
  return 'conforme';
}

// ----------------------------------------------------------
// Utilidad: calcular score actual dado el mapa de respuestas
// ----------------------------------------------------------
function calcularScore(respuestas: Record<string, Respuesta>): number {
  return PREGUNTAS.reduce((total, pregunta) => {
    if (pregunta.esComplementaria) return total;
    const respuesta = respuestas[pregunta.id];
    if (!respuesta || respuesta.bloqueada || respuesta.valor !== 'si') return total;
    return total + pregunta.peso;
  }, 0);
}

// ----------------------------------------------------------
// Utilidad: generar recomendaciones según respuestas
// ----------------------------------------------------------
function generarRecomendaciones(respuestas: Record<string, Respuesta>): string[] {
  const recs: string[] = [];

  if (respuestas['Q1']?.valor === 'no') {
    recs.push('🚨 URGENTE: Redacte e implemente una Política de Tratamiento de Datos Personales. Es el requisito fundacional de la Ley 1581.');
  }
  if (respuestas['Q2']?.valor === 'no' && !respuestas['Q2']?.bloqueada) {
    recs.push('📢 Publique su política en su sitio web y canales de atención al cliente con acceso visible.');
  }
  if (respuestas['Q6']?.valor === 'no') {
    recs.push('🔍 Implemente evaluaciones de impacto de privacidad (PIAs) al diseñar nuevos productos o procesos.');
  }
  if (respuestas['Q7']?.valor === 'no') {
    recs.push('✂️ Audite sus formularios y bases de datos para eliminar campos de datos que no sean estrictamente necesarios.');
  }
  if (respuestas['Q8']?.valor === 'no') {
    recs.push('⚙️ Configure sus sistemas para que la opción más privada sea la predeterminada (Privacy by Default).');
  }
  if (respuestas['Q9']?.valor === 'no') {
    recs.push('📊 Cree un registro de activos de datos e implemente un programa básico de gestión de riesgos.');
  }
  if (respuestas['Q10']?.valor === 'no') {
    recs.push('👤 Designe formalmente un Oficial de Protección de Datos Personales en su organización.');
  }

  if (recs.length === 0) {
    recs.push('✅ ¡Excelente! Su organización mantiene un nivel de cumplimiento sólido. Programe revisiones periódicas de su política cada 12 meses.');
  }

  return recs;
}

// ----------------------------------------------------------
// Estado inicial del hook
// ----------------------------------------------------------
const ESTADO_INICIAL: EstadoDiagnostico = {
  preguntaActualIndex: 0,
  respuestas: {},
  scoreActual: 0,
  nivelRiesgo: 'critico',
  mostrandoSkipNotice: false,
  copilotAbierto: false,
  preguntaCopilot: null,
  completado: false,
  resultado: null,
};

// ----------------------------------------------------------
// Hook principal
// ----------------------------------------------------------
export function useDiagnostico() {
  const [estado, setEstado] = useState<EstadoDiagnostico>(ESTADO_INICIAL);

  const preguntaActual: Pregunta | null =
    PREGUNTAS[estado.preguntaActualIndex] ?? null;

  // Lista de preguntas visibles (no bloqueadas) para calcular progreso
  const preguntasVisibles = useMemo(() => {
    const hayPolitica = estado.respuestas['Q1']?.valor === 'si';
    return PREGUNTAS.filter((p) => {
      if (p.dependeDe === 'Q1' && !hayPolitica && estado.respuestas['Q1']) {
        return false; // bloqueadas si Q1=No y ya fue respondida
      }
      if (p.dependeDe === 'Q10') {
        const q10 = estado.respuestas['Q10'];
        if (q10 && q10.valor === 'no') return false;
      }
      return true;
    });
  }, [estado.respuestas]);

  const progresoPorcentaje = useMemo(() => {
    const respondidas = Object.keys(estado.respuestas).length;
    const total = PREGUNTAS.length;
    return Math.round((respondidas / total) * 100);
  }, [estado.respuestas]);

  // ----------------------------------------------------------
  // Función principal: responder una pregunta
  // ----------------------------------------------------------
  const responder = useCallback((valor: RespuestaValor) => {
    setEstado((prev) => {
      if (!preguntaActual) return prev;

      const nuevasRespuestas: Record<string, Respuesta> = {
        ...prev.respuestas,
        [preguntaActual.id]: {
          preguntaId: preguntaActual.id,
          valor,
          bloqueada: false,
          timestamp: new Date(),
        },
      };

      let nextIndex = prev.preguntaActualIndex + 1;
      let mostrandoSkipNotice = false;

      // ── REGLA DE ORO: Q1 = No → bloquear Q2-Q5 ──
      if (preguntaActual.id === 'Q1' && valor === 'no') {
        const preguntasBloqueadas = PREGUNTAS.filter((p) => p.dependeDe === 'Q1');
        preguntasBloqueadas.forEach((p) => {
          nuevasRespuestas[p.id] = {
            preguntaId: p.id,
            valor: 'no',
            bloqueada: true,
            timestamp: new Date(),
          };
        });
        // Saltar hasta Q6 (índice 5)
        nextIndex = PREGUNTAS.findIndex((p) => p.id === 'Q6');
        mostrandoSkipNotice = true;
      }

      // ── REGLA: Q10 = No → bloquear Q11 ──
      if (preguntaActual.id === 'Q10' && valor === 'no') {
        const q11 = PREGUNTAS.find((p) => p.id === 'Q11');
        if (q11) {
          nuevasRespuestas['Q11'] = {
            preguntaId: 'Q11',
            valor: 'no',
            bloqueada: true,
            timestamp: new Date(),
          };
        }
        nextIndex = PREGUNTAS.length; // Fin del cuestionario
      }

      const nuevoScore = calcularScore(nuevasRespuestas);
      const nuevoNivel = calcularNivelRiesgo(nuevoScore);

      // ── VERIFICAR SI EL CUESTIONARIO TERMINÓ ──
      const terminado = nextIndex >= PREGUNTAS.length;
      let resultado: ResultadoDiagnostico | null = null;

      if (terminado) {
        const resultadosPorBloque: ResultadoBloque[] = BLOQUES.map((bloque) => {
          const preguntasDelBloque = PREGUNTAS.filter(
            (p) => p.bloqueId === bloque.id && !p.esComplementaria
          );
          const scoreObtenido = preguntasDelBloque.reduce((acc, p) => {
            const r = nuevasRespuestas[p.id];
            if (!r || r.bloqueada || r.valor !== 'si') return acc;
            return acc + p.peso;
          }, 0);
          const scoreMaximo = preguntasDelBloque.reduce((acc, p) => acc + p.peso, 0);
          const bloqueadas = preguntasDelBloque.filter(
            (p) => nuevasRespuestas[p.id]?.bloqueada
          ).length;

          return {
            bloque,
            scoreObtenido,
            scoreMaximo,
            porcentaje: scoreMaximo > 0 ? Math.round((scoreObtenido / scoreMaximo) * 100) : 0,
            preguntasRespondidas: preguntasDelBloque.filter(
              (p) => nuevasRespuestas[p.id] && !nuevasRespuestas[p.id].bloqueada
            ).length,
            preguntasBloqueadas: bloqueadas,
          };
        });

        resultado = {
          scoreTotal: nuevoScore,
          nivelRiesgo: nuevoNivel,
          resultadosPorBloque,
          respuestas: nuevasRespuestas,
          fechaCompletado: new Date(),
          recomendaciones: generarRecomendaciones(nuevasRespuestas),
        };
      }

      return {
        ...prev,
        respuestas: nuevasRespuestas,
        preguntaActualIndex: Math.min(nextIndex, PREGUNTAS.length),
        scoreActual: nuevoScore,
        nivelRiesgo: nuevoNivel,
        mostrandoSkipNotice,
        completado: terminado,
        resultado,
        copilotAbierto: false,
      };
    });
  }, [preguntaActual]);

  // ----------------------------------------------------------
  // Cerrar el skip notice después de mostrarse
  // ----------------------------------------------------------
  const cerrarSkipNotice = useCallback(() => {
    setEstado((prev) => ({ ...prev, mostrandoSkipNotice: false }));
  }, []);

  // ----------------------------------------------------------
  // Copilot IA: abrir/cerrar sidebar
  // ----------------------------------------------------------
  const abrirCopilot = useCallback((pregunta: Pregunta) => {
    setEstado((prev) => ({
      ...prev,
      copilotAbierto: true,
      preguntaCopilot: pregunta,
    }));
  }, []);

  const cerrarCopilot = useCallback(() => {
    setEstado((prev) => ({
      ...prev,
      copilotAbierto: false,
      preguntaCopilot: null,
    }));
  }, []);

  // ----------------------------------------------------------
  // Reiniciar diagnóstico
  // ----------------------------------------------------------
  const reiniciar = useCallback(() => {
    setEstado(ESTADO_INICIAL);
  }, []);

  return {
    // Estado
    estado,
    preguntaActual,
    preguntasVisibles,
    progresoPorcentaje,
    totalPreguntas: PREGUNTAS.length,
    bloques: BLOQUES,

    // Acciones
    responder,
    cerrarSkipNotice,
    abrirCopilot,
    cerrarCopilot,
    reiniciar,
  };
}
