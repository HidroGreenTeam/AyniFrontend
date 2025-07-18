"use client";

// import { useState } from 'react';
import Image from 'next/image';
import { 
    X, 
    Calendar, 
    MapPin, 
    Camera,
    TrendingUp,
    Activity
} from 'lucide-react';
import { Crop } from '../types/crop';

interface CropDetailProps {
    crop: Crop | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (crop: Crop) => void;
    onDelete?: (cropId: number) => void;
    onUpdateImage?: (cropId: number, file: File) => void;
}

export default function CropDetail({ 
    crop,
    isOpen, 
    onClose, 
    onUpdateImage
}: CropDetailProps) {
    // const [isChangingIrrigation, setIsChangingIrrigation] = useState(false);

    if (!isOpen || !crop) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDaysSincePlanting = () => {
        const plantingDate = new Date(crop.plantingDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - plantingDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getGrowthStage = () => {
        const days = getDaysSincePlanting();
        if (days < 30) return 'Germinación';
        if (days < 60) return 'Crecimiento vegetativo';
        if (days < 90) return 'Floración';
        if (days < 120) return 'Fructificación';
        return 'Cosecha';
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && onUpdateImage) {
            onUpdateImage(crop.id, file);
        }
    };

    // const handleIrrigationChange = (newType: 'Manual' | 'Automatic') => {
    //     // This function is no longer used as irrigationType is removed
    //     // Keeping it for now in case it's called elsewhere, but it will do nothing
    // };

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={onClose}
            />
            
            {/* Modal Container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative">
                        {/* Image */}
                        <div className="h-64 relative bg-gradient-to-r from-green-500 to-green-600 overflow-hidden">
                            {crop.imageUrl ? (
                                <Image
                                    src={crop.imageUrl}
                                    alt={crop.cropName}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Camera className="w-16 h-16 text-white/50" />
                                </div>
                            )}
                            
                            {/* Overlay with controls */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent">
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    {onUpdateImage && (
                                        <label className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors cursor-pointer shadow-sm">
                                            <Camera className="w-5 h-5 text-gray-600" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                    <button
                                        onClick={onClose}
                                        className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors shadow-sm"
                                    >
                                        <X className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                                
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h1 className="text-3xl font-bold mb-2 drop-shadow-md">{crop.cropName}</h1>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                                            {getGrowthStage()}
                                        </span>
                                        <span className="drop-shadow-md">{getDaysSincePlanting()} días</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Scrollable Content */}
                    <div className="max-h-[50vh] overflow-y-auto">
                        <div className="p-6 bg-white dark:bg-gray-800">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Área</p>
                                            <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                                {crop.area}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">hectáreas</p>
                                        </div>
                                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                                            <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Días cultivando</p>
                                            <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                                {getDaysSincePlanting()}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">días</p>
                                        </div>
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                                            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Estado</p>
                                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                Saludable
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Sin problemas</p>
                                        </div>
                                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                                            <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                                        Información del cultivo
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de plantación</p>
                                                <p className="text-gray-800 dark:text-white">{formatDate(crop.plantingDate)}</p>
                                            </div>
                                        </div>
                                        
                                        {/* En la sección de información del cultivo, agrega un bloque para mostrar crop.location */}
                                        <div className="flex items-center">
                                            <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Ubicación</p>
                                                <p className="text-gray-800 dark:text-white">{crop.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
 
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
