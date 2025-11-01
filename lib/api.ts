import axios, { AxiosInstance } from 'axios';
import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  Notification,
  CreateNotificationRequest,
  UpdateNotificationRequest,
  SendNotificationRequest,
  NotificationLog,
  NotificationStatus,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to attach token
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/signup', data);
    return response.data;
  }

  // Notification endpoints
  async getNotifications(): Promise<Notification[]> {
    const response = await this.client.get<Notification[]>('/notifications');
    return response.data;
  }

  async getNotification(id: string): Promise<Notification> {
    const response = await this.client.get<Notification>(`/notifications/${id}`);
    return response.data;
  }

  async createNotification(data: CreateNotificationRequest): Promise<Notification> {
    const response = await this.client.post<Notification>('/notifications', data);
    return response.data;
  }

  async updateNotification(id: string, data: UpdateNotificationRequest): Promise<Notification> {
    const response = await this.client.patch<Notification>(`/notifications/${id}`, data);
    return response.data;
  }

  async deleteNotification(id: string): Promise<void> {
    await this.client.delete(`/notifications/${id}`);
  }

  async sendNotification(data: SendNotificationRequest): Promise<NotificationLog> {
    const response = await this.client.post<NotificationLog>('/notifications/send', data);
    return response.data;
  }

  async getNotificationLogs(type?: NotificationStatus): Promise<NotificationLog[]> {
    const params = type ? { type } : {};
    const response = await this.client.get<NotificationLog[]>('/notifications/logs', { params });
    return response.data;
  }
}

export const apiClient = new ApiClient();

