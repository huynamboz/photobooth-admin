import { apiClient } from './apiClient';
import { type Photo, type GetPhotosParams, type PaginatedPhotoResponse } from '@/types/photo';

class PhotoService {
  private BASE_URL = '/admin/photobooth';

  async getPhotos(params: GetPhotosParams = {}): Promise<PaginatedPhotoResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sessionId) queryParams.append('sessionId', params.sessionId);
    if (params.isProcessed !== undefined) queryParams.append('isProcessed', params.isProcessed.toString());
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);

    const queryString = queryParams.toString();
    const url = queryString ? `${this.BASE_URL}/photos?${queryString}` : `${this.BASE_URL}/photos`;
    
    return apiClient.get<PaginatedPhotoResponse>(url);
  }

  async getPhotoById(id: string): Promise<Photo> {
    return apiClient.get<Photo>(`${this.BASE_URL}/photos/${id}`);
  }

  async getSessionPhotos(sessionId: string): Promise<Photo[]> {
    return apiClient.get<Photo[]>(`/photobooth/sessions/${sessionId}/photos`);
  }

  async deletePhoto(id: string): Promise<void> {
    return apiClient.delete(`${this.BASE_URL}/photos/${id}`);
  }

  async updatePhotoCaption(id: string, caption: string): Promise<Photo> {
    return apiClient.put<Photo>(`${this.BASE_URL}/photos/${id}`, { caption });
  }

  async markPhotoAsProcessed(id: string): Promise<Photo> {
    return apiClient.put<Photo>(`${this.BASE_URL}/photos/${id}/process`);
  }

  async downloadPhoto(id: string): Promise<Blob> {
    return apiClient.get(`${this.BASE_URL}/photos/${id}/download`, {
      responseType: 'blob'
    });
  }
}

export const photoService = new PhotoService();