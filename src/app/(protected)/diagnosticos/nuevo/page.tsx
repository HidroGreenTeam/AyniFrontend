// src/app/(protected)/diagnosticos/nuevo/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload, X, Check, Loader2 } from "lucide-react";

export default function NuevoDiagnostico() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCameraInterface, setShowCameraInterface] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  
  // Función para manejar carga de imagen desde galería
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Iniciar captura de cámara
  const startCamera = async () => {
    setShowCameraInterface(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      alert("No se pudo acceder a la cámara. Por favor, intenta subir una imagen.");
      setShowCameraInterface(false);
    }
  };
  
  // Capturar foto
  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setSelectedImage(canvas.toDataURL("image/jpeg"));
      stopCamera();
    }
  };
  
  // Detener cámara
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCameraInterface(false);
  };
  
  // Cancelar selección
  const cancelSelection = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Procesar diagnóstico
  const processDiagnosis = () => {
    if (!selectedImage) return;
    
    setIsProcessing(true);
    
    // Simulamos envío a API y recepción de respuesta
    setTimeout(() => {
      setIsProcessing(false);
      // Redirigir a página de resultados (en producción pasaríamos el ID real)
      router.push("/diagnosticos/resultado?temp=" + Date.now());
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-brown-primary mb-4">Nuevo diagnóstico</h1>
      <p className="text-brown-primary/70 mb-6">
        Toma una foto de la planta o sube una imagen para analizar
      </p>
      
      {!selectedImage && !showCameraInterface ? (
        <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center">
          <div className="flex flex-col md:flex-row gap-4 w-full mb-6">
            <button
              onClick={startCamera}
              className="flex-1 flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-green-primary/30 bg-green-light/30 rounded-lg hover:bg-green-light/50 transition-colors"
            >
              <Camera className="h-10 w-10 text-green-primary" />
              <span className="font-medium text-green-primary">Tomar foto</span>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-brown-primary/30 bg-brown-light rounded-lg hover:bg-brown-light/80 transition-colors"
            >
              <Upload className="h-10 w-10 text-brown-primary" />
              <span className="font-medium text-brown-primary">Subir imagen</span>
            </button>
            
            <input 
              type="file" 
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          
          <div className="text-sm text-brown-primary/60 text-center">
            <p>Toma una foto clara y bien iluminada de la hoja o planta.</p>
            <p>Asegúrate que se vea bien el área afectada para un mejor diagnóstico.</p>
          </div>
        </div>
      ) : showCameraInterface ? (
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-900 mb-4">
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={stopCamera}
              className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-50"
            >
              <X className="h-5 w-5" />
            </button>
            
            <button
              onClick={capturePhoto}
              className="px-8 py-2 rounded-lg bg-green-primary text-white hover:bg-green-dark"
            >
              Capturar
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="relative mb-4">
            <img 
              src={selectedImage || ""} 
              alt="Imagen seleccionada" 
              className="w-full rounded-lg object-contain max-h-80"
            />
            
            <button
              onClick={cancelSelection}
              className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white"
            >
              <X className="h-5 w-5 text-red-500" />
            </button>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={cancelSelection}
              className="px-4 py-2 rounded-lg border border-gray-300 text-brown-primary hover:bg-gray-50"
            >
              Cancelar
            </button>
            
            <button
              onClick={processDiagnosis}
              disabled={isProcessing}
              className="px-8 py-2 rounded-lg bg-green-primary text-white hover:bg-green-dark flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Analizando...</span>
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  <span>Analizar</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Tips */}
      <div className="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-medium text-yellow-800 mb-2">Consejos para una buena foto</h3>
        <ul className="space-y-1 text-sm text-yellow-700">
          <li>• Asegúrate de que haya buena iluminación natural</li>
          <li>• Mantén la cámara estable para evitar fotos borrosas</li>
          <li>• Captura de cerca las áreas afectadas</li>
          <li>• Si es posible, incluye partes sanas y dañadas en la misma foto</li>
        </ul>
      </div>
    </div>
  );
}