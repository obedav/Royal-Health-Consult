// Nigerian States and Local Government Areas
export const NIGERIAN_STATES = [
  { value: 'abia', label: 'Abia' },
  { value: 'adamawa', label: 'Adamawa' },
  { value: 'akwa-ibom', label: 'Akwa Ibom' },
  { value: 'anambra', label: 'Anambra' },
  { value: 'bauchi', label: 'Bauchi' },
  { value: 'bayelsa', label: 'Bayelsa' },
  { value: 'benue', label: 'Benue' },
  { value: 'borno', label: 'Borno' },
  { value: 'cross-river', label: 'Cross River' },
  { value: 'delta', label: 'Delta' },
  { value: 'ebonyi', label: 'Ebonyi' },
  { value: 'edo', label: 'Edo' },
  { value: 'ekiti', label: 'Ekiti' },
  { value: 'enugu', label: 'Enugu' },
  { value: 'gombe', label: 'Gombe' },
  { value: 'imo', label: 'Imo' },
  { value: 'jigawa', label: 'Jigawa' },
  { value: 'kaduna', label: 'Kaduna' },
  { value: 'kano', label: 'Kano' },
  { value: 'katsina', label: 'Katsina' },
  { value: 'kebbi', label: 'Kebbi' },
  { value: 'kogi', label: 'Kogi' },
  { value: 'kwara', label: 'Kwara' },
  { value: 'lagos', label: 'Lagos' },
  { value: 'nasarawa', label: 'Nasarawa' },
  { value: 'niger', label: 'Niger' },
  { value: 'ogun', label: 'Ogun' },
  { value: 'ondo', label: 'Ondo' },
  { value: 'osun', label: 'Osun' },
  { value: 'oyo', label: 'Oyo' },
  { value: 'plateau', label: 'Plateau' },
  { value: 'rivers', label: 'Rivers' },
  { value: 'sokoto', label: 'Sokoto' },
  { value: 'taraba', label: 'Taraba' },
  { value: 'yobe', label: 'Yobe' },
  { value: 'zamfara', label: 'Zamfara' },
  { value: 'fct', label: 'Federal Capital Territory' },
]

// Major Nigerian Cities with popular areas
export const MAJOR_CITIES = {
  lagos: [
    'Victoria Island',
    'Ikoyi',
    'Lekki',
    'Ikeja',
    'Surulere',
    'Yaba',
    'Lagos Island',
    'Ajah',
    'Magodo',
    'Gbagada'
  ],
  abuja: [
    'Maitama',
    'Asokoro',
    'Garki',
    'Wuse',
    'Gwarinpa',
    'Kubwa',
    'Nyanya',
    'Kuje'
  ],
  'port-harcourt': [
    'GRA Phase 1',
    'GRA Phase 2',
    'Old GRA',
    'Trans Amadi',
    'Rumuola',
    'Eliozu'
  ],
  kano: [
    'Fagge',
    'Nasarawa',
    'Gwale',
    'Dala',
    'Tarauni'
  ]
}

// Nigerian Timezone
export const TIMEZONE = 'Africa/Lagos' // WAT (West Africa Time)

// Currency
export const CURRENCY = {
  code: 'NGN',
  symbol: '₦',
  name: 'Nigerian Naira'
}

// Phone number format
export const PHONE_REGEX = /^(\+234|234|0)?[789][01]\d{8}$/
export const PHONE_FORMAT_EXAMPLE = '+2348012345678'

// Common Nigerian Languages
export const LANGUAGES = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'ha', label: 'Hausa', flag: '🇳🇬' },
  { value: 'yo', label: 'Yoruba', flag: '🇳🇬' },
  { value: 'ig', label: 'Igbo', flag: '🇳🇬' },
]

// Emergency Contact Types
export const EMERGENCY_CONTACT_TYPES = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'child', label: 'Child' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'friend', label: 'Friend' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'neighbor', label: 'Neighbor' },
  { value: 'other', label: 'Other' },
]