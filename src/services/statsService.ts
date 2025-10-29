import { apiClient } from './apiClient';
import { type SystemStats, type RealtimeStats } from '../types/stats';

class StatsService {
  async getSystemStats(): Promise<SystemStats> {
    return apiClient.get<SystemStats>('/admin/photobooth/stats');
  }

  async getSystemStatus(): Promise<{ status: string; uptime: number }> {
    return apiClient.get<{ status: string; uptime: number }>('/photobooth/status');
  }

  async getRealtimeStats(): Promise<RealtimeStats> {
    return apiClient.get<RealtimeStats>('/admin/photobooth/stats/realtime');
  }

  async cleanupExpiredSessions(): Promise<{ message: string; cleanedCount: number }> {
    return apiClient.post<{ message: string; cleanedCount: number }>('/admin/photobooth/cleanup/expired-sessions');
  }

  async getSessionsChartData(days: number = 7): Promise<Array<{ date: string; count: number }>> {
    return apiClient.get<Array<{ date: string; count: number }>>(`/admin/photobooth/stats/sessions-chart?days=${days}`);
  }

  async getPhotoboothUtilization(): Promise<Array<{ photoboothId: string; name: string; utilization: number }>> {
    return apiClient.get<Array<{ photoboothId: string; name: string; utilization: number }>>('/admin/photobooth/stats/utilization');
  }
}

export const statsService = new StatsService();
