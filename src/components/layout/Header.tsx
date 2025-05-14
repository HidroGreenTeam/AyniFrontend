"use client";

import { authService } from "@/features/auth/services/authService";
import {
  Bell,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface HeaderProps {
  toggleTheme: () => void;
  theme: string;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Header = ({ toggleTheme, theme, setIsMobileMenuOpen }: HeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState(3);
  const [user] = useState({
    fullName: "Carlos Mendoza",
    email: "carlos.mendoza@ejemplo.com",
    avatar: null
  });
  const [isLoading] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null); 

  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 transition-colors duration-300">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Botón de menú móvil */}
        <div className="flex items-center">
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Acciones y perfil */}
        <div className="flex items-center space-x-1 md:space-x-3">
          {/* Botón tema claro/oscuro */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 transform transition-transform duration-300 hover:rotate-12" />
            ) : (
              <Moon className="h-5 w-5 transform transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* Botón de notificaciones */}
          <Link
            href="/notifications"
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 relative"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform scale-90 transition-transform hover:scale-100">
                {notifications}
              </span>
            )}
          </Link>

          {/* Perfil de usuario - siempre visible */}
          {!isLoading && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 focus:outline-none"
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white border-2 border-white dark:border-gray-800 hover:shadow-md transition-all duration-200">
                  <User className="h-5 w-5" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 line-clamp-1">
                    {user?.fullName || "Agricultor"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                    {user?.email || ""}
                  </p>
                </div>
              </button>

              {/* Menú desplegable */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transform origin-top-right transition-all duration-200 animate-fadeIn ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {/* Opciones principales (Perfil y Configuración) siempre visibles */}
                    <Link
                      href="/profile"
                      className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-green-500 dark:group-hover:text-green-400" />
                      Mi perfil
                    </Link>

                    <Link
                      href="/settings"
                      className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-green-500 dark:group-hover:text-green-400" />
                      Configuración
                    </Link>
                  </div>
                  
                  <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left group flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="h-4 w-4 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
                      Cerrar sesión
                    </button>
                  </div>
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