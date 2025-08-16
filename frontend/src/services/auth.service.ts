import axios, { AxiosResponse } from 'axios'
import {
  AuthResponse,
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  VerifyPhoneFormData,
  ChangePasswordFormData,
  User
} from '../types/auth.types'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

// Create axios instance
const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor to add auth token
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
authAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await authAPI.post('/refresh', { refreshToken })
          const { token } = response.data
          
          localStorage.setItem('authToken', token)
          originalRequest.headers.Authorization = `Bearer ${token}`
          
          return authAPI(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

class AuthService {
  // Login user
  async login(data: LoginFormData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authAPI.post('/login', data)
      
      if (response.data.success && response.data.token) {
        // Store tokens and user data
        localStorage.setItem('authToken', response.data.token)
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user))
        }
      }
      
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      }
    }
  }

  // Register new user
  async register(data: RegisterFormData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authAPI.post('/register', {
        ...data,
        phone: this.formatNigerianPhone(data.phone)
      })
      
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      }
    }
  }

  // Forgot password
  async forgotPassword(data: ForgotPasswordFormData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authAPI.post('/forgot-password', {
        ...data,
        emailOrPhone: this.isPhoneNumber(data.emailOrPhone) 
          ? this.formatNigerianPhone(data.emailOrPhone)
          : data.emailOrPhone
      })
      
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reset instructions.'
      }
    }
  }

  // Reset password
  async resetPassword(data: ResetPasswordFormData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authAPI.post('/reset-password', data)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset failed.'
      }
    }
  }

  // Verify phone number with SMS code
  async verifyPhone(data: VerifyPhoneFormData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authAPI.post('/verify-phone', {
        ...data,
        phone: this.formatNigerianPhone(data.phone)
      })
      
      if (response.data.success && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Phone verification failed.'
      }
    }
  }

  // Verify email address
  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authAPI.post('/verify-email', { token })
      
      if (response.data.success && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Email verification failed.'
      }
    }
  }

  // Change password
  async changePassword(data: ChangePasswordFormData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authAPI.post('/change-password', data)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password change failed.'
      }
    }
  }

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authAPI.put('/profile', data)
      
      if (response.data.success && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed.'
      }
    }
  }

  // Refresh auth token
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response: AxiosResponse<AuthResponse> = await authAPI.post('/refresh', { refreshToken })
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('authToken', response.data.token)
      }
      
      return response.data
    } catch (error: any) {
      this.logout()
      return {
        success: false,
        message: 'Session expired. Please login again.'
      }
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<User | null> {
    try {
      const response: AxiosResponse<{ user: User }> = await authAPI.get('/me')
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data.user
      }
      
      return null
    } catch (error) {
      return null
    }
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  // Get stored user data
  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  }

  // Get stored auth token
  getStoredToken(): string | null {
    return localStorage.getItem('authToken')
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getStoredToken()
    const user = this.getStoredUser()
    return !!(token && user)
  }

  // Utility: Format Nigerian phone number
  private formatNigerianPhone(phone: string): string {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '')
    
    // Handle different Nigerian phone formats
    if (cleaned.startsWith('234')) {
      return `+${cleaned}`
    } else if (cleaned.startsWith('0')) {
      return `+234${cleaned.substring(1)}`
    } else if (cleaned.length === 10) {
      return `+234${cleaned}`
    } else if (cleaned.length === 11 && cleaned.startsWith('234')) {
      return `+${cleaned}`
    }
    
    return phone // Return as-is if format not recognized
  }

  // Utility: Check if string is a phone number
  private isPhoneNumber(input: string): boolean {
    const phoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/
    return phoneRegex.test(input.replace(/\D/g, ''))
  }

  // Send SMS verification code
  async sendSMSVerification(phone: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authAPI.post('/send-sms-verification', {
        phone: this.formatNigerianPhone(phone)
      })
      
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send verification code.'
      }
    }
  }

  // Resend email verification
  async resendEmailVerification(): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authAPI.post('/resend-email-verification')
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to resend verification email.'
      }
    }
  }
}

// Export singleton instance
export const authService = new AuthService()
export default authService