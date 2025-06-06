"use client";

import { useState, useEffect } from 'react';
import { Sprout, Calendar, Plus } from 'lucide-react';
import { useCrops } from '../hooks/useCrops';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Crop } from '../types/crop';

interface CropsDashboardProps {
    onViewAll?: () => void;
    onCreateNew?: () => void;
}

export default function CropsDashboard({ onViewAll, onCreateNew }: CropsDashboardProps) {
    const { user } = useAuth();
    const { crops, loading, fetchCropsByFarmerId } = useCrops();
    const [recentCrops, setRecentCrops] = useState<Crop[]>([]);

    useEffect(() => {
        if (user?.id) {
            fetchCropsByFarmerId(user.id);
        }
    }, [user?.id, fetchCropsByFarmerId]);

    useEffect(() => {
        // Get the 3 most recent crops
        const sorted = [...crops].sort((a, b) => 
            new Date(b.plantingDate).getTime() - new Date(a.plantingDate).getTime()
        );
        setRecentCrops(sorted.slice(0, 3));
    }, [crops]);

    const getHealthyCount = () => {
        // For now, consider all crops as healthy
        return crops.length;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getDaysSincePlanting = (plantingDate: string) => {
        const today = new Date();
        const planting = new Date(plantingDate);
        const diffTime = Math.abs(today.getTime() - planting.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-3 bg-gray-300 rounded"></div>
                        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Sprout className="w-5 h-5 text-green-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Mis Cultivos
                        </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                        {crops.length > 0 && onViewAll && (
                            <button 
                                onClick={onViewAll}
                                className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                            >
                                Ver todos
                            </button>
                        )}
                        {onCreateNew && (
                            <button
                                onClick={onCreateNew}
                                className="flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Nuevo
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {crops.length === 0 ? (
                    <div className="text-center py-4">
                        <Sprout className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                            No tienes cultivos registrados
                        </p>
                        {onCreateNew && (
                            <button
                                onClick={onCreateNew}
                                className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Crear primer cultivo
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {crops.length}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    Total
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {getHealthyCount()}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    Saludables
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {crops.reduce((total, crop) => total + crop.area, 0).toFixed(1)}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    Hectáreas
                                </div>
                            </div>
                        </div>

                        {/* Recent Crops */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-3">
                                Cultivos recientes
                            </h4>
                            <div className="space-y-3">
                                {recentCrops.map((crop) => (
                                    <div key={crop.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-800 dark:text-white text-sm">
                                                {crop.cropName}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 mt-1">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {formatDate(crop.plantingDate)}
                                                <span className="mx-2">•</span>
                                                {getDaysSincePlanting(crop.plantingDate)} días
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-gray-800 dark:text-white">
                                                {crop.area} ha
                                            </div>
                                            <div className="text-xs text-green-600 dark:text-green-400">
                                                Saludable
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
