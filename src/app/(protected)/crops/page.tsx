"use client";

import { ChevronDown, Filter, Plus, Sprout } from "lucide-react";
import { useState } from "react";

export default function CropsPage() {
  const [isLoading] = useState(false);

  return (
    <div className="space-y-6">
      {/* Encabezado de página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <Sprout className="mr-2 h-6 w-6 text-green-600" />
            Mis Cultivos
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gestiona y monitorea el estado de tus cultivos activos
          </p>
        </div>

        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm">
          <Plus className="h-5 w-5 mr-2" />
          Nuevo cultivo
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex flex-wrap gap-3 items-center border border-gray-100 dark:border-gray-700">
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <Filter className="h-4 w-4 mr-2" />
          Filtrar por:
        </div>

        <div className="relative">
          <select className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md pl-3 pr-8 py-2 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
            <option>Todos los cultivos</option>
            <option>Café</option>
          </select>
          <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md pl-3 pr-8 py-2 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
            <option>Todos los estados</option>
            <option>Saludable</option>
            <option>En riesgo</option>
            <option>Enfermo</option>
          </select>
          <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Listado de cultivos */}
      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 flex items-center justify-center border border-gray-100 dark:border-gray-700">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando cultivos...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Único cultivo de café */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="h-32 bg-gradient-to-r from-green-500 to-green-600 relative">
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 px-2 py-1 rounded text-xs font-medium text-green-700 dark:text-green-400">
                Saludable
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white">Café Arábica</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Último diagnóstico: hace 2 días
              </p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                  Parcela Principal
                </span>
                <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}