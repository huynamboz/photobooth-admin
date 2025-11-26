import { apiClient } from './apiClient';
import { 
  type User, 
  type CreateUserRequest, 
  type UpdateUserRequest, 
  type UserResponse, 
  type DeleteUserResponse,
  type GetUsersParams,
  type AddPointsRequest
} from '../types/user';
import { type PaginatedResponse } from '../types/pagination';

class UserService {
  async getAllUsers(params?: GetUsersParams): Promise<PaginatedResponse<User>> {
    return apiClient.get<PaginatedResponse<User>>('/users', { params });
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

  async addPoints(id: string, points: number): Promise<UserResponse> {
    return apiClient.post<UserResponse>(`/admin/users/${id}/add-points`, {
      points,
    } as AddPointsRequest);
  }
}

export const userService = new UserService();
