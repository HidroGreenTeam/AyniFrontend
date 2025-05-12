import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");

        window.location.href = "/login";
      }
    }

    if (error.response) {
      console.error(
        "Error de respuesta:",
        error.response.status,
        error.response.data,
      );
    } else if (error.request) {
      console.error("Error de petición:", error.request);
    } else {
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  },
);

export const api = {
  get: <T>(url: string, config = {}) => instance.get<T>(url, config),

  post: <T>(url: string, data = {}, config = {}) =>
    instance.post<T>(url, data, config),

  put: <T>(url: string, data = {}, config = {}) =>
    instance.put<T>(url, data, config),

  patch: <T>(url: string, data = {}, config = {}) =>
    instance.patch<T>(url, data, config),

  delete: <T>(url: string, config = {}) => instance.delete<T>(url, config),
};

export default instance;
