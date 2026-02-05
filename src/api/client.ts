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
  const baseURL = useConfigStore.getState().apiBaseUrl || API_BASE_URL;
  console.log('🔧 Creating API client with baseURL:', baseURL);
  
  return axios.create({
    baseURL,
    timeout: 60000, // Increased to 60 seconds
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    // Additional axios config for better compatibility
    validateStatus: (status) => status >= 200 && status < 500,
  });
};

const apiClient = createApiClient();

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log the request
    console.log('🌐 API Request:', config.method?.toUpperCase(), config.url);
    console.log('📍 Base URL:', config.baseURL);

    // Add auth token if available
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added');
    }

    // Add language header
    const language = useLanguageStore.getState().language;
    config.headers['Accept-Language'] = language;
    console.log('🌍 Language:', language);

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Log the error with more details
    console.error('❌ API Error:', error.config?.method?.toUpperCase(), error.config?.url);
    console.error('Error status:', error.response?.status);
    console.error('Error message:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout (30s)');
    }
    if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network error - cannot reach server');
    }

    // Normalize error
    const appError: AppError = normalizeError(error);

    // Handle 401 Unauthorized - logout user and clear token
    if (appError.status === 401) {
      console.log('🔒 Unauthorized - clearing auth');
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
