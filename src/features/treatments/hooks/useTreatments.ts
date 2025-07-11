import { useState, useCallback } from 'react';
import { useGlobalStore } from '@/store/globalStore';
import { 
  getTreatmentsByProfile, 
  getTreatmentsByCrop, 
  getOverdueTreatments, 
  getTreatmentById, 
  getStepsByTreatment, 
  createStep as createTreatmentStep, 
  updateStep as updateTreatmentStep, 
  completeStep as completeStepService, 
  skipStep as skipStepService, 
  getStepsWithReminders, 
  getOverdueSteps 
} from '../services/treatment';
import { aiRecommendationService, AITreatmentRecommendation } from '../services/aiRecommendations';
import { 
  Treatment, 
  TreatmentStep, 
  StepInput
} from '../services/treatment';
import { Diagnosis } from '@/features/diagnosis/types';

/**
 * Hook principal para gestión de tratamientos con global store
 */
export function useTreatments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useGlobalStore(state => state.user);

  // Estados del global store
  const treatments = useGlobalStore(state => state.treatments);
  const treatmentsLastUpdated = useGlobalStore(state => state.treatmentsLastUpdated);
  const treatmentStats = useGlobalStore(state => state.treatmentStats);
  const setTreatments = useGlobalStore(state => state.setTreatments);
  const addTreatment = useGlobalStore(state => state.addTreatment);
  const updateTreatment = useGlobalStore(state => state.updateTreatment);

  const clearError = useCallback(() => setError(null), []);

  // Cargar tratamientos por perfil con cache inteligente
  const fetchProfileTreatments = useCallback(async () => {
    // Solo hacer fetch si no hay datos o si han pasado más de 5 minutos
    const shouldFetch = !treatments.length || 
      !treatmentsLastUpdated || 
      (Date.now() - treatmentsLastUpdated > 5 * 60 * 1000);

    if (!shouldFetch) {
      return treatments;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getTreatmentsByProfile(user?.id || 0);
      setTreatments(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar tratamientos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [treatments, treatmentsLastUpdated, setTreatments, user?.id]);

  // Cargar tratamientos por cultivo
  const fetchCropTreatments = useCallback(async (cropId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTreatmentsByCrop(cropId);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar tratamientos del cultivo';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar tratamientos vencidos
  const fetchOverdueTreatments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOverdueTreatments();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar tratamientos vencidos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar tratamiento por diagnóstico
  const findTreatmentByDiagnosis = useCallback((diagnosisId: number): Treatment | undefined => {
    return treatments.find(t => t.diagnosisId === diagnosisId);
  }, [treatments]);

  // Actualizar progreso de tratamiento
  const updateTreatmentProgress = useCallback((treatmentId: number, newProgress: Partial<Treatment>) => {
    const existingTreatment = treatments.find(t => t.id === treatmentId);
    if (existingTreatment) {
      updateTreatment({ ...existingTreatment, ...newProgress });
    }
  }, [treatments, updateTreatment]);

  return {
    treatments,
    treatmentStats,
    loading,
    error,
    clearError,
    fetchProfileTreatments,
    fetchCropTreatments,
    fetchOverdueTreatments,
    findTreatmentByDiagnosis,
    updateTreatmentProgress,
    addTreatment,
    updateTreatment
  };
}

/**
 * Hook para gestionar un tratamiento específico y sus pasos
 */
export function useTreatmentDetails(treatmentId?: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [steps, setSteps] = useState<TreatmentStep[]>([]);

  // Acceder al global store para actualizar tratamientos
  const updateTreatment = useGlobalStore(state => state.updateTreatment);

  const clearError = useCallback(() => setError(null), []);

  // Cargar tratamiento y sus pasos
  const fetchTreatmentDetails = useCallback(async (id: number) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const [treatmentData, stepsData] = await Promise.all([
        getTreatmentById(id),
        getStepsByTreatment(id)
      ]);
      
      setTreatment(treatmentData);
      setSteps(stepsData);
      
      // Actualizar en el global store también
      updateTreatment(treatmentData);
      
      return { treatment: treatmentData, steps: stepsData };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar detalles del tratamiento';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateTreatment]);

  // Crear nuevo paso
  const createStep = useCallback(async (stepData: StepInput) => {
    if (!treatmentId) throw new Error('Treatment ID is required');
    
    setLoading(true);
    setError(null);
    try {
      const newStep = await createTreatmentStep(treatmentId, stepData);
      setSteps(prev => [...prev, newStep]);
      
      // Actualizar el conteo de actividades en el tratamiento
      if (treatment) {
        const updatedTreatment = {
          ...treatment,
          activitiesCount: treatment.activitiesCount + 1,
          pendingActivitiesCount: treatment.pendingActivitiesCount + 1
        };
        setTreatment(updatedTreatment);
        updateTreatment(updatedTreatment);
      }
      
      return newStep;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear paso';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [treatmentId, treatment, updateTreatment]);

  // Actualizar paso
  const updateStep = useCallback(async (stepId: number, stepData: StepInput) => {
    setLoading(true);
    setError(null);
    try {
      const updatedStep = await updateTreatmentStep(stepId, stepData);
      setSteps(prev => prev.map(step => step.id === stepId ? updatedStep : step));
      return updatedStep;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar paso';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Completar paso
  const completeStep = useCallback(async (stepId: number) => {
    setLoading(true);
    setError(null);
    try {
      const completedStep = await completeStepService(stepId);
      setSteps(prev => prev.map(step => step.id === stepId ? completedStep : step));
      
      // Actualizar el progreso del tratamiento
      if (treatment) {
        const newCompletedCount = treatment.completedActivitiesCount + 1;
        const newPendingCount = Math.max(0, treatment.pendingActivitiesCount - 1);
        const newProgress = treatment.activitiesCount > 0 
          ? Math.round((newCompletedCount / treatment.activitiesCount) * 100)
          : 0;
          
        const updatedTreatment = {
          ...treatment,
          completedActivitiesCount: newCompletedCount,
          pendingActivitiesCount: newPendingCount,
          progressPercentage: newProgress
        };
        setTreatment(updatedTreatment);
        updateTreatment(updatedTreatment);
      }
      
      return completedStep;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al completar paso';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [treatment, updateTreatment]);

  // Omitir paso
  const skipStep = useCallback(async (stepId: number) => {
    setLoading(true);
    setError(null);
    try {
      const skippedStep = await skipStepService(stepId);
      setSteps(prev => prev.map(step => step.id === stepId ? skippedStep : step));
      
      // Actualizar el conteo de pendientes
      if (treatment) {
        const newPendingCount = Math.max(0, treatment.pendingActivitiesCount - 1);
        const updatedTreatment = {
          ...treatment,
          pendingActivitiesCount: newPendingCount
        };
        setTreatment(updatedTreatment);
        updateTreatment(updatedTreatment);
      }
      
      return skippedStep;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al omitir paso';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [treatment, updateTreatment]);

  return {
    treatment,
    steps,
    loading,
    error,
    clearError,
    fetchTreatmentDetails,
    createStep,
    updateStep,
    completeStep,
    skipStep
  };
}

/**
 * Hook para generar recomendaciones de IA
 */
export function useAIRecommendations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<AITreatmentRecommendation | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const generateRecommendations = useCallback(async (diagnosis: Diagnosis) => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiRecommendationService.generateTreatmentRecommendations(diagnosis);
      setRecommendations(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar recomendaciones';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const formatForSteps = useCallback((recs: AITreatmentRecommendation) => {
    return aiRecommendationService.formatForTreatmentSteps(recs);
  }, []);

  return {
    recommendations,
    loading,
    error,
    clearError,
    generateRecommendations,
    formatForSteps
  };
}

/**
 * Hook para recordatorios y tareas pendientes
 */
export function useTreatmentReminders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reminders, setReminders] = useState<TreatmentStep[]>([]);
  const [overdueSteps, setOverdueSteps] = useState<TreatmentStep[]>([]);

  const clearError = useCallback(() => setError(null), []);

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStepsWithReminders();
      setReminders(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar recordatorios';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOverdueSteps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOverdueSteps();
      setOverdueSteps(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar pasos vencidos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reminders,
    overdueSteps,
    loading,
    error,
    clearError,
    fetchReminders,
    fetchOverdueSteps
  };
} 