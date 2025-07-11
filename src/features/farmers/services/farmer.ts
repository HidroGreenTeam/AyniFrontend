import { Farmer, CreateFarmerDTO, UpdateFarmerDTO } from '../types/farmer';

interface ErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
}

const API_ENDPOINTS = {
  FARMER: (farmerId: number) => `/farmers/${farmerId}`,
  UPDATE_FARMER: (farmerId: number) => `/farmers/${farmerId}`,
  DELETE_FARMER: (farmerId: number) => `/farmers/${farmerId}`,
  UPDATE_IMAGE: (farmerId: number) => `/farmers/${farmerId}/farmerImage`,
  DELETE_IMAGE: (farmerId: number) => `/farmers/${farmerId}/farmerImage`,
  ALL_FARMERS: '/farmers',
  CREATE_FARMER: '/farmers'
} as const;

const STORAGE_KEYS = {
  USER: 'user'
} as const;

const JSON_CONTENT_TYPE = 'application/json';
const AUTH_ERROR_MESSAGE = 'No hay usuario autenticado';

const buildUrl = (endpoint: string): string => {
  const baseURL = 'https://user-service.thankfulwater-e8adfc7e.eastus.azurecontainerapps.io/api/v1';
  return `${baseURL}${endpoint}`;
};

const getAuthToken = (): string => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  if (!user) {
    throw new Error(AUTH_ERROR_MESSAGE);
  }
  const { token } = JSON.parse(user);
  return token;
};

const getAuthHeaders = (): HeadersInit => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': JSON_CONTENT_TYPE
});

const getAuthHeadersFormData = (): HeadersInit => ({
  'Authorization': `Bearer ${getAuthToken()}`
});

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

const createFormDataWithFile = (file: File): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
};

const getWithAuth = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(buildUrl(endpoint), {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return handleResponse<T>(response);
};

const putWithAuth = async <T>(endpoint: string, data: unknown): Promise<T> => {
  const response = await fetch(buildUrl(endpoint), {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<T>(response);
};

const putFormDataWithAuth = async <T>(endpoint: string, formData: FormData): Promise<T> => {
  const response = await fetch(buildUrl(endpoint), {
    method: 'PUT',
    headers: getAuthHeadersFormData(),
    body: formData
  });
  return handleResponse<T>(response);
};

const deleteWithAuth = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(buildUrl(endpoint), {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse<T>(response);
};

const postWithAuth = async <T>(endpoint: string, data: unknown): Promise<T> => {
  const response = await fetch(buildUrl(endpoint), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<T>(response);
};

export const getFarmer = async (farmerId: number): Promise<Farmer> => {
  return getWithAuth<Farmer>(API_ENDPOINTS.FARMER(farmerId));
};

export const updateFarmer = async (farmerId: number, data: UpdateFarmerDTO): Promise<Farmer> => {
  return putWithAuth<Farmer>(API_ENDPOINTS.UPDATE_FARMER(farmerId), data);
};

export const deleteFarmer = async (farmerId: number): Promise<void> => {
  return deleteWithAuth<void>(API_ENDPOINTS.DELETE_FARMER(farmerId));
};

export const updateFarmerImage = async (farmerId: number, file: File): Promise<Farmer> => {
  const formData = createFormDataWithFile(file);
  return putFormDataWithAuth<Farmer>(API_ENDPOINTS.UPDATE_IMAGE(farmerId), formData);
};

export const deleteFarmerImage = async (farmerId: number): Promise<Farmer> => {
  return deleteWithAuth<Farmer>(API_ENDPOINTS.DELETE_IMAGE(farmerId));
};

export const getAllFarmers = async (): Promise<Farmer[]> => {
  return getWithAuth<Farmer[]>(API_ENDPOINTS.ALL_FARMERS);
};

export const createFarmer = async (data: CreateFarmerDTO): Promise<Farmer> => {
  return postWithAuth<Farmer>(API_ENDPOINTS.CREATE_FARMER, data);
}; 