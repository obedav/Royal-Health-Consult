// Authentication system type definitions

export interface User {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  role: UserRole
  isEmailVerified: boolean
  isPhoneVerified: boolean
  avatar?: string
  createdAt: string
  updatedAt: string
  
  // Role-specific data
  patientProfile?: PatientProfile
  nurseProfile?: NurseProfile
  adminProfile?: AdminProfile
}

export type UserRole = 'patient' | 'nurse' | 'admin' | 'support'

export interface PatientProfile {
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  address: {
    street: string
    area: string
    city: string
    state: string
    postalCode?: string
  }
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  medicalInfo?: {
    allergies?: string[]
    medications?: string[]
    conditions?: string[]
    bloodType?: string
  }
  insuranceInfo?: {
    provider: string
    policyNumber: string
    groupNumber?: string
  }
}

export interface NurseProfile {
  licenseNumber: string
  licenseExpiry: string
  specializations: string[]
  experience: number // years
  education: {
    degree: string
    institution: string
    graduationYear: number
  }[]
  certifications: {
    name: string
    issuer: string
    issueDate: string
    expiryDate?: string
  }[]
  workAreas: {
    state: string
    cities: string[]
  }[]
  availability: {
    monday: TimeSlot[]
    tuesday: TimeSlot[]
    wednesday: TimeSlot[]
    thursday: TimeSlot[]
    friday: TimeSlot[]
    saturday: TimeSlot[]
    sunday: TimeSlot[]
  }
  hourlyRate: number
  rating: number
  totalBookings: number
  isVerified: boolean
  documents: {
    type: 'license' | 'certificate' | 'id' | 'cv'
    url: string
    status: 'pending' | 'approved' | 'rejected'
  }[]
}

export interface AdminProfile {
  department: string
  permissions: Permission[]
  employeeId: string
}

export interface TimeSlot {
  start: string // HH:MM format
  end: string   // HH:MM format
}

export interface Permission {
  resource: string
  actions: ('create' | 'read' | 'update' | 'delete')[]
}

// Authentication forms
export interface LoginFormData {
  emailOrPhone: string
  password: string
  rememberMe?: boolean
}

export interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  role: 'patient' | 'nurse'
  agreeToTerms: boolean
  agreeToPrivacy: boolean
}

export interface ForgotPasswordFormData {
  emailOrPhone: string
}

export interface ResetPasswordFormData {
  token: string
  password: string
  confirmPassword: string
}

export interface VerifyPhoneFormData {
  phone: string
  code: string
}

export interface ChangePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Authentication responses
export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
  refreshToken?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Auth context
export interface AuthContextType {
  // State
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (data: LoginFormData) => Promise<AuthResponse>
  register: (data: RegisterFormData) => Promise<AuthResponse>
  logout: () => void
  forgotPassword: (data: ForgotPasswordFormData) => Promise<AuthResponse>
  resetPassword: (data: ResetPasswordFormData) => Promise<AuthResponse>
  verifyPhone: (data: VerifyPhoneFormData) => Promise<AuthResponse>
  verifyEmail: (token: string) => Promise<AuthResponse>
  changePassword: (data: ChangePasswordFormData) => Promise<AuthResponse>
  updateProfile: (data: Partial<User>) => Promise<AuthResponse>
  refreshToken: () => Promise<AuthResponse>
  checkAuthStatus: () => Promise<void>
  
  // Utilities
  hasRole: (role: UserRole) => boolean
  hasPermission: (resource: string, action: string) => boolean
  isProfileComplete: () => boolean
}