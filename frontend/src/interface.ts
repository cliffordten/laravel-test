export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ErrorParams {
  message?: string;
  errors?: {
    [field: string]: string[];
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ImageProp {
  id: string;
  url: string;
  filename: string;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  image_id?: string;
  image?: ImageProp;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  gps_coordinates?: string;
  user_ip?: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  image?: File;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  image?: File;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  token?: string;
  success: boolean;
}
