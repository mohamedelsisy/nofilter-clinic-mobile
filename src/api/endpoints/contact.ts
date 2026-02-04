import apiClient from '../client';
import { ApiResponse } from '../types';
import { ContactFormData } from '../types/account';

/**
 * Submit contact form with optional attachment
 * Uses multipart/form-data
 */
export const submitContactForm = async (data: ContactFormData): Promise<void> => {
  const formData = new FormData();
  
  formData.append('name', data.name);
  formData.append('email', data.email);
  if (data.phone) formData.append('phone', data.phone);
  formData.append('subject', data.subject);
  formData.append('message', data.message);
  
  if (data.attachment) {
    formData.append('attachment', data.attachment);
  }

  const response = await apiClient.post<ApiResponse<any>>('/site/contact', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data;
};
