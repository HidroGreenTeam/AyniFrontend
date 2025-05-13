"use client";

import { Home, Activity, TrendingUp, AlertCircle, Check, Droplet, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      name: "Cultivos activos",
      value: "8",
      change: "+2",
      icon: <Home className="h-6 w-6 text-green-600" />,
    },
    {
      name: "Diagnósticos este mes",
      value: "12",
      change: "+4",
      icon: <Activity className="h-6 w-6 text-blue-600" />,
    },
    {
      name: "Tratamientos aplicados",
      value: "5",
      change: "+2",
      icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
    },
    {
      name: "Alertas activas",
      value: "2",
      change: "-1",
      icon: <AlertCircle className="h-6 w-6 text-yellow-600" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado de página */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <Home className="mr-2 h-6 w-6 text-green-600" />
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Bienvenido de nuevo. Aquí tienes un resumen de tus cultivos y actividades recientes.
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gray-50 dark:bg-gray-700">
                  {stat.icon}
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">
                      {stat.change}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cultivos recientes */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Cultivos recientes
            </h2>
            <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
              Ver todos
            </button>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-green-500 to-green-600"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800 dark:text-white">Tomates Cherry</h3>
                    <span className="text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                      Saludable
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Último diagnóstico: hace 2 días
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800 dark:text-white">Lechugas</h3>
                    <span className="text-xs bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full">
                      En observación
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Último diagnóstico: hoy
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-red-500 to-red-600"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800 dark:text-white">Fresas</h3>
                    <span className="text-xs bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full">
                      Enfermo
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Último diagnóstico: ayer
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alertas activas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Alertas activas
            </h2>
            <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
              Ver todas
            </button>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse flex items-start space-x-4">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Posible sequía</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Las lechugas muestran signos de estrés hídrico.
                  </p>
                  <button className="mt-2 text-xs text-yellow-700 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300">
                    Ver detalles
                  </button>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Enfermedad detectada</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mildiú polvoso en fresas - Tratamiento requerido.
                  </p>
                  <button className="mt-2 text-xs text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                    Ver tratamiento
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            Actividad reciente
          </h2>
          <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
            Ver todo
          </button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-800 dark:text-white">
                  Nuevo diagnóstico realizado en <span className="font-medium">Lechugas</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Hoy, 10:23 AM</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-800 dark:text-white">
                  Se detectó <span className="font-medium">Mildiú polvoso</span> en Fresas
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ayer, 3:45 PM</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                <Droplet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-800 dark:text-white">
                  Riego programado completado para <span className="font-medium">Tomates Cherry</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ayer, 8:30 AM</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                <Check className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-800 dark:text-white">
                  Tratamiento aplicado a <span className="font-medium">Fresas</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Hace 2 días</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Consejos del día */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-100 dark:border-green-800/30">
        <div className="flex items-start">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mr-4">
            <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-800 dark:text-white">Consejo del día</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Para prevenir el mildiú polvoso, mejora la circulación de aire entre plantas y evita
              regar por encima de las hojas. Mantén una distancia adecuada entre plantas para
              reducir la humedad.
            </p>
            <button className="mt-3 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
              Ver más consejos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}