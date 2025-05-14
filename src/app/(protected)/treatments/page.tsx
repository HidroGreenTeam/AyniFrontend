"use client";

import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Cloud,
  Droplet,
  Filter,
  Pill,
  Search,
  Sun
} from "lucide-react";
import { useState } from "react";

export default function TreatmentsPage() {
  const [isLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"activos" | "historial">("activos");
 

  return (
    <div className="space-y-6">
      {/* Encabezado de página */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <Pill className="mr-2 h-6 w-6 text-green-600" />
          Tratamientos para Café
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Gestiona los tratamientos recomendados para tus plantas de café
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-3 px-4 text-center ${
              activeTab === "activos"
                ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400 font-medium"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("activos")}
          >
            Tratamientos activos
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center ${
              activeTab === "historial"
                ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400 font-medium"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("historial")}
          >
            Historial de tratamientos
          </button>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Buscar tratamiento..."
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <div className="flex items-center p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 gap-1">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select className="appearance-none bg-transparent text-gray-800 dark:text-white text-sm focus:outline-none pr-6">
                    <option>Todas las variedades</option>
                    <option>Arábica</option>
                    <option>Robusta</option>
                    <option>Bourbon</option>
                    <option>Typica</option>
                  </select>
                  <ChevronDown className="absolute right-2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <select className="appearance-none bg-transparent text-gray-800 dark:text-white text-sm focus:outline-none pr-6">
                    <option>Todos los estados</option>
                    <option>Pendiente</option>
                    <option>En progreso</option>
                    <option>Completado</option>
                  </select>
                  <ChevronDown className="absolute right-2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido de las pestañas */}
        <div className="p-4">
          {isLoading ? (
            <div className="py-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando tratamientos...</span>
            </div>
          ) : activeTab === "activos" ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Tratamiento 1 */}
              <div className="py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg mr-3">
                      <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        Tratamiento para Roya del Café
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Aplicar en: <span className="font-medium">Arábica (Parcela Este)</span>
                      </p>
                      <div className="mt-2 flex items-center">
                        <span className="text-xs text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          En progreso
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Fecha de inicio: 10/05/2025
                    </span>
                    <button className="mt-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                      Ver detalles
                    </button>
                  </div>
                </div>
                <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Próximos pasos:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-md text-sm flex items-center">
                      <Droplet className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-gray-800 dark:text-white">
                        Aplicar fungicida cúprico (12/05)
                      </span>
                    </div>
                    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-md text-sm flex items-center">
                      <Sun className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-gray-800 dark:text-white">
                        Mejorar circulación de aire entre plantas (Hoy)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tratamiento 2 */}
              <div className="py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start">
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg mr-3">
                      <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        Fertilización orgánica preventiva
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Aplicar en: <span className="font-medium">Bourbon (Parcela Central)</span>
                      </p>
                      <div className="mt-2 flex items-center">
                        <span className="text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Pendiente
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Fecha de inicio: Hoy
                    </span>
                    <button className="mt-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                      Ver detalles
                    </button>
                  </div>
                </div>
                <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Próximos pasos:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-md text-sm flex items-center">
                      <Cloud className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-gray-800 dark:text-white">
                        Aplicar compost y abono orgánico (Hoy)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Tratamiento histórico 1 */}
              <div className="py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-3">
                      <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        Tratamiento para Broca del Café
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Aplicado en: <span className="font-medium">Typica (Parcela Oeste)</span>
                      </p>
                      <div className="mt-2 flex items-center">
                        <span className="text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completado
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Completado: 01/05/2025
                    </span>
                    <button className="mt-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                      Ver detalles
                    </button>
                  </div>
                </div>
                <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Resultados:
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Infestación de broca contenida efectivamente. Reducción del 90% de presencia de la plaga. Se recomienda monitoreo trimestral para prevenir reinfestación.
                  </p>
                </div>
              </div>

              {/* Tratamiento histórico 2 */}
              <div className="py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-3">
                      <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        Manejo de sombra y regulación térmica
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Aplicado en: <span className="font-medium">Arábica y Robusta (Parcelas generales)</span>
                      </p>
                      <div className="mt-2 flex items-center">
                        <span className="text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completado
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Completado: 25/04/2025
                    </span>
                    <button className="mt-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                      Ver detalles
                    </button>
                  </div>
                </div>
                <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Resultados:
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Mejora notoria en el desarrollo de los cafetos y floración más consistente. Temperatura promedio del follaje reducida en 3°C. Programar próxima poda de árboles de sombra en 6 meses.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}