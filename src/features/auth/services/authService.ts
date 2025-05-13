import axios from "@/lib/axios";
import { User } from "@/models/User";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  id: number;
  email: string;
  roles: string[];
  exp: number;
}

interface LoginResponse {
  id: number;
  email: string;
  token: string;
  roles?: string[];
}

interface RegisterResponse {
  id: number;
  email: string;
  roles: string[];
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  roles: string[];
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post("/auth/sign-in", { email, password });

      localStorage.setItem("token", response.data.token);
      Cookies.set("auth_token", response.data.token, { expires: 7 });

      return response.data;
    } catch (error) {

       console.error("Error al iniciar sesión:", error);
      throw new Error("Error al conectar con el servidor");
    }
  },

  async register(
    fullName: string,
    email: string,
    password: string,
  ): Promise<RegisterResponse> {
    try {
      const userData: RegisterData = {
        fullName,
        email,
        password,
        roles: ["ROLE_USER"],
      };

      const response = await axios.post("/auth/sign-up", userData);
      return response.data;
    } catch (error) {
     console.error("Error al registrar el usuario:", error);
      throw new Error("Error al conectar con el servidor");
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode<JWTPayload>(token);

      if (decoded.exp * 1000 < Date.now()) {
        this.logout();
        return null;
      }

      const user: User = {
        id: decoded.id,
        email: decoded.email,
        roles: decoded.roles,
      };

      return user;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      this.logout();
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem("token");
    Cookies.remove("auth_token");
    window.location.href = "/login";
  },

  async validateToken(token: string): Promise<boolean> {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      console.error("Error al validar el token:", error);
      return false;
    }
  },
};
