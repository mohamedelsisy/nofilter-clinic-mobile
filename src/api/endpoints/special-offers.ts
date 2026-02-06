import apiClient from '../client';
import type { ApiResponse } from '../types';

export interface SpecialOffer {
  id: number;
  title?: string;
  title_ar: string;
  title_en: string;
  description_ar?: string;
  description_en?: string;
  photo?: string;
  image?: string;
  new_price: number;
  old_price?: number;
  discount_percentage?: number;
  is_active?: boolean;
  valid_from?: string;
  valid_to?: string;
}

export const specialOffersApi = {
  getSpecialOffers: async (params?: { page?: number }) => {
    const response = await apiClient.get<ApiResponse<SpecialOffer[]>>(
      '/public/special-offers',
      { params }
    );
    return response.data;
  },

  getSpecialOfferById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<SpecialOffer>>(
      `/public/special-offers/${id}`
    );
    return response.data.data;
  },
};

export const specialOffersKeys = {
  all: ['special-offers'] as const,
  lists: () => [...specialOffersKeys.all, 'list'] as const,
  list: (page?: number) => [...specialOffersKeys.lists(), { page }] as const,
  details: () => [...specialOffersKeys.all, 'detail'] as const,
  detail: (id: number) => [...specialOffersKeys.details(), id] as const,
};
