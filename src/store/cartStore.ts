import { create } from 'zustand';

type PaymentMethod = 'myfatoorah' | 'tabby' | 'tamara';

interface CartState {
  // UI state for coupon
  pendingCouponCode: string;
  
  // Selected payment method
  selectedPaymentMethod: PaymentMethod;
  
  // Actions
  setPendingCouponCode: (code: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  reset: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  pendingCouponCode: '',
  selectedPaymentMethod: 'myfatoorah',

  setPendingCouponCode: (code) => {
    set({ pendingCouponCode: code });
  },

  setPaymentMethod: (method) => {
    set({ selectedPaymentMethod: method });
  },

  reset: () => {
    set({
      pendingCouponCode: '',
      selectedPaymentMethod: 'myfatoorah',
    });
  },
}));
