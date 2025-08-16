// src/types/payment.types.ts

export interface PaymentResult {
  transactionId: string
  reference: string
  amount: number
  method: PaymentMethod
  status: 'success' | 'pending' | 'failed'
  gateway: 'flutterwave' | 'paystack'
  paidAt: string
  currency?: string
  gatewayResponse?: any
}

export type PaymentMethod = 'card' | 'bank_transfer' | 'ussd' | 'qr' | 'cash'

export interface PricingBreakdown {
  servicePrice: number
  emergencyFee?: number
  weekendFee?: number
  transportFee: number
  discount?: number
  tax: number
  total: number
  currency: string
}

export interface FlutterwaveConfig {
  public_key: string
  tx_ref: string
  amount: number
  currency: 'NGN'
  country: 'NG'
  payment_options: string
  customer: {
    email: string
    phone_number: string
    name: string
  }
  customizations: {
    title: string
    description: string
    logo?: string
  }
  meta?: {
    service_id: string
    patient_id: string
    booking_id: string
  }
}

export interface PaystackConfig {
  key: string
  email: string
  amount: number // in kobo
  currency: 'NGN'
  ref: string
  channels: string[]
  metadata: {
    custom_fields: Array<{
      display_name: string
      variable_name: string
      value: string
    }>
  }
  callback?: (response: any) => void
  onClose?: () => void
}

export interface PaymentGatewayResponse {
  status: 'success' | 'failed' | 'cancelled'
  transaction_id: string
  reference: string
  amount: number
  currency: string
  gateway: 'flutterwave' | 'paystack'
  customer: {
    email: string
    phone: string
    name: string
  }
  meta_data?: any
}

export interface PromoCode {
  code: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minimumAmount?: number
  expiryDate?: string
  isActive: boolean
  usageLimit?: number
  usedCount?: number
}

export interface TransportFee {
  state: string
  baseFee: number
  urgentFee?: number
  weekendFee?: number
}

export interface PaymentReceipt {
  bookingId: string
  transactionId: string
  service: string
  patient: string
  amount: number
  paymentMethod: PaymentMethod
  paidAt: string
  taxAmount: number
  breakdown: PricingBreakdown
}

// Common promo codes for the Nigerian market
export const COMMON_PROMO_CODES: Record<string, PromoCode> = {
  'FIRSTTIME': {
    code: 'FIRSTTIME',
    description: 'First time user discount',
    discountType: 'percentage',
    discountValue: 0.1,
    minimumAmount: 5000,
    isActive: true
  },
  'ROYAL20': {
    code: 'ROYAL20',
    description: '20% off all services',
    discountType: 'percentage',
    discountValue: 0.2,
    minimumAmount: 10000,
    isActive: true
  },
  'HEALTH15': {
    code: 'HEALTH15',
    description: '15% healthcare discount',
    discountType: 'percentage',
    discountValue: 0.15,
    minimumAmount: 8000,
    isActive: true
  },
  'NURSE10': {
    code: 'NURSE10',
    description: '10% nursing services discount',
    discountType: 'percentage',
    discountValue: 0.1,
    minimumAmount: 5000,
    isActive: true
  }
}

// Transport fees for Nigerian states
export const NIGERIAN_TRANSPORT_FEES: Record<string, TransportFee> = {
  'Lagos': { state: 'Lagos', baseFee: 2000, urgentFee: 3000, weekendFee: 2500 },
  'Abuja': { state: 'Abuja', baseFee: 3000, urgentFee: 4500, weekendFee: 3500 },
  'Kano': { state: 'Kano', baseFee: 2500, urgentFee: 3500, weekendFee: 3000 },
  'Rivers': { state: 'Rivers', baseFee: 2500, urgentFee: 3500, weekendFee: 3000 },
  'Oyo': { state: 'Oyo', baseFee: 2000, urgentFee: 3000, weekendFee: 2500 },
  'Kaduna': { state: 'Kaduna', baseFee: 2500, urgentFee: 3500, weekendFee: 3000 },
  'Ogun': { state: 'Ogun', baseFee: 1500, urgentFee: 2500, weekendFee: 2000 },
  'Ondo': { state: 'Ondo', baseFee: 2000, urgentFee: 3000, weekendFee: 2500 },
  'Osun': { state: 'Osun', baseFee: 2000, urgentFee: 3000, weekendFee: 2500 },
  'Delta': { state: 'Delta', baseFee: 2500, urgentFee: 3500, weekendFee: 3000 },
  'Anambra': { state: 'Anambra', baseFee: 2500, urgentFee: 3500, weekendFee: 3000 },
  'Imo': { state: 'Imo', baseFee: 2500, urgentFee: 3500, weekendFee: 3000 },
  'Enugu': { state: 'Enugu', baseFee: 2500, urgentFee: 3500, weekendFee: 3000 },
  'Edo': { state: 'Edo', baseFee: 2000, urgentFee: 3000, weekendFee: 2500 },
  'Plateau': { state: 'Plateau', baseFee: 3000, urgentFee: 4000, weekendFee: 3500 }
}

// Tax rates
export const TAX_RATES = {
  VAT: 0.05, // 5% VAT in Nigeria
  SERVICE_CHARGE: 0.025 // 2.5% service charge (optional)
}

// Payment method configurations
export const PAYMENT_METHOD_CONFIG = {
  card: {
    name: 'Debit/Credit Card',
    description: 'Visa, Mastercard, Verve',
    icon: 'FaCreditCard',
    processingFee: 0.015, // 1.5%
    available: true
  },
  bank_transfer: {
    name: 'Bank Transfer',
    description: 'Direct bank transfer',
    icon: 'FaUniversity',
    processingFee: 0.01, // 1%
    available: true
  },
  ussd: {
    name: 'USSD',
    description: '*737# and other bank codes',
    icon: 'FaMobileAlt',
    processingFee: 0.005, // 0.5%
    available: true
  },
  qr: {
    name: 'QR Code',
    description: 'Scan to pay',
    icon: 'FaQrcode',
    processingFee: 0.01, // 1%
    available: false // Not implemented yet
  },
  cash: {
    name: 'Cash Payment',
    description: 'Pay nurse directly',
    icon: 'FaMoneyBillWave',
    processingFee: 0, // No processing fee
    available: true
  }
}