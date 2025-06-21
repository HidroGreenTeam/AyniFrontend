import { useState, useEffect, useCallback } from 'react';
import { Crop, CreateCropDTO, UpdateCropDTO, UpdateIrrigationTypeDTO } from '../types/crop';
import { 
    getAllCrops, 
    createCropWithImage, 
    updateCrop, 
    deleteCrop, 
    updateCropImage, 
    deleteCropImage, 
    updateCropIrrigationType,
    getCropsByFarmerId 
} from '../services/crop';

export function useCrops() {
    const [crops, setCrops] = useState<Crop[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCrops = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllCrops();
            setCrops(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching crops');
        } finally {
            setLoading(false);
        }
    }, []);    const fetchCropsByFarmerId = useCallback(async (farmerId: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getCropsByFarmerId(farmerId);
            setCrops(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching crops for farmer');
        } finally {
            setLoading(false);
        }
    }, []);

    const createCrop = async (cropData: CreateCropDTO, file: File) => {
        try {
            setLoading(true);
            setError(null);
            const newCrop = await createCropWithImage(cropData, file);
            setCrops(prev => [...prev, newCrop]);
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
            setCrops(prev => prev.map(crop => crop.id === cropId ? updatedCrop : crop));
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
            setCrops(prev => prev.filter(crop => crop.id !== cropId));
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
            setCrops(prev => prev.map(crop => crop.id === cropId ? updatedCrop : crop));
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
            setCrops(prev => prev.map(crop => crop.id === cropId ? updatedCrop : crop));
            return updatedCrop;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error removing crop image');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateIrrigationType = async (cropId: number, data: UpdateIrrigationTypeDTO) => {
        try {
            setLoading(true);
            setError(null);
            const updatedCrop = await updateCropIrrigationType(cropId, data);
            setCrops(prev => prev.map(crop => crop.id === cropId ? updatedCrop : crop));
            return updatedCrop;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating irrigation type');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCrops();
    }, [fetchCrops]);

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
        updateIrrigationType,
    };
}
