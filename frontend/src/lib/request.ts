"use client";
import {
  ApiResponse,
  CreateTaskData,
  LoginCredentials,
  RegisterData,
  Task,
  UpdateTaskData,
  User,
} from "@/interface";
import {
  getItemLocalStorage,
  removeItemLocalStorage,
  setItemLocalStorage,
} from "./storage";

class ApiService {
  private baseURL: string;
  private token?: string | null;

  constructor() {
    this.baseURL = "http://localhost:8000/api";
    this.token = getItemLocalStorage("token");
  }

  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      setItemLocalStorage("token", token);
    } else {
      removeItemLocalStorage("token");
    }
  }

  private getHeaders(includeFiles: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      Authorization: `Bearer ${this.token}`,
    };

    if (!includeFiles) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & { includeFiles?: boolean } = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: this.getHeaders(options.includeFiles),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.setToken(null);
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }

      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    return response.json();
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    const response = await this.request<User>("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async register(userData: RegisterData): Promise<ApiResponse<User>> {
    return this.request<User>("/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    try {
      await this.request("/logout", { method: "POST" });
    } finally {
      this.setToken(null);
    }
  }

  async getMe(): Promise<ApiResponse<User>> {
    return this.request<User>("/me");
  }

  // Task methods
  async getTasks(): Promise<ApiResponse<Task[]>> {
    return this.request<Task[]>("/task/all");
  }

  async getTask(id: number): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/task/${id}`);
  }

  async createTask(taskData: CreateTaskData): Promise<ApiResponse<Task>> {
    const formData = new FormData();

    Object.entries(taskData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "image" && value instanceof File) {
          formData.append("image", value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return this.request<Task>("/task/create", {
      method: "POST",
      body: formData,
      includeFiles: true,
    });
  }

  async updateTask(
    id: number,
    taskData: UpdateTaskData
  ): Promise<ApiResponse<Task>> {
    const formData = new FormData();
    formData.append("_method", "PATCH");

    Object.entries(taskData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "image" && value instanceof File) {
          formData.append("image", value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return this.request<Task>(`/task/${id}`, {
      method: "POST",
      body: formData,
      includeFiles: true,
    });
  }

  async deleteTask(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/task/${id}`, {
      method: "DELETE",
    });
  }

  // Image methods
  async uploadImage(image: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("image", image);

    return this.request<{ url: string }>("/upload-image", {
      method: "POST",
      body: formData,
      includeFiles: true,
    });
  }

  async deleteImage(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/delete-image/${id}`, {
      method: "DELETE",
    });
  }
}

// Create a singleton instance
const apiService = new ApiService();
export default apiService;
