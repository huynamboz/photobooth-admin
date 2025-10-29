export interface SystemStats {
  photobooths: {
    total: number;
    available: number;
    busy: number;
    maintenance: number;
    offline: number;
  };
  sessions: {
    total: number;
    pending: number;
    active: number;
    completed: number;
    cancelled: number;
    expired: number;
  };
  photos: {
    total: number;
    processed: number;
    unprocessed: number;
    bySession: Record<string, number>;
  };
}

export interface RealtimeStats {
  activeSessions: number;
  totalPhotosToday: number;
  systemUptime: number;
  lastUpdated: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  time: string;
  value: number;
  label?: string;
}
