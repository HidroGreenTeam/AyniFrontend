"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload, Calendar, MapPin, Sprout } from 'lucide-react';
import { Crop, CreateCropDTO, UpdateCropDTO } from '../types/crop';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface CropFormProps {
    crop?: Crop | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateCropDTO | UpdateCropDTO, file?: File) => Promise<void>;
    title?: string;
}

export default function CropForm({ 
    crop, 
    isOpen, 
    onClose, 
    onSubmit, 
    title = 'Nuevo Cultivo' 
}: CropFormProps) {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        cropName: '',
        area: 0,
        plantingDate: '',
        location: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Initialize form with crop data when editing
    useEffect(() => {
        if (crop) {
            setFormData({
                cropName: crop.cropName,
                area: crop.area,
                plantingDate: crop.plantingDate.split('T')[0], // Format for date input
                location: crop.location
            });
            setPreviewUrl(crop.imageUrl || '');
        } else {
            setFormData({
                cropName: '',
                area: 0,
                plantingDate: '',
                location: ''
            });
            setPreviewUrl('');
        }
        setSelectedFile(null);
        setErrorMessage(null);
    }, [crop, user?.id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'area' ? value === '' ? '' : parseFloat(value) || 0 : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.cropName || !formData.plantingDate || formData.area <= 0) {
            setErrorMessage('Por favor completa todos los campos requeridos');
            return;
        }

        if (!crop && !selectedFile) {
            setErrorMessage('Por favor selecciona una imagen para el cultivo');
            return;
        }

        try {
            setLoading(true);
            const formattedData = {
                ...formData,
                plantingDate: formData.plantingDate
            };
            console.log('Submitting crop data:', formattedData);
            await onSubmit(formattedData, selectedFile || undefined);
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorMessage('Error al guardar el cultivo');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            cropName: '',
            area: 0,
            plantingDate: '',
            location: ''
        });
        setSelectedFile(null);
        setPreviewUrl('');
        setErrorMessage(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={handleClose}
            />
            
            {/* Modal Container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                            <Sprout className="w-5 h-5 mr-2 text-green-600" />
                            {title}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="max-h-[70vh] overflow-y-auto">
                        {/* Error Message */}
                        {errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <strong className="font-bold">Error!</strong>
                                <span className="block sm:inline"> {errorMessage}</span>
                                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                    <button onClick={() => setErrorMessage(null)} className="text-red-700">
                                        <X className="h-6 w-6 text-red-700" />
                                    </button>
                                </span>
                            </div>
                        )}
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Imagen del cultivo
                                </label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                                    {previewUrl ? (
                                        <div className="relative">
                                            <Image
                                                src={previewUrl}
                                                alt="Preview"
                                                width={300}
                                                height={128}
                                                className="w-full h-32 object-cover rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPreviewUrl('');
                                                    setSelectedFile(null);
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer flex flex-col items-center">
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                Haz clic para subir una imagen
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Crop Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nombre del cultivo *
                                </label>
                                <input
                                    type="text"
                                    name="cropName"
                                    value={formData.cropName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ej: Café"
                                    required
                                />
                            </div>

                            {/* Area */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Área (hectáreas) *
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input
                                        type="number"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleInputChange}
                                        step="0.1"
                                        min="0.1"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="0.0"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Ubicación *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ej: Huancayo, Junín, Perú"
                                    required
                                />
                            </div>

                            {/* Planting Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Fecha de plantación *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        name="plantingDate"
                                        value={formData.plantingDate}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 transition-colors"
                                >
                                    {loading ? 'Guardando...' : crop ? 'Actualizar' : 'Crear Cultivo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
