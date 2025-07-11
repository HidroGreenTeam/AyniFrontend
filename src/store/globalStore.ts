import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Crop } from '@/features/crops/types/crop';
import { Farmer } from '@/features/farmers/types/farmer';
import { Diagnosis, DetectionStatistics } from '@/features/diagnosis/types';
import { Treatment } from '@/features/treatments/services/treatment';
import { AuthUser } from '@/features/auth/hooks/useAuth';
import { Notification } from '@/features/notifications/services/notification';

// Tipos para estadísticas personalizadas
interface DiagnosisStats {
  total: number;
  thisMonth: number;
  thisWeek: number;
  diseaseDetected: number;
  healthyCrops: number;
  requiresTreatment: number;
}

// Tipos para estadísticas de tratamientos
interface TreatmentStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  averageProgress: number;
}

// Tipos para estadísticas de notificaciones
interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  byChannel: Record<string, number>;
}

interface GlobalState {
  user: AuthUser | null;
  crops: Crop[];
  cropsLastUpdated: number | null;
  farmer: Farmer | null;
  farmerLastUpdated: number | null;
  diagnoses: Diagnosis[];
  diagnosesLastUpdated: number | null;
  diagnosisStats: DiagnosisStats | null;
  diagnosisStatsLastUpdated: number | null;
  treatments: Treatment[];
  treatmentsLastUpdated: number | null;
  treatmentStats: TreatmentStats | null;
  treatmentStatsLastUpdated: number | null;
  notifications: Notification[];
  notificationsLastUpdated: number | null;
  notificationStats: NotificationStats | null;
  notificationStatsLastUpdated: number | null;
  statistics: DetectionStatistics | null;
  statisticsLastUpdated: number | null;
  recommendationsLastUpdated: number | null;
  dashboard: Record<string, unknown> | null;
  dashboardLastUpdated: number | null;

  // Acciones
  setUser: (user: AuthUser | null) => void;
  setCrops: (crops: Crop[]) => void;
  setFarmer: (farmer: Farmer | null) => void;
  setDiagnoses: (diagnoses: Diagnosis[]) => void;
  addDiagnosis: (diagnosis: Diagnosis) => void;
  setDiagnosisStats: (stats: DiagnosisStats) => void;
  setTreatments: (treatments: Treatment[]) => void;
  addTreatment: (treatment: Treatment) => void;
  updateTreatment: (treatment: Treatment) => void;
  setTreatmentStats: (stats: TreatmentStats) => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: number) => void;
  setNotificationStats: (stats: NotificationStats) => void;
  calculateNotificationStats: () => void;
  setStatistics: (statistics: DetectionStatistics) => void;
  setDashboard: (dashboard: Record<string, unknown> | null) => void;
  calculateDiagnosisStats: () => void;
  calculateTreatmentStats: () => void;
  clearAll: () => void;
  hydrateFromStorage: () => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      user: null,
      crops: [],
      cropsLastUpdated: null,
      farmer: null,
      farmerLastUpdated: null,
      diagnoses: [],
      diagnosesLastUpdated: null,
      diagnosisStats: null,
      diagnosisStatsLastUpdated: null,
      treatments: [],
      treatmentsLastUpdated: null,
      treatmentStats: null,
      treatmentStatsLastUpdated: null,
      notifications: [],
      notificationsLastUpdated: null,
      notificationStats: null,
      notificationStatsLastUpdated: null,
      statistics: null,
      statisticsLastUpdated: null,
      recommendationsLastUpdated: null,
      dashboard: null,
      dashboardLastUpdated: null,

      setUser: (user) => set({ user }),
      setCrops: (crops) => set({ crops, cropsLastUpdated: Date.now() }),
      setFarmer: (farmer) => set({ farmer, farmerLastUpdated: Date.now() }),
      setDiagnoses: (diagnoses) => {
        set({ diagnoses, diagnosesLastUpdated: Date.now() });
        // Recalcular estadísticas automáticamente
        get().calculateDiagnosisStats();
      },
      addDiagnosis: (diagnosis) => {
        set((state) => ({ 
          diagnoses: [diagnosis, ...state.diagnoses], 
          diagnosesLastUpdated: Date.now() 
        }));
        // Recalcular estadísticas automáticamente
        get().calculateDiagnosisStats();
      },
      setDiagnosisStats: (stats) => set({ 
        diagnosisStats: stats, 
        diagnosisStatsLastUpdated: Date.now() 
      }),
      
      // Nuevas acciones para tratamientos
      setTreatments: (treatments) => {
        set({ treatments, treatmentsLastUpdated: Date.now() });
        // Recalcular estadísticas automáticamente
        get().calculateTreatmentStats();
      },
      addTreatment: (treatment) => {
        set((state) => ({ 
          treatments: [treatment, ...state.treatments], 
          treatmentsLastUpdated: Date.now() 
        }));
        // Recalcular estadísticas automáticamente
        get().calculateTreatmentStats();
      },
      updateTreatment: (updatedTreatment) => {
        set((state) => ({ 
          treatments: state.treatments.map(t => 
            t.id === updatedTreatment.id ? updatedTreatment : t
          ), 
          treatmentsLastUpdated: Date.now() 
        }));
        // Recalcular estadísticas automáticamente
        get().calculateTreatmentStats();
      },
      setTreatmentStats: (stats) => set({ 
        treatmentStats: stats, 
        treatmentStatsLastUpdated: Date.now() 
      }),
      
      setNotifications: (notifications) => set({ notifications, notificationsLastUpdated: Date.now() }),
      addNotification: (notification) => {
        set((state) => ({ 
          notifications: [notification, ...state.notifications], 
          notificationsLastUpdated: Date.now() 
        }));
        get().calculateNotificationStats();
      },
      markNotificationAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map(n => 
            n.id === notificationId ? { ...n, notificationStatus: 'READ' } : n
          ),
          notificationsLastUpdated: Date.now()
        }));
        get().calculateNotificationStats();
      },
      setNotificationStats: (stats) => set({ 
        notificationStats: stats, 
        notificationStatsLastUpdated: Date.now() 
      }),
      calculateNotificationStats: () => {
        const state = get();
        const { notifications } = state;
        
        if (!notifications || notifications.length === 0) {
          set({ 
            notificationStats: {
              total: 0,
              unread: 0,
              byType: {},
              byChannel: {}
            },
            notificationStatsLastUpdated: Date.now()
          });
          return;
        }

        const stats: NotificationStats = {
          total: notifications.length,
          unread: notifications.filter(n => n.notificationStatus !== 'READ').length,
          byType: {},
          byChannel: {}
        };

        notifications.forEach(notification => {
          const type = notification.notificationType.toUpperCase();
          const channel = notification.notificationChannel.toUpperCase();

          stats.byType[type] = (stats.byType[type] || 0) + 1;
          stats.byChannel[channel] = (stats.byChannel[channel] || 0) + 1;
        });

        set({ 
          notificationStats: stats, 
          notificationStatsLastUpdated: Date.now() 
        });
      },

      setStatistics: (statistics) => set({ statistics, statisticsLastUpdated: Date.now() }),
      setDashboard: (dashboard) => set({ dashboard, dashboardLastUpdated: Date.now() }),
      
      // Función para calcular estadísticas de diagnósticos
      calculateDiagnosisStats: () => {
        const state = get();
        const { diagnoses } = state;
        
        if (!diagnoses || diagnoses.length === 0) {
          set({ 
            diagnosisStats: {
              total: 0,
              thisMonth: 0,
              thisWeek: 0,
              diseaseDetected: 0,
              healthyCrops: 0,
              requiresTreatment: 0
            },
            diagnosisStatsLastUpdated: Date.now()
          });
          return;
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

        const stats: DiagnosisStats = {
          total: diagnoses.length,
          thisMonth: 0,
          thisWeek: 0,
          diseaseDetected: 0,
          healthyCrops: 0,
          requiresTreatment: 0
        };

        diagnoses.forEach(diagnosis => {
          const diagnosisDate = new Date(diagnosis.created_at);
          
          // Conteos por fecha
          if (diagnosisDate >= startOfMonth) {
            stats.thisMonth++;
          }
          if (diagnosisDate >= startOfWeek) {
            stats.thisWeek++;
          }
          
          // Conteos por tipo
          if (diagnosis.disease_detected) {
            stats.diseaseDetected++;
          } else {
            stats.healthyCrops++;
          }
          
          if (diagnosis.requires_treatment) {
            stats.requiresTreatment++;
          }
        });

        set({ 
          diagnosisStats: stats, 
          diagnosisStatsLastUpdated: Date.now() 
        });
      },

      // Función para calcular estadísticas de tratamientos
      calculateTreatmentStats: () => {
        const state = get();
        const { treatments } = state;
        
        if (!treatments || treatments.length === 0) {
          set({ 
            treatmentStats: {
              total: 0,
              pending: 0,
              inProgress: 0,
              completed: 0,
              overdue: 0,
              averageProgress: 0
            },
            treatmentStatsLastUpdated: Date.now()
          });
          return;
        }

        const now = new Date();
        const stats: TreatmentStats = {
          total: treatments.length,
          pending: 0,
          inProgress: 0,
          completed: 0,
          overdue: 0,
          averageProgress: 0
        };

        let totalProgress = 0;

        treatments.forEach(treatment => {
          const status = treatment.status.toUpperCase();
          
          // Conteos por estado
          switch (status) {
            case 'PENDING':
              stats.pending++;
              break;
            case 'IN_PROGRESS':
              stats.inProgress++;
              break;
            case 'COMPLETED':
              stats.completed++;
              break;
          }

          // Verificar si está vencido (tratamientos pendientes con fecha de diagnóstico antigua)
          const diagnosisDate = new Date(treatment.diagnosisDate);
          const daysSinceAlert = Math.floor((now.getTime() - diagnosisDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (status === 'PENDING' && daysSinceAlert > 7) {
            stats.overdue++;
          }

          // Acumular progreso
          totalProgress += treatment.progressPercentage;
        });

        // Calcular progreso promedio
        stats.averageProgress = Math.round(totalProgress / treatments.length);

        set({ 
          treatmentStats: stats, 
          treatmentStatsLastUpdated: Date.now() 
        });
      },

      clearAll: () => set({ 
        user: null, 
        crops: [], 
        cropsLastUpdated: null, 
        farmer: null,
        farmerLastUpdated: null,
        diagnoses: [],
        diagnosesLastUpdated: null,
        diagnosisStats: null,
        diagnosisStatsLastUpdated: null,
        treatments: [],
        treatmentsLastUpdated: null,
        treatmentStats: null,
        treatmentStatsLastUpdated: null,
        notifications: [],
        notificationsLastUpdated: null,
        notificationStats: null,
        notificationStatsLastUpdated: null,
        statistics: null,
        statisticsLastUpdated: null,
        recommendationsLastUpdated: null,
        dashboard: null, 
        dashboardLastUpdated: null 
      }),
      hydrateFromStorage: () => {
        set((state) => ({ ...state }));
        // Recalcular estadísticas después de hidratar
        get().calculateDiagnosisStats();
        get().calculateTreatmentStats();
        get().calculateNotificationStats();
      },
    }),
    {
      name: 'ayni-global-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        crops: state.crops,
        cropsLastUpdated: state.cropsLastUpdated,
        farmer: state.farmer,
        farmerLastUpdated: state.farmerLastUpdated,
        diagnoses: state.diagnoses,
        diagnosesLastUpdated: state.diagnosesLastUpdated,
        diagnosisStats: state.diagnosisStats,
        diagnosisStatsLastUpdated: state.diagnosisStatsLastUpdated,
        treatments: state.treatments,
        treatmentsLastUpdated: state.treatmentsLastUpdated,
        treatmentStats: state.treatmentStats,
        treatmentStatsLastUpdated: state.treatmentStatsLastUpdated,
        notifications: state.notifications,
        notificationsLastUpdated: state.notificationsLastUpdated,
        notificationStats: state.notificationStats,
        notificationStatsLastUpdated: state.notificationStatsLastUpdated,
        statistics: state.statistics,
        statisticsLastUpdated: state.statisticsLastUpdated,
        recommendationsLastUpdated: state.recommendationsLastUpdated,
        dashboard: state.dashboard,
        dashboardLastUpdated: state.dashboardLastUpdated,
      }),
    }
  )
); 