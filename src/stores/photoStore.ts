import { create } from 'zustand';
import { photoService, type GetPhotosParams, type UpdatePhotoRequest } from '../services/photoService';
import { type Photo } from '../types/session';
import { type PaginationMeta } from '../types/pagination';

interface PhotoFilters {
  sessionId?: string;
  isProcessed?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

interface PhotoState {
  photos: Photo[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  filters: PhotoFilters;
  selectedPhotos: string[];
  selectedPhoto: Photo | null;
}

interface PhotoActions {
  // Data fetching
  fetchPhotos: (params?: GetPhotosParams) => Promise<void>;
  fetchPhotoById: (id: string) => Promise<void>;
  
  // CRUD operations
  updatePhoto: (id: string, photoData: UpdatePhotoRequest) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
  bulkUpdatePhotos: (photoIds: string[], updates: UpdatePhotoRequest) => Promise<void>;
  bulkDeletePhotos: (photoIds: string[]) => Promise<void>;
  
  // Selection and UI
  setSelectedPhotos: (photoIds: string[]) => void;
  togglePhotoSelection: (photoId: string) => void;
  clearSelection: () => void;
  setSelectedPhoto: (photo: Photo | null) => void;
  
  // Filters
  setFilters: (filters: Partial<PhotoFilters>) => void;
  clearFilters: () => void;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

type PhotoStore = PhotoState & PhotoActions;

export const usePhotoStore = create<PhotoStore>((set) => ({
  // Initial state
  photos: [],
  pagination: null,
  loading: false,
  error: null,
  filters: {},
  selectedPhotos: [],
  selectedPhoto: null,

  // Actions
  fetchPhotos: async (params?: GetPhotosParams) => {
    set({ loading: true, error: null });
    try {
      const response = await photoService.getAllPhotos(params);
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
    }
  },

  fetchPhotoById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const photo = await photoService.getPhotoById(id);
      set({ selectedPhoto: photo, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch photo',
        loading: false 
      });
    }
  },

  updatePhoto: async (id: string, photoData: UpdatePhotoRequest) => {
    set({ loading: true, error: null });
    try {
      const updatedPhoto = await photoService.updatePhoto(id, photoData);
      set(state => ({
        photos: state.photos.map(p => p.id === id ? updatedPhoto : p),
        selectedPhoto: state.selectedPhoto?.id === id ? updatedPhoto : state.selectedPhoto,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update photo',
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
        photos: state.photos.filter(p => p.id !== id),
        selectedPhotos: state.selectedPhotos.filter(pid => pid !== id),
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

  bulkUpdatePhotos: async (photoIds: string[], updates: UpdatePhotoRequest) => {
    set({ loading: true, error: null });
    try {
      await photoService.bulkUpdatePhotos(photoIds, updates);
      set(state => ({
        photos: state.photos.map(p => 
          photoIds.includes(p.id) 
            ? { ...p, ...updates, updatedAt: new Date().toISOString() }
            : p
        ),
        selectedPhotos: [],
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update photos',
        loading: false 
      });
      throw error;
    }
  },

  bulkDeletePhotos: async (photoIds: string[]) => {
    set({ loading: true, error: null });
    try {
      await photoService.bulkDeletePhotos(photoIds);
      set(state => ({
        photos: state.photos.filter(p => !photoIds.includes(p.id)),
        selectedPhotos: [],
        selectedPhoto: state.selectedPhoto && photoIds.includes(state.selectedPhoto.id) ? null : state.selectedPhoto,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete photos',
        loading: false 
      });
      throw error;
    }
  },

  setSelectedPhotos: (photoIds: string[]) => {
    set({ selectedPhotos: photoIds });
  },

  togglePhotoSelection: (photoId: string) => {
    set(state => ({
      selectedPhotos: state.selectedPhotos.includes(photoId)
        ? state.selectedPhotos.filter(id => id !== photoId)
        : [...state.selectedPhotos, photoId]
    }));
  },

  clearSelection: () => {
    set({ selectedPhotos: [] });
  },

  setSelectedPhoto: (photo: Photo | null) => {
    set({ selectedPhoto: photo });
  },

  setFilters: (filters: Partial<PhotoFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));
