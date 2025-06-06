export interface RecommendationRequest {
    disease: string;
}

export interface RecommendationResponse {
    description: string;
    recommendations: string[];
}

export interface DiagnosisRecommendation {
    id: string;
    disease: string;
    description: string;
    recommendations: string[];
    createdAt: Date;
}
