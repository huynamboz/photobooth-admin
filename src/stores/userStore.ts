import { create } from 'zustand';
import { userService } from '../services/userService';
import { type User, type CreateUserRequest, type UpdateUserRequest, type GetUsersParams } from '../types/user';
import { type PaginationMeta } from '../types/pagination';

interface UserState {
  users: User[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
}

interface UserActions {
  // Data fetching
  fetchUsers: (params?: GetUsersParams) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  
  // CRUD operations
  createUser: (userData: CreateUserRequest) => Promise<void>;
  updateUser: (id: string, userData: UpdateUserRequest) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // State management
  setSelectedUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>((set) => ({
  // Initial state
  users: [],
  pagination: null,
  loading: false,
  error: null,
  selectedUser: null,

  // Actions
  fetchUsers: async (params?: GetUsersParams) => {
    set({ loading: true, error: null });
    try {
      const response = await userService.getAllUsers(params);
      set({ 
        users: response.data, 
        pagination: response.meta,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch users',
        loading: false 
      });
    }
  },

  fetchUserById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const user = await userService.getUserById(id);
      set({ selectedUser: user, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch user',
        loading: false 
      });
    }
  },

  createUser: async (userData: CreateUserRequest) => {
    set({ loading: true, error: null });
    try {
      const newUser = await userService.createUser(userData);
      set(state => ({ 
        users: [...state.users, newUser as User],
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create user',
        loading: false 
      });
      throw error;
    }
  },

  updateUser: async (id: string, userData: UpdateUserRequest) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await userService.updateUser(id, userData);
      set(state => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, ...updatedUser } : user
        ),
        selectedUser: state.selectedUser?.id === id ? { ...state.selectedUser, ...updatedUser } : state.selectedUser,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update user',
        loading: false 
      });
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await userService.deleteUser(id);
      set(state => ({
        users: state.users.filter(user => user.id !== id),
        selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete user',
        loading: false 
      });
      throw error;
    }
  },

  setSelectedUser: (user: User | null) => {
    set({ selectedUser: user });
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
