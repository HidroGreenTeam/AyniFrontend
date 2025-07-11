"use client";

import { useState } from 'react';
import {
    Home,
    Sprout,
    Stethoscope,
    Pill,
    ClipboardList,
    BookOpen,
    Settings,
    ChevronRight,
    ChevronLeft,
    LogOut
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { usePathname } from "next/navigation";

const menuItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
        description: "Vista general de tu actividad"
    },
    {
        title: "Mis Cultivos",
        href: "/crops",
        icon: Sprout,
        description: "Gestiona tus cultivos"
    },
    {
        title: "Diagnóstico",
        href: "/diagnosis",
        icon: Stethoscope,
        description: "Analiza el estado de tus plantas"
    },
    {
        title: "Tratamientos",
        href: "/treatments",
        icon: Pill,
        description: "Recomendaciones y tratamientos"
    },
    {
        title: "Historial",
        href: "/history",
        icon: ClipboardList,
        description: "Historial de diagnósticos"
    },
    {
        title: "Biblioteca",
        href: "/library",
        icon: BookOpen,
        description: "Recursos y guías"
    },
];

const secondaryItems = [
   
    {
        title: "Configuración",
        href: "/settings",
        icon: Settings,
        description: "Personaliza tu experiencia"
    }
];

interface SidebarProps {
    onToggle?: (isExpanded: boolean) => void;
}

export default function Sidebar({ onToggle }: SidebarProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const { logout } = useAuth();
    const pathname = usePathname();

    const handleToggle = () => {
        const newExpanded = !isExpanded;
        setIsExpanded(newExpanded);
        onToggle?.(newExpanded);
    };

    return (
        <div className={`
            fixed inset-y-0 left-0 z-50 flex flex-col
            ${isExpanded ? 'w-64' : 'w-16'}
            transition-all duration-300 ease-in-out
            bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        `}>
            {/* Botón de expansión */}
            <button
                onClick={handleToggle}
                className="absolute -right-3 top-8 w-6 h-6 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-50 shadow-sm"
            >
                {isExpanded ? (
                    <ChevronLeft className="h-4 w-4 text-gray-500" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
            </button>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                <div className="flex flex-1 flex-col pt-5 pb-4">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex flex-shrink-0 items-center px-4 mb-6 hover:opacity-80 transition-opacity">
                        <Image
                            src="/favicon.ico"
                            alt="Ayni"
                            width={40}
                            height={40}
                            className="rounded-lg shadow-sm"
                        />
                        {isExpanded && (
                            <span className="ml-3 text-xl font-bold text-green-600 dark:text-green-400">
                                Ayni
                            </span>
                        )}
                    </Link>

                    <nav className="flex-1 space-y-1 px-3">
                        {/* Menú principal */}
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                                        pathname === item.href
                                            ? 'bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                    title={!isExpanded ? item.title : undefined}
                                >
                                    <item.icon
                                        className={`${
                                            pathname === item.href
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                                        } ${!isExpanded ? 'w-6 h-6' : 'w-5 h-5 mr-3'} flex-shrink-0`}
                                    />
                                    {isExpanded && (
                                        <span className="truncate">{item.title}</span>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Separador */}
                        <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

                        {/* Menú secundario */}
                        <div className="space-y-1">
                            {secondaryItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                                        pathname === item.href
                                            ? 'bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                    title={!isExpanded ? item.title : undefined}
                                >
                                    <item.icon
                                        className={`${
                                            pathname === item.href
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                                        } ${!isExpanded ? 'w-6 h-6' : 'w-5 h-5 mr-3'} flex-shrink-0`}
                                    />
                                    {isExpanded && (
                                        <span className="truncate">{item.title}</span>
                                    )}
                                </Link>
                            ))}

                            {/* Botón de cerrar sesión */}
                            <button
                                onClick={logout}
                                className="w-full group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title={!isExpanded ? "Cerrar sesión" : undefined}
                            >
                                <LogOut className={`text-red-500 dark:text-red-400 ${!isExpanded ? 'w-6 h-6' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
                                {isExpanded && (
                                    <span className="truncate">Cerrar sesión</span>
                                )}
                            </button>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
}