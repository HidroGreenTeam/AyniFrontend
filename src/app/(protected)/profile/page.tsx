"use client";

import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Camera,
  Edit,
  Save
} from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [perfil, setPerfil] = useState({
    nombre: "Carlos Mendoza",
    email: "carlos.mendoza@ejemplo.com",
    telefono: "+51 987 654 321",
    ubicacion: "Lima, Perú",
    ocupacion: "Agricultor",
    fechaRegistro: "Enero 2025",
    bio: "Agricultor experimentado con más de 15 años cultivando diversas hortalizas y frutas en la región de Lima. Especializado en agricultura sostenible y control de plagas mediante métodos naturales.",
    avatar: "/placeholder.svg"
  });

  const handleEditToggle = () => {
    if (isEditing) {
      // Aquí normalmente guardarías los cambios en el backend
      // Simulamos un guardado exitoso
      setTimeout(() => {
        setIsEditing(false);
      }, 500);
    } else {
      setIsEditing(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPerfil(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Encabezado de página */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <User className="mr-2 h-6 w-6 text-green-600" />
          Mi Perfil
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Gestiona tu información personal y preferencias
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Encabezado de perfil */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 h-32 relative">
          <button 
            className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:shadow-md transition-shadow"
            onClick={handleEditToggle}
          >
            {isEditing ? 
              <Save className="h-5 w-5 text-green-600" /> : 
              <Edit className="h-5 w-5 text-green-600" />
            }
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-4 sm:space-x-5">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700">
                <img 
                  src={perfil.avatar} 
                  alt="Foto de perfil" 
                  className="h-full w-full object-cover"
                />
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer shadow-sm hover:bg-green-700 transition-colors">
                  <Camera className="h-4 w-4" />
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              )}
            </div>
            
            <div className="mt-4 sm:mt-0 flex-1">
              {isEditing ? (
                <input
                  type="text"
                  name="nombre"
                  value={perfil.nombre}
                  onChange={handleInputChange}
                  className="text-2xl font-bold text-gray-800 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-green-500 w-full"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{perfil.nombre}</h2>
              )}
              <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Miembro desde {perfil.fechaRegistro}</span>
              </div>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Información de contacto</h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Mail className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={perfil.email}
                      onChange={handleInputChange}
                      className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-green-500 w-full"
                    />
                  ) : (
                    <span>{perfil.email}</span>
                  )}
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Phone className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                  {isEditing ? (
                    <input
                      type="tel"
                      name="telefono"
                      value={perfil.telefono}
                      onChange={handleInputChange}
                      className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-green-500 w-full"
                    />
                  ) : (
                    <span>{perfil.telefono}</span>
                  )}
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MapPin className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="ubicacion"
                      value={perfil.ubicacion}
                      onChange={handleInputChange}
                      className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-green-500 w-full"
                    />
                  ) : (
                    <span>{perfil.ubicacion}</span>
                  )}
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Briefcase className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="ocupacion"
                      value={perfil.ocupacion}
                      onChange={handleInputChange}
                      className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-green-500 w-full"
                    />
                  ) : (
                    <span>{perfil.ocupacion}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Biografía</h3>
              
              {isEditing ? (
                <textarea
                  name="bio"
                  value={perfil.bio}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  {perfil.bio}
                </p>
              )}
            </div>
          </div>

          {/* Estadísticas */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">8</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Cultivos activos</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">24</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Diagnósticos realizados</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">5</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Tratamientos activos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuraciones adicionales */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Preferencias de notificaciones</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-200">Alertas de enfermedades</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Recibe notificaciones cuando se detecten enfermedades en tus cultivos</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={true} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-200">Recordatorios de tratamientos</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Recibe notificaciones sobre tratamientos programados</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={true} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-200">Consejos y recomendaciones</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Recibe consejos personalizados para mejorar tus cultivos</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={false} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}