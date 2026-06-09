import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to extract clean error messages from Django response
export const getErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : "An unexpected error occurred";
  }

  const data = error.response?.data;
  if (!data) {
    return error.message || "Network error occurred";
  }

  if (typeof data === "string") {
    return data;
  }

  if (data.detail) {
    return data.detail;
  }

  if (Array.isArray(data.non_field_errors)) {
    return data.non_field_errors.join(" ");
  }

  if (typeof data === "object") {
    const messages = Object.entries(data)
      .map(([field, value]) => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        const valStr = Array.isArray(value) ? value.join(" ") : String(value);
        return `${fieldName}: ${valStr}`;
      });
    if (messages.length > 0) {
      return messages.join("\n");
    }
  }

  return "An error occurred on the server";
};

export const get = async <T>(url: string, config = {}): Promise<T> => {
  try {
    const response = await api.get<T>(url, config);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const post = async <T>(url: string, data = {}, config = {}): Promise<T> => {
  try {
    const response = await api.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const put = async <T>(url: string, data = {}, config = {}): Promise<T> => {
  try {
    const response = await api.put<T>(url, data, config);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const del = async <T>(url: string, config = {}): Promise<T> => {
  try {
    const response = await api.delete<T>(url, config);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

const apiWrapper = {
  get,
  post,
  put,
  del,
  delete: del,
};

export default apiWrapper;
export { api };
