import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Leaf, Eye, EyeOff, Mail, Lock, User } from "lucide-react";

const RegisterForm: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { handleRegister, isLoading, formErrors } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleRegister(fullName, email, password);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {formErrors.general && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {formErrors.general}
        </div>
      )}

      <div className="space-y-1">
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-[#5A3921]"
        >
          Nombre completo
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Juan Pérez"
            className={`block w-full pl-10 pr-3 py-3 border ${
              formErrors.fullName ? "border-red-300" : "border-gray-300"
            } rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900`}
          />
        </div>
        {formErrors.fullName && (
          <p className="text-red-600 text-xs mt-1">{formErrors.fullName}</p>
        )}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#5A3921]"
        >
          Correo electrónico
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@ejemplo.com"
            className={`block w-full pl-10 pr-3 py-3 border ${
              formErrors.email ? "border-red-300" : "border-gray-300"
            } rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900`}
          />
        </div>
        {formErrors.email && (
          <p className="text-red-600 text-xs mt-1">{formErrors.email}</p>
        )}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-[#5A3921]"
        >
          Contraseña
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className={`block w-full pl-10 pr-10 py-3 border ${
              formErrors.password ? "border-red-300" : "border-gray-300"
            } rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900`}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {formErrors.password && (
          <p className="text-red-600 text-xs mt-1">{formErrors.password}</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="text-[#5A3921]/70">
              Acepto los{" "}
              <a
                href="#"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Términos y Condiciones
              </a>{" "}
              y la{" "}
              <a
                href="#"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Política de Privacidad
              </a>
            </label>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="newsletter"
              name="newsletter"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="newsletter" className="text-[#5A3921]/70">
              Deseo recibir consejos agrícolas, actualizaciones y promociones
              por correo electrónico
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70"
      >
        {isLoading ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <Leaf className="mr-2 h-5 w-5" />
        )}
        Crear cuenta
      </button>
    </form>
  );
};

export default RegisterForm;
