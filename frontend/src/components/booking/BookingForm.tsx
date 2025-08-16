import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Textarea,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Icon,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from '@chakra-ui/react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone } from 'react-icons/fa'
import { BookingService, BookingFormData, TimeSlot } from '../../types/booking.types'
import { NIGERIAN_STATES, PHONE_REGEX } from '../../utils/constants'

// Validation schema
const bookingSchema = z.object({
  // Patient Information
  patientName: z.string().min(2, 'Name must be at least 2 characters'),
  patientAge: z.number().min(1, 'Age is required').max(120, 'Please enter a valid age'),
  patientGender: z.enum(['male', 'female', 'other']),
  patientPhone: z.string().regex(PHONE_REGEX, 'Please enter a valid Nigerian phone number'),
  patientEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  
  // Appointment Details
  date: z.string().min(1, 'Please select a date'),
  timeSlot: z.string().min(1, 'Please select a time'),
  
  // Location
  state: z.string().min(1, 'Please select your state'),
  city: z.string().min(1, 'Please select your city'),
  area: z.string().min(1, 'Please specify your area'),
  street: z.string().min(5, 'Please provide a detailed address'),
  landmark: z.string().optional(),
  
  // Emergency Contact
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().regex(PHONE_REGEX, 'Please enter a valid phone number'),
  emergencyContactRelationship: z.string().min(1, 'Please specify relationship'),
  
  // Medical Information
  medicalCondition: z.string().optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),
  
  // Preferences
  nurseGenderPreference: z.enum(['male', 'female', 'no-preference']),
  specialRequirements: z.string().optional(),
  
  // Payment
  paymentMethod: z.enum(['card', 'bank-transfer', 'ussd', 'cash']),
})

type BookingFormSchema = z.infer<typeof bookingSchema>

interface BookingFormProps {
  service: BookingService
  onSubmit: (data: BookingFormData) => void
  onBack: () => void
}

const BookingForm: React.FC<BookingFormProps> = ({ service, onSubmit, onBack }) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const toast = useToast()

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<BookingFormSchema>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      nurseGenderPreference: 'no-preference',
      paymentMethod: 'card'
    }
  })

  const watchedState = watch('state')
  const watchedDate = watch('date')

  // Generate available time slots (mock data - replace with API call)
  const generateTimeSlots = (date: string): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const startHour = 8
    const endHour = 20
    
    for (let hour = startHour; hour < endHour; hour++) {
      ['00', '30'].forEach(minute => {
        const time = `${hour.toString().padStart(2, '0')}:${minute}`
        slots.push({
          time,
          available: Math.random() > 0.3, // 70% availability
          price: service.price
        })
      })
    }
    
    return slots
  }

  // Handle date change and load time slots
  const handleDateChange = async (date: string) => {
    setSelectedDate(date)
    setValue('date', date)
    
    if (date) {
      setIsLoadingSlots(true)
      // Simulate API call
      setTimeout(() => {
        const slots = generateTimeSlots(date)
        setAvailableTimeSlots(slots)
        setIsLoadingSlots(false)
      }, 1000)
    }
  }

  const onFormSubmit = (data: BookingFormSchema) => {
    const formData: BookingFormData = {
      serviceId: service.id,
      date: data.date,
      timeSlot: data.timeSlot,
      duration: service.duration,
      patientName: data.patientName,
      patientAge: data.patientAge,
      patientGender: data.patientGender,
      patientPhone: data.patientPhone,
      patientEmail: data.patientEmail || undefined,
      medicalCondition: data.medicalCondition,
      medications: data.medications,
      allergies: data.allergies,
      emergencyContact: {
        name: data.emergencyContactName,
        phone: data.emergencyContactPhone,
        relationship: data.emergencyContactRelationship
      },
      address: {
        street: data.street,
        area: data.area,
        city: data.city,
        state: data.state,
        landmark: data.landmark
      },
      specialRequirements: data.specialRequirements,
      nurseGenderPreference: data.nurseGenderPreference,
      paymentMethod: data.paymentMethod,
      totalAmount: service.price
    }

    onSubmit(formData)
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <VStack spacing={4} textAlign="center">
          <Heading size="lg" color="gray.800">
            Book Your Appointment
          </Heading>
          <Text color="gray.600">
            Please provide your details to schedule your {service.name} appointment
          </Text>
        </VStack>

        {/* Service Summary */}
        <Card>
          <CardBody>
            <HStack justify="space-between" align="start">
              <VStack align="start" spacing={2}>
                <Heading size="md" color="primary.500">
                  {service.name}
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  {service.description}
                </Text>
                <HStack spacing={4}>
                  <Badge colorScheme="blue">{service.duration / 60}h session</Badge>
                  <Badge colorScheme="green">₦{service.price.toLocaleString()}</Badge>
                </HStack>
              </VStack>
              <Button size="sm" variant="ghost" onClick={onBack}>
                Change Service
              </Button>
            </HStack>
          </CardBody>
        </Card>

        {/* Booking Form */}
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <VStack spacing={8}>
            {/* Patient Information */}
            <Card w="full">
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Heading size="md" color="gray.800">
                    Patient Information
                  </Heading>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isInvalid={!!errors.patientName}>
                      <FormLabel>Full Name *</FormLabel>
                      <Input {...register('patientName')} placeholder="Enter patient's full name" />
                      <FormErrorMessage>{errors.patientName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.patientAge}>
                      <FormLabel>Age *</FormLabel>
                      <Input 
                        type="number" 
                        {...register('patientAge', { valueAsNumber: true })} 
                        placeholder="Age" 
                      />
                      <FormErrorMessage>{errors.patientAge?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.patientGender}>
                      <FormLabel>Gender *</FormLabel>
                      <Select {...register('patientGender')} placeholder="Select gender">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Select>
                      <FormErrorMessage>{errors.patientGender?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.patientPhone}>
                      <FormLabel>Phone Number *</FormLabel>
                      <Input 
                        {...register('patientPhone')} 
                        placeholder="+2348012345678" 
                        type="tel"
                      />
                      <FormErrorMessage>{errors.patientPhone?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.patientEmail}>
                      <FormLabel>Email Address</FormLabel>
                      <Input 
                        {...register('patientEmail')} 
                        placeholder="email@example.com" 
                        type="email"
                      />
                      <FormErrorMessage>{errors.patientEmail?.message}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            {/* Appointment Scheduling */}
            <Card w="full">
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Heading size="md" color="gray.800">
                    <HStack>
                      <Icon as={FaCalendarAlt} color="primary.500" />
                      <Text>Schedule Appointment</Text>
                    </HStack>
                  </Heading>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isInvalid={!!errors.date}>
                      <FormLabel>Preferred Date *</FormLabel>
                      <Input 
                        type="date" 
                        min={getMinDate()}
                        onChange={(e) => handleDateChange(e.target.value)}
                      />
                      <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.timeSlot}>
                      <FormLabel>Preferred Time *</FormLabel>
                      <Select 
                        {...register('timeSlot')} 
                        placeholder={isLoadingSlots ? "Loading times..." : "Select time"}
                        disabled={!selectedDate || isLoadingSlots}
                      >
                        {availableTimeSlots.map((slot) => (
                          <option 
                            key={slot.time} 
                            value={slot.time}
                            disabled={!slot.available}
                          >
                            {slot.time} {!slot.available && '(Unavailable)'}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>{errors.timeSlot?.message}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>

                  {selectedDate && availableTimeSlots.length === 0 && !isLoadingSlots && (
                    <Alert status="warning">
                      <AlertIcon />
                      <AlertTitle>No available slots!</AlertTitle>
                      <AlertDescription>
                        Please select a different date or contact us for emergency appointments.
                      </AlertDescription>
                    </Alert>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Location Information */}
            <Card w="full">
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Heading size="md" color="gray.800">
                    <HStack>
                      <Icon as={FaMapMarkerAlt} color="primary.500" />
                      <Text>Location Details</Text>
                    </HStack>
                  </Heading>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isInvalid={!!errors.state}>
                      <FormLabel>State *</FormLabel>
                      <Select {...register('state')} placeholder="Select your state">
                        {NIGERIAN_STATES.map((state) => (
                          <option key={state.value} value={state.value}>
                            {state.label}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>{errors.state?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.city}>
                      <FormLabel>City *</FormLabel>
                      <Input {...register('city')} placeholder="Enter your city" />
                      <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.area}>
                      <FormLabel>Area/District *</FormLabel>
                      <Input {...register('area')} placeholder="Enter your area or district" />
                      <FormErrorMessage>{errors.area?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.landmark}>
                      <FormLabel>Landmark</FormLabel>
                      <Input {...register('landmark')} placeholder="Nearby landmark (optional)" />
                      <FormErrorMessage>{errors.landmark?.message}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>

                  <FormControl isInvalid={!!errors.street}>
                    <FormLabel>Street Address *</FormLabel>
                    <Textarea 
                      {...register('street')} 
                      placeholder="Enter your detailed street address"
                      rows={3}
                    />
                    <FormErrorMessage>{errors.street?.message}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Emergency Contact */}
            <Card w="full">
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Heading size="md" color="gray.800">
                    <HStack>
                      <Icon as={FaPhone} color="primary.500" />
                      <Text>Emergency Contact</Text>
                    </HStack>
                  </Heading>

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <FormControl isInvalid={!!errors.emergencyContactName}>
                      <FormLabel>Contact Name *</FormLabel>
                      <Input {...register('emergencyContactName')} placeholder="Full name" />
                      <FormErrorMessage>{errors.emergencyContactName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.emergencyContactPhone}>
                      <FormLabel>Contact Phone *</FormLabel>
                      <Input 
                        {...register('emergencyContactPhone')} 
                        placeholder="+2348012345678" 
                        type="tel"
                      />
                      <FormErrorMessage>{errors.emergencyContactPhone?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.emergencyContactRelationship}>
                      <FormLabel>Relationship *</FormLabel>
                      <Select {...register('emergencyContactRelationship')} placeholder="Select relationship">
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="child">Child</option>
                        <option value="sibling">Sibling</option>
                        <option value="friend">Friend</option>
                        <option value="colleague">Colleague</option>
                        <option value="other">Other</option>
                      </Select>
                      <FormErrorMessage>{errors.emergencyContactRelationship?.message}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            {/* Medical Information */}
            <Card w="full">
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Heading size="md" color="gray.800">
                    Medical Information
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    This information helps our nurses provide better care (optional but recommended)
                  </Text>

                  <SimpleGrid columns={{ base: 1 }} spacing={4}>
                    <FormControl>
                      <FormLabel>Current Medical Condition</FormLabel>
                      <Textarea 
                        {...register('medicalCondition')} 
                        placeholder="Describe any current medical conditions or concerns"
                        rows={3}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Current Medications</FormLabel>
                      <Textarea 
                        {...register('medications')} 
                        placeholder="List any medications currently being taken"
                        rows={2}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Allergies</FormLabel>
                      <Textarea 
                        {...register('allergies')} 
                        placeholder="List any known allergies (medications, foods, etc.)"
                        rows={2}
                      />
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            {/* Preferences */}
            <Card w="full">
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Heading size="md" color="gray.800">
                    Service Preferences
                  </Heading>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isInvalid={!!errors.nurseGenderPreference}>
                      <FormLabel>Nurse Gender Preference</FormLabel>
                      <Select {...register('nurseGenderPreference')}>
                        <option value="no-preference">No Preference</option>
                        <option value="female">Female Nurse</option>
                        <option value="male">Male Nurse</option>
                      </Select>
                      <FormErrorMessage>{errors.nurseGenderPreference?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.paymentMethod}>
                      <FormLabel>Payment Method *</FormLabel>
                      <Select {...register('paymentMethod')}>
                        <option value="card">Card Payment (Flutterwave)</option>
                        <option value="bank-transfer">Bank Transfer</option>
                        <option value="ussd">USSD Banking</option>
                        <option value="cash">Cash Payment</option>
                      </Select>
                      <FormErrorMessage>{errors.paymentMethod?.message}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>

                  <FormControl>
                    <FormLabel>Special Requirements</FormLabel>
                    <Textarea 
                      {...register('specialRequirements')} 
                      placeholder="Any special requirements or instructions for the nurse"
                      rows={3}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Total Amount */}
            <Card w="full" bg="primary.50" border="2px" borderColor="primary.200">
              <CardBody>
                <HStack justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" color="gray.800">
                      Total Amount
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {service.name} - {service.duration / 60}h session
                    </Text>
                  </VStack>
                  <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                    ₦{service.price.toLocaleString()}
                  </Text>
                </HStack>
              </CardBody>
            </Card>

            {/* Submit Buttons */}
            <HStack spacing={4} w="full" justify="space-between">
              <Button
                variant="outline"
                onClick={onBack}
                size="lg"
                px={8}
              >
                Back to Services
              </Button>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                px={8}
                isLoading={isSubmitting}
                loadingText="Booking..."
                className="hover-lift"
              >
                Confirm Booking
              </Button>
            </HStack>

            {/* Terms Notice */}
            <Box textAlign="center" pt={4}>
              <Text fontSize="xs" color="gray.500">
                By confirming this booking, you agree to our{' '}
                <Text as="span" color="primary.500" textDecoration="underline" cursor="pointer">
                  Terms of Service
                </Text>
                {' '}and{' '}
                <Text as="span" color="primary.500" textDecoration="underline" cursor="pointer">
                  Privacy Policy
                </Text>
              </Text>
            </Box>
          </VStack>
        </form>
      </VStack>
    </Container>
  )
}

export default BookingForm