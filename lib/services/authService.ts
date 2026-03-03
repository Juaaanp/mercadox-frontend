import { apiClient } from "./apiClient";
import type {
  LoginRequest,
  LoginResponse,
  RecoverPasswordRequest,
  RecoverPasswordResponse,
  ResetPasswordRequest
} from "../types/auth.types";
import { User } from "../types/user.types";

export const authService = {
  /**
   * Authenticate user and store tokens
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mercadox_token', response.access_token);
    }
    return response;
  },

  /**
   * Logout user and clear tokens
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mercadox_token');
        localStorage.removeItem('mercadox_refresh_token');
      }
    }
  },

  /**
   * Send password recovery email
   */
  async recoverPassword(payload: RecoverPasswordRequest): Promise<RecoverPasswordResponse> {
    return apiClient.post<RecoverPasswordResponse>('/auth/recover-password', payload);
  },

  /**
   * Reset password with token from email
   */
  async resetPassword(payload: ResetPasswordRequest): Promise<{ message: string }> {
    return apiClient.post('/auth/reset-password', payload);
  },

  /**
   * Get current authenticated user
   */
  async me(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  /**
   * Check if user is authenticated (client-side)
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('mercadox_token');
  },
};