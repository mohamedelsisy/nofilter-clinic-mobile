// Booking types for the Site API

export interface Department {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
}

export interface BookingDoctor {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  title?: string;
  title_ar?: string;
  title_en?: string;
  specialization?: string;
  specialization_ar?: string;
  specialization_en?: string;
  bio?: string;
  bio_ar?: string;
  bio_en?: string;
  consultation_fee?: number;
  photo?: string;
  image?: string;
  department_id?: number;
}

export interface TimeSlot {
  time: string; // "09:30"
  display?: string; // "09:30 AM"
  available: boolean;
}

export interface SlotsResponse {
  working_hours?: string;
  working: boolean;
  slots: TimeSlot[];
}

export interface BookingRequest {
  doctor_id: number;
  department_id: number;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // "09:30"
  name: string;
  phone: string;
  national_identity_number: string;
  reason_for_visit?: string;
  service_id?: number;
}

export interface BookingAppointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  department_id: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason_for_visit?: string;
  consultation_fee?: number;
  doctor?: BookingDoctor;
}

export interface BookingPatient {
  id: number;
  name: string;
  phone: string;
  email?: string;
  national_identity_number?: string;
}

export interface BookingResponse {
  appointment: BookingAppointment;
  patient: BookingPatient;
  token?: string;
  token_type?: string;
}
