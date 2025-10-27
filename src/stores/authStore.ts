import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, type LoginRequest, type RegisterRequest } from '../services/authService';
import { apiClient } from '../services/apiClient';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      loading: false,
      isAuthenticated: false,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ loading: true });
        try {
          const response = await authService.login(credentials);
          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
            loading: false,
          });
          // Update API client with new token
          apiClient.setAuthToken(response.access_token);
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ loading: true });
        try {
          const response = await authService.register(userData);
          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
            loading: false,
          });
          // Update API client with new token
          apiClient.setAuthToken(response.access_token);
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });
          // Clear API client token
          apiClient.clearAuthToken();
        }
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        });
        // Clear API client token
        apiClient.clearAuthToken();
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Initialize API client with stored token when store is rehydrated
        if (state?.token) {
          apiClient.setAuthToken(state.token);
        }
      },
    }
  )
);
