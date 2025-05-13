// src/app/(protected)/cultivos/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Leaf, Edit, Trash2, MoreVertical } from "lucide-react";
import Image from "next/image";

export default function Cultivos() {
  const [searchTerm, setSearchTerm] = useState("");
  // En producción, estos datos vendrían de una API
  const [cultivos] = useState([
    { 
      id: 1, 
      nombre: "Café Arábica", 
      variedad: "Typica", 
      ubicacion: "Parcela norte", 
      fechaSiembra: "10 enero 2025",
      estado: "Saludable",
      imagenUrl: "/placeholder-coffee.jpg" // En producción sería una imagen real
    },
    { 
      id: 2, 
      nombre: "Café Robusta", 
      variedad: "Conilon", 
      ubicacion: "Ladera este", 
      fechaSiembra: "15 febrero 2025",
      estado: "En vigilancia",
      imagenUrl: "/placeholder-coffee2.jpg"
    },
    { 
      id: 3, 
      nombre: "Café Bourbon", 
      variedad: "Bourbon Rojo", 
      ubicacion: "Sector sur", 
      fechaSiembra: "5 marzo 2025",
      estado: "Saludable",
      imagenUrl: "/placeholder-coffee3.jpg"
    }
  ]);
  
  // Filtrar cultivos por término de búsqueda
  const filteredCultivos = cultivos.filter(cultivo => 
    cultivo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cultivo.variedad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cultivo.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brown-primary">Mis cultivos</h1>
        
        <Link
          href="/cultivos/nuevo"
          className="px-4 py-2 rounded-lg bg-green-primary text-white hover:bg-green-dark transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo cultivo</span>
        </Link>
      </div>
      
      {/* Barra de búsqueda */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brown-primary/60" />
        <input
          type="text"
          placeholder="Buscar cultivo por nombre, variedad o ubicación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
        />
      </div>
      
      {/* Lista de cultivos */}
      {filteredCultivos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCultivos.map(cultivo => (
            <div 
              key={cultivo.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Imagen del cultivo */}
              <div className="h-36 overflow-hidden">
                <Image 
                  src={cultivo.imagenUrl} 
                  alt={cultivo.nombre} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Contenido */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-brown-primary">{cultivo.nombre}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    cultivo.estado === "Saludable" 
                      ? "bg-green-light text-green-primary" 
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {cultivo.estado}
                  </span>
                </div>
                
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-brown-primary/80">
                    <span className="font-medium">Variedad:</span> {cultivo.variedad}
                  </p>
                  <p className="text-sm text-brown-primary/80">
                    <span className="font-medium">Ubicación:</span> {cultivo.ubicacion}
                  </p>
                  <p className="text-sm text-brown-primary/80">
                    <span className="font-medium">Fecha siembra:</span> {cultivo.fechaSiembra}
                  </p>
                </div>
                
                {/* Acciones */}
                <div className="flex justify-between">
                  <Link
                    href={`/cultivos/${cultivo.id}`}
                    className="px-4 py-1.5 rounded-lg bg-green-light text-green-primary hover:bg-green-light/70 transition-colors text-sm"
                  >
                    Ver detalles
                  </Link>
                  
                  <div className="flex gap-1">
                    <Link
                      href={`/cultivos/${cultivo.id}/editar`}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="h-4 w-4 text-brown-primary/70" />
                    </Link>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <Trash2 className="h-4 w-4 text-brown-primary/70" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreVertical className="h-4 w-4 text-brown-primary/70" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          {searchTerm ? (
            <>
              <Leaf className="h-12 w-12 text-brown-primary/30 mx-auto mb-4" />
              <h3 className="font-medium text-brown-primary mb-2">No se encontraron cultivos</h3>
              <p className="text-brown-primary/60 mb-4">
                No hay resultados para "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="text-green-primary hover:underline"
              >
                Borrar búsqueda
              </button>
            </>
          ) : (
            <>
              <Leaf className="h-12 w-12 text-brown-primary/30 mx-auto mb-4" />
              <h3 className="font-medium text-brown-primary mb-2">No tienes cultivos registrados</h3>
              <p className="text-brown-primary/60 mb-4">
                Comienza registrando tu primer cultivo
              </p>
              <Link
                href="/cultivos/nuevo"
                className="px-4 py-2 rounded-lg bg-green-primary text-white hover:bg-green-dark transition-colors inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Añadir cultivo</span>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}