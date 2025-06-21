import { useState } from 'react';
import { generateRecommendations } from '../services/recommendation';
import { RecommendationResponse } from '../types/recommendation';

export function useRecommendations() {
    const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getRecommendations = async (disease: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await generateRecommendations(disease);
            setRecommendations(data);
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error generating recommendations';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearRecommendations = () => {
        setRecommendations(null);
        setError(null);
    };

    return {
        recommendations,
        loading,
        error,
        getRecommendations,
        clearRecommendations,
    };
}
