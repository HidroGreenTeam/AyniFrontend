"use client";

import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Filter,
  Search,
  X,
  Info,
  Eye,
  Plus,
  Stethoscope
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
// Removed useFarmerProfile import - using user ID directly
import { useCrops } from "@/features/crops/hooks/useCrops";
import { useDiagnosisHistory } from "@/features/diagnosis/hooks/useDiagnosis";
import { Diagnosis } from "@/features/diagnosis/types";
import Link from "next/link";

export default function HistoryPage() {
  const { user } = useAuth();
  const { crops } = useCrops(user as { id: number; [key: string]: unknown } | null);
  const { 
    diagnoses,
    loading,
    error,
    fetchFarmerHistory,
    clearError
  } = useDiagnosisHistory();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedCropId, setSelectedCropId] = useState<string>("all");
  const [filteredDiagnoses, setFilteredDiagnoses] = useState<Diagnosis[]>([]);

  // Cargar historial inicial usando directamente el user ID
  useEffect(() => {
    if (user?.id) {
      console.log('🔍 HistoryPage - Cargando historial para user.id:', user.id);
      fetchFarmerHistory(user.id);
    }
  }, [user?.id, fetchFarmerHistory]);

  // Aplicar filtros
  useEffect(() => {
    if (!diagnoses) return;
    
    console.log('🔍 HistoryPage - Diagnoses recibidos:', diagnoses);
    console.log('🔍 HistoryPage - Primer diagnosis:', diagnoses[0]);

    let filtered = [...diagnoses];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(diagnosis => 
        diagnosis.predicted_class.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por período
    if (selectedPeriod !== "all") {
      const now = new Date();
      const periods = {
        "month": 30,
        "quarter": 90,
        "year": 365
      };
      const days = periods[selectedPeriod as keyof typeof periods];
      filtered = filtered.filter(diagnosis => {
        const diagnosisDate = new Date(diagnosis.created_at);
        const diffTime = Math.abs(now.getTime() - diagnosisDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= days;
      });
    }

    // Filtrar por cultivo
    if (selectedCropId !== "all") {
      filtered = filtered.filter(diagnosis => 
        diagnosis.crop_id === parseInt(selectedCropId)
      );
    }

    setFilteredDiagnoses(filtered);
  }, [diagnoses, searchTerm, selectedPeriod, selectedCropId]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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

  return (
    <div className="space-y-6">
      {/* Encabezado de página */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <ClipboardList className="mr-2 h-6 w-6 text-green-600" />
          Historial de Diagnósticos
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Consulta el historial completo de diagnósticos realizados en tus cultivos
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Buscar diagnóstico..."
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <div className="flex items-center p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 gap-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="appearance-none bg-transparent text-gray-800 dark:text-white text-sm focus:outline-none pr-6"
                >
                  <option value="all">Todo el tiempo</option>
                  <option value="month">Último mes</option>
                  <option value="quarter">Últimos 3 meses</option>
                  <option value="year">Último año</option>
                </select>
                <ChevronDown className="absolute right-2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 gap-1">
                <Filter className="h-4 w-4 text-gray-400" />
                <select 
                  value={selectedCropId}
                  onChange={(e) => setSelectedCropId(e.target.value)}
                  className="appearance-none bg-transparent text-gray-800 dark:text-white text-sm focus:outline-none pr-6"
                >
                  <option value="all">Todos los cultivos</option>
                  {crops.map(crop => (
                    <option key={`crop-${crop.id}`} value={crop.id}>
                      {crop.cropName} ({crop.location})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listado de diagnósticos */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 flex items-center justify-center border border-gray-100 dark:border-gray-700">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando historial...</span>
        </div>
      ) : filteredDiagnoses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center border border-gray-100 dark:border-gray-700">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No se encontraron diagnósticos
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            No hay diagnósticos que coincidan con los filtros seleccionados
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Encabezado de la tabla */}
            <div className="hidden md:flex items-center p-4 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
              <div className="w-1/6">Fecha</div>
              <div className="w-1/5">Cultivo</div>
              <div className="w-1/4">Diagnóstico</div>
              <div className="w-1/6">Estado</div>
              <div className="w-1/5">Acciones</div>
            </div>

            {/* Listado de diagnósticos */}
            {filteredDiagnoses.map((diagnosis, index) => {
              console.log('🔍 HistoryPage - Procesando diagnosis:', diagnosis);
              console.log('🔍 HistoryPage - diagnosis.diagnosis_id:', diagnosis.diagnosis_id);
              console.log('🔍 HistoryPage - typeof diagnosis.diagnosis_id:', typeof diagnosis.diagnosis_id);
              
              const crop = crops.find(c => c.id === diagnosis.crop_id);
              const statusColor = getStatusColor(diagnosis.disease_detected, diagnosis.requires_treatment);
              const statusText = getStatusText(diagnosis.disease_detected, diagnosis.requires_treatment);

              return (
                <div key={`diagnosis-${diagnosis.diagnosis_id}-${index}`} className="p-4">
                  <div className="md:hidden mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(diagnosis.created_at)}
                    </div>
                    <div className="font-medium text-gray-800 dark:text-white mt-1">
                      {crop?.cropName} ({crop?.location})
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="hidden md:block w-1/6 text-sm text-gray-600 dark:text-gray-300">
                      {formatDate(diagnosis.created_at)}
                    </div>
                    <div className="hidden md:block w-1/5 text-sm text-gray-800 dark:text-white">
                      {crop?.cropName} ({crop?.location})
                    </div>
                    
                    <div className="md:w-1/4 flex items-center">
                      <div className={`h-8 w-8 rounded-full bg-${statusColor}-100 dark:bg-${statusColor}-900/30 flex items-center justify-center mr-3 md:mr-2`}>
                        {statusColor === 'green' ? (
                          <CheckCircle2 className={`h-4 w-4 text-${statusColor}-600 dark:text-${statusColor}-400`} />
                        ) : (
                          <AlertTriangle className={`h-4 w-4 text-${statusColor}-600 dark:text-${statusColor}-400`} />
                        )}
                      </div>
                      <span className="text-sm text-gray-800 dark:text-white">
                        {getDiseaseName(diagnosis.predicted_class)}
                      </span>
                    </div>
                    
                    <div className="md:w-1/6 mt-2 md:mt-0 flex items-center">
                      <span className={`text-xs bg-${statusColor}-50 dark:bg-${statusColor}-900/20 text-${statusColor}-700 dark:text-${statusColor}-400 px-2 py-1 rounded-full`}>
                        {statusText}
                      </span>
                    </div>
                    
                    <div className="md:w-1/5 mt-3 md:mt-0 flex flex-col sm:flex-row gap-2">
                      <Link
                        href={diagnosis.diagnosis_id ? `/diagnosis/details/${diagnosis.diagnosis_id}` : '/diagnosis/details/error'}
                        className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
                        onClick={() => {
                          console.log('🔗 HistoryPage - Clic en enlace de diagnóstico');
                          console.log('🔗 HistoryPage - diagnosis completo:', diagnosis);
                          console.log('🔗 HistoryPage - diagnosis.diagnosis_id:', diagnosis.diagnosis_id);
                          console.log('🔗 HistoryPage - URL que se generará:', diagnosis.diagnosis_id ? `/diagnosis/details/${diagnosis.diagnosis_id}` : '/diagnosis/details/error');
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver detalles
                      </Link>
                      
                      {/* Botón de tratamiento - siempre visible pero con diferentes estados */}
                      <Link
                        href={`/treatments/diagnosis/${diagnosis.diagnosis_id}`}
                        className={`text-xs px-3 py-1.5 rounded transition-colors flex items-center justify-center ${
                          diagnosis.requires_treatment
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {diagnosis.requires_treatment ? (
                          <>
                            <Stethoscope className="h-3 w-3 mr-1" />
                            Ver tratamiento
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1" />
                            Crear plan
                          </>
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paginación - TODO: Implementar cuando el backend soporte paginación */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Mostrando {filteredDiagnoses.length} diagnósticos
            </div>
          </div>
        </div>
      )}
    </div>
  );
}