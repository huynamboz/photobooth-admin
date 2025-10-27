export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  roleId?: string;
  role?: Role;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password?: string;
  phone?: string;
  address?: string;
  roleId?: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  password?: string;
  phone?: string;
  address?: string;
  roleId?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  role?: Role;
}

export interface DeleteUserResponse {
  message: string;
}
