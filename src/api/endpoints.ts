import apiClient, { extractData } from './client';
import { 
  ApiResponse, 
  HomepageData, 
  AppSettings,
  LoginRequest,
  LoginResponse,
  Service,
  Doctor,
  Offer,
  Post,
  Appointment,
  Invoice,
} from './types';

// Auth Endpoints
export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data)
      .then(res => extractData(res.data)),
  
  logout: () =>
    apiClient.post<ApiResponse<null>>('/auth/logout')
      .then(res => extractData(res.data)),
  
  register: (data: any) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/register', data)
      .then(res => extractData(res.data)),
  
  getProfile: () =>
    apiClient.get<ApiResponse<any>>('/auth/profile')
      .then(res => extractData(res.data)),
};

// Site Endpoints
export const siteApi = {
  getHomepage: () =>
    apiClient.get<ApiResponse<HomepageData>>('/site/homepage')
      .then(res => extractData(res.data)),
  
  getSettings: () =>
    apiClient.get<ApiResponse<AppSettings>>('/site/settings')
      .then(res => extractData(res.data)),
};

// Services Endpoints
export const servicesApi = {
  getServices: (params?: { category_id?: number; page?: number; search?: string }) =>
    apiClient.get<ApiResponse<Service[]>>('/site/services', { params })
      .then(res => res.data), // Return full response for pagination
  
  getService: (slug: string) =>
    apiClient.get<ApiResponse<Service>>(`/site/services/${slug}`)
      .then(res => extractData(res.data)),
};

// Doctors Endpoints
export const doctorsApi = {
  getDoctors: (params?: { department_id?: number; search?: string; page?: number }) =>
    apiClient.get<ApiResponse<Doctor[]>>('/site/doctors', { params })
      .then(res => res.data), // Return full response for pagination
  
  getDoctor: (id: number) =>
    apiClient.get<ApiResponse<Doctor>>(`/site/doctors/${id}`)
      .then(res => extractData(res.data)),
};

// Offers Endpoints
export const offersApi = {
  getOffers: (params?: { page?: number }) =>
    apiClient.get<ApiResponse<Offer[]>>('/site/offers', { params })
      .then(res => res.data), // Return full response for pagination
  
  getOffer: (id: number) =>
    apiClient.get<ApiResponse<Offer>>(`/site/offers/${id}`)
      .then(res => extractData(res.data)),
};

// Blog Endpoints
export const blogApi = {
  getPosts: (params?: { page?: number; category?: string; search?: string }) =>
    apiClient.get<ApiResponse<Post[]>>('/site/blog', { params })
      .then(res => res.data), // Return full response for pagination
  
  getPost: (slug: string) =>
    apiClient.get<ApiResponse<Post>>(`/site/blog/${slug}`)
      .then(res => extractData(res.data)),
  
  searchPosts: (q: string) =>
    apiClient.get<ApiResponse<Post[]>>('/site/blog/search', { params: { q } })
      .then(res => res.data),
};

// Appointments Endpoints
export const appointmentsApi = {
  getMyAppointments: () =>
    apiClient.get<ApiResponse<Appointment[]>>('/site/my-appointments')
      .then(res => extractData(res.data)),
  
  createAppointment: (data: any) =>
    apiClient.post<ApiResponse<Appointment>>('/site/booking', data)
      .then(res => extractData(res.data)),
  
  cancelAppointment: (id: number) =>
    apiClient.post<ApiResponse<Appointment>>(`/site/my-appointments/${id}/cancel`)
      .then(res => extractData(res.data)),
};

// Invoices Endpoints
export const invoicesApi = {
  getInvoice: (id: number) =>
    apiClient.get<ApiResponse<Invoice>>(`/site/invoices/${id}`)
      .then(res => extractData(res.data)),
  
  downloadInvoice: (id: number) =>
    apiClient.get<ApiResponse<{ url: string }>>(`/site/invoices/${id}/download`)
      .then(res => extractData(res.data)),
  
  payInvoice: (id: number) =>
    apiClient.post<ApiResponse<{ redirect_url: string }>>(`/site/invoices/${id}/pay`)
      .then(res => extractData(res.data)),
};

// Cart Endpoints
export const cartApi = {
  getCart: () =>
    apiClient.get<ApiResponse<any>>('/site/cart')
      .then(res => extractData(res.data)),
  
  addToCart: (offerId: number, quantity: number = 1) =>
    apiClient.post<ApiResponse<any>>('/site/cart', { offer_id: offerId, quantity })
      .then(res => extractData(res.data)),
  
  updateCart: (offerId: number, quantity: number) =>
    apiClient.put<ApiResponse<any>>(`/site/cart/${offerId}`, { quantity })
      .then(res => extractData(res.data)),
  
  removeFromCart: (offerId: number) =>
    apiClient.delete<ApiResponse<any>>(`/site/cart/${offerId}`)
      .then(res => extractData(res.data)),
  
  clearCart: () =>
    apiClient.delete<ApiResponse<any>>('/site/cart')
      .then(res => extractData(res.data)),
  
  getCartCount: () =>
    apiClient.get<ApiResponse<{ count: number }>>('/site/cart/count')
      .then(res => extractData(res.data)),
  
  applyCoupon: (code: string) =>
    apiClient.post<ApiResponse<any>>('/site/cart/coupon', { code })
      .then(res => extractData(res.data)),
  
  removeCoupon: () =>
    apiClient.delete<ApiResponse<any>>('/site/cart/coupon')
      .then(res => extractData(res.data)),
};

// Checkout Endpoints
export const checkoutApi = {
  getSummary: () =>
    apiClient.get<ApiResponse<any>>('/site/checkout/summary')
      .then(res => extractData(res.data)),
  
  process: (data: any) =>
    apiClient.post<ApiResponse<{ redirect_url: string }>>('/site/checkout/process', data)
      .then(res => extractData(res.data)),
};

// Points Endpoints
export const pointsApi = {
  getPoints: () =>
    apiClient.get<ApiResponse<any>>('/site/points')
      .then(res => extractData(res.data)),
  
  getPointsCard: () =>
    apiClient.get<ApiResponse<{ url: string }>>('/site/points/card')
      .then(res => extractData(res.data)),
};

// Contact Endpoint
export const contactApi = {
  submit: (data: FormData) =>
    apiClient.post<ApiResponse<any>>('/site/contact', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => extractData(res.data)),
};
