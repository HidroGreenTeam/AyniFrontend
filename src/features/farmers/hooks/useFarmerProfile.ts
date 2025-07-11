import { useState, useEffect, useCallback } from 'react';
import { UpdateFarmerDTO } from '../types/farmer';
import { getFarmer, updateFarmer, updateFarmerImage, deleteFarmerImage } from '../services/farmer';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useGlobalStore } from '@/store/globalStore';

export function useFarmerProfile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const farmer = useGlobalStore(state => state.farmer);
    const setFarmer = useGlobalStore(state => state.setFarmer);
    const farmerLastUpdated = useGlobalStore(state => state.farmerLastUpdated);

    const fetchFarmer = useCallback(async () => {
        console.log('fetchFarmer', user);
        if (!user?.id) {
            setError('Usuario no autenticado'); // typo corregido
            return;
        }

        // Solo hacer fetch si no hay datos o si han pasado más de 5 minutos
        const shouldFetch = !farmer || !farmerLastUpdated || (Date.now() - farmerLastUpdated > 5 * 60 * 1000);
        
        if (!shouldFetch) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getFarmer(user.id);
            setFarmer(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching farmer profile');
        } finally {
            setLoading(false);
        }
    }, [user, farmer, farmerLastUpdated, setFarmer]);

    const updateProfile = async (data: UpdateFarmerDTO) => {
        if (!user?.id) {
            throw new Error('Usuario no autenticado');
        }

        try {
            setLoading(true);
            setError(null);
            const updatedFarmer = await updateFarmer(user.id, data);
            setFarmer(updatedFarmer);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating profile');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateImage = async (file: File) => {
        if (!user?.id) {
            throw new Error('Usuario no autenticado');
        }

        try {
            setLoading(true);
            setError(null);
            const updatedFarmer = await updateFarmerImage(user.id, file);
            setFarmer(updatedFarmer);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating image');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeImage = async () => {
        if (!user?.id) {
            throw new Error('Usuario no autenticado');
        }

        try {
            setLoading(true);
            setError(null);
            const updatedFarmer = await deleteFarmerImage(user.id);
            setFarmer(updatedFarmer);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error removing image');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Limpia el error si el usuario aparece
    useEffect(() => {
        if (user?.id && error) {
            setError(null);
        }
    }, [user, error]);

    // Cargar el perfil cuando el usuario esté autenticado
    useEffect(() => {
        if (user?.id) {
            fetchFarmer();
        }
    }, [user?.id, fetchFarmer]);

    return {
        farmer,
        loading,
        error,
        fetchFarmer,
        updateProfile,
        updateImage,
        removeImage,
    };
} 