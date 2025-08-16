// src/components/booking/BookingConfirmation.tsx
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  Button,
  Icon,
  Badge,
  Divider,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  QRCode,
  Image,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react'
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaClock,
  FaUserNurse,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaSms,
  FaWhatsapp,
  FaPrint,
  FaDownload,
  FaHome,
  FaReceipt,
  FaExclamationTriangle,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { BookingService } from '../../types/booking.types'
import { ScheduleData } from './AppointmentScheduling'
import { PatientInformation } from './PatientInformationForm'
import { PaymentResult } from './PaymentIntegration'

interface BookingConfirmationProps {
  selectedService: BookingService
  selectedSchedule: ScheduleData
  patientInfo: PatientInformation
  paymentResult: PaymentResult
}

export interface BookingDetails {
  bookingId: string
  confirmationCode: string
  status: 'confirmed' | 'pending' | 'cancelled'
  createdAt: string
  estimatedArrival: string
  instructions: string[]
  emergencyContact: string
  cancellationPolicy: string
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  selectedService,
  selectedSchedule,
  patientInfo,
  paymentResult,
}) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const navigate = useNavigate()

  // Generate booking details
  const bookingDetails: BookingDetails = {
    bookingId: `RHC-${Date.now().toString().slice(-6)}`,
    confirmationCode: `${selectedSchedule.nurse.name.split(' ')[0].toUpperCase()}${Date.now().toString().slice(-4)}`,
    status: paymentResult.method === 'cash' ? 'pending' : 'confirmed',
    createdAt: new Date().toISOString(),
    estimatedArrival: calculateEstimatedArrival(),
    instructions: generatePreparationInstructions(),
    emergencyContact: '+234 901 234 5678',
    cancellationPolicy: 'Free cancellation up to 4 hours before appointment'
  }

  function calculateEstimatedArrival(): string {
    const appointmentTime = new Date(`${selectedSchedule.date}T${selectedSchedule.timeSlot.time}`)
    const arrivalTime = new Date(appointmentTime.getTime() - 15 * 60000) // 15 minutes before
    return arrivalTime.toLocaleTimeString('en-NG', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  function generatePreparationInstructions(): string[] {
    const baseInstructions = [
      'Ensure patient is available at the scheduled time',
      'Have a clear path to the treatment area',
      'Prepare a comfortable, well-lit space for the nurse'
    ]

    const serviceSpecificInstructions: Record<string, string[]> = {
      'home-nursing': [
        'Have current medications list ready',
        'Prepare comfortable seating area',
        'Ensure good lighting for medical procedures'
      ],
      'elderly-care': [
        'Have medical history documents available',
        'Prepare comfortable clothing for patient',
        'Ensure wheelchair accessibility if needed'
      ],
      'post-surgery': [
        'Have surgery discharge notes ready',
        'Prepare sterile environment',
        'Keep pain medication accessible'
      ],
      'wound-care': [
        'Clean the wound area gently',
        'Remove any old dressing if advised',
        'Have a clean towel available'
      ],
      'physiotherapy': [
        'Wear comfortable, loose clothing',
        'Prepare an open space for exercises',
        'Have water available for hydration'
      ],
      'emergency-care': [
        'Stay calm and follow nurse instructions',
        'Have emergency contacts readily available',
        'Clear path for potential ambulance access'
      ]
    }

    return [
      ...baseInstructions,
      ...(serviceSpecificInstructions[selectedService.id] || [])
    ]
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF
    const receiptData = {
      bookingId: bookingDetails.bookingId,
      service: selectedService.name,
      date: selectedSchedule.date,
      time: selectedSchedule.timeSlot.time,
      amount: paymentResult.amount,
      patient: `${patientInfo.firstName} ${patientInfo.lastName}`
    }
    
    // Create a simple text receipt for download
    const receiptText = `
ROYAL HEALTH CONSULT - RECEIPT
==============================
Booking ID: ${bookingDetails.bookingId}
Confirmation Code: ${bookingDetails.confirmationCode}

Service: ${selectedService.name}
Date: ${new Date(selectedSchedule.date).toLocaleDateString('en-NG')}
Time: ${selectedSchedule.timeSlot.time}
Patient: ${patientInfo.firstName} ${patientInfo.lastName}
Nurse: ${selectedSchedule.nurse.name}

Amount Paid: ${formatPrice(paymentResult.amount)}
Payment Method: ${paymentResult.method.toUpperCase()}
Transaction ID: ${paymentResult.transactionId}

Address: ${selectedSchedule.address.street}, ${selectedSchedule.address.state}
Phone: ${patientInfo.phone}

Thank you for choosing Royal Health Consult!
For support: +234 901 234 5678
    `.trim()

    const blob = new Blob([receiptText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `RHC-Receipt-${bookingDetails.bookingId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleGoHome = () => {
    navigate('/')
  }

  const handleViewDashboard = () => {
    navigate('/dashboard')
  }

  const handleReschedule = () => {
    navigate('/booking')
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Success Header */}
        <VStack spacing={6} textAlign="center">
          <Box
            w={20}
            h={20}
            bg="green.50"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FaCheckCircle} color="green.500" fontSize="3xl" />
          </Box>
          
          <VStack spacing={2}>
            <Heading size="xl" color="gray.800">
              {paymentResult.method === 'cash' ? 'Appointment Scheduled!' : 'Booking Confirmed!'}
            </Heading>
            <Text color="gray.600" fontSize="lg">
              {paymentResult.method === 'cash' 
                ? 'Your appointment is scheduled. Payment will be collected upon service delivery.'
                : 'Your payment has been processed and appointment is confirmed.'
              }
            </Text>
          </VStack>

          {/* Confirmation Code */}
          <Card bg="primary.50" borderColor="primary.200" borderWidth="2px">
            <CardBody p={6} textAlign="center">
              <VStack spacing={2}>
                <Text fontSize="sm" color="primary.600" fontWeight="600">
                  CONFIRMATION CODE
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="primary.700" letterSpacing="wider">
                  {bookingDetails.confirmationCode}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  Please save this code for your records
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Appointment Details */}
          <VStack spacing={6} align="stretch">
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody p={6}>
                <VStack spacing={6} align="start">
                  <Heading size="md">Appointment Details</Heading>
                  
                  <VStack spacing={4} w="full">
                    <HStack spacing={4} w="full" align="start">
                      <Icon as={FaCalendarAlt} color="primary.500" fontSize="lg" mt={1} />
                      <VStack spacing={1} align="start" flex={1}>
                        <Text fontWeight="600">Date & Time</Text>
                        <Text color="gray.600">
                          {new Date(selectedSchedule.date).toLocaleDateString('en-NG', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Text>
                        <Text color="gray.600">
                          {selectedSchedule.timeSlot.time} • {selectedService.duration / 60}h session
                        </Text>
                      </VStack>
                    </HStack>

                    <Divider />

                    <HStack spacing={4} w="full" align="start">
                      <Icon as={FaUserNurse} color="blue.500" fontSize="lg" mt={1} />
                      <VStack spacing={1} align="start" flex={1}>
                        <Text fontWeight="600">Healthcare Professional</Text>
                        <Text color="gray.600">{selectedSchedule.nurse.name}</Text>
                        <HStack spacing={2}>
                          <Badge colorScheme="green" size="sm">
                            ⭐ {selectedSchedule.nurse.rating}
                          </Badge>
                          <Badge colorScheme="blue" size="sm">
                            {selectedSchedule.nurse.experience}y exp.
                          </Badge>
                        </HStack>
                      </VStack>
                    </HStack>

                    <Divider />

                    <HStack spacing={4} w="full" align="start">
                      <Icon as={FaMapMarkerAlt} color="red.500" fontSize="lg" mt={1} />
                      <VStack spacing={1} align="start" flex={1}>
                        <Text fontWeight="600">Service Location</Text>
                        <Text color="gray.600">
                          {selectedSchedule.address.street}
                        </Text>
                        <Text color="gray.600">
                          {selectedSchedule.address.city}, {selectedSchedule.address.state}
                        </Text>
                        {selectedSchedule.address.landmark && (
                          <Text fontSize="sm" color="gray.500">
                            Near: {selectedSchedule.address.landmark}
                          </Text>
                        )}
                      </VStack>
                    </HStack>

                    <Divider />

                    <HStack spacing={4} w="full" align="start">
                      <Icon as={FaClock} color="orange.500" fontSize="lg" mt={1} />
                      <VStack spacing={1} align="start" flex={1}>
                        <Text fontWeight="600">Estimated Arrival</Text>
                        <Text color="gray.600">
                          {bookingDetails.estimatedArrival} (15 minutes before appointment)
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Payment Summary */}
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <HStack spacing={2}>
                    <Icon as={FaReceipt} color="green.500" />
                    <Heading size="md">Payment Summary</Heading>
                  </HStack>
                  
                  <VStack spacing={2} w="full">
                    <HStack justify="space-between" w="full">
                      <Text>Service</Text>
                      <Text>{selectedService.name}</Text>
                    </HStack>
                    
                    <HStack justify="space-between" w="full">
                      <Text>Amount</Text>
                      <Text fontWeight="600">{formatPrice(paymentResult.amount)}</Text>
                    </HStack>
                    
                    <HStack justify="space-between" w="full">
                      <Text>Payment Method</Text>
                      <Badge colorScheme={paymentResult.method === 'cash' ? 'orange' : 'green'}>
                        {paymentResult.method.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </HStack>
                    
                    <HStack justify="space-between" w="full">
                      <Text>Transaction ID</Text>
                      <Text fontSize="sm" color="gray.600">
                        {paymentResult.transactionId}
                      </Text>
                    </HStack>
                    
                    <HStack justify="space-between" w="full">
                      <Text>Status</Text>
                      <Badge colorScheme={paymentResult.status === 'success' ? 'green' : 'yellow'}>
                        {paymentResult.status.toUpperCase()}
                      </Badge>
                    </HStack>
                  </VStack>

                  <Divider />

                  <HStack spacing={2} w="full">
                    <Button
                      leftIcon={<FaPrint />}
                      size="sm"
                      variant="outline"
                      onClick={handlePrintReceipt}
                      flex={1}
                    >
                      Print
                    </Button>
                    <Button
                      leftIcon={<FaDownload />}
                      size="sm"
                      variant="outline"
                      onClick={handleDownloadReceipt}
                      flex={1}
                    >
                      Download
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>

          {/* Instructions & Next Steps */}
          <VStack spacing={6} align="stretch">
            {/* Preparation Instructions */}
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <Heading size="md">Preparation Instructions</Heading>
                  
                  <VStack spacing={2} align="start" w="full">
                    {bookingDetails.instructions.map((instruction, index) => (
                      <HStack key={index} spacing={3} align="start">
                        <Box
                          w={2}
                          h={2}
                          bg="primary.500"
                          borderRadius="full"
                          mt={2}
                          flexShrink={0}
                        />
                        <Text fontSize="sm" color="gray.700">
                          {instruction}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Contact Information */}
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <Heading size="md">Contact & Support</Heading>
                  
                  <VStack spacing={3} w="full">
                    <HStack spacing={3} w="full">
                      <Icon as={FaPhone} color="blue.500" />
                      <VStack spacing={0} align="start" flex={1}>
                        <Text fontWeight="600" fontSize="sm">Emergency Hotline</Text>
                        <Text fontSize="sm" color="gray.600">{bookingDetails.emergencyContact}</Text>
                      </VStack>
                    </HStack>
                    
                    <HStack spacing={3} w="full">
                      <Icon as={FaWhatsapp} color="green.500" />
                      <VStack spacing={0} align="start" flex={1}>
                        <Text fontWeight="600" fontSize="sm">WhatsApp Support</Text>
                        <Text fontSize="sm" color="gray.600">+234 901 234 5678</Text>
                      </VStack>
                    </HStack>
                    
                    <HStack spacing={3} w="full">
                      <Icon as={FaEnvelope} color="purple.500" />
                      <VStack spacing={0} align="start" flex={1}>
                        <Text fontWeight="600" fontSize="sm">Email Support</Text>
                        <Text fontSize="sm" color="gray.600">support@royalhealthconsult.ng</Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Important Notes */}
            <Alert status="info">
              <AlertIcon />
              <Box>
                <AlertTitle>Important Notes</AlertTitle>
                <AlertDescription fontSize="sm">
                  <VStack spacing={1} align="start" mt={2}>
                    <Text>• {bookingDetails.cancellationPolicy}</Text>
                    <Text>• SMS reminders will be sent 24h and 2h before appointment</Text>
                    <Text>• Nurse will call 30 minutes before arrival</Text>
                    {paymentResult.method === 'cash' && (
                      <Text>• Please have exact amount ready for cash payment</Text>
                    )}
                  </VStack>
                </AlertDescription>
              </Box>
            </Alert>

            {/* Action Buttons */}
            <VStack spacing={3}>
              <Button
                leftIcon={<FaHome />}
                colorScheme="primary"
                size="lg"
                onClick={handleViewDashboard}
                w="full"
              >
                View Dashboard
              </Button>
              
              <HStack spacing={3} w="full">
                <Button
                  variant="outline"
                  onClick={handleReschedule}
                  flex={1}
                >
                  Book Another
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGoHome}
                  flex={1}
                >
                  Go Home
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </SimpleGrid>

        {/* SMS/Email Confirmation Notice */}
        <Alert status="success">
          <AlertIcon />
          <Box>
            <AlertTitle>Confirmation Sent!</AlertTitle>
            <AlertDescription>
              We've sent appointment details to {patientInfo.email} and {patientInfo.phone}. 
              {patientInfo.consentToSMSUpdates && ' You\'ll receive SMS reminders as your appointment approaches.'}
            </AlertDescription>
          </Box>
        </Alert>
      </VStack>
    </Container>
  )
}

export default BookingConfirmation