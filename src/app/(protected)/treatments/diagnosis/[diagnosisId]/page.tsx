"use client";

import {
  ArrowLeft,
  AlertTriangle,
  Calendar,
  Coffee,
  Activity,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDiagnosis } from "@/features/diagnosis/hooks/useDiagnosis";
import { useTreatments } from "@/features/treatments/hooks/useTreatments";
import { useCrops } from "@/features/crops/hooks/useCrops";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { TreatmentStepsManager } from "@/features/treatments/components/TreatmentStepsManager";
import { Diagnosis } from "@/features/diagnosis/types";

import Link from "next/link";

export default function TreatmentDiagnosisPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { crops } = useCrops(user as { id: number; [key: string]: unknown } | null);
  const { getDiagnosis } = useDiagnosis();
  const { treatments, fetchProfileTreatments } = useTreatments();
  
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const diagnosisId = params.diagnosisId as string;

  useEffect(() => {
    async function fetchData() {
      if (!diagnosisId || !user?.id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Cargar diagnóstico
        const diagnosisData = await getDiagnosis(parseInt(diagnosisId));
        setDiagnosis(diagnosisData);
        
        // Buscar tratamiento existente para este diagnóstico
        await fetchProfileTreatments();
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [diagnosisId, user?.id, getDiagnosis, fetchProfileTreatments]);

  // Buscar tratamiento existente para este diagnóstico
  console.log('🔍 TreatmentDiagnosisPage - diagnosisId:', diagnosisId);
  console.log('🔍 TreatmentDiagnosisPage - parseInt(diagnosisId):', parseInt(diagnosisId));
  console.log('🔍 TreatmentDiagnosisPage - treatments:', treatments);
  console.log('🔍 TreatmentDiagnosisPage - treatments.map(t => t.diagnosisId):', treatments.map(t => t.diagnosisId));
  
  const existingTreatment = treatments.find(t => t.diagnosisId === parseInt(diagnosisId));
  console.log('🔍 TreatmentDiagnosisPage - existingTreatment:', existingTreatment);

  const getDiseaseName = (predictedClass: string) => {
    const diseaseMap: { [key: string]: string } = {
      'rust': 'Roya del café',
      'healthy': 'Planta saludable',
      'nodisease': 'Sin enfermedad detectada',
      'leaf_spot': 'Ojo de gallo',
      'coffee_borer': 'Broca del café',
      'anthracnose': 'Antracnosis',
      'bacterial_blight': 'Tizón bacteriano'
    };
    return diseaseMap[predictedClass] || predictedClass;
  };

  const handleStepCreated = () => {
    // Refrescar tratamientos cuando se crea un nuevo paso
    fetchProfileTreatments();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando tratamiento...</span>
      </div>
    );
  }

  if (error || !diagnosis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error al cargar el tratamiento
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const crop = crops.find(c => c.id === diagnosis.crop_id);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver
        </button>
        
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {existingTreatment ? 'Plan de Tratamiento' : 'Crear Plan de Tratamiento'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Para {getDiseaseName(diagnosis.predicted_class)}
          </p>
        </div>
      </div>

      {/* Información del diagnóstico */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Información del diagnóstico</h2>
          <Link
                          href={`/diagnosis/details/${diagnosis.diagnosis_id}`}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Ver detalles completos
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Diagnóstico</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {getDiseaseName(diagnosis.predicted_class)}
              </div>
            </div>
          </div>
          
          {crop && (
            <div className="flex items-center">
              <Coffee className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Cultivo</div>
                <div className="font-medium text-gray-900 dark:text-white">{crop.cropName}</div>
              </div>
            </div>
          )}
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Fecha</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {new Date(diagnosis.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progreso del tratamiento (solo si existe) */}
      {existingTreatment && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Progreso del tratamiento</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {existingTreatment.completedActivitiesCount} de {existingTreatment.activitiesCount} completadas
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${existingTreatment.progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {existingTreatment.activitiesCount}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total pasos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {existingTreatment.completedActivitiesCount}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Completados</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {existingTreatment.pendingActivitiesCount}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Pendientes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(existingTreatment.progressPercentage)}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Progreso</div>
            </div>
          </div>
        </div>
      )}

      {/* Componente de gestión de pasos */}
      {existingTreatment ? (
        <TreatmentStepsManager
          treatmentId={existingTreatment.id}
          diagnosis={diagnosis}
          onStepCreated={handleStepCreated}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="h-20 w-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Crear Plan de Tratamiento
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
                Para el diagnóstico de <strong>{getDiseaseName(diagnosis.predicted_class)}</strong>, 
                crea un plan de tratamiento personalizado con pasos y recordatorios.
              </p>
              
              {diagnosis.requires_treatment ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
                    <p className="text-sm text-red-800 dark:text-red-200">
                      Este diagnóstico requiere tratamiento inmediato
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Crea un plan preventivo para mantener la salud del cultivo
                    </p>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <button 
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    // Por ahora redirigir a tratamientos, después implementar creación automática
                    window.location.href = '/treatments';
                  }}
                >
                  Crear Tratamiento Automático
                </button>
                
                <div className="text-gray-400 dark:text-gray-500">o</div>
                
                <Link
                  href="/treatments"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Ir a Gestión de Tratamientos
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 