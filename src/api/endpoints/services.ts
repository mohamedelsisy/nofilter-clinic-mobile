import apiClient from '../client';
import { ApiResponse } from '../types';
import { ServiceListItem, ServiceDetails } from '../types/services';

/**
 * Get paginated list of services
 * @param page - Page number (optional)
 * @param search - Search query (optional)
 * @param category_id - Category ID filter (optional)
 * @returns ApiResponse with services array and pagination meta
 */
export const getServices = async (params?: {
  page?: number;
  search?: string;
  category_id?: number;
}): Promise<ApiResponse<ServiceListItem[]>> => {
  const response = await apiClient.get<ApiResponse<ServiceListItem[]>>('/site/services', {
    params,
  });
  return response.data;
};

/**
 * Get service details by slug
 * @param slug - Service slug or ID
 * @returns Service details
 */
export const getServiceBySlug = async (slug: string): Promise<ServiceDetails> => {
  const response = await apiClient.get<ApiResponse<ServiceDetails>>(`/site/services/${slug}`);
  return response.data.data;
};

// React Query keys for services
export const servicesKeys = {
  all: ['services'] as const,
  lists: () => [...servicesKeys.all, 'list'] as const,
  list: (filters: { page?: number; search?: string; category_id?: number }) =>
    [...servicesKeys.lists(), filters] as const,
  details: () => [...servicesKeys.all, 'detail'] as const,
  detail: (slug: string) => [...servicesKeys.details(), slug] as const,
};
