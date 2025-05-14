"use client";

import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ChevronDown,
  Filter,
  Info,
  Leaf,
  Search
} from "lucide-react";
import { useState } from "react";

export default function LibraryPage() {
  const [isLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  
  const enfermedades = [
    {
      id: 1,
      nombre: "Roya del café",
      nombreCientifico: "Hemileia vastatrix",
      variedades: ["Typica", "Bourbon", "Catuai", "Caturra"],
      nivel: "alto",
      descripcion: "Causa manchas amarillentas en el envés de las hojas que evolucionan a lesiones con polvo anaranjado, provocando defoliación severa."
    },
    {
      id: 2,
      nombre: "Ojo de gallo",
      nombreCientifico: "Mycena citricolor",
      variedades: ["Bourbon", "Typica", "Caturra"],
      nivel: "medio",
      descripcion: "Produce manchas circulares de color café claro a oscuro en las hojas, que pueden caer dejando agujeros."
    },
    {
      id: 3,
      nombre: "Antracnosis",
      nombreCientifico: "Colletotrichum coffeanum",
      variedades: ["Catuai", "Catimor", "Bourbon"],
      nivel: "medio",
      descripcion: "Afecta frutos, hojas y brotes tiernos causando lesiones necróticas hundidas con bordes definidos."
    },
    {
      id: 4,
      nombre: "Mal de hilachas",
      nombreCientifico: "Pellicularia koleroga",
      variedades: ["Typica", "Bourbon", "Geisha"],
      nivel: "alto",
      descripcion: "Hongo que forma filamentos blanquecinos sobre ramas y hojas, causando que estas se sequen y queden suspendidas por hilos miceliares."
    },
    {
      id: 5,
      nombre: "CBD (Coffee Berry Disease)",
      nombreCientifico: "Colletotrichum kahawae",
      variedades: ["Arabica", "Typica", "Bourbon"],
      nivel: "alto",
      descripcion: "Afecta principalmente los frutos en desarrollo, causando lesiones hundidas oscuras y momificación del grano."
    },
    {
      id: 6,
      nombre: "Mancha de hierro",
      nombreCientifico: "Cercospora coffeicola",
      variedades: ["Caturra", "Catuai", "Catimor"],
      nivel: "medio",
      descripcion: "Causa manchas circulares con centro grisáceo y borde rojizo en hojas, similares a óxido. Puede afectar también los frutos."
    },
    {
      id: 7,
      nombre: "Broca del café",
      nombreCientifico: "Hypothenemus hampei",
      variedades: ["Todas las variedades"],
      nivel: "alto",
      descripcion: "Insecto barrenador que perfora los frutos y se alimenta de los granos, causando pérdidas significativas en rendimiento y calidad."
    },
    {
      id: 8,
      nombre: "Nematodos del café",
      nombreCientifico: "Meloidogyne spp.",
      variedades: ["Typica", "Bourbon", "Mundo Novo"],
      nivel: "medio",
      descripcion: "Atacan el sistema radicular formando nódulos que impiden la absorción de nutrientes, causando debilitamiento general."
    }
  ];

  const enfermedadesFiltradas = enfermedades.filter(enfermedad => 
    enfermedad.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enfermedad.nombreCientifico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enfermedad.variedades.some(variedad => variedad.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "alto":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          text: "text-red-700 dark:text-red-400"
        };
      case "medio":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          text: "text-yellow-700 dark:text-yellow-400"
        };
      case "bajo":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          text: "text-green-700 dark:text-green-400"
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-700/50",
          text: "text-gray-700 dark:text-gray-300"
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado de página */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <BookOpen className="mr-2 h-6 w-6 text-green-600" />
          Biblioteca de Enfermedades del Café
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Consulta información detallada sobre enfermedades comunes en cafetales
        </p>
      </div>

      {/* Búsqueda y filtros */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Buscar por nombre, variedad afectada..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <div className="flex items-center p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 gap-1">
                <Filter className="h-4 w-4 text-gray-400" />
                <select className="appearance-none bg-transparent text-gray-800 dark:text-white text-sm focus:outline-none pr-6">
                  <option>Todas las variedades</option>
                  <option>Typica</option>
                  <option>Bourbon</option>
                  <option>Caturra</option>
                  <option>Catuai</option>
                  <option>Catimor</option>
                  <option>Geisha</option>
                </select>
                <ChevronDown className="absolute right-2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 gap-1">
                <AlertTriangle className="h-4 w-4 text-gray-400" />
                <select className="appearance-none bg-transparent text-gray-800 dark:text-white text-sm focus:outline-none pr-6">
                  <option>Todos los niveles</option>
                  <option>Alto</option>
                  <option>Medio</option>
                  <option>Bajo</option>
                </select>
                <ChevronDown className="absolute right-2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta informativa */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-4 flex items-start">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-blue-800 dark:text-blue-300">Información importante</h3>
          <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
            Esta biblioteca contiene información sobre las enfermedades más comunes que afectan a los cafetales en Perú.
            La información proporcionada es de carácter educativo. Para un diagnóstico preciso, consulta con un especialista agrónomo.
          </p>
        </div>
      </div>

      {/* Lista de enfermedades */}
      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 flex items-center justify-center border border-gray-100 dark:border-gray-700">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando biblioteca...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enfermedadesFiltradas.length > 0 ? (
            enfermedadesFiltradas.map((enfermedad) => {
              const nivelColor = getNivelColor(enfermedad.nivel);
              
              return (
                <div 
                  key={enfermedad.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">{enfermedad.nombre}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">{enfermedad.nombreCientifico}</p>
                      </div>
                      <span className={`${nivelColor.bg} ${nivelColor.text} text-xs px-2 py-1 rounded-full`}>
                        Nivel {enfermedad.nivel}
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center mb-2">
                        <Leaf className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Variedades afectadas:</span>
                      </div>
                      <div className="flex flex-wrap gap-1 ml-6">
                        {enfermedad.variedades.map((variedad, idx) => (
                          <span 
                            key={idx} 
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                          >
                            {variedad}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                      {enfermedad.descripcion}
                    </p>
                    
                    <button className="mt-4 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center">
                      Ver detalles completos
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col items-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">No se encontraron resultados</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  No hay enfermedades que coincidan con tu búsqueda &quot;{searchTerm}&quot;.
                </p>
                <button 
                  className="mt-4 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                  onClick={() => setSearchTerm("")}
                >
                  Mostrar todas las enfermedades
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}