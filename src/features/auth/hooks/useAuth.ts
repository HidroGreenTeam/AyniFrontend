import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authService } from "../services/authService";

interface AuthUser {
    id: number;
    email: string;
    token: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    fullName?: string;
    general?: string;
  }>({});

  const router = useRouter();

  useEffect(() => {
    // Intentar obtener el usuario del localStorage al cargar
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setFormErrors((prev) => ({
        ...prev,
        email: "El correo electrónico es obligatorio",
      }));
      return false;
    }
    if (!emailRegex.test(email)) {
      setFormErrors((prev) => ({
        ...prev,
        email: "Ingrese un correo electrónico válido",
      }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, email: undefined }));
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setFormErrors((prev) => ({
        ...prev,
        password: "La contraseña es obligatoria",
      }));
      return false;
    }
    if (password.length < 6) {
      setFormErrors((prev) => ({
        ...prev,
        password: "La contraseña debe tener al menos 6 caracteres",
      }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, password: undefined }));
    return true;
  };

  const validateFullName = (fullName: string): boolean => {
    if (!fullName) {
      setFormErrors((prev) => ({
        ...prev,
        fullName: "El nombre completo es obligatorio",
      }));
      return false;
    }
    if (fullName.length < 3) {
      setFormErrors((prev) => ({
        ...prev,
        fullName: "El nombre debe tener al menos 3 caracteres",
      }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, fullName: undefined }));
    return true;
  };

  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    setFormErrors({});
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return false;
    }

    try {
      setIsLoading(true);
      const userData = await authService.login(email, password);

      setUser({
        id: userData.id,
        email: userData.email,
        token: userData.token,
      });
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));

      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get("redirectTo") || "/crops";
      router.push(redirectTo);

      return true;
    } catch (error) {
      console.error("Error during login:", error);
      setFormErrors((prev) => ({
        ...prev,
        general:
          "Error al iniciar sesión. Verifique sus credenciales.",
      }));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (
    fullName: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    setFormErrors({});
    const isNameValid = validateFullName(fullName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      return false;
    }

    try {
      setIsLoading(true);
      await authService.register(fullName, email, password);

      return await handleLogin(email, password);
    } catch (error) {
      console.error("Error during registration:", error);
      setFormErrors((prev) => ({
        ...prev,
        general:
          "Error al registrar cuenta. Intente nuevamente.",
      }));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    formErrors,
    setFormErrors,
    validateEmail,
    validatePassword,
    validateFullName,
    handleLogin,
    handleRegister,
    logout,
  };
};
