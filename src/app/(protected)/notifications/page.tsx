"use client";

import { Bell, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { NotificationsList, useNotifications } from "@/features/notifications";

export default function NotificacionesPage() {
  const { user } = useAuth();
  const {
    notifications,
    notificationStats,
    loading,
    error,
    getUnreadCount,
    fetchProfileNotifications
  } = useNotifications();

  // Cargar notificaciones cuando el usuario esté disponible
  useEffect(() => {
    if (user?.id) {
      console.log('🔔 NotificationsPage - Cargando notificaciones para user.id:', user.id);
      fetchProfileNotifications();
    }
  }, [user?.id, fetchProfileNotifications]);

  const unreadCount = getUnreadCount();

  const handleMarkAllAsRead = async () => {
    // Esta funcionalidad se puede implementar después
    console.log("Marcar todas como leídas");
  };

  const handleDeleteAll = async () => {
    // Esta funcionalidad se puede implementar después
    console.log("Eliminar todas");
  };

  const handleRefresh = () => {
    fetchProfileNotifications();
  };

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
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
          <button 
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Marcar todas como leídas
          </button>
          <button 
            onClick={handleDeleteAll}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar todas
          </button>
        </div>
      </div>

      {/* Contador de notificaciones */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-gray-700 dark:text-gray-300">Total:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {notificationStats?.total || notifications.length} notificaciones
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-700 dark:text-gray-300">No leídas:</span>
          <span className="bg-green-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        </div>
      </div>

      {/* Error estado */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
              <div className="mt-3">
                <button
                  onClick={handleRefresh}
                  className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1 rounded text-sm hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de notificaciones usando el componente */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <NotificationsList 
            showAll={true}
            onNotificationClick={(id) => {
              console.log(`Clicked notification ${id}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}