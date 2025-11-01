export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  SCHEDULED = 'scheduled',
}

export interface User {
  id: string;
  email: string;
  fname: string;
  lname: string;
  designation: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  fname: string;
  lname: string;
  designation: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface Notification {
  _id: string;
  type: NotificationType;
  recipients: string[];
  subject: string;
  message: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNotificationRequest {
  type: NotificationType;
  recipients: string[];
  subject: string;
  message: string;
}

export interface UpdateNotificationRequest {
  type?: NotificationType;
  recipients?: string[];
  subject?: string;
  message?: string;
}

export interface SendNotificationRequest {
  notificationId: string;
  scheduledAt?: string; // ISO 8601 format
}

export interface NotificationLog {
  _id: string;
  notificationId: string;
  status: NotificationStatus;
  scheduledAt?: string;
  sentAt?: string;
  messageId?: string;
  errorMessage?: string;
  senderId?: string;
  jobId?: string;
  createdAt?: string;
  updatedAt?: string;
}

