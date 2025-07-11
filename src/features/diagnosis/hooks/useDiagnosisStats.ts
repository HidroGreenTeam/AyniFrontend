import { useEffect } from 'react';
import { useGlobalStore } from '@/store/globalStore';
import { useDiagnosisHistory } from './useDiagnosis';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useFarmerProfile } from '@/features/farmers/hooks/useFarmerProfile';

/**
 * Hook para manejar estadísticas de diagnósticos
 * Integra con el global store y mantiene datos actualizados
 */
export function useDiagnosisStats() {
  const { user } = useAuth();
  const { farmer } = useFarmerProfile();
  const { fetchFarmerHistory } = useDiagnosisHistory();
  
  // Obtener datos del global store
  const diagnosisStats = useGlobalStore(state => state.diagnosisStats);
  const diagnosisStatsLastUpdated = useGlobalStore(state => state.diagnosisStatsLastUpdated);
  const diagnoses = useGlobalStore(state => state.diagnoses);
  const calculateDiagnosisStats = useGlobalStore(state => state.calculateDiagnosisStats);

  // Cargar diagnósticos y calcular estadísticas
  useEffect(() => {
    async function loadStats() {
      const farmerId = farmer?.id || user?.id;
      if (!farmerId) return;

      // Solo cargar si no hay datos o están desactualizados (más de 5 minutos)
      const shouldFetch = !diagnosisStats || 
        !diagnosisStatsLastUpdated || 
        (Date.now() - diagnosisStatsLastUpdated > 5 * 60 * 1000);

      if (shouldFetch) {
        try {
          // Cargar historial de diagnósticos
          await fetchFarmerHistory(farmerId);
          // Las estadísticas se calculan automáticamente cuando se actualiza el store
        } catch (error) {
          console.error('Error loading diagnosis stats:', error);
        }
      }
    }

    loadStats();
  }, [farmer?.id, user?.id, diagnosisStats, diagnosisStatsLastUpdated, fetchFarmerHistory]);

  // Recalcular estadísticas si los diagnósticos cambian pero las stats no están actualizadas
  useEffect(() => {
    if (diagnoses && diagnoses.length > 0 && !diagnosisStats) {
      calculateDiagnosisStats();
    }
  }, [diagnoses, diagnosisStats, calculateDiagnosisStats]);

  return {
    stats: diagnosisStats || {
      total: 0,
      thisMonth: 0,
      thisWeek: 0,
      diseaseDetected: 0,
      healthyCrops: 0,
      requiresTreatment: 0
    },
    isLoading: !diagnosisStats && diagnoses.length === 0,
    lastUpdated: diagnosisStatsLastUpdated,
    refresh: () => {
      const farmerId = farmer?.id || user?.id;
      if (farmerId) {
        fetchFarmerHistory(farmerId);
      }
    }
  };
} 