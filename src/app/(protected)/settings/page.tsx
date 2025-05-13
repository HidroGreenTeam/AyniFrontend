"use client";

import { 
  Settings, 
  Moon, 
  Sun, 
  Globe, 
  Bell, 
  Lock, 
  ExternalLink, 
  LogOut,
  Check
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("es");
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationApp, setNotificationApp] = useState(true);

  return (
    <div className="space-y-6">
      {/* Encabezado de página */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <Settings className="mr-2 h-6 w-6 text-green-600" />
          Configuración
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Personaliza la aplicación según tus preferencias
        </p>
      </div>

      {/* Configuración de apariencia */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Apariencia</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tema
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div 
                className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer border ${
                  theme === "light" 
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                    : "border-gray-200 dark:border-gray-700"
                }`}
                onClick={() => setTheme("light")}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  theme === "light" 
                    ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}>
                  {theme === "light" ? <Check className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 dark:text-white">Claro</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Usar siempre el tema claro</div>
                </div>
              </div>
              
              <div 
                className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer border ${
                  theme === "dark" 
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                    : "border-gray-200 dark:border-gray-700"
                }`}
                onClick={() => setTheme("dark")}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  theme === "dark" 
                    ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}>
                  {theme === "dark" ? <Check className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 dark:text-white">Oscuro</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Usar siempre el tema oscuro</div>
                </div>
              </div>
              
              <div 
                className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer border ${
                  theme === "system" 
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                    : "border-gray-200 dark:border-gray-700"
                }`}
                onClick={() => setTheme("system")}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  theme === "system" 
                    ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}>
                  {theme === "system" ? <Check className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 dark:text-white">Sistema</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Seguir la configuración del sistema</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Idioma
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <select 
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="qu">Quechua</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Configuración de notificaciones */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-green-600" />
            Notificaciones
          </div>
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-200">Notificaciones por correo</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Recibir alertas y actualizaciones por correo electrónico</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notificationEmail} 
                onChange={() => setNotificationEmail(!notificationEmail)} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-200">Notificaciones en la aplicación</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Mostrar alertas y actualizaciones en la aplicación</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notificationApp} 
                onChange={() => setNotificationApp(!notificationApp)} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Seguridad */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          <div className="flex items-center">
            <Lock className="h-5 w-5 mr-2 text-green-600" />
            Seguridad
          </div>
        </h2>
        
        <div className="space-y-4">
          <button className="w-full sm:w-auto text-left px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center">
            <span className="flex-1">Cambiar contraseña</span>
            <ExternalLink className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-2" />
          </button>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión en todos los dispositivos
            </button>
          </div>
        </div>
      </div>

      {/* Información de la aplicación */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Acerca de</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Versión</span>
            <span className="text-gray-800 dark:text-white">1.0.0</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Última actualización</span>
            <span className="text-gray-800 dark:text-white">10/05/2025</span>
          </div>
          
          <div className="pt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 HidroGreen. Todos los derechos reservados.
            </div>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                Política de privacidad
              </a>
              <a href="#" className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                Términos de servicio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}