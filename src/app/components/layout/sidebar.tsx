// src/components/layout/sidebar.tsx
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Leaf, 
  FileText, 
  Sprout, 
  User, 
  Settings, 
  LogOut,
  Camera,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    {
      name: "Inicio",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />
    },
    {
      name: "Mis Cultivos",
      href: "/cultivos",
      icon: <Leaf className="h-5 w-5" />
    },
    {
      name: "Diagnósticos",
      href: "/diagnosticos",
      icon: <FileText className="h-5 w-5" />
    },
    {
      name: "Tratamientos",
      href: "/tratamientos",
      icon: <Sprout className="h-5 w-5" />
    },
    {
      name: "Mi Cuenta",
      href: "/perfil",
      icon: <User className="h-5 w-5" />
    },
    {
      name: "Configuración",
      href: "/configuracion",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <>
      {/* Botón móvil para mostrar/ocultar sidebar */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transition-all duration-300 lg:translate-x-0 lg:w-72 ${
          isOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b">
          <Link href="/dashboard" className="flex items-center">
            <div className="w-10 h-10 bg-green-light rounded-lg flex items-center justify-center mr-3">
              <Leaf className="h-6 w-6 text-green-primary" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-green-primary">Ayni</h1>
              <p className="text-xs text-brown-primary/60">Para agricultores</p>
            </div>
          </Link>
        </div>
        
        {/* Botón rápido de diagnóstico */}
        <div className="p-4">
          <Link 
            href="/diagnosticos/nuevo"
            className="flex items-center justify-center gap-2 w-full py-3 bg-green-primary text-white rounded-lg hover:bg-green-dark transition-colors"
          >
            <Camera className="h-5 w-5" />
            <span className="font-medium">Nuevo Diagnóstico</span>
          </Link>
        </div>
        
        {/* Menú principal */}
        <nav className="mt-2 px-3">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 my-1 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-green-light text-green-primary font-medium' 
                    : 'text-brown-primary hover:bg-green-light/50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          {/* Botón de cerrar sesión */}
          <button
            className="flex items-center gap-3 p-3 my-1 rounded-lg text-brown-primary hover:bg-green-light/50 transition-colors w-full mt-6"
            onClick={() => {
              // Lógica de cerrar sesión
            }}
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </nav>
        
        {/* Indicador de estado offline/online */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="flex items-center bg-brown-light p-2 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-primary mr-2"></div>
            <span className="text-xs text-brown-primary">Conectado</span>
          </div>
        </div>
      </aside>
    </>
  );
}