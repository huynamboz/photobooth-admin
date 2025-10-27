import { apiClient } from './apiClient';
import { 
  type Asset, 
  type CreateAssetRequest, 
  type UploadAssetRequest, 
  type AssetResponse, 
  type DeleteAssetResponse,
  type GetAssetsParams
} from '../types/asset';
import { type PaginatedResponse } from '../types/pagination';

class AssetService {
  // Public endpoints (no auth required)
  async getAllAssets(params?: GetAssetsParams): Promise<PaginatedResponse<Asset>> {
    return apiClient.get<PaginatedResponse<Asset>>('/assets', { params });
  }

  async getFrames(params?: GetAssetsParams): Promise<PaginatedResponse<Asset>> {
    return apiClient.get<PaginatedResponse<Asset>>('/assets/frames', { params });
  }

  async getFilters(params?: GetAssetsParams): Promise<PaginatedResponse<Asset>> {
    return apiClient.get<PaginatedResponse<Asset>>('/assets/filters', { params });
  }

  async getStickers(params?: GetAssetsParams): Promise<PaginatedResponse<Asset>> {
    return apiClient.get<PaginatedResponse<Asset>>('/assets/stickers', { params });
  }

  async getAssetById(id: string): Promise<Asset> {
    return apiClient.get<Asset>(`/assets/${id}`);
  }

  // Admin endpoints (auth required)
  async getAllAssetsAdmin(params?: GetAssetsParams): Promise<PaginatedResponse<Asset>> {
    return apiClient.get<PaginatedResponse<Asset>>('/admin/assets', { params });
  }

  async uploadAsset(uploadData: UploadAssetRequest): Promise<AssetResponse> {
    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('type', uploadData.type);

    return apiClient.post<AssetResponse>('/admin/assets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async createAsset(assetData: CreateAssetRequest): Promise<AssetResponse> {
    return apiClient.post<AssetResponse>('/admin/assets', assetData);
  }

  async deleteAsset(id: string): Promise<DeleteAssetResponse> {
    return apiClient.delete<DeleteAssetResponse>(`/admin/assets/${id}`);
  }
}

export const assetService = new AssetService();
