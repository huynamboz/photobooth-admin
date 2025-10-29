import { apiClient } from './apiClient';
import { type Photo } from '../types/session';
import { type PaginatedResponse } from '../types/pagination';

export interface GetPhotosParams {
  page?: number;
  limit?: number;
  search?: string;
  sessionId?: string;
  isProcessed?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdatePhotoRequest {
  caption?: string;
  isProcessed?: boolean;
}

class PhotoService {
  private BASE_URL = '/admin/photobooth/photos';

  async getAllPhotos(params?: GetPhotosParams): Promise<PaginatedResponse<Photo>> {
    return apiClient.get<PaginatedResponse<Photo>>(this.BASE_URL, { params });
  }

  async getPhotoById(id: string): Promise<Photo> {
    return apiClient.get<Photo>(`/photobooth/photos/${id}`);
  }

  async updatePhoto(id: string, photoData: UpdatePhotoRequest): Promise<Photo> {
    return apiClient.put<Photo>(`${this.BASE_URL}/${id}`, photoData);
  }

  async deletePhoto(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${this.BASE_URL}/${id}`);
  }

  async bulkUpdatePhotos(photoIds: string[], updates: UpdatePhotoRequest): Promise<{ message: string }> {
    return apiClient.patch<{ message: string }>(`${this.BASE_URL}/bulk`, {
      photoIds,
      updates
    });
  }

  async bulkDeletePhotos(photoIds: string[]): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${this.BASE_URL}/bulk`, {
      data: { photoIds }
    });
  }
}

export const photoService = new PhotoService();
