"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/features/auth/hooks/useAuth";
// Removed useFarmerProfile import - using user data directly
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

const getPageTitle = (pathname: string): string => {
    const pageMap: { [key: string]: string } = {
        '/dashboard': 'Dashboard',
        '/crops': 'Mis Cultivos',
        '/diagnosis': 'Diagnóstico',
        '/treatments': 'Tratamientos',
        '/history': 'Historial',
        '/library': 'Biblioteca',
        '/notifications': 'Notificaciones',
        '/profile': 'Mi Perfil',
        '/settings': 'Configuración',
    };

    return pageMap[pathname] || 'Ayni';
};

export default function Header() {
    const { user } = useAuth();
    // Using user data directly instead of farmer profile
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-40 flex h-16 flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-1 justify-between items-center px-4">
                {/* Logo y título de la página */}
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Image
                            src="/favicon.ico"
                            alt="Ayni Logo"
                            width={32}
                            height={32}
                            className="rounded-lg shadow-sm"
                        />
                        <span className="text-xl font-bold text-green-600 dark:text-green-400 hidden sm:block">
                            Ayni
                        </span>
                    </Link>
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {getPageTitle(pathname)}
                    </h1>
                </div>

                {/* Controles del header */}
                <div className="flex items-center gap-3">
                    {/* Notificaciones */}
                    <Link
                        href="/notifications"
                        className="relative rounded-full bg-white dark:bg-gray-800 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <span className="sr-only">Ver notificaciones</span>
                        <Bell className="h-5 w-5" />
                        {/* Indicador de notificaciones */}
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full"></span>
                    </Link>

                    {/* Cambio de tema */}
                    <ThemeToggle />

                    {/* Perfil de usuario */}
                    <Link
                        href="/profile"
                        className="flex items-center gap-3 rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                        {/* Avatar del usuario */}
                        <div className="relative">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        </div>

                        {/* Información del usuario */}
                        <div className="flex flex-col items-start">
                            <span className="font-medium text-gray-900 dark:text-white">
                                {user?.email?.split('@')[0] || 'Usuario'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {user?.email || 'usuario@ejemplo.com'}
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}