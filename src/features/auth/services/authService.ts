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

interface ErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
}

const API_ENDPOINTS = {
  LOGIN: '/auth/sign-in',
  REGISTER: '/auth/sign-up'
} as const;

const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user'
} as const;

const COOKIE_KEYS = {
  AUTH_TOKEN: 'auth_token'
} as const;

const TOKEN_EXPIRY_DAYS = 7;
const DEFAULT_USER_ROLE = 'ROLE_USER';
const LOGIN_REDIRECT_PATH = '/login';

const buildUrl = (endpoint: string): string => {
  const baseURL = "https://user-service.thankfulwater-e8adfc7e.eastus.azurecontainerapps.io/api/v1";
  return `${baseURL}${endpoint}`;
};

const tryParseErrorResponse = async (response: Response): Promise<ErrorResponse | null> => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await tryParseErrorResponse(response);
    const message = errorData?.detail || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }
  return response.json();
};

const storeAuthData = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  Cookies.set(COOKIE_KEYS.AUTH_TOKEN, token, { expires: TOKEN_EXPIRY_DAYS });
};

const clearAuthData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  Cookies.remove(COOKIE_KEYS.AUTH_TOKEN);
};

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const createUserFromToken = (decoded: JWTPayload): User => ({
  id: decoded.id,
  email: decoded.email,
  roles: decoded.roles,
});

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(buildUrl(API_ENDPOINTS.LOGIN), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await handleResponse<LoginResponse>(response);
    storeAuthData(data.token);
    return data;
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Failed to connect to server");
  }
};

export const register = async (fullName: string, email: string, password: string): Promise<RegisterResponse> => {
  try {
    const userData: RegisterData = {
      fullName,
      email,
      password,
      roles: [DEFAULT_USER_ROLE],
    };

    const response = await fetch(buildUrl(API_ENDPOINTS.REGISTER), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    return handleResponse<RegisterResponse>(response);
  } catch (error) {
    console.error("Registration failed:", error);
    throw new Error("Failed to connect to server");
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (!token) return null;

  try {
    if (isTokenExpired(token)) {
      logout();
      return null;
    }

    const decoded = jwtDecode<JWTPayload>(token);
    return createUserFromToken(decoded);
  } catch (error) {
    console.error("Token decode failed:", error);
    logout();
    return null;
  }
};

export const logout = (): void => {
  clearAuthData();
  window.location.href = LOGIN_REDIRECT_PATH;
};

export const validateToken = async (token: string): Promise<boolean> => {
  return !isTokenExpired(token);
};
