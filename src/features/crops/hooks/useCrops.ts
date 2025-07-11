import { useState, useEffect, useCallback } from 'react';
import { CreateCropDTO, UpdateCropDTO } from '../types/crop';
import { 
    getAllCrops, 
    createCropWithImage, 
    updateCrop, 
    deleteCrop, 
    updateCropImage, 
    deleteCropImage, 
    getCropsByFarmerId 
} from '../services/crop';
import { useGlobalStore } from '@/store/globalStore';

// Define un tipo mínimo para el usuario
interface MinimalUser { id: number; [key: string]: unknown }

export function useCrops(user: MinimalUser | null) {
    const crops = useGlobalStore(state => state.crops);
    const setCrops = useGlobalStore(state => state.setCrops);
    // const cropsLastUpdated = useGlobalStore(state => state.cropsLastUpdated);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCrops = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // Solo hacer fetch si no hay cultivos
            if (!crops || crops.length === 0) {
            const data = await getAllCrops();
            setCrops(data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching crops');
        } finally {
            setLoading(false);
        }
    }, [crops, setCrops]);

    const fetchCropsByFarmerId = useCallback(async (farmerId: number) => {
        try {
            setLoading(true);
            setError(null);
            // Solo hacer fetch si no hay cultivos o si el usuario cambió
            if (!crops || crops.length === 0 || user?.id !== farmerId) {
            const data = await getCropsByFarmerId(farmerId);
            setCrops(data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching crops for farmer');
        } finally {
            setLoading(false);
        }
    }, [crops, setCrops, user?.id]);

    const createCrop = async (farmerId: number, cropData: CreateCropDTO, file: File) => {
        try {
            setLoading(true);
            setError(null);
            const newCrop = await createCropWithImage(farmerId, cropData, file);
            // Actualizar crops en el store global
            setCrops([...(crops || []), newCrop]);
            return newCrop;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating crop');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateCropData = async (cropId: number, data: UpdateCropDTO) => {
        try {
            setLoading(true);
            setError(null);
            const updatedCrop = await updateCrop(cropId, data);
            // Actualizar crops en el store global
            setCrops((crops || []).map(crop => crop.id === cropId ? updatedCrop : crop));
            return updatedCrop;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating crop');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeCrop = async (cropId: number) => {
        try {
            setLoading(true);
            setError(null);
            await deleteCrop(cropId);
            // Actualizar crops en el store global
            setCrops((crops || []).filter(crop => crop.id !== cropId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting crop');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateImage = async (cropId: number, file: File) => {
        try {
            setLoading(true);
            setError(null);
            const updatedCrop = await updateCropImage(cropId, file);
            // Actualizar crops en el store global
            setCrops((crops || []).map(crop => crop.id === cropId ? updatedCrop : crop));
            return updatedCrop;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating crop image');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeImage = async (cropId: number) => {
        try {
            setLoading(true);
            setError(null);
            const updatedCrop = await deleteCropImage(cropId);
            // Actualizar crops en el store global
            setCrops((crops || []).map(crop => crop.id === cropId ? updatedCrop : crop));
            return updatedCrop;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error removing crop image');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchCropsByFarmerId(user.id);
        }
    }, [user?.id, fetchCropsByFarmerId]);

    return {
        crops,
        loading,
        error,
        fetchCrops,
        fetchCropsByFarmerId,
        createCrop,
        updateCropData,
        removeCrop,
        updateImage,
        removeImage,
    };
}
