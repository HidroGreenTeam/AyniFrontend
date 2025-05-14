"use client";

import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Filter,
  Pill,
  Search
} from "lucide-react";
import { useState } from "react";

export default function HistoryPage() {
  const [isLoading] = useState(false);
 
  return (
    <div className="space-y-6">
      {/* Encabezado de página */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <ClipboardList className="mr-2 h-6 w-6 text-green-600" />
          Historial de Diagnósticos de Café
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Consulta el historial completo de diagnósticos realizados en tus cultivos de café
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Buscar diagnóstico..."
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <div className="flex items-center p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 gap-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <select className="appearance-none bg-transparent text-gray-800 dark:text-white text-sm focus:outline-none pr-6">
                  <option>Todo el tiempo</option>
                  <option>Último mes</option>
                  <option>Últimos 3 meses</option>
                  <option>Último año</option>
                </select>
                <ChevronDown className="absolute right-2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 gap-1">
                <Filter className="h-4 w-4 text-gray-400" />
                <select className="appearance-none bg-transparent text-gray-800 dark:text-white text-sm focus:outline-none pr-6">
                  <option>Todas las variedades</option>
                  <option>Café Arábica</option>
                  <option>Café Robusta</option>
                  <option>Café Bourbon</option>
                  <option>Café Typica</option>
                </select>
                <ChevronDown className="absolute right-2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listado de diagnósticos */}
      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 flex items-center justify-center border border-gray-100 dark:border-gray-700">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando historial...</span>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Encabezado de la tabla */}
            <div className="hidden md:flex items-center p-4 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
              <div className="w-1/6">Fecha</div>
              <div className="w-1/5">Variedad</div>
              <div className="w-1/4">Diagnóstico</div>
              <div className="w-1/6">Estado</div>
              <div className="w-1/5">Acciones</div>
            </div>

            {/* Diagnóstico 1 */}
            <div className="p-4">
              <div className="md:hidden mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">12/05/2025</div>
                <div className="font-medium text-gray-800 dark:text-white mt-1">Café Arábica (Parcela 2)</div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="hidden md:block w-1/6 text-sm text-gray-600 dark:text-gray-300">12/05/2025</div>
                <div className="hidden md:block w-1/5 text-sm text-gray-800 dark:text-white">Café Arábica (Parcela 2)</div>
                
                <div className="md:w-1/4 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3 md:mr-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span className="text-sm text-gray-800 dark:text-white">Roya del café</span>
                </div>
                
                <div className="md:w-1/6 mt-2 md:mt-0 flex items-center">
                  <span className="text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full">
                    En observación
                  </span>
                </div>
                
                <div className="md:w-1/5 mt-3 md:mt-0 flex space-x-2">
                  <button className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                    Ver detalles
                  </button>
                  <button className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                    <Pill className="h-3 w-3 mr-1" />
                    Tratamientos
                  </button>
                </div>
              </div>
            </div>

            {/* Diagnóstico 2 */}
            <div className="p-4">
              <div className="md:hidden mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">11/05/2025</div>
                <div className="font-medium text-gray-800 dark:text-white mt-1">Café Robusta (Invernadero)</div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="hidden md:block w-1/6 text-sm text-gray-600 dark:text-gray-300">11/05/2025</div>
                <div className="hidden md:block w-1/5 text-sm text-gray-800 dark:text-white">Café Robusta (Invernadero)</div>
                
                <div className="md:w-1/4 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 md:mr-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-sm text-gray-800 dark:text-white">Broca del café</span>
                </div>
                
                <div className="md:w-1/6 mt-2 md:mt-0 flex items-center">
                  <span className="text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2 py-1 rounded-full">
                    Requiere tratamiento
                  </span>
                </div>
                
                <div className="md:w-1/5 mt-3 md:mt-0 flex space-x-2">
                  <button className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                    Ver detalles
                  </button>
                  <button className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                    <Pill className="h-3 w-3 mr-1" />
                    Tratamientos
                  </button>
                </div>
              </div>
            </div>

            {/* Diagnóstico 3 */}
            <div className="p-4">
              <div className="md:hidden mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">10/05/2025</div>
                <div className="font-medium text-gray-800 dark:text-white mt-1">Café Bourbon (Parcela 1)</div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="hidden md:block w-1/6 text-sm text-gray-600 dark:text-gray-300">10/05/2025</div>
                <div className="hidden md:block w-1/5 text-sm text-gray-800 dark:text-white">Café Bourbon (Parcela 1)</div>
                
                <div className="md:w-1/4 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 md:mr-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-gray-800 dark:text-white">Sin patologías</span>
                </div>
                
                <div className="md:w-1/6 mt-2 md:mt-0 flex items-center">
                  <span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                    Saludable
                  </span>
                </div>
                
                <div className="md:w-1/5 mt-3 md:mt-0 flex space-x-2">
                  <button className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                    Ver detalles
                  </button>
                  <button className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                    <Pill className="h-3 w-3 mr-1" />
                    Tratamientos
                  </button>
                </div>
              </div>
            </div>

            {/* Diagnóstico 4 */}
            <div className="p-4">
              <div className="md:hidden mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">08/05/2025</div>
                <div className="font-medium text-gray-800 dark:text-white mt-1">Café Typica (Parcela 3)</div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="hidden md:block w-1/6 text-sm text-gray-600 dark:text-gray-300">08/05/2025</div>
                <div className="hidden md:block w-1/5 text-sm text-gray-800 dark:text-white">Café Typica (Parcela 3)</div>
                
                <div className="md:w-1/4 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3 md:mr-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span className="text-sm text-gray-800 dark:text-white">Mancha de hierro</span>
                </div>
                
                <div className="md:w-1/6 mt-2 md:mt-0 flex items-center">
                  <span className="text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full">
                    En tratamiento
                  </span>
                </div>
                
                <div className="md:w-1/5 mt-3 md:mt-0 flex space-x-2">
                  <button className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                    Ver detalles
                  </button>
                  <button className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                    <Pill className="h-3 w-3 mr-1" />
                    Tratamientos
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Paginación */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Mostrando 1-4 de 16 diagnósticos
            </div>
            <div className="flex space-x-1">
              <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" disabled>
                Anterior
              </button>
              <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                1
              </button>
              <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                2
              </button>
              <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                3
              </button>
              <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                4
              </button>
              <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}