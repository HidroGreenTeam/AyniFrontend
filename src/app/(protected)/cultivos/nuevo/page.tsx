// src/app/(protected)/cultivos/nuevo/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2, Upload, X } from "lucide-react";

export default function NuevoCultivo() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    variedad: "",
    ubicacion: "",
    fechaSiembra: "",
    areaTotal: "",
    descripcion: ""
  });
  
  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Manejar carga de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Eliminar imagen
  const removeImage = () => {
    setSelectedImage(null);
  };
  
  // Enviar formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Aquí enviaríamos los datos a la API
    // Simulamos una espera para representar la comunicación con el servidor
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/cultivos");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Link 
          href="/cultivos" 
          className="mr-3 p-2 rounded-full hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5 text-brown-primary" />
        </Link>
        <h1 className="text-2xl font-bold text-brown-primary">Nuevo cultivo</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Nombre del cultivo */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-brown-primary mb-1">
              Nombre del cultivo *
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
              placeholder="Ej: Café Arábica"
            />
          </div>
          
          {/* Variedad */}
          <div>
            <label htmlFor="variedad" className="block text-sm font-medium text-brown-primary mb-1">
              Variedad
            </label>
            <input
              id="variedad"
              name="variedad"
              type="text"
              value={formData.variedad}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
              placeholder="Ej: Typica"
            />
          </div>
          
          {/* Ubicación */}
          <div>
            <label htmlFor="ubicacion" className="block text-sm font-medium text-brown-primary mb-1">
              Ubicación *
            </label>
            <input
              id="ubicacion"
              name="ubicacion"
              type="text"
              required
              value={formData.ubicacion}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
            placeholder="Ej: Parcela norte"
            />
          </div>
          
          {/* Fecha de siembra */}
          <div>
            <label htmlFor="fechaSiembra" className="block text-sm font-medium text-brown-primary mb-1">
              Fecha de siembra *
            </label>
            <input
              id="fechaSiembra"
              name="fechaSiembra"
              type="date"
              required
              value={formData.fechaSiembra}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
            />
          </div>
          
          {/* Área total */}
          <div>
            <label htmlFor="areaTotal" className="block text-sm font-medium text-brown-primary mb-1">
              Área total (hectáreas)
            </label>
            <input
              id="areaTotal"
              name="areaTotal"
              type="number"
              step="0.01"
              min="0"
              value={formData.areaTotal}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
              placeholder="Ej: 2.5"
            />
          </div>
          
          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-brown-primary mb-1">
              Imagen del cultivo
            </label>
            
            {selectedImage ? (
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={selectedImage} 
                  alt="Vista previa" 
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-6 w-6 text-brown-primary/60 mb-2" />
                  <p className="text-sm text-brown-primary/60">
                    Clic para subir imagen
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>
        
        {/* Descripción */}
        <div className="mb-8">
          <label htmlFor="descripcion" className="block text-sm font-medium text-brown-primary mb-1">
            Descripción o notas adicionales
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={3}
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
            placeholder="Cualquier información adicional que quieras agregar sobre este cultivo..."
          />
        </div>
        
        {/* Botones */}
        <div className="flex justify-end gap-3">
          <Link
            href="/cultivos"
            className="px-4 py-2 rounded-lg border border-gray-300 text-brown-primary hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-green-primary text-white hover:bg-green-dark transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <span>Guardar cultivo</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}