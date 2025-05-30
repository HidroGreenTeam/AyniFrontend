export interface PredictionResponse {
    predicted_class: string;
    confidence: number;
}

export interface DiseaseInfo {
    description: string;
    recommendations: string[];
}

export async function getPrediction(file: File): Promise<PredictionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.[0]?.msg || 'Error from prediction service');
    }

    return response.json();
}

export async function getRecommendations(disease: string): Promise<DiseaseInfo> {
    const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disease }),
    });

    if (!response.ok) {
        throw new Error('Error getting disease information');
    }

    return response.json();
} 