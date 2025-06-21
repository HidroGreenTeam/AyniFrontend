import { RecommendationRequest, RecommendationResponse } from '../types/recommendation';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/recommendations`;

export async function generateRecommendations(disease: string): Promise<RecommendationResponse> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disease } as RecommendationRequest),
    });
    
    if (!response.ok) {
        throw new Error('Error generating recommendations');
    }
    
    return response.json();
}
