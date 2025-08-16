// src/types/patient.types.ts

export interface PatientInformation {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'prefer_not_to_say'
  nationalId?: string
  
  // Medical Information
  medicalHistory: MedicalHistory
  
  // Emergency Contacts
  emergencyContact: EmergencyContact
  
  // Additional Information
  insuranceProvider?: string
  insuranceNumber?: string
  preferredLanguage: string
  specialNeeds?: string
  
  // Consents
  consentToTreatment: boolean
  consentToDataProcessing: boolean
  consentToSMSUpdates: boolean
  
  // Service-specific information
  serviceSpecificInfo?: Record<string, any>
}

export interface MedicalHistory {
  conditions: string[]
  currentMedications: string[]
  allergies: string[]
  previousSurgeries: string[]
  hospitalizations: string[]
  chronicConditions?: string[]
  familyHistory?: string[]
  notes?: string
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  address?: string
  email?: string
  isAlternate?: boolean
}

export interface InsuranceInformation {
  provider: string
  policyNumber: string
  groupNumber?: string
  expiryDate?: string
  coverageType: 'basic' | 'comprehensive' | 'premium'
  preAuthRequired: boolean
}

export interface PatientConsent {
  consentToTreatment: boolean
  consentToDataProcessing: boolean
  consentToSMSUpdates: boolean
  consentToEmailUpdates?: boolean
  consentToResearch?: boolean
  signedDate: string
  ipAddress?: string
}

export interface MedicalDocument {
  id: string
  type: 'prescription' | 'lab_result' | 'xray' | 'report' | 'insurance_card' | 'id_document'
  name: string
  url: string
  uploadedDate: string
  expiryDate?: string
}

// For form validation
export interface PatientFormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelationship?: string
  consentToTreatment?: string
  consentToDataProcessing?: string
  [key: string]: string | undefined
}

// Common data for dropdowns
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
]

export const NIGERIAN_LANGUAGES = [
  'English', 'Hausa', 'Yoruba', 'Igbo', 'Pidgin English', 'Fulfulde',
  'Kanuri', 'Tiv', 'Edo', 'Efik', 'Ibibio', 'Ijaw', 'Nupe'
]

export const RELATIONSHIP_OPTIONS = [
  'Spouse/Partner', 'Parent', 'Child', 'Sibling', 'Relative',
  'Friend', 'Guardian', 'Neighbor', 'Colleague', 'Other'
]

export const COMMON_CONDITIONS = [
  'Hypertension (High Blood Pressure)',
  'Diabetes Type 1',
  'Diabetes Type 2',
  'Heart Disease',
  'Asthma',
  'Arthritis',
  'High Cholesterol',
  'Kidney Disease',
  'Liver Disease',
  'Mental Health Conditions',
  'Cancer',
  'Stroke',
  'Epilepsy',
  'Thyroid Disorders',
  'Osteoporosis',
  'COPD',
  'HIV/AIDS',
  'Hepatitis B',
  'Hepatitis C',
  'Sickle Cell Disease'
]

export const COMMON_ALLERGIES = [
  'Penicillin', 'Aspirin', 'Ibuprofen', 'Codeine', 'Sulfa drugs',
  'Latex', 'Shellfish', 'Nuts', 'Peanuts', 'Eggs', 'Dairy', 'Soy',
  'Wheat/Gluten', 'Dust', 'Pollen', 'Pet Dander', 'Insect Stings'
]

export const INSURANCE_PROVIDERS = [
  'NHIS (National Health Insurance Scheme)',
  'AIICO Insurance',
  'AXA Mansard',
  'Leadway Health',
  'Hygeia HMO',
  'Total Health Trust',
  'Reliance HMO',
  'Clearline HMO',
  'Princeton Lolly HMO',
  'Greenlife HMO',
  'Other',
  'No Insurance'
]