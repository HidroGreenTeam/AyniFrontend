// Tipos para diagnósticos y detecciones
export interface DiagnosisResult {
  predicted_class: string;
  confidence: number;
  disease_detected: boolean;
  requires_treatment: boolean;
}

export interface DiagnosisRequest {
  crop_id: number;
  profile_id: number;
  file: File;
}

export interface Diagnosis {
  diagnosis_id: number;
  crop_id: number;
  profile_id: number;
  predicted_class: string;
  confidence: number;
  disease_detected: boolean;
  requires_treatment: boolean;
  image_url: string;
  image_public_id: string;
  created_at: string;
  updated_at: string;
}

export interface DiagnosisHistory {
  diagnoses: Diagnosis[];
  total: number;
  page: number;
  limit: number;
}

export interface DiagnosisError {
  detail: string | Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

// Nuevos tipos para endpoints adicionales
export interface PredictionResult {
  predicted_class: string;
  confidence: number;
  disease_detected: boolean;
  requires_treatment: boolean;
}

export interface DetectionStatistics {
  total_detections: number;
  diseases_detected: number;
  accuracy_rate: number;
  most_common_diseases: Array<{
    disease: string;
    count: number;
  }>;
  detections_by_month: Array<{
    month: string;
    count: number;
  }>;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: 'up' | 'down';
    cloudinary: 'up' | 'down';
    ai_model: 'up' | 'down';
  };
}

export interface RootResponse {
  message: string;
  version: string;
  endpoints: string[];
} 