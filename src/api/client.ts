import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore } from '@/store/languageStore';
import { useConfigStore } from '@/store/configStore';
import { ApiError, ApiResponse } from './types';
import { normalizeError, AppError } from '@/utils/errors';

// Get API base URL from environment
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 
  process.env.EXPO_PUBLIC_API_BASE_URL || 
  'http://localhost:8000/api/v1';

// Create axios instance with dynamic baseURL
const createApiClient = (): AxiosInstance => {
  return axios.create({
    baseURL: useConfigStore.getState().apiBaseUrl || API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
};

const apiClient = createApiClient();

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add language header
    const language = useLanguageStore.getState().language;
    config.headers['Accept-Language'] = language;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Normalize error
    const appError: AppError = normalizeError(error);

    // Handle 401 Unauthorized - logout user and clear token
    if (appError.status === 401) {
      useAuthStore.getState().clearAuth();
    }

    return Promise.reject(appError);
  }
);

export default apiClient;

// Helper function to extract data from API response
export const extractData = <T>(response: ApiResponse<T>): T => {
  return response.data;
};
