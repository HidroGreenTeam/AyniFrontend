import { useState, useEffect, useCallback } from 'react';
import { Crop, UpdateCropDTO } from '../types/crop';
import { 
    getCrop, 
    updateCrop, 
    deleteCrop, 
    updateCropImage, 
    deleteCropImage 
} from '../services/crop';
import { useGlobalStore } from '@/store/globalStore';

export function useCrop(cropId: number | null) {
    const [crop, setCrop] = useState<Crop | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Obtener crops del global store para sincronizar cambios
    const crops = useGlobalStore(state => state.crops);
    const setCrops = useGlobalStore(state => state.setCrops);

    const fetchCrop = useCallback(async () => {
        if (!cropId) {
            setCrop(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getCrop(cropId);
            setCrop(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching crop');
        } finally {
            setLoading(false);
        }
    }, [cropId]);

    const updateCropData = async (data: UpdateCropDTO) => {
        if (!cropId) {
            throw new Error('No crop ID provided');
        }

        try {
            setLoading(true);
            setError(null);
            const updatedCrop = await updateCrop(cropId, data);
            setCrop(updatedCrop);
            
            // Actualizar también en la lista global
            setCrops(crops.map(c => c.id === cropId ? updatedCrop : c));
            
            return updatedCrop;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating crop');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeCrop = async () => {
        if (!cropId) {
            throw new Error('No crop ID provided');
        }

        try {
            setLoading(true);
            setError(null);
            await deleteCrop(cropId);
            setCrop(null);
            
            // Remover también de la lista global
            setCrops(crops.filter(c => c.id !== cropId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting crop');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateImage = async (file: File) => {
        if (!cropId) {
            throw new Error('No crop ID provided');
        }

        try {
            setLoading(true);
            setError(null);
            const updatedCrop = await updateCropImage(cropId, file);
            setCrop(updatedCrop);
            
            // Actualizar también en la lista global
            setCrops(crops.map(c => c.id === cropId ? updatedCrop : c));
            
            return updatedCrop;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating crop image');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeImage = async () => {
        if (!cropId) {
            throw new Error('No crop ID provided');
        }

        try {
            setLoading(true);
            setError(null);
            const updatedCrop = await deleteCropImage(cropId);
            setCrop(updatedCrop);
            
            // Actualizar también en la lista global
            setCrops(crops.map(c => c.id === cropId ? updatedCrop : c));
            
            return updatedCrop;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error removing crop image');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCrop();
    }, [fetchCrop]);

    return {
        crop,
        loading,
        error,
        fetchCrop,
        updateCropData,
        removeCrop,
        updateImage,
        removeImage,
    };
}
