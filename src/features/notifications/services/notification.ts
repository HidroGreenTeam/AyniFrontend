// services/notificationService.ts

import axios from 'axios';

const API_BASE = "https://notification-service.thankfulwater-e8adfc7e.eastus.azurecontainerapps.io";

const api = axios.create({
  baseURL: `${API_BASE}/api/v1/notifications`,
  headers: {
    Accept: '*/*',
  },
});

// ====================
// Types
// ====================

export interface Notification {
  id: number;
  profileId: number;
  title: string;
  message: string;
  notificationType: string;
  notificationChannel: string;
  notificationStatus: string;
  createdAt: string;
  sentAt: string;
}

// ====================
// API Functions
// ====================

// GET /notifications/{notificationId}
export const getNotificationById = async (notificationId: number): Promise<Notification> => {
  const res = await api.get(`/${notificationId}`);
  return res.data;
};

// GET /notifications/user/{profileId}
export const getNotificationsByProfile = async (profileId: number): Promise<Notification[]> => {
  console.log('🔔 notification service - Obteniendo notificaciones para profileId:', profileId);
  
  if (!profileId) {
    console.log('❌ notification service - ProfileId no válido:', profileId);
    throw new Error('Profile ID es requerido');
  }

  try {
    const url = `/user/${profileId}`;
    console.log('🚀 notification service - URL:', `${API_BASE}/api/v1/notifications${url}`);
    
    const res = await api.get(url);
    console.log('✅ notification service - Respuesta recibida:', res.status);
    console.log('🔔 notification service - Datos de notificaciones:', res.data);
    
    return res.data;
  } catch (error) {
    console.error('❌ notification service - Error:', error);
    throw error;
  }
};

// ====================
// Utility Functions
// ====================

const NOTIFICATION_TYPE_TEXTS = {
  TREATMENT_REMINDER: 'Recordatorio de tratamiento',
  DIAGNOSIS_RESULT: 'Resultado de diagnóstico',
  SYSTEM_UPDATE: 'Actualización del sistema',
  SUBSCRIPTION_ALERT: 'Alerta de suscripción',
  WEATHER_WARNING: 'Advertencia climática'
} as const;

const STATUS_COLORS = {
  PENDING: 'yellow',
  SENT: 'green',
  FAILED: 'red',
  READ: 'blue'
} as const;

const STATUS_TEXTS = {
  PENDING: 'Pendiente',
  SENT: 'Enviado',
  FAILED: 'Fallido',
  READ: 'Leído'
} as const;

const CHANNEL_TEXTS = {
  EMAIL: 'Correo electrónico',
  PUSH: 'Notificación push',
  SMS: 'Mensaje de texto',
  IN_APP: 'En la aplicación'
} as const;

export const getNotificationTypeText = (type: string): string => {
  return NOTIFICATION_TYPE_TEXTS[type as keyof typeof NOTIFICATION_TYPE_TEXTS] || type;
};

export const getStatusColor = (status: string): string => {
  const normalizedStatus = status.toUpperCase() as keyof typeof STATUS_COLORS;
  return STATUS_COLORS[normalizedStatus] || 'gray';
};

export const getStatusText = (status: string): string => {
  const normalizedStatus = status.toUpperCase() as keyof typeof STATUS_TEXTS;
  return STATUS_TEXTS[normalizedStatus] || 'Desconocido';
};

export const getChannelText = (channel: string): string => {
  const normalizedChannel = channel.toUpperCase() as keyof typeof CHANNEL_TEXTS;
  return CHANNEL_TEXTS[normalizedChannel] || channel;
};

export const isUnread = (notification: Notification): boolean => {
  return notification.notificationStatus.toUpperCase() !== 'READ';
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
  }
}; 