// Booking system type definitions

export interface BookingService {
  id: string
  name: string
  description: string
  price: number
  duration: number // in minutes
  category: 'nursing' | 'therapy' | 'monitoring' | 'emergency'
  icon: string
  popular?: boolean
  requirements?: string[]
}

export interface TimeSlot {
  time: string
  available: boolean
  price?: number // surge pricing
}

export interface BookingFormData {
  // Service Details
  serviceId: string
  date: string
  timeSlot: string
  duration: number
  
  // Patient Information
  patientName: string
  patientAge: number
  patientGender: 'male' | 'female' | 'other'
  patientPhone: string
  patientEmail?: string
  
  // Medical Information
  medicalCondition?: string
  medications?: string
  allergies?: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  
  // Location Information
  address: {
    street: string
    area: string
    city: string
    state: string
    landmark?: string
  }
  
  // Special Requirements
  specialRequirements?: string
  nurseGenderPreference?: 'male' | 'female' | 'no-preference'
  
  // Payment
  paymentMethod: 'card' | 'bank-transfer' | 'ussd' | 'cash'
  totalAmount: number
}

export interface BookingStep {
  id: number
  title: string
  description: string
  completed: boolean
  active: boolean
}