// services/treatmentService.ts

import axios from 'axios';

const API_BASE = "https://treatment-service.thankfulwater-e8adfc7e.eastus.azurecontainerapps.io";

const api = axios.create({
  baseURL: `${API_BASE}/api/v1/treatments`,
  headers: {
    Accept: '*/*',
  },
});

// ====================
// Helper Functions
// ====================

// Type for dates that come as arrays from the API
type APIDateArray = number[]; // [año, mes, día, hora, minuto, segundo, nanosegundo]

// Raw API response type (before normalization)
interface TreatmentFromAPI {
  id: number;
  diagnosisId: number;
  cropId: number;
  profileId: number;
  title: string;
  description: string;
  diseaseType: string;
  confidence: number;
  status: string; // Comes as "TreatmentStatus[status=PENDING]"
  severity: string | null;
  imageUrl: string;
  diagnosisDate: APIDateArray;
  notes: string;
  createdAt: APIDateArray;
  updatedAt: APIDateArray;
  activitiesCount: number;
  pendingActivitiesCount: number;
  completedActivitiesCount: number;
  progressPercentage: number;
}

// Utility to normalize dates from API arrays
function normalizeAPIDate(dateArray: APIDateArray): string {
  if (!dateArray || dateArray.length < 6) {
    return new Date().toISOString();
  }
  
  // [año, mes, día, hora, minuto, segundo, nanosegundo]
  // Note: JavaScript months are 0-indexed, but API sends 1-indexed
  const [year, month, day, hour, minute, second] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second);
  return date.toISOString();
}

// Utility to normalize status from API format
function normalizeStatus(statusString: string): string {
  // If status comes in format "TreatmentStatus[status=PENDING]"
  const match = statusString.match(/TreatmentStatus\[status=([^\]]+)\]/);
  if (match) {
    return match[1];
  }
  // If it comes in normal format, return as is
  return statusString;
}

// Utility to convert API Treatment to normalized Treatment
function normalizeTreatment(apiTreatment: TreatmentFromAPI): Treatment {
  return {
    ...apiTreatment,
    status: normalizeStatus(apiTreatment.status),
    diagnosisDate: normalizeAPIDate(apiTreatment.diagnosisDate),
    createdAt: normalizeAPIDate(apiTreatment.createdAt),
    updatedAt: normalizeAPIDate(apiTreatment.updatedAt),
    severity: apiTreatment.severity || 'medium'
  };
}

// ====================
// Types
// ====================

export interface Treatment {
  id: number;
  diagnosisId: number;
  cropId: number;
  profileId: number;
  title: string;
  description: string;
  diseaseType: string;
  confidence: number;
  status: string;
  severity: string | null;
  imageUrl: string;
  diagnosisDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  activitiesCount: number;
  pendingActivitiesCount: number;
  completedActivitiesCount: number;
  progressPercentage: number;
}

export interface TreatmentStep {
  id: number;
  name: string;
  description: string;
  scheduledDate: string;
  completedDate: string;
  status: string;
  hasReminder: boolean;
  reminderMinutesBefore: number;
  createdAt: string;
  updatedAt: string;
}

export interface StepInput {
  name: string;
  description: string;
  scheduledDate: string;
  hasReminder: boolean;
  reminderMinutesBefore: number;
}

// ====================
// API Functions
// ====================

// GET /treatments/profile/{profileId}
export const getTreatmentsByProfile = async (profileId: number): Promise<Treatment[]> => {
  const res = await api.get(`/profile/${profileId}`);
  const apiTreatments: TreatmentFromAPI[] = res.data;
  return apiTreatments.map(normalizeTreatment);
};

// GET /treatments/{treatmentId}
export const getTreatmentById = async (treatmentId: number): Promise<Treatment> => {
  const res = await api.get(`/${treatmentId}`);
  const apiTreatment: TreatmentFromAPI = res.data;
  return normalizeTreatment(apiTreatment);
};

// GET /treatments/{treatmentId}/steps
export const getStepsByTreatment = async (treatmentId: number): Promise<TreatmentStep[]> => {
  const res = await api.get(`/${treatmentId}/steps`);
  return res.data;
};

// GET /treatments/steps/reminders
export const getStepsWithReminders = async (): Promise<TreatmentStep[]> => {
  const res = await api.get('/steps/reminders');
  return res.data;
};

// GET /treatments/steps/overdue
export const getOverdueSteps = async (): Promise<TreatmentStep[]> => {
  const res = await api.get('/steps/overdue');
  return res.data;
};

// GET /treatments/overdue
export const getOverdueTreatments = async (): Promise<Treatment[]> => {
  const res = await api.get('/overdue');
  const apiTreatments: TreatmentFromAPI[] = res.data;
  return apiTreatments.map(normalizeTreatment);
};

// GET /treatments/crop/{cropId}
export const getTreatmentsByCrop = async (cropId: number): Promise<Treatment[]> => {
  const res = await api.get(`/crop/${cropId}`);
  const apiTreatments: TreatmentFromAPI[] = res.data;
  return apiTreatments.map(normalizeTreatment);
};

// POST /treatments/{treatmentId}/steps
export const createStep = async (treatmentId: number, data: StepInput): Promise<TreatmentStep> => {
  const res = await api.post(`/${treatmentId}/steps`, data);
  return res.data;
};

// PUT /treatments/steps/{stepId}
export const updateStep = async (stepId: number, data: StepInput): Promise<TreatmentStep> => {
  const res = await api.put(`/steps/${stepId}`, data);
  return res.data;
};

// PATCH /treatments/steps/{stepId}/skip
export const skipStep = async (stepId: number): Promise<TreatmentStep> => {
  const res = await api.patch(`/steps/${stepId}/skip`);
  return res.data;
};

// PATCH /treatments/steps/{stepId}/complete
export const completeStep = async (stepId: number): Promise<TreatmentStep> => {
  const res = await api.patch(`/steps/${stepId}/complete`);
  return res.data;
};

// ====================
// Utility Functions
// ====================

export const calculateProgress = (treatment: Treatment): number => {
  if (treatment.activitiesCount === 0) return 0;
  return Math.round((treatment.completedActivitiesCount / treatment.activitiesCount) * 100);
};

export const isStepOverdue = (step: TreatmentStep): boolean => {
  if (step.status === 'completed' || step.status === 'skipped') return false;
  return new Date(step.scheduledDate) < new Date();
};

export const getDaysUntilStep = (step: TreatmentStep): number => {
  const today = new Date();
  const stepDate = new Date(step.scheduledDate);
  const diffTime = stepDate.getTime() - today.getTime();
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.ceil(diffTime / MILLISECONDS_PER_DAY);
};

const STATUS_COLORS = {
  PENDING: 'yellow',
  IN_PROGRESS: 'blue',
  COMPLETED: 'green',
  CANCELLED: 'gray'
} as const;

const STATUS_TEXTS = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado'
} as const;

const DISEASE_NAMES = {
  rust: 'Roya del café',
  healthy: 'Planta saludable',
  nodisease: 'Sin enfermedad detectada',
  leaf_spot: 'Ojo de gallo',
  coffee_borer: 'Broca del café',
  anthracnose: 'Antracnosis',
  bacterial_blight: 'Tizón bacteriano'
} as const;

export const getStatusColor = (status: string): string => {
  const normalizedStatus = status.toUpperCase() as keyof typeof STATUS_COLORS;
  return STATUS_COLORS[normalizedStatus] || 'gray';
};

export const getStatusText = (status: string): string => {
  const normalizedStatus = status.toUpperCase() as keyof typeof STATUS_TEXTS;
  return STATUS_TEXTS[normalizedStatus] || 'Desconocido';
};

export const getDiseaseName = (diseaseType: string): string => {
  return DISEASE_NAMES[diseaseType as keyof typeof DISEASE_NAMES] || diseaseType;
};
