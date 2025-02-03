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
  id: number;
  url: string;
  filename: string;
}

export interface userProp {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  completed: number;
  image_id?: number;
  image?: ImageProp;
  user?: userProp;
  created_at?: string;
  updated_at?: string;
  user_id: number;
  gps_coordinates?: string;
  user_ip?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  token?: string;
  success: boolean;
}
