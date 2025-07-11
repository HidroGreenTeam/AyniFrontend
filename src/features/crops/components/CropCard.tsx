"use client";

import Image from 'next/image';
import { 
    Calendar, 
    MapPin, 
    Edit, 
    Trash2, 
    Camera
} from 'lucide-react';
import { Crop } from '../types/crop';

interface CropCardProps {
    crop: Crop;
    onEdit?: (crop: Crop) => void;
    onDelete?: (cropId: number) => void;
    onView?: (crop: Crop) => void;
    onUpdateImage?: (cropId: number, file: File) => void;
}

export default function CropCard({ 
    crop, 
    onEdit, 
    onDelete, 
    onView, 
    onUpdateImage 
}: CropCardProps) {
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && onUpdateImage) {
            onUpdateImage(crop.id, file);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getHealthStatus = () => {
        // Simple logic for demo - you can implement real health checking
        const daysSincePlanting = Math.floor((Date.now() - new Date(crop.plantingDate).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSincePlanting < 30) return { status: 'Creciendo', color: 'blue' };
        if (daysSincePlanting < 90) return { status: 'Saludable', color: 'green' };
        return { status: 'Maduro', color: 'yellow' };
    };

    const healthStatus = getHealthStatus();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow relative group">
            {/* Imagen con overlay de acciones */}
            <div className="h-48 relative bg-gradient-to-r from-green-500 to-green-600 cursor-pointer" onClick={() => onView && onView(crop)}>
                {crop.imageUrl ? (
                    <Image
                        src={crop.imageUrl}
                        alt={crop.cropName}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-12 h-12 text-white/50" />
                    </div>
                )}
                {/* Status Badge */}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium 
                    ${healthStatus.color === 'green' ? 'bg-green-100 text-green-700' : 
                      healthStatus.color === 'blue' ? 'bg-blue-100 text-blue-700' : 
                      'bg-yellow-100 text-yellow-700'} dark:bg-black/70 dark:text-white`}>
                    {healthStatus.status}
                </div>
                {/* Ícono de cámara para cambiar imagen */}
                {onUpdateImage && (
                    <label className="absolute bottom-3 right-3 bg-white/90 dark:bg-black/70 p-2 rounded-full shadow-md cursor-pointer hover:bg-green-100 dark:hover:bg-green-900 transition-colors z-10">
                        <Camera className="w-5 h-5 text-green-600" />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>
                )}
            </div>
            {/* Íconos de editar y eliminar */}
            {onEdit && (
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(crop); }}
                    className="absolute top-3 right-12 bg-white/90 dark:bg-black/70 p-2 rounded-full shadow-md hover:bg-green-100 dark:hover:bg-green-900 transition-colors z-10 group-hover:opacity-100 opacity-80"
                    title="Editar"
                >
                    <Edit className="w-4 h-4 text-green-600" />
                </button>
            )}
            {onDelete && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(crop.id); }}
                    className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 p-2 rounded-full shadow-md hover:bg-red-100 dark:hover:bg-red-900 transition-colors z-10 group-hover:opacity-100 opacity-80"
                    title="Eliminar"
                >
                    <Trash2 className="w-4 h-4 text-red-600" />
                </button>
            )}
            {/* Content */}
            <div className="p-4">
                <h3
                    className="font-semibold text-lg text-gray-800 dark:text-white mb-2 cursor-pointer hover:underline"
                    onClick={() => onView && onView(crop)}
                >
                    {crop.cropName}
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{crop.area} hectáreas</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Plantado: {formatDate(crop.plantingDate)}</span>
                    </div>
                </div>
                {onView && (
                    <button
                        onClick={() => onView(crop)}
                        className="mt-4 w-full py-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                    >
                        Ver detalles
                    </button>
                )}
            </div>
        </div>
    );
}
