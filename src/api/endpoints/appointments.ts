import apiClient from '../client';
import { ApiResponse } from '../types';
import { Appointment } from '../types/account';

/**
 * Get patient's appointments (paginated)
 */
export const getMyAppointments = async (params?: {
  page?: number;
}): Promise<ApiResponse<Appointment[]>> => {
  const response = await apiClient.get<ApiResponse<Appointment[]>>('/site/my-appointments', {
    params: {
      page: params?.page || 1,
    },
  });
  return response.data;
};

/**
 * Cancel an appointment
 */
export const cancelAppointment = async (id: number): Promise<void> => {
  const response = await apiClient.post<ApiResponse<any>>(`/site/my-appointments/${id}/cancel`);
  return response.data.data;
};

// React Query keys
export const appointmentsKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentsKeys.all, 'list'] as const,
  list: (page: number) => [...appointmentsKeys.lists(), page] as const,
};
