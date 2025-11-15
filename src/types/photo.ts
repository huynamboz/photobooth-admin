export interface Photo {
  id: string;
  sessionId: string;
  session?: {
    id: string;
    status: string;
    userId?: string;
    photoboothId: string;
  };
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

export interface GetPhotosParams {
  page?: number;
  limit?: number;
  sessionId?: string;
  isProcessed?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedPhotoResponse {
  data: Photo[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
