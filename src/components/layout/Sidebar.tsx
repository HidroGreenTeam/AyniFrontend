"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  AlertTriangle,
  Pill,
  ClipboardList,
  BookOpen,
  Sprout,
  X
} from "lucide-react";
import NextImage from "next/image";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void; 
}

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Mis Cultivos", href: "/crops", icon: Sprout },
    { name: "Diagnóstico", href: "/diagnosis", icon: AlertTriangle },
    { name: "Tratamientos", href: "/treatments", icon: Pill },
    { name: "Historial", href: "/history", icon: ClipboardList },
    { name: "Biblioteca", href: "/library", icon: BookOpen },
  ];

  return (
    <>
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
               <NextImage
                    src="/favicon.ico"
                    alt="Logo"
                    width={32}
                    height={32}
                    className=" h-12 w-12"
                  />
              <div className="font-bold text-lg text-gray-800 dark:text-white">Ayni</div>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${isActive
                      ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/30 dark:hover:text-white"
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${isActive
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                        } mr-3 flex-shrink-0 h-5 w-5`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75">
          <div className="fixed inset-0 flex z-40">
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl">
              <div className="absolute top-0 right-0 pt-2 pr-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Cerrar menú</span>
                  <X className="h-6 w-6 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <NextImage
                    src="/favicon.ico"
                    alt="Logo"
                    width={32}
                    height={32}
                    className=" h-12 w-12"
                  />
                  <div className="font-bold text-lg text-gray-800 dark:text-white ml-2">Ayni</div>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`${isActive
                          ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/30 dark:hover:text-white"
                          } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon
                          className={`${isActive
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                            } mr-4 flex-shrink-0 h-6 w-6`}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="flex-shrink-0 flex items-center p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">Usuario</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Agricultor</div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 w-14" aria-hidden="true" />
          </div>
        </div>
      )}
    </>
  );
}