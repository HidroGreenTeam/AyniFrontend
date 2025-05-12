"use client";

import {
  AlertTriangle,
  BookOpen,
  CloudRain,
  History,
  LayoutDashboard,
  Leaf,
  Menu,
  Settings,
  Sprout,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      name: "Panel",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Cultivos",
      href: "/crops",
      icon: <Sprout className="h-5 w-5" />,
    },
    {
      name: "Diagnóstico",
      href: "/diagnosis",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      name: "Tratamientos",
      href: "/treatments",
      icon: <CloudRain className="h-5 w-5" />,
    },
    {
      name: "Historial",
      href: "/history",
      icon: <History className="h-5 w-5" />,
    },
    {
      name: "Biblioteca",
      href: "/library",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Configuración",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md text-gray-600 hover:text-green-600"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-0
          w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo and brand */}
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center space-x-3">
                <Image
                src="/favicon.ico"
                alt="Ayni Logo"
                width={30}
                height={30}
                className="h-14 w-14"
              /> 
            <div>
              <h1 className="font-bold text-lg text-gray-800">Ayni</h1>
              <p className="text-xs text-gray-500">Panel de administración</p>
            </div>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-lg
                      ${
                        isActive
                          ? "bg-green-50 text-green-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                      transition-colors duration-200
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    <span
                      className={`${isActive ? "text-green-600" : "text-gray-500"} mr-3`}
                    >
                      {item.icon}
                    </span>
                    {item.name}

                    {isActive && (
                      <span className="ml-auto w-1.5 h-5 bg-green-600 rounded-full"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Version info */}
        <div className="p-4 border-t text-xs text-gray-500">
          <p>Ayni v1.0.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
