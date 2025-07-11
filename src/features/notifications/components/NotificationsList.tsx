'use client';

import { useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { 
  getNotificationTypeText, 
  getStatusColor, 
  getStatusText,
  getChannelText,
  formatTime,
  isUnread 
} from '../services/notification';

interface NotificationsListProps {
  limit?: number;
  showAll?: boolean;
  onNotificationClick?: (notificationId: number) => void;
}

export function NotificationsList({ 
  limit = 10, 
  showAll = false,
  onNotificationClick 
}: NotificationsListProps) {
  const {
    notifications,
    notificationStats,
    loading,
    error,
    fetchProfileNotifications,
    markAsRead,
    getUnreadCount
  } = useNotifications();

  useEffect(() => {
    fetchProfileNotifications();
  }, [fetchProfileNotifications]);

  const handleNotificationClick = async (notificationId: number) => {
    await markAsRead(notificationId);
    onNotificationClick?.(notificationId);
  };

  const displayNotifications = showAll ? notifications : notifications.slice(0, limit);
  const unreadCount = getUnreadCount();

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando notificaciones...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M15 17h5l-5 5m0-5V7a4 4 0 00-8 0v5l-5 5h5m3-12V3" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Sin notificaciones</h3>
        <p className="mt-1 text-sm text-gray-500">
          No hay notificaciones para mostrar en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header con estadísticas */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Notificaciones
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {unreadCount} nuevas
            </span>
          )}
        </h2>
        {notificationStats && (
          <div className="text-sm text-gray-500">
            Total: {notificationStats.total}
          </div>
        )}
      </div>

      {/* Lista de notificaciones */}
      <div className="space-y-2">
        {displayNotifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification.id)}
            className={`
              p-4 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50
              ${isUnread(notification) 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-white border-gray-200'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className={`text-sm font-medium truncate ${
                    isUnread(notification) ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {notification.title}
                  </h3>
                  {isUnread(notification) && (
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </div>
                
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {notification.message}
                </p>
                
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 bg-${getStatusColor(notification.notificationStatus)}-500`}></span>
                    {getStatusText(notification.notificationStatus)}
                  </span>
                  
                  <span>
                    {getNotificationTypeText(notification.notificationType)}
                  </span>
                  
                  <span>
                    {getChannelText(notification.notificationChannel)}
                  </span>
                  
                  <span className="ml-auto">
                    {formatTime(notification.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mostrar más */}
      {!showAll && notifications.length > limit && (
        <div className="text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Ver todas las notificaciones ({notifications.length - limit} más)
          </button>
        </div>
      )}

      {/* Loading overlay para updates */}
      {loading && notifications.length > 0 && (
        <div className="flex items-center justify-center p-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-xs text-gray-500">Actualizando...</span>
        </div>
      )}
    </div>
  );
} 