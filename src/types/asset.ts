export enum AssetType {
  FRAME = 'frame',
  FILTER = 'filter',
  STICKER = 'sticker'
}

export interface Asset {
  id: string;
  imageUrl: string;
  publicId?: string;
  type: AssetType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssetRequest {
  type: AssetType;
}

export interface UploadAssetRequest {
  file: File;
  type: AssetType;
}

export interface AssetResponse {
  id: string;
  imageUrl: string;
  publicId?: string;
  type: AssetType;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteAssetResponse {
  message: string;
}

export interface AssetFilters {
  type?: AssetType;
  search?: string;
}

export interface GetAssetsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: AssetType;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
