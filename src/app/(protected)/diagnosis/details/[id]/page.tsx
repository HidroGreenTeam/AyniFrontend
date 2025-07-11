"use client";

import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Coffee,
  Activity,
  TrendingUp,
  Stethoscope,
  Plus,
  Download,
  Share2
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDiagnosis } from "@/features/diagnosis/hooks/useDiagnosis";
import { useCrops } from "@/features/crops/hooks/useCrops";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Diagnosis } from "@/features/diagnosis/types";
import Link from "next/link";
import Image from "next/image";

export default function DiagnosisDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { crops } = useCrops(user as { id: number; [key: string]: unknown } | null);
  const { getDiagnosis } = useDiagnosis();
  
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const diagnosisId = params.id as string;

  console.log('🔍 DiagnosisDetailsPage - params:', params);
  console.log('🔍 DiagnosisDetailsPage - diagnosisId:', diagnosisId);
  console.log('🔍 DiagnosisDetailsPage - typeof diagnosisId:', typeof diagnosisId);

  useEffect(() => {
    console.log('🔍 DiagnosisDetailsPage useEffect - diagnosisId:', diagnosisId);
    
    async function fetchDiagnosis() {
      if (!diagnosisId || diagnosisId === 'undefined') {
        console.log('❌ DiagnosisDetailsPage - ID no proporcionado o es undefined');
        setError('ID de diagnóstico no proporcionado');
        setLoading(false);
        return;
      }
      
      const numericId = parseInt(diagnosisId, 10);
      console.log('🔍 DiagnosisDetailsPage - numericId:', numericId);
      
      if (isNaN(numericId) || numericId <= 0) {
        console.log('❌ DiagnosisDetailsPage - ID inválido:', numericId);
        setError('ID de diagnóstico inválido');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        console.log('🚀 DiagnosisDetailsPage - Llamando getDiagnosis con ID:', numericId);
        const data = await getDiagnosis(numericId);
        console.log('✅ DiagnosisDetailsPage - Datos recibidos:', data);
        setDiagnosis(data);
      } catch (err) {
        console.error('❌ DiagnosisDetailsPage - Error:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar el diagnóstico');
      } finally {
        setLoading(false);
      }
    }

    fetchDiagnosis();
  }, [diagnosisId, getDiagnosis]);

  const getStatusColor = (diseaseDetected: boolean, requiresTreatment: boolean) => {
    if (!diseaseDetected) return 'green';
    if (requiresTreatment) return 'red';
    return 'yellow';
  };

  const getStatusText = (diseaseDetected: boolean, requiresTreatment: boolean) => {
    if (!diseaseDetected) return 'Saludable';
    if (requiresTreatment) return 'Requiere tratamiento';
    return 'En observación';
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando diagnóstico...</span>
      </div>
    );
  }

  if (error || !diagnosis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error al cargar el diagnóstico
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error || 'No se pudo encontrar el diagnóstico solicitado'}
          </p>
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
  const statusColor = getStatusColor(diagnosis.disease_detected, diagnosis.requires_treatment);
  const statusText = getStatusText(diagnosis.disease_detected, diagnosis.requires_treatment);
  const confidence = Math.round(diagnosis.confidence * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header con navegación */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver al historial
        </button>
        
        <div className="flex gap-2">
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Card principal del diagnóstico */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        
        {/* Banner con estado */}
        <div className={`bg-${statusColor}-50 dark:bg-${statusColor}-900/20 border-b border-${statusColor}-100 dark:border-${statusColor}-800/30 p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`h-12 w-12 rounded-full bg-${statusColor}-100 dark:bg-${statusColor}-900/30 flex items-center justify-center mr-4`}>
                {statusColor === 'green' ? (
                  <CheckCircle2 className={`h-6 w-6 text-${statusColor}-600 dark:text-${statusColor}-400`} />
                ) : (
                  <AlertTriangle className={`h-6 w-6 text-${statusColor}-600 dark:text-${statusColor}-400`} />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getDiseaseName(diagnosis.predicted_class)}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Diagnóstico realizado el {formatDate(diagnosis.created_at)}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-100 dark:bg-${statusColor}-900/30 text-${statusColor}-700 dark:text-${statusColor}-400`}>
                {statusText}
              </span>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Confianza: <span className="font-semibold">{confidence}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Imagen del diagnóstico */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <Camera className="h-5 w-5 mr-2 text-gray-500" />
                Imagen analizada
              </h3>
              
              {diagnosis.image_url ? (
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={diagnosis.image_url}
                    alt="Imagen del diagnóstico"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No hay imagen disponible</p>
                  </div>
                </div>
              )}
            </div>

            {/* Información del cultivo y detalles */}
            <div className="space-y-6">
              
              {/* Información del cultivo */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4">
                  <Coffee className="h-5 w-5 mr-2 text-gray-500" />
                  Información del cultivo
                </h3>
                
                {crop ? (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {crop.cropName}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="h-4 w-4 mr-2" />
                      {crop.location}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Área:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">{crop.area} ha</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Plantado:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          {new Date(crop.plantingDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">Información del cultivo no disponible</p>
                )}
              </div>

              {/* Métricas del diagnóstico */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4">
                  <Activity className="h-5 w-5 mr-2 text-gray-500" />
                  Detalles del análisis
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Nivel de confianza</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{confidence}%</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-${statusColor}-500 h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Enfermedad detectada</span>
                      <span className={`font-semibold ${diagnosis.disease_detected ? 'text-red-600' : 'text-green-600'}`}>
                        {diagnosis.disease_detected ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Requiere tratamiento</span>
                      <span className={`font-semibold ${diagnosis.requires_treatment ? 'text-red-600' : 'text-green-600'}`}>
                        {diagnosis.requires_treatment ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Acciones */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              href={`/treatments/diagnosis/${diagnosis.diagnosis_id}`}
              className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                diagnosis.requires_treatment
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {diagnosis.requires_treatment ? (
                <>
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Ver plan de tratamiento
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Crear plan preventivo
                </>
              )}
            </Link>
            
            <Link
              href="/diagnosis"
              className="flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Realizar nuevo diagnóstico
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 