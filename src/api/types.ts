// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
  links?: {
    first?: string;
    last?: string;
    prev?: string | null;
    next?: string | null;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Auth Types
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  points?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

// Settings Types
export interface AppSettings {
  clinic_name: string;
  clinic_name_ar: string;
  logo: string;
  phone: string;
  email: string;
  address: string;
  address_ar: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  whatsapp?: string;
  primary_color: string;
  working_hours?: string;
  working_hours_ar?: string;
}

// Homepage Types
export interface Slider {
  id: number;
  title: string;
  title_ar: string;
  image: string;
  link?: string;
  order: number;
}

export interface Service {
  id: number;
  slug?: string;
  name?: string; // For compatibility
  name_en?: string;
  name_ar: string;
  description?: string;
  description_en?: string;
  description_ar?: string;
  photo?: string; // Main image field from API
  image?: string; // For compatibility
  icon?: string;
  price?: number;
  duration?: number;
  category_id?: number;
  is_active?: boolean;
  category?: {
    id: number;
    name: string;
    name_ar: string;
  };
  is_featured?: boolean;
  sub_services?: SubService[];
}

export interface Doctor {
  id: number;
  full_name: string;
  name?: string; // For compatibility
  name_ar?: string; // For compatibility
  title?: string; // For compatibility
  title_ar?: string; // For compatibility
  bio_en?: string;
  bio_ar?: string;
  bio?: string; // For compatibility
  education_en?: string;
  education_ar?: string;
  experience_en?: string;
  experience_ar?: string;
  photo?: string; // Main image field from API
  image?: string; // For compatibility
  specialization?: string;
  specialization_ar?: string;
  department_id?: number;
  user_id?: number;
}

export interface Offer {
  id: number;
  title: string;
  title_ar: string;
  description?: string;
  description_ar?: string;
  image?: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  valid_from?: string;
  valid_to?: string;
}

export interface SubService {
  id: number;
  service_id: number;
  name: string;
  name_ar: string;
  description?: string;
  description_ar?: string;
  price?: number;
  duration?: number;
}

export interface Post {
  id: number;
  slug?: string;
  title: string;
  title_ar: string;
  excerpt?: string;
  excerpt_ar?: string;
  content?: string;
  content_ar?: string;
  image?: string;
  published_at?: string;
  category?: string;
}

export interface HomepageData {
  sliders: Slider[];
  services: Service[]; // Backend returns 'services' not 'featured_services'
  doctors: Doctor[];
  offers?: Offer[]; // Optional, may not be in homepage
  posts: Post[];
  special_offers?: any[]; // Optional special offers
}

// Appointment Types
export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  service_id?: number;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  doctor?: Doctor;
  service?: Service;
}

// Invoice Types
export interface Invoice {
  id: number;
  invoice_number: string;
  patient_id: number;
  total: number;
  tax: number;
  discount: number;
  net_total: number;
  status: 'draft' | 'paid' | 'cancelled';
  created_at: string;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}
