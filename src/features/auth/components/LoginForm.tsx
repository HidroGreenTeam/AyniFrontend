import React, { useState } from "react"; 
import { useAuth } from "../hooks/useAuth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, isLoading, formErrors } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
       await handleLogin(email, password);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {formErrors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {formErrors.general}
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
            formErrors.email ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="usuario@ejemplo.com"
          required
        />
        {formErrors.email && (
          <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <a href="#" className="text-xs text-green-600 hover:text-green-800">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
            formErrors.password ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="••••••••"
          required
        />
        {formErrors.password && (
          <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="remember-me"
          type="checkbox"
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label
          htmlFor="remember-me"
          className="ml-2 block text-sm text-gray-700"
        >
          Recordarme
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            Iniciando sesión...
          </>
        ) : (
          "Iniciar sesión"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
