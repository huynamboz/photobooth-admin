import { create } from 'zustand';
import { photoService } from '@/services/photoService';
import { type Photo, type GetPhotosParams } from '@/types/photo';

interface PhotoFilters {
  sessionId?: string;
  isProcessed?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

interface PhotoStore {
  // State
  photos: Photo[];
  selectedPhoto: Photo | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  loading: boolean;
  error: string | null;
  filters: PhotoFilters;

  // Actions
  fetchPhotos: (params?: GetPhotosParams) => Promise<void>;
  getPhotoById: (id: string) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
  updatePhotoCaption: (id: string, caption: string) => Promise<void>;
  markPhotoAsProcessed: (id: string) => Promise<void>;
  downloadPhoto: (id: string) => Promise<void>;
  setFilters: (filters: Partial<PhotoFilters>) => void;
  clearFilters: () => void;
  clearError: () => void;
  setSelectedPhoto: (photo: Photo | null) => void;
}

export const usePhotoStore = create<PhotoStore>((set) => ({
  // Initial state
  photos: [],
  selectedPhoto: null,
  pagination: null,
  loading: false,
  error: null,
  filters: {},

  // Actions
  fetchPhotos: async (params: GetPhotosParams = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await photoService.getPhotos(params);
      set({
        photos: response.data,
        pagination: response.meta,
        loading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch photos',
        loading: false
      });
      throw error;
    }
  },

  getPhotoById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const photo = await photoService.getPhotoById(id);
      set({ selectedPhoto: photo, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch photo',
        loading: false
      });
      throw error;
    }
  },

  deletePhoto: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await photoService.deletePhoto(id);
      set(state => ({
        photos: state.photos.filter(photo => photo.id !== id),
        selectedPhoto: state.selectedPhoto?.id === id ? null : state.selectedPhoto,
        loading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete photo',
        loading: false
      });
      throw error;
    }
  },

  updatePhotoCaption: async (id: string, caption: string) => {
    set({ loading: true, error: null });
    try {
      const updatedPhoto = await photoService.updatePhotoCaption(id, caption);
      set(state => ({
        photos: state.photos.map(photo => 
          photo.id === id ? updatedPhoto : photo
        ),
        selectedPhoto: state.selectedPhoto?.id === id ? updatedPhoto : state.selectedPhoto,
        loading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update photo caption',
        loading: false
      });
      throw error;
    }
  },

  markPhotoAsProcessed: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const updatedPhoto = await photoService.markPhotoAsProcessed(id);
      set(state => ({
        photos: state.photos.map(photo => 
          photo.id === id ? updatedPhoto : photo
        ),
        selectedPhoto: state.selectedPhoto?.id === id ? updatedPhoto : state.selectedPhoto,
        loading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to mark photo as processed',
        loading: false
      });
      throw error;
    }
  },

  downloadPhoto: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await photoService.downloadPhoto(id);
      set({ loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to download photo',
        loading: false
      });
      throw error;
    }
  },

  setFilters: (newFilters: Partial<PhotoFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  clearError: () => {
    set({ error: null });
  },

  setSelectedPhoto: (photo: Photo | null) => {
    set({ selectedPhoto: photo });
  }
}));