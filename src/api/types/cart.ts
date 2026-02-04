// Cart and Checkout types for the Site API

export interface CartItem {
  id: number;
  offer_id: number;
  quantity: number;
  price: number;
  total: number;
  offer: {
    id: number;
    title: string;
    title_ar: string;
    title_en: string;
    photo?: string;
    image?: string;
    new_price: number;
    old_price?: number;
  };
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  coupon?: {
    code: string;
    discount_amount: number;
    discount_type: string; // 'fixed' | 'percentage'
  };
  items_count: number;
}

export interface CartCountResponse {
  count: number;
}

export interface CheckoutSummary {
  items: CartItem[];
  patient?: {
    id: number;
    name: string;
    email?: string;
    phone: string;
  };
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  coupon?: {
    code: string;
    discount_amount: number;
    discount_type: string;
  };
}

export interface CheckoutProcessResponse {
  redirect_url: string;
  order_ids: number[];
  payment_method: string;
  total: number;
}

export interface AddToCartRequest {
  offer_id: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface ApplyCouponRequest {
  code: string;
}

export interface CheckoutProcessRequest {
  payment_method: 'myfatoorah' | 'tabby' | 'tamara';
  coupon_code?: string;
}
