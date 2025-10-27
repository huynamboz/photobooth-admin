import { create } from 'zustand';
import { assetService } from '../services/assetService';
import { type Asset, type CreateAssetRequest, type UploadAssetRequest, type AssetFilters, type GetAssetsParams } from '../types/asset';
import { type PaginationMeta } from '../types/pagination';

interface AssetState {
  assets: Asset[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  filters: AssetFilters;
  selectedAsset: Asset | null;
}

interface AssetActions {
  // Data fetching
  fetchAssets: (params?: GetAssetsParams) => Promise<void>;
  fetchFrames: (params?: GetAssetsParams) => Promise<void>;
  fetchFilters: (params?: GetAssetsParams) => Promise<void>;
  fetchStickers: (params?: GetAssetsParams) => Promise<void>;
  fetchAssetById: (id: string) => Promise<void>;
  
  // CRUD operations
  uploadAsset: (uploadData: UploadAssetRequest) => Promise<void>;
  createAsset: (assetData: CreateAssetRequest) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  
  // Filtering and search
  setFilters: (filters: AssetFilters) => void;
  clearFilters: () => void;
  
  // State management
  setSelectedAsset: (asset: Asset | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type AssetStore = AssetState & AssetActions;

export const useAssetStore = create<AssetStore>((set) => ({
  // Initial state
  assets: [],
  pagination: null,
  loading: false,
  error: null,
  filters: {},
  selectedAsset: null,

  // Actions
  fetchAssets: async (params?: GetAssetsParams) => {
    set({ loading: true, error: null });
    try {
      const response = await assetService.getAllAssetsAdmin(params);
      set({ 
        assets: response.data, 
        pagination: response.meta,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch assets',
        loading: false 
      });
    }
  },

  fetchFrames: async (params?: GetAssetsParams) => {
    set({ loading: true, error: null });
    try {
      const response = await assetService.getFrames(params);
      set({ 
        assets: response.data, 
        pagination: response.meta,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch frames',
        loading: false 
      });
    }
  },

  fetchFilters: async (params?: GetAssetsParams) => {
    set({ loading: true, error: null });
    try {
      const response = await assetService.getFilters(params);
      set({ 
        assets: response.data, 
        pagination: response.meta,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch filters',
        loading: false 
      });
    }
  },

  fetchStickers: async (params?: GetAssetsParams) => {
    set({ loading: true, error: null });
    try {
      const response = await assetService.getStickers(params);
      set({ 
        assets: response.data, 
        pagination: response.meta,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch stickers',
        loading: false 
      });
    }
  },

  fetchAssetById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const asset = await assetService.getAssetById(id);
      set({ selectedAsset: asset, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch asset',
        loading: false 
      });
    }
  },

  uploadAsset: async (uploadData: UploadAssetRequest) => {
    set({ error: null });
    try {
      const newAsset = await assetService.uploadAsset(uploadData);
      set(state => ({ 
        assets: [...state.assets, newAsset as Asset],
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to upload asset',
        loading: false 
      });
      throw error;
    }
  },

  createAsset: async (assetData: CreateAssetRequest) => {
    set({ loading: true, error: null });
    try {
      const newAsset = await assetService.createAsset(assetData);
      set(state => ({ 
        assets: [...state.assets, newAsset as Asset],
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create asset',
        loading: false 
      });
      throw error;
    }
  },

  deleteAsset: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await assetService.deleteAsset(id);
      set(state => ({
        assets: state.assets.filter(asset => asset.id !== id),
        selectedAsset: state.selectedAsset?.id === id ? null : state.selectedAsset,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete asset',
        loading: false 
      });
      throw error;
    }
  },

  setFilters: (filters: AssetFilters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  setSelectedAsset: (asset: Asset | null) => {
    set({ selectedAsset: asset });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));
