// Account-related types for patient endpoints

export interface Appointment {
  id: number;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // HH:mm
  start_time?: string;
  end_time?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  doctor_name?: string;
  doctor?: {
    id: number;
    name: string;
    name_ar?: string;
    specialization?: string;
    photo?: string;
  };
  department_name?: string;
  department?: {
    id: number;
    name: string;
    name_ar?: string;
  };
  price?: number;
  reason_for_visit?: string;
  notes?: string;
  can_cancel?: boolean;
}

export interface InvoiceItem {
  id: number;
  description?: string;
  description_ar?: string;
  quantity: number;
  price: number;
  total: number;
  service_name?: string;
  offer_name?: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  payment_status: 'unpaid' | 'paid' | 'partially_paid' | 'refunded' | 'pending';
  total_amount: number;
  paid_amount?: number;
  remaining_amount?: number;
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  issue_date: string;
  due_date?: string;
  items: InvoiceItem[];
  patient?: {
    id: number;
    name: string;
    phone?: string;
  };
  can_pay?: boolean;
}

export interface InvoicePaymentInfo {
  invoice: Invoice;
  payment_methods?: string[]; // ['myfatoorah', 'tabby', 'tamara']
  can_pay: boolean;
}

export interface InvoicePaymentResponse {
  redirect_url: string;
  payment_id?: number;
  invoice_id: number;
}

export interface PointsWallet {
  available_balance: number;
  pending_balance?: number;
  lifetime_points?: number;
}

export interface PointsTier {
  name: string;
  name_ar?: string;
  current_points: number;
  points_to_next_tier?: number;
  benefits?: string[];
}

export interface PointsTransaction {
  id: number;
  type: 'earn' | 'redeem' | 'expire';
  points: number;
  description?: string;
  description_ar?: string;
  created_at: string;
  invoice_id?: number;
  order_id?: number;
}

export interface PointsStats {
  total_earned?: number;
  total_redeemed?: number;
  total_expired?: number;
}

export interface PointsDashboard {
  wallet: PointsWallet;
  tier?: PointsTier;
  stats?: PointsStats;
  transactions: PointsTransaction[];
  patient?: {
    id: number;
    name: string;
    phone?: string;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  attachment?: File | Blob | any; // File object for multipart
}
