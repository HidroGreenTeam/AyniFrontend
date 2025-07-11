import { useState, useCallback } from 'react';
import { useGlobalStore } from '@/store/globalStore';
import { 
  getNotificationById, 
  getNotificationsByProfile,
  Notification 
} from '../services/notification';

/**
 * Hook principal para gestión de notificaciones con global store
 */
export function useNotifications() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useGlobalStore(state => state.user);

  // Estados del global store
  const notifications = useGlobalStore(state => state.notifications);
  const notificationsLastUpdated = useGlobalStore(state => state.notificationsLastUpdated);
  const notificationStats = useGlobalStore(state => state.notificationStats);
  const setNotifications = useGlobalStore(state => state.setNotifications);
  const addNotification = useGlobalStore(state => state.addNotification);
  const markNotificationAsRead = useGlobalStore(state => state.markNotificationAsRead);

  const clearError = useCallback(() => setError(null), []);

  // Cargar notificaciones por perfil con cache inteligente
  const fetchProfileNotifications = useCallback(async () => {
    console.log('🔔 useNotifications - fetchProfileNotifications iniciado');
    console.log('🔔 useNotifications - user:', user);
    console.log('🔔 useNotifications - user?.id:', user?.id);
    console.log('🔔 useNotifications - notifications.length:', notifications.length);
    console.log('🔔 useNotifications - notificationsLastUpdated:', notificationsLastUpdated);
    
    // Solo hacer fetch si no se han cargado datos aún o si han pasado más de 2 minutos
    const shouldFetch = !notificationsLastUpdated || 
      (Date.now() - notificationsLastUpdated > 2 * 60 * 1000);

    console.log('🔔 useNotifications - shouldFetch:', shouldFetch);

    if (!shouldFetch) {
      console.log('🔔 useNotifications - Usando cache, no haciendo fetch');
      return notifications;
    }

    if (!user?.id) {
      console.log('❌ useNotifications - No hay user.id disponible');
      setError('Usuario no disponible');
      return [];
    }

    setLoading(true);
    setError(null);
    try {
      console.log('🚀 useNotifications - Llamando getNotificationsByProfile con user.id:', user.id);
      const data = await getNotificationsByProfile(user.id);
      console.log('✅ useNotifications - Datos recibidos:', data);
      setNotifications(data);
      return data;
    } catch (err) {
      console.error('❌ useNotifications - Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar notificaciones';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifications, notificationsLastUpdated, setNotifications, user?.id]);

  // Cargar notificación específica
  const fetchNotificationById = useCallback(async (notificationId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotificationById(notificationId);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar notificación';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Marcar como leída
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      markNotificationAsRead(notificationId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al marcar como leída';
      setError(errorMessage);
      throw err;
    }
  }, [markNotificationAsRead]);

  // Obtener notificaciones no leídas
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => n.notificationStatus !== 'READ');
  }, [notifications]);

  // Obtener notificaciones por tipo
  const getNotificationsByType = useCallback((type: string) => {
    return notifications.filter(n => n.notificationType === type);
  }, [notifications]);

  // Obtener notificaciones recientes (últimas 24 horas)
  const getRecentNotifications = useCallback(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return notifications.filter(n => {
      const notificationDate = new Date(n.createdAt);
      return notificationDate >= yesterday;
    });
  }, [notifications]);

  // Contar notificaciones no leídas
  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => n.notificationStatus !== 'READ').length;
  }, [notifications]);

  return {
    notifications,
    notificationStats,
    loading,
    error,
    clearError,
    fetchProfileNotifications,
    fetchNotificationById,
    markAsRead,
    getUnreadNotifications,
    getNotificationsByType,
    getRecentNotifications,
    getUnreadCount,
    addNotification
  };
}

/**
 * Hook para gestión de notificaciones en tiempo real
 */
export function useNotificationRealtime() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addNotification = useGlobalStore(state => state.addNotification);

  const clearError = useCallback(() => setError(null), []);

  // Simular llegada de nueva notificación (en producción vendría de WebSocket/SSE)
  const simulateNewNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(), // Temporal ID for simulation
    };
    
    addNotification(newNotification);
  }, [addNotification]);

  // Conectar a notificaciones en tiempo real
  const connectToRealtime = useCallback(async (profileId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Aquí se conectaría a WebSocket o Server-Sent Events
      // Por ahora es solo un placeholder
      console.log(`Conectando a notificaciones en tiempo real para perfil ${profileId}`);
      
      // Simular conexión exitosa
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al conectar notificaciones';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  // Desconectar de notificaciones en tiempo real
  const disconnectFromRealtime = useCallback(() => {
    // Aquí se desconectaría del WebSocket/SSE
    console.log('Desconectando de notificaciones en tiempo real');
  }, []);

  return {
    loading,
    error,
    clearError,
    simulateNewNotification,
    connectToRealtime,
    disconnectFromRealtime
  };
} 