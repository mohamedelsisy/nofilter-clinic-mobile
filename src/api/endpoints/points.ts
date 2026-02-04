import apiClient from '../client';
import { ApiResponse } from '../types';
import { PointsDashboard } from '../types/account';

/**
 * Get loyalty points dashboard
 */
export const getPoints = async (): Promise<PointsDashboard> => {
  const response = await apiClient.get<ApiResponse<PointsDashboard>>('/site/points');
  return response.data.data;
};

/**
 * Download loyalty points card PDF
 * Returns arraybuffer for file download
 */
export const downloadPointsCard = async (): Promise<ArrayBuffer> => {
  const response = await apiClient.get('/site/points/card', {
    responseType: 'arraybuffer',
  });
  return response.data;
};

// React Query keys
export const pointsKeys = {
  all: ['points'] as const,
  dashboard: () => [...pointsKeys.all, 'dashboard'] as const,
};
