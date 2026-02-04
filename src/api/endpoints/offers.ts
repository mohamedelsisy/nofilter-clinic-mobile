import apiClient from '../client';
import { ApiResponse } from '../types';
import { OfferListItem, OfferDetails } from '../types/offers';

/**
 * Get offers list (paginated)
 * Default: 12 per page
 */
export const getOffers = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
}): Promise<ApiResponse<OfferListItem[]>> => {
  const response = await apiClient.get<ApiResponse<OfferListItem[]>>('/site/offers', {
    params: {
      page: params?.page || 1,
      per_page: params?.per_page || 12,
      search: params?.search,
    },
  });
  return response.data;
};

/**
 * Get offer details by ID (includes related offers)
 */
export const getOfferById = async (id: number): Promise<OfferDetails> => {
  const response = await apiClient.get<ApiResponse<OfferDetails>>(`/site/offers/${id}`);
  return response.data.data;
};

// React Query keys for offers
export const offersKeys = {
  all: ['offers'] as const,
  lists: () => [...offersKeys.all, 'list'] as const,
  list: (page: number, filters?: any) => [...offersKeys.lists(), page, filters] as const,
  details: () => [...offersKeys.all, 'detail'] as const,
  detail: (id: number) => [...offersKeys.details(), id] as const,
};
