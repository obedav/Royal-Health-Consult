// src/types/schedule.types.ts

export interface ScheduleData {
  date: string
  timeSlot: TimeSlot
  nurse: Nurse
  address: Address
  specialRequirements?: string
}

export interface TimeSlot {
  id: string
  time: string
  duration: number
  available: boolean
  price?: number // May vary based on time (emergency rates, etc.)
}

export interface Nurse {
  id: string
  name: string
  avatar?: string
  rating: number
  experience: number
  specializations: string[]
  availability: string[]
  verified: boolean
  bio?: string
  certifications?: string[]
}

export interface Address {
  street: string
  city: string
  state: string
  landmark?: string
  phoneNumber: string
  zipCode?: string
}

export interface AvailableDate {
  value: string
  label: string
  isToday: boolean
  isWeekend: boolean
  isHoliday?: boolean
}

export interface NurseAvailability {
  nurseId: string
  date: string
  availableSlots: string[]
  unavailableSlots: string[]
  emergencyAvailable: boolean
}

export interface AppointmentRequest {
  serviceId: string
  nurseId: string
  patientId: string
  scheduleData: ScheduleData
  paymentMethod: 'card' | 'bank_transfer' | 'cash'
  totalAmount: number
}

export interface AppointmentConfirmation {
  appointmentId: string
  confirmationCode: string
  estimatedArrival: string
  nurseContact: string
  emergencyContact: string
  cancellationPolicy: string
}