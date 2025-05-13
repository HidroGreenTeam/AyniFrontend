"use client";

import { 
  BookOpen, 
  Search, 
  Filter, 
  ChevronDown, 
  AlertTriangle, 
  Info,
  Leaf,
  ArrowRight
} from "lucide-react";
import { useEffect, useState } from "react";

export default function LibraryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Datos de ejemplo para las enfermedades
  const enfermedades = [
    {
      id: 1,
      nombre: "Mildiú polvoso",
      nombreCientifico: "Erysiphe cichoracearum",
      cultivos: ["Fresas", "Tomates", "Calabaza"],
      nivel: "alto",
      descripcion: "Enfermedad fúngica que produce un polvo blanco en la superficie de las hojas."
    },
    {
      id: 2,
      nombre: "Tizón temprano",
      nombreCientifico: "Alternaria solani",
      cultivos: ["Tomates", "Patatas"],
      nivel: "alto",
      descripcion: "Causa manchas necróticas con anillos concéntricos en hojas más viejas."
    },
    {
      id: 3,
      nombre: "Roya",
      nombreCientifico: "Puccinia spp.",
      cultivos: ["Maíz", "Frijoles"],
      nivel: "medio",
      descripcion: "Provoca pústulas de color óxido o marrón en hojas y tallos."
    },
    {
      id: 4,
      nombre: "Mancha bacteriana",
      nombreCientifico: "Xanthomonas campestris",
      cultivos: ["Pimientos", "Tomates"],
      nivel: "medio",
      descripcion: "Causa pequeñas manchas oscuras rodeadas de halos amarillentos."
    },
    {
      id: 5,
      nombre: "Verticilosis",
      nombreCientifico: "Verticillium dahliae",
      cultivos: ["Berenjena", "Patatas", "Fresas"],
      nivel: "alto",
      descripcion: "Marchitamiento que comienza en hojas inferiores y progresa hacia arriba."
    },
    {
      id: 6,
      nombre: "Mosaico del tabaco",
      nombreCientifico: "Tobacco mosaic virus (TMV)",
      cultivos: ["Tomates", "Pimientos", "Tabaco"],
      nivel: "bajo",
      descripcion: "Virus que causa patrón de mosaico en hojas y crecimiento atrofiado."
    }
  ];

  // Filtrar enfermedades basado en el término de búsqueda
  const enfermedadesFiltradas = enfermedades.filter(enfermedad => 
    enfermedad.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enfermedad.nombreCientifico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enfermedad.cultivos.some(cultivo => cultivo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Obtener color basado en el nivel de severidad
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
          Biblioteca de Enfermedades
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Consulta información detallada sobre enfermedades comunes en cultivos
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
              placeholder="Buscar por nombre, cultivo afectado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <div className="flex items-center p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 gap-1">
                <Filter className="h-4 w-4 text-gray-400" />
                <select className="appearance-none bg-transparent text-gray-800 dark:text-white text-sm focus:outline-none pr-6">
                  <option>Todos los cultivos</option>
                  <option>Tomates</option>
                  <option>Patatas</option>
                  <option>Fresas</option>
                  <option>Maíz</option>
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
            Esta biblioteca contiene información sobre las enfermedades más comunes que afectan a los cultivos en Perú.
            La información proporcionada es de carácter educativo. En caso de dudas, consulta con un especialista agrónomo.
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
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Cultivos afectados:</span>
                      </div>
                      <div className="flex flex-wrap gap-1 ml-6">
                        {enfermedad.cultivos.map((cultivo, idx) => (
                          <span 
                            key={idx} 
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                          >
                            {cultivo}
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