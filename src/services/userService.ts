import { apiClient } from './apiClient';
import { 
  type User, 
  type CreateUserRequest, 
  type UpdateUserRequest, 
  type UserResponse, 
  type DeleteUserResponse 
} from '../types/user';

class UserService {
  async getAllUsers(): Promise<User[]> {
    return apiClient.get<User[]>('/users');
  }

  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  }

  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    return apiClient.post<UserResponse>('/users', userData);
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<UserResponse> {
    return apiClient.put<UserResponse>(`/users/${id}`, userData);
  }

  async deleteUser(id: string): Promise<DeleteUserResponse> {
    return apiClient.delete<DeleteUserResponse>(`/users/${id}`);
  }
}

export const userService = new UserService();
