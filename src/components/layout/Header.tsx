"use client";

import { authService } from "@/features/auth/services/authService";
import { User as UserType } from "@/models/User";
import { Bell, LogOut, Moon, Search, Settings, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState(3);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Búsqueda */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar en la plataforma..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Acciones y perfil */}
        <div className="flex items-center space-x-4">
          {/* Botón tema claro/oscuro */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notificaciones */}
          <div className="relative">
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* Perfil de usuario */}
          {!isLoading && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 border border-green-200 hover:border-green-300 transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700 line-clamp-1">
                    {user?.fullName || user?.username || "Agricultor"}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {user?.email || ""}
                  </p>
                </div>
              </button>

              {/* Menú desplegable */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <a
                    href="/profile"
                    className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Mi perfil
                  </a>
                  <a
                    href="/settings"
                    className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </a>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className=" w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
