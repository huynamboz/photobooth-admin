import { create } from 'zustand';
import { statsService } from '../services/statsService';
import { type SystemStats, type RealtimeStats, type TimeSeriesData } from '../types/stats';

interface StatsState {
  systemStats: SystemStats | null;
  realtimeStats: RealtimeStats | null;
  sessionsChartData: TimeSeriesData[];
  utilizationData: Array<{ photoboothId: string; name: string; utilization: number }>;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

interface StatsActions {
  // Data fetching
  fetchSystemStats: () => Promise<void>;
  fetchRealtimeStats: () => Promise<void>;
  fetchSessionsChartData: (days?: number) => Promise<void>;
  fetchUtilizationData: () => Promise<void>;
  
  // Cleanup operations
  cleanupExpiredSessions: () => Promise<number>;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

type StatsStore = StatsState & StatsActions;

export const useStatsStore = create<StatsStore>((set) => ({
  // Initial state
  systemStats: null,
  realtimeStats: null,
  sessionsChartData: [],
  utilizationData: [],
  loading: false,
  error: null,
  lastUpdated: null,

  // Actions
  fetchSystemStats: async () => {
    set({ loading: true, error: null });
    try {
      const systemStats = await statsService.getSystemStats();
      set({ 
        systemStats,
        loading: false,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch system stats',
        loading: false 
      });
    }
  },

  fetchRealtimeStats: async () => {
    try {
      const realtimeStats = await statsService.getRealtimeStats();
      set({ 
        realtimeStats,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch realtime stats'
      });
    }
  },

  fetchSessionsChartData: async (days: number = 7) => {
    set({ loading: true, error: null });
    try {
      const chartData = await statsService.getSessionsChartData(days);
      set({ 
        sessionsChartData: chartData,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch chart data',
        loading: false 
      });
    }
  },

  fetchUtilizationData: async () => {
    set({ loading: true, error: null });
    try {
      const utilizationData = await statsService.getPhotoboothUtilization();
      set({ 
        utilizationData,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch utilization data',
        loading: false 
      });
    }
  },

  cleanupExpiredSessions: async () => {
    set({ loading: true, error: null });
    try {
      const result = await statsService.cleanupExpiredSessions();
      set({ 
        loading: false,
        lastUpdated: new Date().toISOString()
      });
      return result.cleanedCount;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to cleanup expired sessions',
        loading: false 
      });
      throw error;
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));
