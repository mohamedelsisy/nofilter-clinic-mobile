import apiClient from '../client';
import { ApiResponse } from '../types';
import {
  CartSummary,
  CartCountResponse,
  AddToCartRequest,
  UpdateCartItemRequest,
  ApplyCouponRequest,
  CheckoutSummary,
  CheckoutProcessRequest,
  CheckoutProcessResponse,
} from '../types/cart';

/**
 * Get cart contents
 */
export const getCart = async (couponCode?: string): Promise<CartSummary> => {
  const params = couponCode ? { coupon_code: couponCode } : {};
  const response = await apiClient.get<ApiResponse<CartSummary>>('/site/cart', { params });
  return response.data.data;
};

/**
 * Get cart item count
 */
export const getCartCount = async (): Promise<number> => {
  const response = await apiClient.get<ApiResponse<CartCountResponse>>('/site/cart/count');
  return response.data.data.count;
};

/**
 * Add item to cart
 */
export const addToCart = async (data: AddToCartRequest): Promise<CartSummary> => {
  const response = await apiClient.post<ApiResponse<CartSummary>>('/site/cart', data);
  return response.data.data;
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (
  offerId: number,
  data: UpdateCartItemRequest
): Promise<CartSummary> => {
  const response = await apiClient.put<ApiResponse<CartSummary>>(`/site/cart/${offerId}`, data);
  return response.data.data;
};

/**
 * Remove item from cart
 */
export const removeCartItem = async (offerId: number): Promise<CartSummary> => {
  const response = await apiClient.delete<ApiResponse<CartSummary>>(`/site/cart/${offerId}`);
  return response.data.data;
};

/**
 * Clear entire cart
 */
export const clearCart = async (): Promise<void> => {
  await apiClient.delete('/site/cart');
};

/**
 * Apply coupon to cart
 */
export const applyCoupon = async (data: ApplyCouponRequest): Promise<CartSummary> => {
  const response = await apiClient.post<ApiResponse<CartSummary>>('/site/cart/coupon', data);
  return response.data.data;
};

/**
 * Remove coupon from cart
 */
export const removeCoupon = async (): Promise<CartSummary> => {
  const response = await apiClient.delete<ApiResponse<CartSummary>>('/site/cart/coupon');
  return response.data.data;
};

/**
 * Get checkout summary
 */
export const getCheckoutSummary = async (couponCode?: string): Promise<CheckoutSummary> => {
  const params = couponCode ? { coupon_code: couponCode } : {};
  const response = await apiClient.get<ApiResponse<CheckoutSummary>>('/site/checkout/summary', {
    params,
  });
  return response.data.data;
};

/**
 * Process checkout and get payment redirect URL
 */
export const processCheckout = async (
  data: CheckoutProcessRequest
): Promise<CheckoutProcessResponse> => {
  const response = await apiClient.post<ApiResponse<CheckoutProcessResponse>>(
    '/site/checkout/process',
    data
  );
  return response.data.data;
};

// React Query keys for cart
export const cartKeys = {
  all: ['cart'] as const,
  cart: (couponCode?: string) => [...cartKeys.all, couponCode] as const,
  count: () => [...cartKeys.all, 'count'] as const,
  checkoutSummary: (couponCode?: string) => ['checkoutSummary', couponCode] as const,
};
