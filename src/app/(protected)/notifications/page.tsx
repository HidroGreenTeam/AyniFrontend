"use client";

import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Pill, 
  Droplet,
  Trash2,
  MoreVertical
} from "lucide-react";
import { useEffect, useState } from "react";

export default function NotificacionesPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Datos de ejemplo para las notificaciones
  const notificaciones = [
    {
      id: 1,
      tipo: "alerta",
      icono: <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />,
      titulo: "Necesita atención urgente",
      mensaje: "Se ha detectado Mildiú polvoso en tus Fresas (Invernadero).",
      tiempo: "Hace 1 hora",
      leido: false
    },
    {
      id: 2,
      tipo: "recordatorio",
      icono: <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      titulo: "Recordatorio de tratamiento",
      mensaje: "Es hora de aplicar la solución fungicida en tus Fresas.",
      tiempo: "Hace 3 horas",
      leido: false
    },
    {
      id: 3,
      tipo: "tratamiento",
      icono: <Pill className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      titulo: "Tratamiento completado",
      mensaje: "El tratamiento para Tizón temprano en Tomates Cherry ha sido completado con éxito.",
      tiempo: "Ayer",
      leido: true
    },
    {
      id: 4,
      tipo: "recordatorio",
      icono: <Droplet className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      titulo: "Recordatorio de riego",
      mensaje: "Es hora de regar tus Lechugas en Huerto 2.",
      tiempo: "Ayer",
      leido: true
    },
    {
      id: 5,
      tipo: "exito",
      icono: <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />,
      titulo: "Diagnóstico completado",
      mensaje: "Tu diagnóstico para Papas (Huerto 3) ha sido completado. No se detectaron enfermedades.",
      tiempo: "Hace 3 días",
      leido: true
    }
  ];

  const noLeidas = notificaciones.filter(n => !n.leido).length;

  return (
    <div className="space-y-6">
      {/* Encabezado de página */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <Bell className="mr-2 h-6 w-6 text-green-600" />
            Notificaciones
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Mantente informado sobre el estado de tus cultivos y tratamientos
          </p>
        </div>

        <div className="flex space-x-3">
          <button className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Marcar todas como leídas
          </button>
          <button className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar todas
          </button>
        </div>
      </div>

      {/* Contador de notificaciones */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-gray-700 dark:text-gray-300">Total:</span>
          <span className="font-medium text-gray-900 dark:text-white">{notificaciones.length} notificaciones</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-700 dark:text-gray-300">No leídas:</span>
          <span className="bg-green-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">{noLeidas}</span>
        </div>
      </div>

      {/* Lista de notificaciones */}
      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 flex items-center justify-center border border-gray-100 dark:border-gray-700">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando notificaciones...</span>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notificaciones.map((notificacion) => (
              <div 
                key={notificacion.id} 
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !notificacion.leido ? "bg-green-50/30 dark:bg-green-900/5" : ""
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className={`h-10 w-10 rounded-full ${
                      !notificacion.leido ? "bg-white dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-700"
                    } flex items-center justify-center`}>
                      {notificacion.icono}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        !notificacion.leido ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                      }`}>
                        {notificacion.titulo}
                      </p>
                      <div className="flex items-center ml-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {notificacion.tiempo}
                        </span>
                        <button className="ml-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {notificacion.mensaje}
                    </p>
                    
                    <div className="mt-2 flex space-x-2">
                      <button className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                        Ver detalles
                      </button>
                      {!notificacion.leido && (
                        <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                          Marcar como leída
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Paginación */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Mostrando las últimas 5 notificaciones
            </div>
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Ver todas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}