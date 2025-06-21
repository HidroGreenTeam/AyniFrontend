import { useState, useEffect, useCallback } from 'react';
import { Crop, UpdateCropDTO, UpdateIrrigationTypeDTO } from '../types/crop';
import { 
    getCrop, 
    updateCrop, 
    deleteCrop, 
    updateCropImage, 
    deleteCropImage, 
    updateCropIrrigationType 
} from '../services/crop';

export function useCrop(cropId: number | null) {
    const [crop, setCrop] = useState<Crop | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            return updatedCrop;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error removing crop image');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateIrrigationType = async (data: UpdateIrrigationTypeDTO) => {
        if (!cropId) {
            throw new Error('No crop ID provided');
        }

        try {
            setLoading(true);
            setError(null);
            const updatedCrop = await updateCropIrrigationType(cropId, data);
            setCrop(updatedCrop);
            return updatedCrop;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating irrigation type');
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
        updateIrrigationType,
    };
}
