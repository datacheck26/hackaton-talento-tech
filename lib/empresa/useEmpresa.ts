'use client';

// ============================================================
// Datacheck AI — Hook: useEmpresa
// Gestiona datos de empresa + historial de diagnósticos en localStorage
// ============================================================

import { useState, useCallback, useEffect } from 'react';
import type { DatosEmpresa } from './types';
import type { ResultadoDiagnostico } from '../diagnostico/types';

const KEY_EMPRESA   = 'datacheck_empresa';
const KEY_HISTORIAL = 'datacheck_historial';

export interface DiagnosticoGuardado {
  id: string;
  fecha: string;          // ISO string
  scoreTotal: number;
  nivelRiesgo: string;
  recomendaciones: string[];
  resultadosPorBloque: Array<{
    bloqueId: string;
    bloqueTitulo: string;
    scoreObtenido: number;
    scoreMaximo: number;
    porcentaje: number;
  }>;
}

function parseSafe<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function useEmpresa() {
  const [empresa, setEmpresaState] = useState<DatosEmpresa | null>(null);
  const [historial, setHistorialState] = useState<DiagnosticoGuardado[]>([]);

  // Leer desde localStorage al montar
  useEffect(() => {
    setEmpresaState(parseSafe<DatosEmpresa>(KEY_EMPRESA));
    setHistorialState(parseSafe<DiagnosticoGuardado[]>(KEY_HISTORIAL) ?? []);
  }, []);

  // ----------------------------------------------------------
  // Guardar/actualizar datos de empresa
  // ----------------------------------------------------------
  const guardarEmpresa = useCallback((datos: DatosEmpresa) => {
    localStorage.setItem(KEY_EMPRESA, JSON.stringify(datos));
    setEmpresaState(datos);
  }, []);

  const limpiarEmpresa = useCallback(() => {
    localStorage.removeItem(KEY_EMPRESA);
    setEmpresaState(null);
  }, []);

  // ----------------------------------------------------------
  // Guardar resultado de diagnóstico en historial
  // ----------------------------------------------------------
  const guardarDiagnostico = useCallback((resultado: ResultadoDiagnostico) => {
    const nuevo: DiagnosticoGuardado = {
      id: `diag_${Date.now()}`,
      fecha: resultado.fechaCompletado.toISOString(),
      scoreTotal: resultado.scoreTotal,
      nivelRiesgo: resultado.nivelRiesgo,
      recomendaciones: resultado.recomendaciones,
      resultadosPorBloque: resultado.resultadosPorBloque.map((rb) => ({
        bloqueId: rb.bloque.id,
        bloqueTitulo: rb.bloque.titulo,
        scoreObtenido: rb.scoreObtenido,
        scoreMaximo: rb.scoreMaximo,
        porcentaje: rb.porcentaje,
      })),
    };

    setHistorialState((prev) => {
      const nuevo_historial = [nuevo, ...prev];
      localStorage.setItem(KEY_HISTORIAL, JSON.stringify(nuevo_historial));
      return nuevo_historial;
    });
  }, []);

  const limpiarHistorial = useCallback(() => {
    localStorage.removeItem(KEY_HISTORIAL);
    setHistorialState([]);
  }, []);

  return {
    empresa,
    historial,
    guardarEmpresa,
    limpiarEmpresa,
    guardarDiagnostico,
    limpiarHistorial,
  };
}
