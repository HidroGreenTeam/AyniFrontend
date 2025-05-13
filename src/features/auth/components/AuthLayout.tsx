import { CloudRain, Leaf, Sprout } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  linkText: string;
  linkHref: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  linkText,
  linkHref,
}) => {
  return (
    <div className="min-h-screen w-full flex relative overflow-hidden bg-gradient-to-b from-[#F1F8E9] to-[#E8F5E9]">
      {/* Panel a la izquierda con información sobre Ayni */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-700 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20">
            <Leaf className="w-full h-full text-white" />
          </div>
          <div className="absolute bottom-20 right-10 w-32 h-32">
            <Sprout className="w-full h-full text-white" />
          </div>
        </div>

        <div className="z-10 text-white">
          <div className="mb-8 flex items-center">
            <div className="bg-white rounded-full p-3 mr-4">
              <Image
                src="/favicon.ico"
                alt="Ayni Logo"
                className="w-12 h-12"
              />
            </div>
            <h1 className="text-3xl font-bold">Ayni</h1>
          </div>

          <h2 className="text-4xl font-bold mb-6">
            La tecnología agrícola accesible para todos
          </h2>

          <div className="space-y-6 max-w-md">
            <p className="text-lg opacity-90">
              Diagnostica enfermedades en tus cultivos en segundos con
              inteligencia artificial, incluso sin conexión a internet.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3 mt-1">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Detección temprana</h3>
                  <p className="opacity-80">
                    Identifica problemas antes de que se propaguen y salva tus
                    cosechas
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3 mt-1">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Tratamientos personalizados
                  </h3>
                  <p className="opacity-80">
                    Recibe recomendaciones específicas para el tratamiento de
                    tus cultivos
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3 mt-1">
                  <CloudRain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Funciona sin internet
                  </h3>
                  <p className="opacity-80">
                    Nuestra aplicación está diseñada para zonas rurales con
                    conectividad limitada
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario a la derecha */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
            <div className="flex justify-center mb-6 lg:hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-full p-3">
                <Image
                  src="/favicon.ico"
                  alt="Ayni Logo"
                  className="w-12 h-12"
                />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-[#2E7D32] mb-2">{title}</h2>
            <p className="text-[#5A3921]/70 mb-6">{subtitle}</p>

            {children}

            <div className="mt-6 text-center">
              <p className="text-[#5A3921]/70">
                {linkText.split(" ")[0]}{" "}
                <Link
                  href={linkHref}
                  className="text-green-600 font-medium hover:text-green-700"
                >
                  {linkText.split(" ").slice(1).join(" ")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
