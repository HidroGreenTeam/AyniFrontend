import { Crop, CreateCropDTO, UpdateCropDTO } from '../types/crop';
import { useGlobalStore } from '@/store/globalStore';

interface ErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
}

const API_ENDPOINTS = {
  CROP: (cropId: number) => `/crops/crop/${cropId}`,
  UPDATE_CROP: (cropId: number) => `/crops/${cropId}`,
  DELETE_CROP: (cropId: number) => `/crops/${cropId}`,
  UPLOAD_IMAGE: (cropId: number) => `/crops/${cropId}/image`,
  DELETE_IMAGE: (cropId: number) => `/crops/${cropId}/cropImage`,
  ALL_CROPS: '/crops',
  CREATE_CROP: (farmerId: number) => `/crops/${farmerId}`,
  FARMER_CROPS: (farmerId: number) => `/crops/${farmerId}`
} as const;

const JSON_CONTENT_TYPE = 'application/json';

const buildUrl = (endpoint: string): string => {
  const baseURL = "https://crop-service.thankfulwater-e8adfc7e.eastus.azurecontainerapps.io/api/v1";
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

const createFormDataWithFile = (file: File): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
};

const createFormDataWithCropAndFile = (cropData: CreateCropDTO, file: File): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('crop', new Blob([JSON.stringify(cropData)], { type: JSON_CONTENT_TYPE }));
  return formData;
};

const updateGlobalStore = (crops: Crop[]): void => {
  useGlobalStore.getState().setCrops(crops);
};

export const getCrop = async (cropId: number): Promise<Crop> => {
  const response = await fetch(buildUrl(API_ENDPOINTS.CROP(cropId)), {
    method: 'GET'
  });
  return handleResponse<Crop>(response);
};

export const updateCrop = async (cropId: number, data: UpdateCropDTO): Promise<Crop> => {
  const response = await fetch(buildUrl(API_ENDPOINTS.UPDATE_CROP(cropId)), {
    method: 'PUT',
    headers: { 'Content-Type': JSON_CONTENT_TYPE },
    body: JSON.stringify(data)
  });
  return handleResponse<Crop>(response);
};

export const deleteCrop = async (cropId: number): Promise<void> => {
  const response = await fetch(buildUrl(API_ENDPOINTS.DELETE_CROP(cropId)), {
    method: 'DELETE'
  });
  return handleResponse<void>(response);
};

export const updateCropImage = async (cropId: number, file: File): Promise<Crop> => {
  const formData = createFormDataWithFile(file);
  const response = await fetch(buildUrl(API_ENDPOINTS.UPLOAD_IMAGE(cropId)), {
    method: 'POST',
    body: formData
  });
  return handleResponse<Crop>(response);
};

export const deleteCropImage = async (cropId: number): Promise<Crop> => {
  const response = await fetch(buildUrl(API_ENDPOINTS.DELETE_IMAGE(cropId)), {
    method: 'DELETE'
  });
  return handleResponse<Crop>(response);
};

export const getAllCrops = async (): Promise<Crop[]> => {
  const response = await fetch(buildUrl(API_ENDPOINTS.ALL_CROPS), {
    method: 'GET'
  });
  const data = await handleResponse<Crop[]>(response);
  updateGlobalStore(data);
  return data;
};

export const createCropWithImage = async (farmerId: number, cropData: CreateCropDTO, file: File): Promise<Crop> => {
  const formData = createFormDataWithCropAndFile(cropData, file);
  const response = await fetch(buildUrl(API_ENDPOINTS.CREATE_CROP(farmerId)), {
    method: 'POST',
    body: formData
  });
  return handleResponse<Crop>(response);
};

export const getCropsByFarmerId = async (farmerId: number): Promise<Crop[]> => {
  const response = await fetch(buildUrl(API_ENDPOINTS.FARMER_CROPS(farmerId)), {
    method: 'GET'
  });
  const data = await handleResponse<Crop[]>(response);
  updateGlobalStore(data);
  return data;
};
