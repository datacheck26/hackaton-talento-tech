'use client';

import { useState, useCallback, useEffect } from 'react';
import type { DatosEmpresa } from './types';
import type { ResultadoDiagnostico } from '../diagnostico/types';
import { supabase } from '../supabaseClient';

export interface DiagnosticoGuardado {
  id: string;
  fecha: string;
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

export function useEmpresa() {
  const [empresa, setEmpresaState] = useState<DatosEmpresa | null>(null);
  const [historial, setHistorialState] = useState<DiagnosticoGuardado[]>([]);
  const [empresaId, setEmpresaId] = useState<string | null>(null);

  // Leer desde Supabase al montar
  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Cargar empresa (la primera que tenga asignada)
      const { data: ueData } = await supabase
        .from('user_empresas')
        .select('empresa_id')
        .eq('user_id', session.user.id)
        .limit(1)
        .single();

      if (ueData) {
        const { data: empData } = await supabase
          .from('empresas')
          .select('*')
          .eq('id', ueData.empresa_id)
          .single();
        
        if (empData) {
          setEmpresaId(empData.id);
          setEmpresaState({
            nombre: empData.nombre,
            nit: empData.nit,
            sector: empData.sector as any,
            tamano: empData.tamano as any,
            fechaRegistro: empData.created_at,
          });

          // Cargar historial de diagnósticos
          const { data: diagData } = await supabase
            .from('diagnosticos')
            .select('*')
            .eq('empresa_id', empData.id)
            .order('created_at', { ascending: false });

          if (diagData) {
            setHistorialState(diagData.map((d: any) => ({
              id: d.id,
              fecha: d.created_at,
              scoreTotal: d.score_total,
              nivelRiesgo: d.nivel_riesgo,
              recomendaciones: d.recomendaciones_json || [],
              resultadosPorBloque: d.resultados_json || [],
            })));
          }
        }
      }
    }
    loadData();
  }, []);

  const guardarEmpresa = useCallback(async (datos: DatosEmpresa) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Crear la empresa (el trigger de DB asignará al usuario en user_empresas)
    const { data, error } = await supabase
      .from('empresas')
      .insert({
        nombre: datos.nombre,
        nit: datos.nit,
        sector: datos.sector,
        tamano: datos.tamano,
      })
      .select()
      .single();

    if (!error && data) {
      setEmpresaId(data.id);
      setEmpresaState(datos);
    }
  }, []);

  const limpiarEmpresa = useCallback(() => {
    setEmpresaState(null);
    setEmpresaId(null);
  }, []);

  const guardarDiagnostico = useCallback(async (resultado: ResultadoDiagnostico) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !empresaId) return;

    const { data, error } = await supabase
      .from('diagnosticos')
      .insert({
        empresa_id: empresaId,
        evaluador_id: session.user.id,
        score_total: resultado.scoreTotal,
        nivel_riesgo: resultado.nivelRiesgo,
        resultados_json: resultado.resultadosPorBloque.map((rb) => ({
          bloqueId: rb.bloque.id,
          bloqueTitulo: rb.bloque.titulo,
          scoreObtenido: rb.scoreObtenido,
          scoreMaximo: rb.scoreMaximo,
          porcentaje: rb.porcentaje,
        })),
        recomendaciones_json: resultado.recomendaciones,
      })
      .select()
      .single();

    if (!error && data) {
      const nuevo: DiagnosticoGuardado = {
        id: data.id,
        fecha: data.created_at,
        scoreTotal: data.score_total,
        nivelRiesgo: data.nivel_riesgo,
        recomendaciones: data.recomendaciones_json,
        resultadosPorBloque: data.resultados_json,
      };

      setHistorialState((prev) => [nuevo, ...prev]);
    }
  }, [empresaId]);

  const limpiarHistorial = useCallback(() => {
    setHistorialState([]);
  }, []);

  return {
    empresa,
    historial,
    empresaId, // Exportado para uso en otros hooks
    guardarEmpresa,
    limpiarEmpresa,
    guardarDiagnostico,
    limpiarHistorial,
  };
}
