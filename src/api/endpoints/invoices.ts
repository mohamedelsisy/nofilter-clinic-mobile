import apiClient from '../client';
import { ApiResponse } from '../types';
import { Invoice, InvoicePaymentInfo, InvoicePaymentResponse } from '../types/account';

/**
 * Get invoice by ID
 */
export const getInvoice = async (id: number): Promise<Invoice> => {
  const response = await apiClient.get<ApiResponse<Invoice>>(`/site/invoices/${id}`);
  return response.data.data;
};

/**
 * Download invoice PDF
 * Returns arraybuffer for file download
 */
export const downloadInvoicePdf = async (id: number): Promise<ArrayBuffer> => {
  const response = await apiClient.get(`/site/invoices/${id}/download`, {
    responseType: 'arraybuffer',
  });
  return response.data;
};

/**
 * Get invoice payment info
 */
export const getInvoicePaymentInfo = async (id: number): Promise<InvoicePaymentInfo> => {
  const response = await apiClient.get<ApiResponse<InvoicePaymentInfo>>(`/site/invoices/${id}/pay`);
  return response.data.data;
};

/**
 * Pay invoice
 */
export const payInvoice = async (
  id: number,
  payment_method: string
): Promise<InvoicePaymentResponse> => {
  const response = await apiClient.post<ApiResponse<InvoicePaymentResponse>>(
    `/site/invoices/${id}/pay`,
    { payment_method }
  );
  return response.data.data;
};

// React Query keys
export const invoicesKeys = {
  all: ['invoices'] as const,
  detail: (id: number) => [...invoicesKeys.all, 'detail', id] as const,
  paymentInfo: (id: number) => [...invoicesKeys.all, 'payment', id] as const,
};
