"use client";

import { Sprout, Plus } from "lucide-react";
import { Crop } from '../types/crop';
import CropCard from './CropCard';

interface CropsListProps {
    crops: Crop[];
    loading: boolean;
    onEdit: (crop: Crop) => void;
    onDelete: (cropId: number) => void;
    onView: (crop: Crop) => void;
    onUpdateImage: (cropId: number, file: File) => void;
    onCreateNew: () => void;
}

export default function CropsList({
    crops,
    loading,
    onEdit,
    onDelete,
    onView,
    onUpdateImage,
    onCreateNew
}: CropsListProps) {
    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 flex items-center justify-center border border-gray-100 dark:border-gray-700">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando cultivos...</span>
            </div>
        );
    }

    if (crops.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center border border-gray-100 dark:border-gray-700">
                <Sprout className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                    No tienes cultivos registrados
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Comienza agregando tu primer cultivo para monitorear su crecimiento
                </p>
                <button 
                    onClick={onCreateNew}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Agregar cultivo
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crops.map((crop) => (
                <CropCard
                    key={crop.id}
                    crop={crop}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                    onUpdateImage={onUpdateImage}
                />
            ))}
        </div>
    );
}
