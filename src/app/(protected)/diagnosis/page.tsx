"use client";

import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Info,
  RefreshCw,
  Upload,
} from "lucide-react";
import React, { useState } from "react";

export default function DiagnosticoPage() {
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
      }, 2000);
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
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <AlertTriangle className="mr-2 h-6 w-6 text-green-600" />
          Diagnóstico de Cultivos
        </h1>
        <p className="text-gray-600 mt-1">
          Detecta enfermedades y problemas en tus plantas con nuestra
          herramienta de diagnóstico
        </p>
      </div>

      {/* Contenedor principal */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeStep === "upload" && (
          <div className="flex flex-col items-center py-10">
            <div className="bg-green-50 rounded-full p-4 mb-4">
              <Camera className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Sube una imagen
            </h2>
            <p className="text-gray-600 text-center max-w-md mb-6">
              Toma una foto clara de la hoja o planta afectada. Nuestro sistema
              de IA analizará la imagen para detectar posibles enfermedades.
            </p>

            <div className="space-y-4 w-full max-w-md">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-green-300 border-dashed rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-green-600" />
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">
                      Haz clic para seleccionar
                    </span>{" "}
                    o arrastra una imagen
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
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

              <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Camera className="mr-2 h-5 w-5" />
                Tomar una foto
              </button>
            </div>

            <div className="mt-8 bg-blue-50 rounded-lg p-4 flex items-start max-w-md">
              <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Para mejores resultados, asegúrate de que
                la imagen esté bien iluminada y enfocada en la zona afectada.
              </p>
            </div>
          </div>
        )}

        {activeStep === "analyzing" && imagePreview && (
          <div className="flex flex-col items-center py-10">
            <div className="w-full max-w-md h-64 rounded-lg overflow-hidden mb-6 relative">
              <img
                src={imagePreview}
                alt="Imagen para analizar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center">
                  <RefreshCw className="h-10 w-10 text-white mx-auto animate-spin" />
                  <p className="text-white font-medium mt-3">
                    Analizando imagen...
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-center max-w-md">
              Nuestro sistema de IA está examinando la imagen para detectar
              posibles patógenos y enfermedades. Esto puede tomar unos segundos.
            </p>
          </div>
        )}

        {activeStep === "results" && imagePreview && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2">
              <div className="rounded-lg overflow-hidden mb-4">
                <img
                  src={imagePreview}
                  alt="Imagen analizada"
                  className="w-full h-64 object-cover"
                />
              </div>

              <button
                onClick={resetDiagnosis}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Volver a escanear
              </button>
            </div>

            <div className="lg:w-1/2">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-yellow-800 flex items-center mb-1">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                  Mildiú polvoso (90% de confianza)
                </h3>
                <p className="text-sm text-yellow-800">
                  Se ha detectado una posible infección por mildiú polvoso en
                  las hojas. Esta enfermedad fúngica puede propagarse
                  rápidamente si no se trata.
                </p>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Síntomas detectados:
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      Manchas blancas/grisáceas en las hojas
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      Polvo blanco en la superficie foliar
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      Hojas con bordes amarillentos
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Recomendaciones:
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                        <span className="block h-3 w-3 bg-green-600 rounded-full"></span>
                      </div>
                      Aplicar fungicida orgánico a base de azufre
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                        <span className="block h-3 w-3 bg-green-600 rounded-full"></span>
                      </div>
                      Mejorar la circulación de aire entre las plantas
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                        <span className="block h-3 w-3 bg-green-600 rounded-full"></span>
                      </div>
                      Evitar regar por encima de las hojas
                    </li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Ver tratamientos
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
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
