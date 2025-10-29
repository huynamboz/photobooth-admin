export type SessionStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'expired';

export interface Session {
  id: string;
  status: SessionStatus;
  userId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  photoboothId: string;
  photobooth: {
    id: string;
    name: string;
    location?: string;
  };
  photos: Photo[];
  photoCount: number;
  maxPhotos: number;
  startedAt?: string;
  completedAt?: string;
  expiresAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  sessionId: string;
  imageUrl: string;
  publicId?: string;
  thumbnailUrl?: string;
  order: number;
  caption?: string;
  isProcessed: boolean;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionRequest {
  photoboothId: string;
  maxPhotos?: number;
  notes?: string;
}

export interface UpdateSessionRequest {
  status?: SessionStatus;
  notes?: string;
  maxPhotos?: number;
}

export interface DeleteSessionResponse {
  message: string;
}

export interface SessionFilters {
  status?: SessionStatus;
  photoboothId?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface GetSessionsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: SessionStatus;
  photoboothId?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
