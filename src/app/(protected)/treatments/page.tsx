"use client";

import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Coffee,
  Filter,
  Plus,
  Search,
  Stethoscope,
  TrendingUp,
  Target,
  Users,
  ChevronDown,
  Activity,
  Zap,
  Eye,
  AlertCircle,
  BookOpen,
  BarChart3
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCrops } from "@/features/crops/hooks/useCrops";
import { useTreatments } from "@/features/treatments/hooks/useTreatments";
import { getDiseaseName, getStatusColor, getStatusText } from "@/features/treatments/services/treatment";
import { Treatment } from "@/features/treatments/services/treatment";
import Link from "next/link";
import Image from "next/image";

export default function TreatmentsPage() {
  const { user } = useAuth();
  const { crops } = useCrops(user as { id: number; [key: string]: unknown } | null);
  const {
    treatments,
    treatmentStats,
    loading,
    error, 
    clearError,
    fetchProfileTreatments
  } = useTreatments();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [diseaseFilter, setDiseaseFilter] = useState("all");
  const [filteredTreatments, setFilteredTreatments] = useState<Treatment[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  // Cargar tratamientos cuando el usuario esté disponible
  useEffect(() => {
    if (user?.id) {
      fetchProfileTreatments();
    }
  }, [user?.id, fetchProfileTreatments]);


  // Aplicar filtros
  useEffect(() => {
    if (!treatments) return;

    let filtered = [...treatments];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(treatment =>
        treatment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        treatment.diseaseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        treatment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter(treatment => {
        const status = treatment.status.toUpperCase();
        return status === statusFilter.toUpperCase();
      });
    }

    // Filtrar por enfermedad
    if (diseaseFilter !== "all") {
      filtered = filtered.filter(treatment => treatment.diseaseType === diseaseFilter);
    }

    // Filtrar por tab activo
    if (activeTab === "active") {
      filtered = filtered.filter(treatment => {
        const status = treatment.status.toUpperCase();
        return status === "PENDING" || status === "IN_PROGRESS";
      });
    } else {
      filtered = filtered.filter(treatment => {
        const status = treatment.status.toUpperCase();
        return status === "COMPLETED" || status === "CANCELLED";
      });
    }

    setFilteredTreatments(filtered);
  }, [treatments, searchTerm, statusFilter, diseaseFilter, activeTab]);

  // Obtener cultivos únicos con tratamientos
  const uniqueDiseases = [...new Set(treatments.map(t => t.diseaseType))];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateRelative = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return formatDate(dateString);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'green';
    if (progress >= 50) return 'yellow';
    if (progress >= 20) return 'orange';
    return 'red';
  };

  const getUrgencyLevel = (treatment: Treatment) => {
    const daysSinceAlert = Math.floor(
      (new Date().getTime() - new Date(treatment.diagnosisDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (treatment.status.toUpperCase() === 'PENDING' && daysSinceAlert > 7) return 'urgent';
    if (treatment.status.toUpperCase() === 'PENDING' && daysSinceAlert > 3) return 'high';
    if (treatment.progressPercentage < 30 && daysSinceAlert > 14) return 'medium';
    return 'normal';
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <Stethoscope className="mr-2 h-6 w-6 text-green-600" />
          Tratamientos para Café
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Gestiona los tratamientos recomendados para tus plantas de café
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
              <AlertTriangle className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Estadísticas rápidas */}
      {treatmentStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{treatmentStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pendientes</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{treatmentStats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completados</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{treatmentStats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Progreso Promedio</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{treatmentStats.averageProgress}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs y filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("active")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "active"
                  ? "border-green-500 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Tratamientos activos
                {treatmentStats && (
                  <span className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                    {treatmentStats.pending + treatmentStats.inProgress}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "history"
                  ? "border-green-500 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Historial de tratamientos
                {treatmentStats && (
                  <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full">
                    {treatmentStats.completed}
                  </span>
                )}
              </div>
            </button>
          </nav>
        </div>

        {/* Filtros */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Buscar tratamiento..."
              />
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <div className="flex items-center p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 gap-1">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-transparent text-gray-800 dark:text-white text-sm focus:outline-none pr-6"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendiente</option>
                    <option value="in_progress">En progreso</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                  <ChevronDown className="absolute right-2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div className="relative">
                <div className="flex items-center p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 gap-1">
                  <Target className="h-4 w-4 text-gray-400" />
                  <select
                    value={diseaseFilter}
                    onChange={(e) => setDiseaseFilter(e.target.value)}
                    className="appearance-none bg-transparent text-gray-800 dark:text-white text-sm focus:outline-none pr-6"
                  >
                    <option value="all">Todas las enfermedades</option>
                    {uniqueDiseases.map(disease => (
                      <option key={disease} value={disease}>
                        {getDiseaseName(disease)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de tratamientos */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 flex items-center justify-center border border-gray-100 dark:border-gray-700">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando tratamientos...</span>
        </div>
      ) : filteredTreatments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center border border-gray-100 dark:border-gray-700">
          <div className="h-24 w-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {activeTab === "active" 
              ? "No hay tratamientos activos" 
              : "No hay historial de tratamientos"
            }
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {activeTab === "active"
              ? "Los tratamientos aparecerán aquí cuando realices diagnósticos que requieran atención"
              : "El historial de tratamientos completados aparecerá aquí"
            }
          </p>
          {activeTab === "active" && (
            <Link
              href="/diagnosis"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Realizar diagnóstico
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTreatments.map((treatment) => {
            const crop = crops.find(c => c.id === treatment.cropId);
            const statusColor = getStatusColor(treatment.status);
            const statusText = getStatusText(treatment.status);
            const progressColor = getProgressColor(treatment.progressPercentage);
            const urgencyLevel = getUrgencyLevel(treatment);
            
            return (
              <div
                key={treatment.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border transition-all hover:shadow-md ${
                  urgencyLevel === 'urgent' 
                    ? 'border-red-300 dark:border-red-700' 
                    : urgencyLevel === 'high'
                    ? 'border-orange-300 dark:border-orange-700'
                    : 'border-gray-100 dark:border-gray-700'
                } p-6`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Imagen del tratamiento */}
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                      {treatment.imageUrl ? (
                        <Image
                          src={treatment.imageUrl}
                          alt={treatment.title}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Stethoscope className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Información principal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {treatment.title}
                        </h3>
                        {urgencyLevel === 'urgent' && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                            <Zap className="h-3 w-3 mr-1" />
                            Urgente
                          </span>
                        )}
                        {urgencyLevel === 'high' && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Prioridad Alta
                          </span>
                        )}
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <Target className="h-4 w-4 mr-1" />
                        <span className="mr-4">{getDiseaseName(treatment.diseaseType)}</span>
                        {crop && (
                          <>
                            <Coffee className="h-4 w-4 mr-1" />
                            <span>{crop.cropName} ({crop.location})</span>
                          </>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {treatment.description}
                      </p>

                      {/* Progreso */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 dark:bg-${statusColor}-900/30 text-${statusColor}-800 dark:text-${statusColor}-200`}>
                              {statusText}
                            </span>
                          </div>
                          
                          {treatment.progressPercentage > 0 && (
                            <div className="flex items-center">
                              <div className={`w-32 bg-gray-200 rounded-full h-2 mr-3`}>
                                <div 
                                  className={`bg-${progressColor}-500 h-2 rounded-full transition-all duration-300`}
                                  style={{ width: `${treatment.progressPercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {treatment.progressPercentage}%
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {formatDateRelative(treatment.diagnosisDate)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      href={`/treatments/diagnosis/${treatment.diagnosisId}`}
                      className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {activeTab === "active" ? "Gestionar" : "Ver detalles"}
                    </Link>
                  </div>
                </div>

                {/* Pasos próximos para tratamientos activos */}
                {activeTab === "active" && (treatment.status.toUpperCase() === "PENDING" || treatment.status.toUpperCase() === "IN_PROGRESS") && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Próximos pasos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {/* Esta información vendrá de los pasos del tratamiento */}
                      <div className="flex items-center text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                        <Clock className="h-3 w-3 mr-1" />
                        {treatment.diseaseType === 'rust' 
                          ? 'Aplicar fungicida cúprico' 
                          : 'Seguir plan de tratamiento'
                        }
                      </div>
                      <div className="flex items-center text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
                        <Users className="h-3 w-3 mr-1" />
                        {treatment.diseaseType === 'rust' 
                          ? 'Mejorar circulación de aire entre plantas' 
                          : 'Monitoreo continuo'
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}