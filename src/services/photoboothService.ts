import { apiClient } from './apiClient';
import { 
  type Photobooth, 
  type CreatePhotoboothRequest, 
  type UpdatePhotoboothRequest, 
  type GetPhotoboothsParams 
} from '../types/photobooth';
import { type PaginatedResponse } from '../types/pagination';

class PhotoboothService {
  private BASE_URL = '/admin/photobooth/photobooths';

  async getAllPhotobooths(params?: GetPhotoboothsParams): Promise<PaginatedResponse<Photobooth>> {
    return apiClient.get<PaginatedResponse<Photobooth>>(this.BASE_URL, { params });
  }

  async getPhotoboothById(id: string): Promise<Photobooth> {
    return apiClient.get<Photobooth>(`${this.BASE_URL}/${id}`);
  }

  async createPhotobooth(photoboothData: CreatePhotoboothRequest): Promise<Photobooth> {
    return apiClient.post<Photobooth>(this.BASE_URL, photoboothData);
  }

  async updatePhotobooth(id: string, photoboothData: UpdatePhotoboothRequest): Promise<Photobooth> {
    return apiClient.put<Photobooth>(`${this.BASE_URL}/${id}`, photoboothData);
  }

  async updatePhotoboothStatus(id: string, status: string): Promise<Photobooth> {
    return apiClient.put<Photobooth>(`${this.BASE_URL}/${id}/status`, { status });
  }

  async deletePhotobooth(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${this.BASE_URL}/${id}`);
  }
}

export const photoboothService = new PhotoboothService();
