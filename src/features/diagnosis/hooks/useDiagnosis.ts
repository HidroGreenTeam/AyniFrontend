import { useState, useCallback } from 'react';
import { Diagnosis, DiagnosisRequest, PredictionResult, DetectionStatistics, HealthStatus } from '../types';
import { 
    diagnoseImage, 
    getFarmerDiagnosisHistory, 
    getDiagnosisById, 
    getCropDiagnosis,
    predictDisease,
    getDetectionStatistics,
    getHealthCheck
} from '../services/diagnosis';
import { useGlobalStore } from '@/store/globalStore';

export function useDiagnosis() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    
    // Obtener diagnósticos del global store
    const diagnoses = useGlobalStore(state => state.diagnoses);
    const addDiagnosis = useGlobalStore(state => state.addDiagnosis);

    const performDiagnosis = useCallback(async (request: DiagnosisRequest): Promise<Diagnosis | null> => {
        try {
            setLoading(true);
            setError(null);
            const result = await diagnoseImage(request);
            setDiagnosis(result);
            
            // Agregar el nuevo diagnóstico al global store
            addDiagnosis(result);
            
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al realizar diagnóstico';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, [addDiagnosis]);

    const performPrediction = useCallback(async (file: File): Promise<PredictionResult | null> => {
        try {
            setLoading(true);
            setError(null);
            const result = await predictDisease(file);
            setPrediction(result);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al predecir enfermedad';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getDiagnosis = useCallback(async (diagnosisId: number): Promise<Diagnosis | null> => {
        console.log('🔍 useDiagnosis getDiagnosis - Recibido diagnosisId:', diagnosisId);
        console.log('🔍 useDiagnosis getDiagnosis - typeof diagnosisId:', typeof diagnosisId);
        
        if (!diagnosisId || isNaN(diagnosisId) || diagnosisId <= 0) {
            const errorMessage = 'ID de diagnóstico inválido';
            console.log('❌ useDiagnosis getDiagnosis - ID inválido:', diagnosisId);
            setError(errorMessage);
            return null;
        }

        try {
            setLoading(true);
            setError(null);
            console.log('🚀 useDiagnosis getDiagnosis - Llamando getDiagnosisById con:', diagnosisId);
            const result = await getDiagnosisById(diagnosisId);
            console.log('✅ useDiagnosis getDiagnosis - Resultado:', result);
            setDiagnosis(result);
            return result;
        } catch (err) {
            console.error('❌ useDiagnosis getDiagnosis - Error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener diagnóstico';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearDiagnosis = useCallback(() => {
        setDiagnosis(null);
    }, []);

    const clearPrediction = useCallback(() => {
        setPrediction(null);
    }, []);

    return {
        diagnosis,
        prediction,
        diagnoses, // Exponer diagnósticos del global store
        loading,
        error,
        performDiagnosis,
        performPrediction,
        getDiagnosis,
        clearError,
        clearDiagnosis,
        clearPrediction,
    };
}

export function useDiagnosisHistory() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<Diagnosis[]>([]);
    
    // Obtener diagnósticos del global store
    const diagnoses = useGlobalStore(state => state.diagnoses);
    const setDiagnoses = useGlobalStore(state => state.setDiagnoses);
    const diagnosesLastUpdated = useGlobalStore(state => state.diagnosesLastUpdated);

    const fetchFarmerHistory = useCallback(async (farmerId: number): Promise<Diagnosis[]> => {
        // Solo hacer fetch si no hay datos o si han pasado más de 5 minutos
        const shouldFetch = !diagnoses.length || !diagnosesLastUpdated || (Date.now() - diagnosesLastUpdated > 5 * 60 * 1000);
        
        if (!shouldFetch) {
            setHistory(diagnoses);
            return diagnoses;
        }

        try {
            setLoading(true);
            setError(null);
            const result = await getFarmerDiagnosisHistory(farmerId);
            setDiagnoses(result);
            setHistory(result);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener historial';
            setError(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, [diagnoses, diagnosesLastUpdated, setDiagnoses]);

    const fetchCropHistory = useCallback(async (cropId: number): Promise<Diagnosis[]> => {
        try {
            setLoading(true);
            setError(null);
            const result = await getCropDiagnosis(cropId);
            setHistory(result);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener historial del cultivo';
            setError(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    return {
        history,
        diagnoses, // Exponer diagnósticos del global store
        loading,
        error,
        fetchFarmerHistory,
        fetchCropHistory,
        clearError,
        clearHistory,
    };
}

export function useDiagnosisStatistics() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
    
    // Obtener estadísticas del global store
    const statistics = useGlobalStore(state => state.statistics);
    const setStatistics = useGlobalStore(state => state.setStatistics);
    const statisticsLastUpdated = useGlobalStore(state => state.statisticsLastUpdated);

    const fetchStatistics = useCallback(async (): Promise<DetectionStatistics | null> => {
        // Solo hacer fetch si no hay datos o si han pasado más de 10 minutos
        const shouldFetch = !statistics || !statisticsLastUpdated || (Date.now() - statisticsLastUpdated > 10 * 60 * 1000);
        
        if (!shouldFetch && statistics) {
            return statistics;
        }

        try {
            setLoading(true);
            setError(null);
            const result = await getDetectionStatistics();
            setStatistics(result);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener estadísticas';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, [statistics, statisticsLastUpdated, setStatistics]);

    const checkHealth = useCallback(async (): Promise<HealthStatus | null> => {
        try {
            setLoading(true);
            setError(null);
            const result = await getHealthCheck();
            setHealthStatus(result);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al verificar estado del sistema';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        statistics,
        healthStatus,
        loading,
        error,
        fetchStatistics,
        checkHealth,
        clearError,
    };
} 