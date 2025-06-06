import { useState, useEffect, useCallback } from 'react';
import { Farmer, UpdateFarmerDTO } from '../types/farmer';
import { getFarmer, updateFarmer, updateFarmerImage, deleteFarmerImage } from '../services/farmer';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function useFarmerProfile() {
    const { user } = useAuth();
    const [farmer, setFarmer] = useState<Farmer | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFarmer = useCallback(async () => {
        if (!user?.id) {
            setError('Usuario no autenticado');
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
    }, [user?.id]);

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