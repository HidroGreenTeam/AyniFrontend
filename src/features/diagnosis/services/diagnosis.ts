import { 
  Diagnosis, 
  DiagnosisRequest, 
  PredictionResult, 
  DetectionStatistics, 
  HealthStatus, 
  RootResponse 
} from '../types';

interface ErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
}

const API_ENDPOINTS = {
  PREDICT: '/detections/predict',
  DIAGNOSE: '/detections/diagnose',
  HISTORY: (farmerId: number) => `/detections/${farmerId}`,
  DETAIL: (diagnosisId: number) => `/detections/detail/${diagnosisId}`,
  CROP: (cropId: number) => `/detections/crop/${cropId}`,
  STATISTICS: '/detections/statistics',
  HEALTH: '/detections/health/api/v1/health',
  ROOT: '/'
} as const;

const buildUrl = (endpoint: string): string => {
  const baseURL = "https://detection-service.thankfulwater-e8adfc7e.eastus.azurecontainerapps.io/api/v1";
  ;
  return `${baseURL}${endpoint}`;
};

const tryParseErrorResponse = async (response: Response): Promise<ErrorResponse | null> => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await tryParseErrorResponse(response);
    const message = errorData?.detail || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }
  return response.json();
};

const createFormDataWithFile = (file: File): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
};

const buildDiagnoseEndpoint = (cropId: number, profileId: number): string => {
  return `${API_ENDPOINTS.DIAGNOSE}?crop_id=${cropId}&profile_id=${profileId}`;
};

export const predictDisease = async (file: File): Promise<PredictionResult> => {
  const formData = createFormDataWithFile(file);
  const response = await fetch(buildUrl(API_ENDPOINTS.PREDICT), {
    method: 'POST',
    body: formData
  });
  return handleResponse<PredictionResult>(response);
};

export const diagnoseImage = async (request: DiagnosisRequest): Promise<Diagnosis> => {
  const formData = createFormDataWithFile(request.file);
  const endpoint = buildDiagnoseEndpoint(request.crop_id, request.profile_id);
  
  const response = await fetch(buildUrl(endpoint), {
    method: 'POST',
    body: formData
  });
  return handleResponse<Diagnosis>(response);
};

export const getFarmerDiagnosisHistory = async (farmerId: number): Promise<Diagnosis[]> => {
  const response = await fetch(buildUrl(API_ENDPOINTS.HISTORY(farmerId)), {
    method: 'GET'
  });
  return handleResponse<Diagnosis[]>(response);
};

export const getDiagnosisById = async (diagnosisId: number): Promise<Diagnosis> => {
  console.log('🔍 diagnosis service getDiagnosisById - Recibido diagnosisId:', diagnosisId);
  console.log('🔍 diagnosis service getDiagnosisById - typeof diagnosisId:', typeof diagnosisId);
  
  if (!diagnosisId || isNaN(diagnosisId) || diagnosisId <= 0) {
    console.log('❌ diagnosis service getDiagnosisById - ID inválido:', diagnosisId);
    throw new Error('ID de diagnóstico inválido');
  }

  const url = buildUrl(API_ENDPOINTS.DETAIL(diagnosisId));
  console.log('🚀 diagnosis service getDiagnosisById - URL generada:', url);
  
  const response = await fetch(url, {
    method: 'GET'
  });
  
  console.log('🔍 diagnosis service getDiagnosisById - Response status:', response.status);
  console.log('🔍 diagnosis service getDiagnosisById - Response ok:', response.ok);
  
  const result = await handleResponse<Diagnosis>(response);
  console.log('✅ diagnosis service getDiagnosisById - Resultado:', result);
  
  return result;
};

export const getCropDiagnosis = async (cropId: number): Promise<Diagnosis[]> => {
  const response = await fetch(buildUrl(API_ENDPOINTS.CROP(cropId)), {
    method: 'GET'
  });
  return handleResponse<Diagnosis[]>(response);
};

export const getDetectionStatistics = async (): Promise<DetectionStatistics> => {
  const response = await fetch(buildUrl(API_ENDPOINTS.STATISTICS), {
    method: 'GET'
  });
  return handleResponse<DetectionStatistics>(response);
};

export const getHealthCheck = async (): Promise<HealthStatus> => {
  const response = await fetch(buildUrl(API_ENDPOINTS.HEALTH), {
    method: 'GET'
  });
  return handleResponse<HealthStatus>(response);
};

export const readRoot = async (): Promise<RootResponse> => {
  const response = await fetch(buildUrl(API_ENDPOINTS.ROOT), {
    method: 'GET'
  });
  return handleResponse<RootResponse>(response);
}; 