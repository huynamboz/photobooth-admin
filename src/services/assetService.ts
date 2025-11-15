import { apiClient } from './apiClient';
import { 
  type Asset, 
  type CreateAssetRequest, 
  type UploadAssetRequest, 
  type UpdateAssetRequest,
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

    // Add filter properties if type is filter
    if (uploadData.type === 'filter') {
      if (uploadData.filterType !== undefined && uploadData.filterType !== null) {
        formData.append('filterType', uploadData.filterType);
      }
      if (uploadData.scale !== undefined) {
        formData.append('scale', uploadData.scale.toString());
      }
      if (uploadData.offset_y !== undefined) {
        formData.append('offset_y', uploadData.offset_y.toString());
      }
      if (uploadData.anchor_idx !== undefined) {
        formData.append('anchor_idx', uploadData.anchor_idx.toString());
      }
      if (uploadData.left_idx !== undefined) {
        formData.append('left_idx', uploadData.left_idx.toString());
      }
      if (uploadData.right_idx !== undefined) {
        formData.append('right_idx', uploadData.right_idx.toString());
      }
    }

    return apiClient.post<AssetResponse>('/admin/assets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async createAsset(assetData: CreateAssetRequest): Promise<AssetResponse> {
    return apiClient.post<AssetResponse>('/admin/assets', assetData);
  }

  async updateAsset(id: string, assetData: UpdateAssetRequest): Promise<AssetResponse> {
    return apiClient.put<AssetResponse>(`/admin/assets/${id}`, assetData);
  }

  async deleteAsset(id: string): Promise<DeleteAssetResponse> {
    return apiClient.delete<DeleteAssetResponse>(`/admin/assets/${id}`);
  }
}

export const assetService = new AssetService();
