export const AssetType = {
  FRAME: 'frame',
  FILTER: 'filter',
  STICKER: 'sticker'
} as const;

export type AssetType = typeof AssetType[keyof typeof AssetType];

export interface Asset {
  id: string;
  imageUrl: string;
  publicId?: string;
  type: AssetType;
  // Filter properties (only for type="filter")
  filterType?: string | null;
  scale?: number;
  offset_y?: number;
  anchor_idx?: number;
  left_idx?: number;
  right_idx?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssetRequest {
  type: AssetType;
  // Filter properties (only for type="filter")
  filterType?: string | null;
  scale?: number;
  offset_y?: number;
  anchor_idx?: number;
  left_idx?: number;
  right_idx?: number;
}

export interface UploadAssetRequest {
  file: File;
  type: AssetType;
  // Filter properties (only for type="filter")
  filterType?: string | null;
  scale?: number;
  offset_y?: number;
  anchor_idx?: number;
  left_idx?: number;
  right_idx?: number;
}

export interface AssetResponse {
  id: string;
  imageUrl: string;
  publicId?: string;
  type: AssetType;
  // Filter properties (only for type="filter")
  filterType?: string | null;
  scale?: number;
  offset_y?: number;
  anchor_idx?: number;
  left_idx?: number;
  right_idx?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAssetRequest {
  // Filter properties (only for type="filter")
  filterType?: string | null;
  scale?: number;
  offset_y?: number;
  anchor_idx?: number;
  left_idx?: number;
  right_idx?: number;
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
