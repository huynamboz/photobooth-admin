export type PhotoboothStatus = 'available' | 'busy' | 'maintenance' | 'offline';

export interface Photobooth {
  id: string;
  name: string;
  description?: string;
  status: PhotoboothStatus;
  location?: string;
  isActive: boolean;
  currentSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePhotoboothRequest {
  name: string;
  description?: string;
  location?: string;
  status?: PhotoboothStatus;
}

export interface UpdatePhotoboothRequest {
  name?: string;
  description?: string;
  location?: string;
  status?: PhotoboothStatus;
}

export interface PhotoboothFilters {
  status?: PhotoboothStatus;
  location?: string;
  search?: string;
}

export interface GetPhotoboothsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PhotoboothStatus;
  location?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
