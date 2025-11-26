import { create } from 'zustand';
import { bankService } from '../services/bankService';
import {
  type Bank,
  type BankInfo,
  type CreateBankInfoRequest,
  type UpdateBankInfoRequest,
} from '../types/bank';

interface BankState {
  banks: Bank[];
  bankInfo: BankInfo | null;
  loading: boolean;
  error: string | null;
}

interface BankActions {
  // Data fetching
  fetchBanks: () => Promise<void>;
  fetchBankInfo: () => Promise<void>;
  
  // CRUD operations
  createOrUpdateBankInfo: (data: CreateBankInfoRequest) => Promise<void>;
  updateBankInfo: (id: string, data: UpdateBankInfoRequest) => Promise<void>;
  deleteBankInfo: (id: string) => Promise<void>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type BankStore = BankState & BankActions;

export const useBankStore = create<BankStore>((set) => ({
  // Initial state
  banks: [],
  bankInfo: null,
  loading: false,
  error: null,

  // Actions
  fetchBanks: async () => {
    set({ loading: true, error: null });
    try {
      const banks = await bankService.getBanks();
      set({ banks, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch banks',
        loading: false,
      });
    }
  },

  fetchBankInfo: async () => {
    set({ loading: true, error: null });
    try {
      const bankInfo = await bankService.getBankInfo();
      set({ bankInfo, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch bank info',
        loading: false,
      });
    }
  },

  createOrUpdateBankInfo: async (data: CreateBankInfoRequest) => {
    set({ loading: true, error: null });
    try {
      const bankInfo = await bankService.createOrUpdateBankInfo(data);
      set({ bankInfo, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to save bank info',
        loading: false,
      });
      throw error;
    }
  },

  updateBankInfo: async (id: string, data: UpdateBankInfoRequest) => {
    set({ loading: true, error: null });
    try {
      const bankInfo = await bankService.updateBankInfo(id, data);
      set({ bankInfo, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update bank info',
        loading: false,
      });
      throw error;
    }
  },

  deleteBankInfo: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await bankService.deleteBankInfo(id);
      set({ bankInfo: null, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete bank info',
        loading: false,
      });
      throw error;
    }
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

