import { create } from 'zustand';
import { photoboothService } from '../services/photoboothService';
import { 
  type Photobooth, 
  type CreatePhotoboothRequest, 
  type UpdatePhotoboothRequest, 
  type GetPhotoboothsParams,
  type PhotoboothFilters 
} from '../types/photobooth';
import { type PaginationMeta } from '../types/pagination';

interface PhotoboothState {
  photobooths: Photobooth[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  filters: PhotoboothFilters;
  selectedPhotobooth: Photobooth | null;
}

interface PhotoboothActions {
  // Data fetching
  fetchPhotobooths: (params?: GetPhotoboothsParams) => Promise<void>;
  fetchPhotoboothById: (id: string) => Promise<void>;
  
  // CRUD operations
  createPhotobooth: (photoboothData: CreatePhotoboothRequest) => Promise<void>;
  updatePhotobooth: (id: string, photoboothData: UpdatePhotoboothRequest) => Promise<void>;
  updatePhotoboothStatus: (id: string, status: string) => Promise<void>;
  deletePhotobooth: (id: string) => Promise<void>;
  
  // Filters and UI
  setFilters: (filters: Partial<PhotoboothFilters>) => void;
  clearFilters: () => void;
  setSelectedPhotobooth: (photobooth: Photobooth | null) => void;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

type PhotoboothStore = PhotoboothState & PhotoboothActions;

export const usePhotoboothStore = create<PhotoboothStore>((set) => ({
  // Initial state
  photobooths: [],
  pagination: null,
  loading: false,
  error: null,
  filters: {},
  selectedPhotobooth: null,

  // Actions
  fetchPhotobooths: async (params?: GetPhotoboothsParams) => {
    set({ loading: true, error: null });
    try {
      const response = await photoboothService.getAllPhotobooths(params);
      set({ 
        photobooths: response.data, 
        pagination: response.meta,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch photobooths',
        loading: false 
      });
    }
  },

  fetchPhotoboothById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const photobooth = await photoboothService.getPhotoboothById(id);
      set({ selectedPhotobooth: photobooth, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch photobooth',
        loading: false 
      });
    }
  },

  createPhotobooth: async (photoboothData: CreatePhotoboothRequest) => {
    set({ loading: true, error: null });
    try {
      const newPhotobooth = await photoboothService.createPhotobooth(photoboothData);
      set(state => ({ 
        photobooths: [newPhotobooth, ...state.photobooths],
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create photobooth',
        loading: false 
      });
      throw error;
    }
  },

  updatePhotobooth: async (id: string, photoboothData: UpdatePhotoboothRequest) => {
    set({ loading: true, error: null });
    try {
      const updatedPhotobooth = await photoboothService.updatePhotobooth(id, photoboothData);
      set(state => ({
        photobooths: state.photobooths.map(p => p.id === id ? updatedPhotobooth : p),
        selectedPhotobooth: state.selectedPhotobooth?.id === id ? updatedPhotobooth : state.selectedPhotobooth,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update photobooth',
        loading: false 
      });
      throw error;
    }
  },

  updatePhotoboothStatus: async (id: string, status: string) => {
    set({ loading: true, error: null });
    try {
      const updatedPhotobooth = await photoboothService.updatePhotoboothStatus(id, status);
      set(state => ({
        photobooths: state.photobooths.map(p => p.id === id ? updatedPhotobooth : p),
        selectedPhotobooth: state.selectedPhotobooth?.id === id ? updatedPhotobooth : state.selectedPhotobooth,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update photobooth status',
        loading: false 
      });
      throw error;
    }
  },

  deletePhotobooth: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await photoboothService.deletePhotobooth(id);
      set(state => ({
        photobooths: state.photobooths.filter(p => p.id !== id),
        selectedPhotobooth: state.selectedPhotobooth?.id === id ? null : state.selectedPhotobooth,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete photobooth',
        loading: false 
      });
      throw error;
    }
  },

  setFilters: (filters: Partial<PhotoboothFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  setSelectedPhotobooth: (photobooth: Photobooth | null) => {
    set({ selectedPhotobooth: photobooth });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));
