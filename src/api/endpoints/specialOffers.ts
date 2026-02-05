import apiClient from '../client';
import { ApiResponse } from '../types';

/**
 * Special Offers API Endpoints
 * Route: /api/v1/public/special-offers
 * 
 * Special offers are time-limited promotions or exclusive deals
 * Rate limited: 60 requests per minute
 */

export interface SpecialOffer {
  id: number;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  image: string;
  original_price: number;
  discount_price: number;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  stock_quantity?: number;
  remaining_quantity?: number;
  max_per_customer?: number;
  terms_conditions?: string;
  terms_conditions_ar?: string;
  created_at: string;
  updated_at: string;
}

export interface SpecialOfferListItem {
  id: number;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  image: string;
  original_price: number;
  discount_price: number;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  remaining_quantity?: number;
  time_remaining?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  };
}

export interface SpecialOfferDetails extends SpecialOffer {
  related_offers?: SpecialOfferListItem[];
  view_count?: number;
  purchase_count?: number;
}

/**
 * Get special offers list (paginated, throttled: 60/min)
 * Includes active time-limited promotions
 */
export const getSpecialOffers = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  active_only?: boolean;
}): Promise<ApiResponse<SpecialOfferListItem[]>> => {
  const response = await apiClient.get<ApiResponse<SpecialOfferListItem[]>>(
    '/public/special-offers',
    {
      params: {
        page: params?.page || 1,
        per_page: params?.per_page || 12,
        search: params?.search,
        active_only: params?.active_only ?? true,
      },
    }
  );
  return response.data;
};

/**
 * Get special offer details by ID
 * Includes terms & conditions and related offers
 */
export const getSpecialOfferById = async (id: number): Promise<SpecialOfferDetails> => {
  const response = await apiClient.get<ApiResponse<SpecialOfferDetails>>(
    `/public/special-offers/${id}`
  );
  return response.data.data;
};

// React Query keys for special offers
export const specialOffersKeys = {
  all: ['specialOffers'] as const,
  lists: () => [...specialOffersKeys.all, 'list'] as const,
  list: (page: number, filters?: any) => [...specialOffersKeys.lists(), page, filters] as const,
  details: () => [...specialOffersKeys.all, 'detail'] as const,
  detail: (id: number) => [...specialOffersKeys.details(), id] as const,
};
