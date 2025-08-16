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

export interface Booking {
  id: string
  bookingReference: string
  userId: string
  service: BookingService
  appointment: {
    date: string
    time: string
    duration: number
  }
  patient: {
    name: string
    age: number
    gender: string
    phone: string
    email?: string
  }
  location: {
    address: string
    area: string
    city: string
    state: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  assignedNurse?: {
    id: string
    name: string
    phone: string
    photo?: string
  }
  status: 'pending' | 'confirmed' | 'assigned' | 'in-progress' | 'completed' | 'cancelled'
  payment: {
    method: string
    amount: number
    status: 'pending' | 'paid' | 'failed' | 'refunded'
    reference?: string
  }
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface NurseAvailability {
  nurseId: string
  date: string
  timeSlots: TimeSlot[]
  location: {
    state: string
    city: string
    areas: string[]
  }
}

export interface BookingStep {
  id: number
  title: string
  description: string
  completed: boolean
  active: boolean
}