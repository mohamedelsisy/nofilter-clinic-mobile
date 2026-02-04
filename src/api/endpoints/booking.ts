import apiClient from '../client';
import { ApiResponse } from '../types';
import {
  Department,
  BookingDoctor,
  SlotsResponse,
  BookingRequest,
  BookingResponse,
} from '../types/booking';

/**
 * Get available departments for booking
 */
export const getDepartments = async (): Promise<Department[]> => {
  const response = await apiClient.get<ApiResponse<Department[]>>('/site/booking/departments');
  return response.data.data;
};

/**
 * Get doctors by department
 */
export const getDoctorsByDepartment = async (departmentId: number): Promise<BookingDoctor[]> => {
  const response = await apiClient.get<ApiResponse<BookingDoctor[]>>('/site/booking/doctors', {
    params: { department_id: departmentId },
  });
  return response.data.data;
};

/**
 * Get available time slots for a doctor on a specific date
 */
export const getTimeSlots = async (params: {
  doctor_id: number;
  date: string; // YYYY-MM-DD
  duration?: number;
}): Promise<SlotsResponse> => {
  const response = await apiClient.get<ApiResponse<SlotsResponse>>('/site/booking/slots', {
    params: {
      doctor_id: params.doctor_id,
      date: params.date,
      duration: params.duration || 30,
    },
  });
  return response.data.data;
};

/**
 * Submit booking
 */
export const submitBooking = async (data: BookingRequest): Promise<BookingResponse> => {
  const response = await apiClient.post<ApiResponse<BookingResponse>>('/site/booking', data);
  return response.data.data;
};

// React Query keys for booking
export const bookingKeys = {
  all: ['booking'] as const,
  departments: () => [...bookingKeys.all, 'departments'] as const,
  doctors: (departmentId: number) => [...bookingKeys.all, 'doctors', departmentId] as const,
  slots: (doctorId: number, date: string) => [...bookingKeys.all, 'slots', doctorId, date] as const,
};
