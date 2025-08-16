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
  FaStethoscope,
  FaClipboardList,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { BookingService } from '../../types/booking.types'
import { ScheduleData } from './AppointmentScheduling'
import { PatientInformation } from './PatientInformationForm'
import { PaymentResult } from './PaymentIntegration'
import { ASSESSMENT_PRICE } from '../../constants/assessments'

interface BookingConfirmationProps {
  selectedService: BookingService
  selectedSchedule: ScheduleData
  patientInfo: PatientInformation
  paymentResult: PaymentResult
}

export interface AssessmentBookingDetails {
  bookingId: string
  confirmationCode: string
  status: 'confirmed' | 'pending' | 'cancelled'
  createdAt: string
  estimatedArrival: string
  assessmentInstructions: string[]
  emergencyContact: string
  cancellationPolicy: string
  assessmentDuration: number
  followUpInfo: string
  assignedProfessional: {
    name: string
    rating: number
    experience: number
    specialization: string
  }
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

  // Generate mock healthcare professional data since it's not in ScheduleData
  const generateMockProfessional = () => {
    const professionals = [
      { name: 'Dr. Adaora Okonkwo', rating: 4.9, experience: 8, specialization: 'General Health Assessment' },
      { name: 'Nurse Joy Abiola', rating: 4.8, experience: 6, specialization: 'Preventive Care' },
      { name: 'Dr. Emeka Nwosu', rating: 4.9, experience: 12, specialization: 'Chronic Care Management' },
      { name: 'Nurse Sarah Ibrahim', rating: 4.7, experience: 5, specialization: 'Home Healthcare' },
      { name: 'Dr. Folake Adebayo', rating: 4.8, experience: 10, specialization: 'Family Medicine' },
    ]
    
    // Use a deterministic selection based on date and service to ensure consistency
    const index = (new Date(selectedSchedule.date).getDay() + selectedService.name.length) % professionals.length
    return professionals[index]
  }

  const mockProfessional = generateMockProfessional()

  // Generate assessment booking details
  const assessmentDetails: AssessmentBookingDetails = {
    bookingId: `RHC-${Date.now().toString().slice(-6)}`,
    confirmationCode: `ASS${mockProfessional.name.split(' ')[1].slice(0, 3).toUpperCase()}${Date.now().toString().slice(-4)}`,
    status: paymentResult.method === 'cash' ? 'pending' : 'confirmed',
    createdAt: new Date().toISOString(),
    estimatedArrival: calculateEstimatedArrival(),
    assessmentInstructions: generateAssessmentPreparationInstructions(),
    emergencyContact: '+234 901 234 5678',
    cancellationPolicy: 'Free cancellation up to 4 hours before assessment appointment',
    assessmentDuration: selectedService.duration,
    followUpInfo: 'Assessment report will be provided within 24 hours after completion',
    assignedProfessional: mockProfessional
  }

  function calculateEstimatedArrival(): string {
    // Parse the time from the time slot (e.g., "8:00 AM" -> Date object)
    const timeString = selectedSchedule.timeSlot.time
    const appointmentDate = new Date(selectedSchedule.date)
    
    // Simple time parsing - you might want to use a more robust solution
    const timeParts = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (timeParts) {
      let hours = parseInt(timeParts[1])
      const minutes = parseInt(timeParts[2])
      const period = timeParts[3].toUpperCase()
      
      if (period === 'PM' && hours !== 12) hours += 12
      if (period === 'AM' && hours === 12) hours = 0
      
      appointmentDate.setHours(hours, minutes, 0, 0)
    }
    
    const arrivalTime = new Date(appointmentDate.getTime() - 15 * 60000) // 15 minutes before
    return arrivalTime.toLocaleTimeString('en-NG', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  function generateAssessmentPreparationInstructions(): string[] {
    const baseInstructions = [
      'Ensure patient is available and well-rested for the assessment',
      'Have a quiet, comfortable space prepared for the evaluation',
      'Prepare good lighting for medical examination',
      'Have all medical documents and records easily accessible'
    ]

    const serviceSpecificInstructions: Record<string, string[]> = {
      'general-health-assessment': [
        'Have current medications list ready',
        'Wear comfortable, loose-fitting clothing',
        'Prepare any previous medical test results',
        'List any health concerns or symptoms to discuss'
      ],
      'elderly-care-assessment': [
        'Have complete medical history documents available',
        'Prepare comfortable seating with back support',
        'Ensure wheelchair accessibility if needed',
        'Have family member present for support if desired'
      ],
      'chronic-condition-assessment': [
        'Have recent blood work and test results ready',
        'Prepare detailed symptom diary or health tracking records',
        'List all current medications with dosages',
        'Note any recent changes in health status'
      ],
      'post-surgery-assessment': [
        'Have surgery discharge notes and instructions ready',
        'Prepare the surgical site for examination (clean, accessible)',
        'List any concerns about healing or recovery',
        'Have pain medication information available'
      ],
      'mental-health-screening': [
        'Ensure a private, quiet environment for discussion',
        'Prepare to discuss current stress levels and concerns',
        'Have list of any mood-related medications ready',
        'Consider having a trusted person nearby for support'
      ],
      'maternal-health-assessment': [
        'Have pregnancy records and antenatal care card ready',
        'Wear comfortable, easily adjustable clothing',
        'Prepare any ultrasound results or medical records',
        'Have prenatal vitamin information available'
      ],
      'pediatric-assessment': [
        'Have child\'s vaccination records and growth chart ready',
        'Prepare favorite toys or comfort items for the child',
        'Ensure child is well-fed and comfortable before assessment',
        'Have both parents present if possible'
      ],
      'emergency-assessment': [
        'Stay calm and follow healthcare professional instructions',
        'Have emergency contacts readily available',
        'Prepare clear description of symptoms and timeline',
        'Keep emergency medications easily accessible'
      ],
      'routine-checkup': [
        'Fast for 8-12 hours if blood work might be needed',
        'Prepare list of any health concerns or questions',
        'Have insurance information and ID ready',
        'Bring any vitamins or supplements currently taking'
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
    // Generate assessment receipt for download
    const receiptData = {
      bookingId: assessmentDetails.bookingId,
      assessmentType: selectedService.name,
      date: selectedSchedule.date,
      time: selectedSchedule.timeSlot.time,
      assessmentFee: ASSESSMENT_PRICE,
      patient: `${patientInfo.firstName} ${patientInfo.lastName}`,
      healthcareProfessional: assessmentDetails.assignedProfessional.name
    }
    
    const receiptText = `
ROYAL HEALTH CONSULT - ASSESSMENT RECEIPT
=========================================
Booking ID: ${assessmentDetails.bookingId}
Confirmation Code: ${assessmentDetails.confirmationCode}

ASSESSMENT DETAILS:
Assessment Type: ${selectedService.name}
Date: ${new Date(selectedSchedule.date).toLocaleDateString('en-NG')}
Time: ${selectedSchedule.timeSlot.time}
Duration: ${selectedService.duration} minutes
Patient: ${patientInfo.firstName} ${patientInfo.lastName}
Healthcare Professional: ${assessmentDetails.assignedProfessional.name}

PAYMENT INFORMATION:
Assessment Fee: ${formatPrice(ASSESSMENT_PRICE)}
Payment Method: ${paymentResult.method.toUpperCase()}
Transaction ID: ${paymentResult.transactionId}
Payment Status: ${paymentResult.status.toUpperCase()}

LOCATION:
Address: ${selectedSchedule.address.street}, ${selectedSchedule.address.state}
Contact: ${patientInfo.phone}

IMPORTANT NOTES:
- ${assessmentDetails.cancellationPolicy}
- Assessment report provided within 24 hours
- Follow-up recommendations will be included
- Emergency contact: ${assessmentDetails.emergencyContact}

Thank you for choosing Royal Health Consult!
For support: +234 901 234 5678
Email: support@royalhealthconsult.ng
    `.trim()

    const blob = new Blob([receiptText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `RHC-Assessment-Receipt-${assessmentDetails.bookingId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleGoHome = () => {
    navigate('/')
  }

  const handleViewDashboard = () => {
    navigate('/dashboard')
  }

  const handleBookAnother = () => {
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
              {paymentResult.method === 'cash' ? 'Assessment Scheduled!' : 'Assessment Confirmed!'}
            </Heading>
            <Text color="gray.600" fontSize="lg">
              {paymentResult.method === 'cash' 
                ? 'Your health assessment is scheduled. Payment will be collected after the assessment.'
                : 'Your payment has been processed and assessment appointment is confirmed.'
              }
            </Text>
          </VStack>

          {/* Confirmation Code */}
          <Card bg="primary.50" borderColor="primary.200" borderWidth="2px">
            <CardBody p={6} textAlign="center">
              <VStack spacing={2}>
                <Text fontSize="sm" color="primary.600" fontWeight="600">
                  ASSESSMENT CONFIRMATION CODE
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="primary.700" letterSpacing="wider">
                  {assessmentDetails.confirmationCode}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  Please save this code for your records
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Assessment Details */}
          <VStack spacing={6} align="stretch">
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody p={6}>
                <VStack spacing={6} align="start">
                  <HStack spacing={2}>
                    <Icon as={FaStethoscope} color="primary.500" />
                    <Heading size="md">Assessment Details</Heading>
                  </HStack>
                  
                  <VStack spacing={4} w="full">
                    <HStack spacing={4} w="full" align="start">
                      <Icon as={FaClipboardList} color="primary.500" fontSize="lg" mt={1} />
                      <VStack spacing={1} align="start" flex={1}>
                        <Text fontWeight="600">Assessment Type</Text>
                        <Text color="gray.600">{selectedService.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {selectedService.description}
                        </Text>
                      </VStack>
                    </HStack>

                    <Divider />

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
                          {selectedSchedule.timeSlot.time} • {assessmentDetails.assessmentDuration} minute assessment
                        </Text>
                      </VStack>
                    </HStack>

                    <Divider />

                    <HStack spacing={4} w="full" align="start">
                      <Icon as={FaUserNurse} color="blue.500" fontSize="lg" mt={1} />
                      <VStack spacing={1} align="start" flex={1}>
                        <Text fontWeight="600">Healthcare Professional</Text>
                        <Text color="gray.600">{assessmentDetails.assignedProfessional.name}</Text>
                        <HStack spacing={2}>
                          <Badge colorScheme="green" size="sm">
                            ⭐ {assessmentDetails.assignedProfessional.rating}
                          </Badge>
                          <Badge colorScheme="blue" size="sm">
                            {assessmentDetails.assignedProfessional.experience}y exp.
                          </Badge>
                          <Badge colorScheme="purple" size="sm">
                            Verified
                          </Badge>
                        </HStack>
                        <Text fontSize="xs" color="gray.500">
                          {assessmentDetails.assignedProfessional.specialization}
                        </Text>
                      </VStack>
                    </HStack>

                    <Divider />

                    <HStack spacing={4} w="full" align="start">
                      <Icon as={FaMapMarkerAlt} color="red.500" fontSize="lg" mt={1} />
                      <VStack spacing={1} align="start" flex={1}>
                        <Text fontWeight="600">Assessment Location</Text>
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
                          {assessmentDetails.estimatedArrival} (15 minutes before assessment)
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Healthcare professional will call 30 minutes before arrival
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
                      <Text>Assessment Type</Text>
                      <Text>{selectedService.name}</Text>
                    </HStack>
                    
                    <HStack justify="space-between" w="full">
                      <Text>Assessment Fee</Text>
                      <Text fontWeight="600">{formatPrice(ASSESSMENT_PRICE)}</Text>
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

                    <Divider />

                    <Alert status="info" size="sm">
                      <AlertIcon />
                      <Box fontSize="sm">
                        <AlertTitle>Fixed Assessment Fee!</AlertTitle>
                        <AlertDescription>
                          All health assessments are priced at {formatPrice(ASSESSMENT_PRICE)} regardless of type or duration.
                        </AlertDescription>
                      </Box>
                    </Alert>
                  </VStack>

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
                  <Heading size="md">Assessment Preparation</Heading>
                  
                  <VStack spacing={2} align="start" w="full">
                    {assessmentDetails.assessmentInstructions.map((instruction, index) => (
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
                        <Text fontSize="sm" color="gray.600">{assessmentDetails.emergencyContact}</Text>
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

            {/* Assessment Information */}
            <Alert status="success">
              <AlertIcon />
              <Box>
                <AlertTitle>What to Expect</AlertTitle>
                <AlertDescription fontSize="sm">
                  <VStack spacing={1} align="start" mt={2}>
                    <Text>• Professional health assessment in your home</Text>
                    <Text>• Comprehensive evaluation and health screening</Text>
                    <Text>• Written assessment report within 24 hours</Text>
                    <Text>• Personalized health recommendations</Text>
                    <Text>• Follow-up care guidance if needed</Text>
                  </VStack>
                </AlertDescription>
              </Box>
            </Alert>

            {/* Important Notes */}
            <Alert status="info">
              <AlertIcon />
              <Box>
                <AlertTitle>Important Notes</AlertTitle>
                <AlertDescription fontSize="sm">
                  <VStack spacing={1} align="start" mt={2}>
                    <Text>• {assessmentDetails.cancellationPolicy}</Text>
                    <Text>• SMS reminders will be sent 24h and 2h before assessment</Text>
                    <Text>• Healthcare professional will call 30 minutes before arrival</Text>
                    <Text>• {assessmentDetails.followUpInfo}</Text>
                    {paymentResult.method === 'cash' && (
                      <Text>• Please have exact amount ready: {formatPrice(ASSESSMENT_PRICE)}</Text>
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
                  onClick={handleBookAnother}
                  flex={1}
                >
                  Book Another Assessment
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
              We've sent assessment appointment details to {patientInfo.email} and {patientInfo.phone}. 
              {patientInfo.consentToSMSUpdates && ' You\'ll receive SMS reminders as your assessment appointment approaches.'}
            </AlertDescription>
          </Box>
        </Alert>
      </VStack>
    </Container>
  )
}

export default BookingConfirmation