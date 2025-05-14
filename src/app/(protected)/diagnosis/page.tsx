"use client";

import {
    AlertTriangle,
    CheckCircle2,
    Info,
    RefreshCw,
    Upload
} from "lucide-react";
import Image from 'next/image';
import React, { useState } from "react";

export default function DiagnosisPage() {
    const [activeStep, setActiveStep] = useState<
        "upload" | "analyzing" | "results"
    >("upload");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setImagePreview(preview);

            setActiveStep("analyzing");
            setTimeout(() => {
                setActiveStep("results");
            }, 6000);
        }
    };

    const resetDiagnosis = () => {
        setActiveStep("upload");
        setImagePreview(null);
    };

    return (
        <div className="space-y-6">
            {/* Encabezado de página */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                    <AlertTriangle className="mr-2 h-6 w-6 text-green-600" />
                    Diagnóstico de Plantas de Café
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Detecta enfermedades y problemas en tus plantas de café con nuestra
                    herramienta especializada de diagnóstico
                </p>
            </div>

            {/* Contenedor principal */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                {activeStep === "upload" && (
                    <div className="flex flex-col items-center py-10">
                        <div className="bg-green-50 dark:bg-green-900/30 rounded-full p-4 mb-4">
                            <AlertTriangle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                            Sube una imagen de tu planta de café
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-6">
                            Toma una foto clara de la hoja o parte de la planta de café afectada. Nuestro sistema
                            de IA especializado en cafetales analizará la imagen para detectar enfermedades comunes.
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
                                <strong>Tip:</strong> Para mejores resultados, enfoca la imagen en las hojas o frutos afectados.
                                Nuestro sistema puede detectar roya, ojo de gallo, broca y otras enfermedades comunes del café.
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
                                        Analizando planta de café...
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
                            Nuestro sistema especializado está examinando la imagen para detectar
                            enfermedades comunes en cafetales. Esto puede tomar unos segundos.
                        </p>
                    </div>
                )}

                {activeStep === "results" && imagePreview && (
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-1/2">
                            <div className="rounded-lg overflow-hidden mb-4">
                                <Image
                                    src={imagePreview}
                                    alt="Imagen analizada"
                                    className="w-full h-64 object-cover"
                                    width={500}
                                    height={500}
                                />
                            </div>

                            <button
                                onClick={resetDiagnosis}
                                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Volver a escanear
                            </button>
                        </div>

                        <div className="lg:w-1/2">
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg p-4 mb-4">
                                <h3 className="font-semibold text-red-800 dark:text-red-300 flex items-center mb-1">
                                    <AlertTriangle className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                                    Roya del café (93% de confianza)
                                </h3>
                                <p className="text-sm text-red-800 dark:text-red-200">
                                    Se ha detectado la enfermedad Roya del café (Hemileia vastatrix), un patógeno 
                                    fúngico que puede causar defoliación severa y pérdidas significativas en la producción.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                                        Síntomas detectados:
                                    </h4>
                                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                        <li className="flex items-start">
                                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                                            Manchas amarillentas en el haz de las hojas
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                                            Polvillo anaranjado en el envés (esporas del hongo)
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                                            Defoliación prematura en ramas afectadas
                                        </li>
                                    </ul>
                                </div>

                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                                        Recomendaciones:
                                    </h4>
                                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                                        <li className="flex items-start">
                                            <div className="bg-green-100 dark:bg-green-800 rounded-full p-1 mr-2 mt-0.5">
                                                <span className="block h-3 w-3 bg-green-600 rounded-full"></span>
                                            </div>
                                            Aplicar fungicida cúprico o sistémico específico para roya
                                        </li>
                                        <li className="flex items-start">
                                            <div className="bg-green-100 dark:bg-green-800 rounded-full p-1 mr-2 mt-0.5">
                                                <span className="block h-3 w-3 bg-green-600 rounded-full"></span>
                                            </div>
                                            Regular la sombra para mejorar ventilación
                                        </li>
                                        <li className="flex items-start">
                                            <div className="bg-green-100 dark:bg-green-800 rounded-full p-1 mr-2 mt-0.5">
                                                <span className="block h-3 w-3 bg-green-600 rounded-full"></span>
                                            </div>
                                            Implementar variedades resistentes en futuras plantaciones
                                        </li>
                                        <li className="flex items-start">
                                            <div className="bg-green-100 dark:bg-green-800 rounded-full p-1 mr-2 mt-0.5">
                                                <span className="block h-3 w-3 bg-green-600 rounded-full"></span>
                                            </div>
                                            Mantener adecuada fertilización con balance de nitrógeno
                                        </li>
                                    </ul>
                                </div>

                                <div className="flex space-x-3">
                                    <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                                        Ver tratamientos específicos
                                    </button>
                                    <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        Guardar diagnóstico
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}