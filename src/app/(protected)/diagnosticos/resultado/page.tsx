// src/app/(protected)/diagnosticos/resultado/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, AlertTriangle, Download, Share2, Leaf } from "lucide-react";

export default function ResultadoDiagnostico() {
  // En producción, estos datos vendrían de la API
  const [diagnostico] = useState({
    id: "diag-123",
    cultivo: "Café Arábica",
    enfermedad: "Roya del Café (Hemileia vastatrix)",
    gravedad: "Media",
    fecha: "15 mayo 2025",
    imagen: "/placeholder-image.jpg", // En producción sería la imagen subida
    descripcion: "La roya del café es una enfermedad causada por el hongo Hemileia vastatrix. Se manifiesta como manchas amarillentas o anaranjadas en el envés de las hojas. En casos severos, causa defoliación y reduce la producción de café.",
    recomendaciones: [
      "Aplicar fungicida a base de cobre cada 30 días",
      "Mejorar la ventilación entre plantas mediante poda adecuada",
      "Evitar exceso de humedad en el cultivo",
      "Eliminar y quemar hojas afectadas que hayan caído al suelo"
    ],
    causasProbables: [
      "Alta humedad ambiental",
      "Temperaturas entre 21°C y 25°C",
      "Sombra excesiva",
      "Cultivos cercanos infectados"
    ]
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Link 
          href="/diagnosticos" 
          className="mr-3 p-2 rounded-full hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5 text-brown-primary" />
        </Link>
        <h1 className="text-2xl font-bold text-brown-primary">Resultado del diagnóstico</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        {/* Encabezado con resultado principal */}
        <div className={`p-4 ${
          diagnostico.gravedad === "Baja" 
            ? "bg-green-light" 
            : diagnostico.gravedad === "Media"
              ? "bg-yellow-50"
              : "bg-red-50"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-brown-primary">{diagnostico.enfermedad}</h2>
              <p className="text-brown-primary/70">{diagnostico.cultivo} • {diagnostico.fecha}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              diagnostico.gravedad === "Baja" 
                ? "bg-green-primary text-white" 
                : diagnostico.gravedad === "Media"
                  ? "bg-yellow-500 text-white"
                  : "bg-red-500 text-white"
            }`}>
              Gravedad: {diagnostico.gravedad}
            </div>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="p-6">
          {/* Imagen de la planta */}
          <div className="mb-6">
            <img 
              src={diagnostico.imagen} 
              alt="Imagen diagnóstico" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
          
          {/* Alerta de acción rápida */}
          <div className="flex items-start p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-6">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">Acción recomendada</h3>
              <p className="text-sm text-yellow-700">
                Se recomienda tratar esta enfermedad lo antes posible para evitar que se propague a otras plantas.
              </p>
            </div>
          </div>
          
          {/* Descripción */}
          <div className="mb-6">
            <h3 className="font-medium text-brown-primary mb-2">Acerca de esta enfermedad</h3>
            <p className="text-brown-primary/80 text-sm">
              {diagnostico.descripcion}
            </p>
          </div>
          
          {/* Causas probables */}
          <div className="mb-6">
            <h3 className="font-medium text-brown-primary mb-2">Causas probables</h3>
            <ul className="space-y-1">
              {diagnostico.causasProbables.map((causa, index) => (
                <li key={index} className="flex items-center text-sm text-brown-primary/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2"></div>
                  {causa}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Recomendaciones */}
          <div>
            <h3 className="font-medium text-brown-primary mb-2">Recomendaciones de tratamiento</h3>
            <ul className="space-y-2">
              {diagnostico.recomendaciones.map((recomendacion, index) => (
                <li key={index} className="flex items-center text-sm text-brown-primary/80">
                  <div className="w-6 h-6 rounded-full bg-green-light flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-green-primary font-medium">{index + 1}</span>
                  </div>
                  {recomendacion}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Acciones */}
        <div className="p-4 border-t border-gray-100 flex justify-between">
          <Link
            href={`/tratamientos?enfermedad=${encodeURIComponent(diagnostico.enfermedad)}`}
            className="px-6 py-2 rounded-lg bg-green-primary text-white hover:bg-green-dark transition-colors flex items-center gap-2"
          >
            <Leaf className="h-4 w-4" />
            <span>Ver tratamientos</span>
          </Link>
          
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-gray-200 text-brown-primary hover:bg-gray-50">
              <Download className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg border border-gray-200 text-brown-primary hover:bg-gray-50">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Enlaces relacionados */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-medium text-brown-primary mb-4">Ver más información</h3>
        <div className="space-y-2">
          <Link 
            href="/diagnosticos/historial"
            className="block p-3 rounded-lg hover:bg-brown-light/50 transition-colors"
          >
            <div className="font-medium text-brown-primary">Historial de diagnósticos</div>
            <p className="text-sm text-brown-primary/60">Ver diagnósticos anteriores</p>
          </Link>
          
          <Link 
            href="/cultivos"
            className="block p-3 rounded-lg hover:bg-brown-light/50 transition-colors"
          >
            <div className="font-medium text-brown-primary">Mis cultivos</div>
            <p className="text-sm text-brown-primary/60">Administrar cultivos registrados</p>
          </Link>
        </div>
      </div>
    </div>
  );
}