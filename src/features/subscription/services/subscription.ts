import { PlanDetails, UserSubscription, PaymentDetails } from '../types/subscription';

interface ErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
}

const API_ENDPOINTS = {
  PLANS: '/subscription/plans',
  USER_SUBSCRIPTION: (userId: number) => `/subscription/users/${userId}`,
  CREATE_PAYMENT: '/subscription/payment/paypal/create',
  VERIFY_PAYMENT: '/subscription/payment/paypal/verify',
  CANCEL_SUBSCRIPTION: (userId: number) => `/subscription/users/${userId}/cancel`,
  CHECK_DIAGNOSTICS: (userId: number) => `/subscription/users/${userId}/diagnostics/check`,
  INCREMENT_DIAGNOSTICS: (userId: number) => `/subscription/users/${userId}/diagnostics/increment`
} as const;

const JSON_CONTENT_TYPE = 'application/json';

const buildUrl = (endpoint: string): string => {
  const baseURL = "https://suscriptions-service.thankfulwater-e8adfc7e.eastus.azurecontainerapps.io/api/v1"
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

const get = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(buildUrl(endpoint), { method: 'GET' });
  return handleResponse<T>(response);
};

const postWithJson = async <T>(endpoint: string, data: unknown): Promise<T> => {
  const response = await fetch(buildUrl(endpoint), {
    method: 'POST',
    headers: { 'Content-Type': JSON_CONTENT_TYPE },
    body: JSON.stringify(data)
  });
  return handleResponse<T>(response);
};

const post = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(buildUrl(endpoint), { method: 'POST' });
  return handleResponse<T>(response);
};

export const getSubscriptionPlans = async (): Promise<PlanDetails[]> => {
  return get<PlanDetails[]>(API_ENDPOINTS.PLANS);
};

export const getUserSubscription = async (userId: number): Promise<UserSubscription> => {
  return get<UserSubscription>(API_ENDPOINTS.USER_SUBSCRIPTION(userId));
};

export const initiatePayPalPayment = async (userId: number, details: PaymentDetails): Promise<string> => {
  const response = await postWithJson<{ paypalUrl: string }>(
    API_ENDPOINTS.CREATE_PAYMENT,
    { userId, ...details }
  );
  return response.paypalUrl;
};

export const verifyPayPalPayment = async (userId: number, paymentId: string): Promise<UserSubscription> => {
  return postWithJson<UserSubscription>(
    API_ENDPOINTS.VERIFY_PAYMENT,
    { userId, paymentId }
  );
};

export const cancelSubscription = async (userId: number): Promise<void> => {
  return post<void>(API_ENDPOINTS.CANCEL_SUBSCRIPTION(userId));
};

export const checkDiagnosticsLimit = async (userId: number): Promise<boolean> => {
  const response = await get<{ canPerformDiagnostic: boolean }>(
    API_ENDPOINTS.CHECK_DIAGNOSTICS(userId)
  );
  return response.canPerformDiagnostic;
};

export const incrementDiagnosticsCount = async (userId: number): Promise<void> => {
  return post<void>(API_ENDPOINTS.INCREMENT_DIAGNOSTICS(userId));
}; 