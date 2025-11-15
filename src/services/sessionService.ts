import { apiClient } from './apiClient';
import { 
  type Session, 
  type CreateSessionRequest, 
  type UpdateSessionRequest, 
  type GetSessionsParams,
  type DeleteSessionResponse,
  type Photo
} from '../types/session';
import { type PaginatedResponse } from '../types/pagination';

class SessionService {
  private BASE_URL = '/admin/photobooth/sessions';

  async getAllSessions(params?: GetSessionsParams): Promise<PaginatedResponse<Session>> {
    return apiClient.get<PaginatedResponse<Session>>(this.BASE_URL, { params });
  }

  async getSessionById(id: string): Promise<Session> {
    return apiClient.get<Session>(`${this.BASE_URL}/${id}`);
  }

  async createSession(sessionData: CreateSessionRequest): Promise<Session> {
    return apiClient.post<Session>('/photobooth/sessions', sessionData);
  }

  async updateSession(id: string, sessionData: UpdateSessionRequest): Promise<Session> {
    return apiClient.put<Session>(`${this.BASE_URL}/${id}`, sessionData);
  }

  async cancelSession(id: string): Promise<Session> {
    return apiClient.put<Session>(`/photobooth/sessions/${id}/cancel`);
  }

  // Clear session from photobooth (fix stuck sessions)
  async clearSessionFromPhotobooth(photoboothId: string): Promise<Session> {
    return apiClient.put<Session>(`/admin/photobooth/photobooths/${photoboothId}/clear-session`);
  }

  async deleteSession(id: string): Promise<DeleteSessionResponse> {
    return apiClient.delete<DeleteSessionResponse>(`${this.BASE_URL}/${id}`);
  }

  // Public session operations
  async startSession(id: string): Promise<Session> {
    return apiClient.put<Session>(`/photobooth/sessions/${id}/start`);
  }

  async completeSession(id: string): Promise<Session> {
    return apiClient.put<Session>(`/photobooth/sessions/${id}/complete`);
  }

  async uploadImage(file: File): Promise<{ imageUrl: string; publicId: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post<{ imageUrl: string; publicId: string }>('/photobooth/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async addPhotoToSession(sessionId: string, imageUrl: string, publicId: string, caption?: string): Promise<Photo> {
    return apiClient.post<Photo>(`/photobooth/sessions/${sessionId}/photos`, {
      imageUrl,
      publicId,
      caption,
    });
  }

  async uploadPhoto(sessionId: string, file: File, caption?: string): Promise<Photo> {
    // Step 1: Upload image file
    const { imageUrl, publicId } = await this.uploadImage(file);
    
    // Step 2: Add photo to session
    return this.addPhotoToSession(sessionId, imageUrl, publicId, caption);
  }

  // Admin operation: Start capture for a session
  async startCapture(sessionId: string): Promise<void> {
    return apiClient.post<void>(`${this.BASE_URL}/${sessionId}/start-capture`);
  }
}

export const sessionService = new SessionService();
