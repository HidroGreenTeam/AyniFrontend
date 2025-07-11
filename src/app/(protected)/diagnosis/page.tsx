"use client";

import {
    AlertTriangle,
    Info,
    RefreshCw,
    Upload,
    Sprout,
    Calendar,
    MapPin,
    ChevronRight,
    Check,
    X,
    Zap,
    Stethoscope
} from "lucide-react";
import Image from 'next/image';
import React, { useState, useEffect } from "react";
import { useCrops } from '@/features/crops/hooks/useCrops';
import { useAuth } from '@/features/auth/hooks/useAuth';
// Removed useFarmerProfile import - using user ID directly
import { useDiagnosis } from '@/features/diagnosis/hooks/useDiagnosis';
import { Crop } from '@/features/crops/types/crop';
// import { Diagnosis } from '@/features/diagnosis/types';
// import { checkDiagnosticsLimit, incrementDiagnosticsCount } from '@/features/subscription/services/subscription';
// import { getUserSubscription } from '@/features/subscription/services/subscription';
// import { UserSubscription } from '@/features/subscription/types/subscription';

export default function DiagnosisPage() {
    const { user } = useAuth();
    // Using user ID directly instead of farmer profile
    const { crops, loading: cropsLoading, fetchCropsByFarmerId } = useCrops(user as { id: number; [key: string]: unknown } | null);
    const { 
        diagnosis,
        prediction,
        error: diagnosisError,
        performDiagnosis,
        performPrediction,
        clearError,
        clearPrediction
    } = useDiagnosis();
    
    const [activeStep, setActiveStep] = useState<
        "select-mode" | "select-crop" | "upload" | "analyzing" | "results"
    >("select-mode");
    const [diagnosisMode, setDiagnosisMode] = useState<"quick" | "complete">("complete");
    const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    // const [selectedFile, _setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
 //   const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Cargar cultivos del agricultor
    useEffect(() => {
        if (user?.id) {
            fetchCropsByFarmerId(user.id);
        }
    }, [user?.id, fetchCropsByFarmerId]);

    // useEffect(() => {
    //     if (user?.id) {
    //         loadSubscriptionData();
    //     }
    // }, [user?.id]);

    // Manejar errores del diagnóstico
    useEffect(() => {
        if (diagnosisError) {
            setError(diagnosisError);
            setActiveStep("upload");
        }
    }, [diagnosisError]);

    // const loadSubscriptionData = async () => {
    //     try {
    //         const data = await getUserSubscription(user!.id);
    //         setSubscription(data);
    //     } catch (error) {
    //         console.error('Error loading subscription:', error);
    //     }
    // };

    const handleModeSelect = (mode: "quick" | "complete") => {
        setDiagnosisMode(mode);
        if (mode === "quick") {
            setActiveStep("upload");
        } else {
            setActiveStep("select-crop");
        }
        setError(null);
        clearError();
    };

    const handleCropSelect = (crop: Crop) => {
        setSelectedCrop(crop);
        setActiveStep("upload");
        setError(null);
        clearError();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tamaño del archivo
        if (file.size > 10 * 1024 * 1024) { // 10MB
            setError('El archivo es demasiado grande. El tamaño máximo es 10MB.');
            return;
        }

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            setError('Por favor selecciona un archivo de imagen válido.');
            return;
        }

        try {
            const preview = URL.createObjectURL(file);
            setImagePreview(preview);
            setActiveStep("analyzing");
            setError(null);
            clearError();

            if (diagnosisMode === "quick") {
                // Usar predicción rápida sin guardar en BD
                const predictionResult = await performPrediction(file);
                if (predictionResult) {
                    setActiveStep("results");
                    setSuccessMessage('¡Predicción completada!');
                    setTimeout(() => setSuccessMessage(null), 5000);
                }
            } else {
                // Realizar diagnóstico completo
                const diagnosisResult = await performDiagnosis({
                    crop_id: selectedCrop!.id,
                    profile_id: user!.id,
                    file: file
                });

                if (diagnosisResult) {
                    setActiveStep("results");
                    setSuccessMessage('¡Diagnóstico completado exitosamente!');
                    setTimeout(() => setSuccessMessage(null), 5000);
                }
            }
        } catch (err) {
            console.error('Error en diagnóstico:', err);
            setError(err instanceof Error ? err.message : 'Error al procesar la imagen');
            setActiveStep("upload");
        }
    };

    const resetDiagnosis = () => {
        setActiveStep("select-mode");
        setDiagnosisMode("complete");
        setSelectedCrop(null);
        setImagePreview(null);
        // _setSelectedFile(null);
        setError(null);
        setSuccessMessage(null);
        clearError();
        clearPrediction();
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
    };

    const goBackToUpload = () => {
        setActiveStep("upload");
        setImagePreview(null);
        // _setSelectedFile(null);
        setError(null);
        clearError();
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
    };

    const getDiseaseName = (predictedClass: string) => {
        const diseaseMap: { [key: string]: string } = {
            'rust': 'Roya del café',
            'healthy': 'Planta saludable',
            'nodisease': 'Sin enfermedad detectada',
            'leaf_spot': 'Ojo de gallo',
            'coffee_borer': 'Broca del café',
            'anthracnosis': 'Antracnosis',
            'bacterial_blight': 'Tizón bacteriano'
        };
        return diseaseMap[predictedClass] || predictedClass;
    };

    const getStatusColor = (diseaseDetected: boolean, requiresTreatment: boolean) => {
        if (!diseaseDetected) return 'green';
        if (requiresTreatment) return 'red';
        return 'yellow';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const currentResult = diagnosisMode === "quick" ? prediction : diagnosis;

    return (
        <div className="space-y-6">
            {/* Encabezado de página */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                    <AlertTriangle className="mr-2 h-6 w-6 text-green-600" />
                    Diagnóstico de Plantas
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Detecta enfermedades y problemas en tus cultivos con nuestra
                    herramienta de diagnóstico inteligente
                </p>
            </div>

            {/* Mensaje de éxito */}
            {successMessage && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                        <p className="text-sm text-green-800 dark:text-green-200">
                            {successMessage}
                        </p>
                        <button
                            onClick={() => setSuccessMessage(null)}
                            className="ml-auto text-green-600 hover:text-green-700"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Indicador de pasos */}
            <div className="flex items-center justify-center mb-6">
                <div className="flex items-center space-x-4">
                    <div className={`flex items-center ${activeStep === 'select-mode' ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activeStep === 'select-mode' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                        }`}>
                            1
                        </div>
                        <span className="ml-2 text-sm font-medium">Modo</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                    <div className={`flex items-center ${activeStep === 'select-crop' ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activeStep === 'select-crop' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                        }`}>
                            2
                        </div>
                        <span className="ml-2 text-sm font-medium">
                            {diagnosisMode === "quick" ? "Imagen" : "Cultivo"}
                        </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                    <div className={`flex items-center ${
                        activeStep === 'upload' || activeStep === 'analyzing' ? 'text-green-600' : 'text-gray-400'
                    }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activeStep === 'upload' || activeStep === 'analyzing' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                        }`}>
                            3
                        </div>
                        <span className="ml-2 text-sm font-medium">Subir imagen</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                    <div className={`flex items-center ${activeStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activeStep === 'results' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                        }`}>
                            4
                        </div>
                        <span className="ml-2 text-sm font-medium">Resultados</span>
                    </div>
                </div>
            </div>

            {/* Límite de diagnósticos - Temporalmente oculto */}
            {/* {subscription && subscription.plan === 'free' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5" />
                        <div>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                Plan Gratuito: {subscription.diagnosticsUsed} de {subscription.diagnosticsLimit} diagnósticos usados este mes
                            </p>
                            <a
                                href="/settings/subscription"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-1 inline-block"
                            >
                                Actualiza a Pro para diagnósticos ilimitados →
                            </a>
                        </div>
                    </div>
                </div>
            )} */}

            {/* Contenedor principal */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg p-4">
                        <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-800 dark:text-red-200">
                                {error}
                            </p>
                            <button
                                onClick={() => setError(null)}
                                className="ml-auto text-red-600 hover:text-red-700"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {activeStep === "select-mode" && (
                    <div>
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                ¿Qué tipo de diagnóstico necesitas?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Elige entre predicción rápida o diagnóstico completo
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            <button
                                onClick={() => handleModeSelect("quick")}
                                className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 
                                         border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-600
                                         rounded-lg p-6 transition-all duration-200 text-left"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                                        <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                    Predicción Rápida
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                                    Obtén una predicción instantánea sin guardar en el historial. 
                                    Ideal para análisis rápidos.
                                </p>
                                <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                                    <div>✓ Resultado inmediato</div>
                                    <div>✓ No requiere seleccionar cultivo</div>
                                    <div>✗ No se guarda en historial</div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleModeSelect("complete")}
                                className="bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 
                                         border-2 border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-600
                                         rounded-lg p-6 transition-all duration-200 text-left"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-lg">
                                        <AlertTriangle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                    Diagnóstico Completo
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                                    Diagnóstico completo que se guarda en la base de datos y 
                                    aparece en tu historial.
                                </p>
                                <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                                    <div>✓ Se guarda en historial</div>
                                    <div>✓ Vinculado a cultivo específico</div>
                                    <div>✓ Información completa</div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {activeStep === "select-crop" && (
                    <div>
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                ¿Qué cultivo quieres diagnosticar?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Selecciona el cultivo que deseas analizar
                            </p>
                        </div>

                        {cropsLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <RefreshCw className="h-8 w-8 text-green-600 animate-spin" />
                                <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando tus cultivos...</span>
                            </div>
                        ) : crops.length === 0 ? (
                            <div className="text-center py-10">
                                <Sprout className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    No tienes cultivos registrados
                                </p>
                                <a href="/crops" className="text-green-600 hover:text-green-700 font-medium">
                                    Registra tu primer cultivo →
                                </a>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {crops.map((crop) => (
                                    <button
                                        key={crop.id}
                                        onClick={() => handleCropSelect(crop)}
                                        className="bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/20 
                                                 border-2 border-gray-200 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-600
                                                 rounded-lg p-4 transition-all duration-200 text-left"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                                                <Sprout className="h-6 w-6 text-green-600 dark:text-green-400" />
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-400 mt-1" />
                                        </div>
                                        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                                            {crop.cropName}
                                        </h3>
                                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                <span>{crop.location}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                <span>Plantado: {formatDate(crop.plantingDate)}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeStep === "upload" && (
                    <div className="flex flex-col items-center py-10">
                        {/* Mostrar cultivo seleccionado para modo completo */}
                        {diagnosisMode === "complete" && selectedCrop && (
                            <div className="mb-6 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 flex items-center">
                                <Sprout className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Analizando cultivo:</p>
                                    <p className="font-semibold text-gray-800 dark:text-white">{selectedCrop.cropName} - {selectedCrop.location}</p>
                                </div>
                                <button
                                    onClick={() => setActiveStep("select-crop")}
                                    className="ml-4 text-sm text-green-600 hover:text-green-700"
                                >
                                    Cambiar
                                </button>
                            </div>
                        )}

                        {/* Indicador para modo rápido */}
                        {diagnosisMode === "quick" && (
                            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-center">
                                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                                <div>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Predicción Rápida</p>
                                    <p className="text-xs text-blue-500 dark:text-blue-400">El resultado no se guardará en tu historial</p>
                                </div>
                                <button
                                    onClick={() => setActiveStep("select-mode")}
                                    className="ml-4 text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Cambiar modo
                                </button>
                            </div>
                        )}

                        <div className="bg-green-50 dark:bg-green-900/30 rounded-full p-4 mb-4">
                            <AlertTriangle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                            {diagnosisMode === "quick" ? 
                                "Sube una imagen para analizar" : 
                                `Sube una imagen de tu ${selectedCrop?.cropName.toLowerCase()}`
                            }
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-6">
                            Toma una foto clara de la hoja o parte afectada. Nuestro sistema
                            analizará la imagen para detectar posibles enfermedades.
                        </p>

                        <div className="space-y-4 w-full max-w-md">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-green-300 dark:border-green-700 border-dashed rounded-lg cursor-pointer bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-2 text-green-600 dark:text-green-400" />
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <span className="font-medium">
                                            Haz clic para seleccionar
                                        </span>{" "}
                                        o arrastra una imagen
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        PNG, JPG hasta 10MB
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>

                        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start max-w-md">
                            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>Tip:</strong> Para mejores resultados, enfoca la imagen en las hojas o partes afectadas
                                con buena iluminación y evita sombras.
                            </p>
                        </div>
                    </div>
                )}

                {activeStep === "analyzing" && imagePreview && (
                    <div className="flex flex-col items-center py-10">
                        <div className="w-full max-w-md h-64 rounded-lg overflow-hidden mb-6 relative">
                            <Image
                                src={imagePreview}
                                alt="Imagen analizada"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw" 
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="text-center">
                                    <RefreshCw className="h-10 w-10 text-white mx-auto animate-spin" />
                                    <p className="text-white font-medium mt-3">
                                        {diagnosisMode === "quick" ? 
                                            "Analizando imagen..." : 
                                            `Analizando ${selectedCrop?.cropName}...`
                                        }
                                    </p>
                                    <p className="text-white/80 text-sm mt-1">
                                        {diagnosisMode === "quick" ? 
                                            "Generando predicción..." : 
                                            "Guardando en base de datos..."
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
                            {diagnosisMode === "quick" ? 
                                "Nuestro sistema está examinando la imagen para detectar posibles enfermedades." :
                                "Nuestro sistema está examinando la imagen para detectar posibles enfermedades y guardando el resultado en tu historial."
                            }
                        </p>
                    </div>
                )}

                {activeStep === "results" && imagePreview && currentResult && (
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-1/2">
                            {diagnosisMode === "complete" && selectedCrop && (
                                <div className="mb-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Cultivo analizado:</p>
                                    <p className="font-semibold text-gray-800 dark:text-white">
                                        {selectedCrop.cropName} - {selectedCrop.location}
                                    </p>
                                    {diagnosis && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Diagnóstico realizado: {formatDateTime(diagnosis.created_at)}
                                        </p>
                                    )}
                                </div>
                            )}

                            {diagnosisMode === "quick" && (
                                <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                        Predicción Rápida
                                    </p>
                                    <p className="text-xs text-blue-500 dark:text-blue-400">
                                        Este resultado no se ha guardado en tu historial
                                    </p>
                                </div>
                            )}

                            <div className="rounded-lg overflow-hidden mb-4">
                                <Image
                                    src={diagnosis?.image_url || imagePreview}
                                    alt="Imagen analizada"
                                    className="w-full h-64 object-cover"
                                    width={500}
                                    height={500}
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={goBackToUpload}
                                    className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Nueva imagen
                                </button>
                                <button
                                    onClick={resetDiagnosis}
                                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Nuevo diagnóstico
                                </button>
                            </div>
                        </div>

                        <div className="lg:w-1/2">
                            <div className={`${
                                getStatusColor(currentResult.disease_detected, currentResult.requires_treatment) === 'green' 
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/40' 
                                    : getStatusColor(currentResult.disease_detected, currentResult.requires_treatment) === 'red'
                                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40'
                                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/40'
                            } border rounded-lg p-4 mb-4`}>
                                <h3 className={`font-semibold flex items-center mb-2 ${
                                    getStatusColor(currentResult.disease_detected, currentResult.requires_treatment) === 'green' 
                                        ? 'text-green-800 dark:text-green-300' 
                                        : getStatusColor(currentResult.disease_detected, currentResult.requires_treatment) === 'red'
                                        ? 'text-red-800 dark:text-red-300'
                                        : 'text-yellow-800 dark:text-yellow-300'
                                }`}>
                                    <AlertTriangle className={`h-5 w-5 mr-2 ${
                                        getStatusColor(currentResult.disease_detected, currentResult.requires_treatment) === 'green' 
                                            ? 'text-green-600 dark:text-green-400' 
                                            : getStatusColor(currentResult.disease_detected, currentResult.requires_treatment) === 'red'
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-yellow-600 dark:text-yellow-400'
                                    }`} />
                                    {getDiseaseName(currentResult.predicted_class)}
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className={`${
                                        getStatusColor(currentResult.disease_detected, currentResult.requires_treatment) === 'green' 
                                            ? 'text-green-800 dark:text-green-200' 
                                            : getStatusColor(currentResult.disease_detected, currentResult.requires_treatment) === 'red'
                                            ? 'text-red-800 dark:text-red-200'
                                            : 'text-yellow-800 dark:text-yellow-200'
                                    }`}>
                                        <strong>Confianza:</strong> {(currentResult.confidence * 100).toFixed(1)}%
                                    </div>
                                    <div className={`${
                                        getStatusColor(currentResult.disease_detected, currentResult.requires_treatment) === 'green' 
                                            ? 'text-green-800 dark:text-green-200' 
                                            : getStatusColor(currentResult.disease_detected, currentResult.requires_treatment) === 'red'
                                            ? 'text-red-800 dark:text-red-200'
                                            : 'text-yellow-800 dark:text-yellow-200'
                                    }`}>
                                        <strong>Enfermedad detectada:</strong> {currentResult.disease_detected ? 'Sí' : 'No'}
                                    </div>
                                    <div className={`${
                                        getStatusColor(currentResult.disease_detected, currentResult.requires_treatment) === 'green' 
                                            ? 'text-green-800 dark:text-green-200' 
                                            : getStatusColor(currentResult.disease_detected, currentResult.requires_treatment) === 'red'
                                            ? 'text-red-800 dark:text-red-200'
                                            : 'text-yellow-800 dark:text-yellow-200'
                                    }`}>
                                        <strong>Requiere tratamiento:</strong> {currentResult.requires_treatment ? 'Sí' : 'No'}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                                        Recomendaciones:
                                    </h4>
                                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                                        {currentResult.disease_detected ? (
                                            currentResult.requires_treatment ? (
                                                <div className="space-y-2">
                                                    <div className="flex items-start">
                                                        <div className="bg-red-100 dark:bg-red-800 rounded-full p-1 mr-2 mt-0.5">
                                                            <span className="block h-3 w-3 bg-red-600 rounded-full"></span>
                                                        </div>
                                                        Se requiere tratamiento inmediato para la enfermedad detectada
                                                    </div>
                                                    <div className="flex items-start">
                                                        <div className="bg-red-100 dark:bg-red-800 rounded-full p-1 mr-2 mt-0.5">
                                                            <span className="block h-3 w-3 bg-red-600 rounded-full"></span>
                                                        </div>
                                                        Consulta con un especialista agrícola
                                                    </div>
                                                    <div className="flex items-start">
                                                        <div className="bg-red-100 dark:bg-red-800 rounded-full p-1 mr-2 mt-0.5">
                                                            <span className="block h-3 w-3 bg-red-600 rounded-full"></span>
                                                        </div>
                                                        Aísla las plantas afectadas si es posible
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="flex items-start">
                                                        <div className="bg-yellow-100 dark:bg-yellow-800 rounded-full p-1 mr-2 mt-0.5">
                                                            <span className="block h-3 w-3 bg-yellow-600 rounded-full"></span>
                                                        </div>
                                                        Se detectó una enfermedad, pero no requiere tratamiento urgente
                                                    </div>
                                                    <div className="flex items-start">
                                                        <div className="bg-yellow-100 dark:bg-yellow-800 rounded-full p-1 mr-2 mt-0.5">
                                                            <span className="block h-3 w-3 bg-yellow-600 rounded-full"></span>
                                                        </div>
                                                        Monitorea el cultivo regularmente
                                                    </div>
                                                </div>
                                            )
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="flex items-start">
                                                    <div className="bg-green-100 dark:bg-green-800 rounded-full p-1 mr-2 mt-0.5">
                                                        <span className="block h-3 w-3 bg-green-600 rounded-full"></span>
                                                    </div>
                                                    Tu cultivo se ve saludable
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="bg-green-100 dark:bg-green-800 rounded-full p-1 mr-2 mt-0.5">
                                                        <span className="block h-3 w-3 bg-green-600 rounded-full"></span>
                                                    </div>
                                                    Continúa con el cuidado regular
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="bg-green-100 dark:bg-green-800 rounded-full p-1 mr-2 mt-0.5">
                                                        <span className="block h-3 w-3 bg-green-600 rounded-full"></span>
                                                    </div>
                                                    Mantén buenas prácticas de cultivo
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    {currentResult.requires_treatment && diagnosis && (
                                        <button 
                                            onClick={() => window.location.href = `/treatments/diagnosis/${diagnosis.diagnosis_id}`}
                                            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                                        >
                                            <Stethoscope className="h-4 w-4 mr-2" />
                                            Ver tratamientos
                                        </button>
                                    )}
                                    {diagnosisMode === "complete" && (
                                        <button 
                                            onClick={() => window.location.href = '/history'}
                                            className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Ver historial
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}