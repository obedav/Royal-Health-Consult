import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { FaChevronRight, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ServiceSelection from '../components/booking/ServiceSelection'
import AppointmentScheduling, { ScheduleData } from '../components/booking/AppointmentScheduling'
import PatientInformationForm, { PatientInformation } from '../components/booking/PatientInformationForm'
import PaymentIntegration, { PaymentResult } from '../components/booking/PaymentIntegration'
import BookingConfirmation from '../components/booking/BookingConfirmation'
import { BookingService } from '../types/booking.types'

const Booking: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedService, setSelectedService] = useState<BookingService | undefined>()
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleData | undefined>()
  const [patientInfo, setPatientInfo] = useState<PatientInformation | undefined>()
  const [paymentResult, setPaymentResult] = useState<PaymentResult | undefined>()
  
  // Booking steps
  const steps = [
    { title: 'Select Service', description: 'Choose your healthcare service' },
    { title: 'Schedule', description: 'Pick date and time' },
    { title: 'Details', description: 'Patient information' },
    { title: 'Payment', description: 'Confirm and pay' },
    { title: 'Confirmation', description: 'Booking confirmed' }
  ]

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  // Check for pre-selected service from URL on component mount
  useEffect(() => {
    const serviceParam = searchParams.get('service')
    if (serviceParam) {
      // Service will be auto-selected by ServiceSelection component
      // We can add some feedback here
      console.log(`Pre-selecting service: ${serviceParam}`)
    }
  }, [searchParams])

  const handleServiceSelect = (service: BookingService) => {
    setSelectedService(service)
    
    // Update URL to reflect selected service (optional)
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('service', service.id)
    navigate(`/booking?${newSearchParams.toString()}`, { replace: true })
  }

  const handleScheduleSelect = (scheduleData: ScheduleData) => {
    setSelectedSchedule(scheduleData)
  }

  const handlePatientInfoSubmit = (patientData: PatientInformation) => {
    setPatientInfo(patientData)
  }

  const handlePaymentSuccess = (payment: PaymentResult) => {
    setPaymentResult(payment)
  }

  const handlePaymentError = (error: string) => {
    // Handle payment error - you could show additional UI feedback here
    console.error('Payment error:', error)
    // The toast notification is already handled in the PaymentIntegration component
  }

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const handleBackToServices = () => {
    navigate('/services')
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ServiceSelection
            onServiceSelect={handleServiceSelect}
            selectedService={selectedService}
          />
        )
      case 1:
        return selectedService ? (
          <AppointmentScheduling
            selectedService={selectedService}
            onScheduleSelect={handleScheduleSelect}
            selectedSchedule={selectedSchedule}
          />
        ) : (
          <Box textAlign="center" py={20}>
            <Alert status="warning" maxW="500px" mx="auto">
              <AlertIcon />
              <Box>
                <AlertTitle>Service Required!</AlertTitle>
                <AlertDescription>
                  Please go back and select a service first.
                </AlertDescription>
              </Box>
            </Alert>
          </Box>
        )
      case 2:
        return selectedService && selectedSchedule ? (
          <PatientInformationForm
            selectedService={selectedService}
            selectedSchedule={selectedSchedule}
            onPatientInfoSubmit={handlePatientInfoSubmit}
            patientInfo={patientInfo}
          />
        ) : (
          <Box textAlign="center" py={20}>
            <Alert status="warning" maxW="500px" mx="auto">
              <AlertIcon />
              <Box>
                <AlertTitle>Previous Steps Required!</AlertTitle>
                <AlertDescription>
                  Please complete service selection and appointment scheduling first.
                </AlertDescription>
              </Box>
            </Alert>
          </Box>
        )
      case 3:
        return selectedService && selectedSchedule && patientInfo ? (
          <PaymentIntegration
            selectedService={selectedService}
            selectedSchedule={selectedSchedule}
            patientInfo={patientInfo}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        ) : (
          <Box textAlign="center" py={20}>
            <Alert status="warning" maxW="500px" mx="auto">
              <AlertIcon />
              <Box>
                <AlertTitle>Previous Steps Required!</AlertTitle>
                <AlertDescription>
                  Please complete all previous steps before proceeding to payment.
                </AlertDescription>
              </Box>
            </Alert>
          </Box>
        )
      case 4:
        return selectedService && selectedSchedule && patientInfo && paymentResult ? (
          <BookingConfirmation
            selectedService={selectedService}
            selectedSchedule={selectedSchedule}
            patientInfo={patientInfo}
            paymentResult={paymentResult}
          />
        ) : (
          <Box textAlign="center" py={20}>
            <Alert status="warning" maxW="500px" mx="auto">
              <AlertIcon />
              <Box>
                <AlertTitle>Payment Required!</AlertTitle>
                <AlertDescription>
                  Please complete payment to view your booking confirmation.
                </AlertDescription>
              </Box>
            </Alert>
          </Box>
        )
      default:
        return null
    }
  }

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Breadcrumb */}
          <Breadcrumb spacing="8px" separator={<FaChevronRight color="gray.500" />}>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/')} color="primary.500" cursor="pointer">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="gray.600">Book Appointment</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color="gray.800">
              Book Your Healthcare Appointment
            </Heading>
            <Text color="gray.600" fontSize="lg" maxW="600px">
              Follow these simple steps to schedule professional healthcare services 
              in the comfort of your home.
            </Text>
            
            {/* Pre-selection notification */}
            {searchParams.get('service') && selectedService && (
              <Alert status="info" maxW="600px" borderRadius="lg">
                <AlertIcon />
                <Box>
                  <AlertTitle fontSize="sm">Service Pre-selected!</AlertTitle>
                  <AlertDescription fontSize="sm">
                    <strong>{selectedService.name}</strong> has been automatically selected. 
                    You can change this in step 1 if needed.
                  </AlertDescription>
                </Box>
              </Alert>
            )}
          </VStack>

          {/* Progress Stepper */}
          <Box maxW="800px" mx="auto" w="full">
            <Stepper index={activeStep} colorScheme="primary">
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>

                  <Box flexShrink="0">
                    <StepTitle fontSize={{ base: 'sm', md: 'md' }}>
                      {step.title}
                    </StepTitle>
                    <StepDescription fontSize={{ base: 'xs', md: 'sm' }}>
                      {step.description}
                    </StepDescription>
                  </Box>

                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Step Content */}
          <Box>
            {renderStepContent()}
          </Box>

          {/* Navigation Buttons */}
          {activeStep !== 0 && (
            <HStack spacing={4} justify="center" pt={8}>
              <Button
                leftIcon={<FaArrowLeft />}
                onClick={handlePrevious}
                variant="outline"
                colorScheme="gray"
                size="lg"
              >
                Previous
              </Button>
              
              {activeStep === 0 ? (
                <Button
                  rightIcon={<FaArrowRight />}
                  onClick={handleNext}
                  colorScheme="primary"
                  size="lg"
                  isDisabled={!selectedService}
                >
                  Continue to Schedule
                </Button>
              ) : activeStep === 1 ? (
                <Button
                  rightIcon={<FaArrowRight />}
                  onClick={handleNext}
                  colorScheme="primary"
                  size="lg"
                  isDisabled={!selectedSchedule}
                >
                  Continue to Patient Details
                </Button>
              ) : activeStep === 2 ? (
                <Button
                  rightIcon={<FaArrowRight />}
                  onClick={handleNext}
                  colorScheme="primary"
                  size="lg"
                  isDisabled={!patientInfo}
                >
                  Continue to Payment
                </Button>
              ) : activeStep === 3 ? (
                <Button
                  rightIcon={<FaArrowRight />}
                  onClick={handleNext}
                  colorScheme="primary"
                  size="lg"
                  isDisabled={!paymentResult}
                >
                  View Confirmation
                </Button>
              ) : activeStep < steps.length - 1 ? (
                <Button
                  rightIcon={<FaArrowRight />}
                  onClick={handleNext}
                  colorScheme="primary"
                  size="lg"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/dashboard')}
                  colorScheme="primary"
                  size="lg"
                >
                  View Dashboard
                </Button>
              )}
            </HStack>
          )}

          {/* Service Selection Navigation */}
          {activeStep === 0 && (
            <VStack spacing={4} pt={4}>
              <HStack spacing={4} justify="center">
                <Button
                  onClick={handleBackToServices}
                  variant="ghost"
                  colorScheme="primary"
                  size="sm"
                >
                  ← Back to All Services
                </Button>
                
                {selectedService && (
                  <Button
                    rightIcon={<FaArrowRight />}
                    onClick={handleNext}
                    colorScheme="primary"
                    size="lg"
                    px={8}
                  >
                    Continue with {selectedService.name}
                  </Button>
                )}
              </HStack>
              
              {!selectedService && (
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Please select a service to continue
                </Text>
              )}
            </VStack>
          )}

          {/* Help Section */}
          <Box
            bg="blue.50"
            borderRadius="lg"
            p={6}
            textAlign="center"
            maxW="600px"
            mx="auto"
          >
            <Text fontWeight="600" color="blue.800" mb={2}>
              Need Help?
            </Text>
            <Text fontSize="sm" color="blue.700" mb={4}>
              Our customer support team is available 24/7 to assist you with your booking.
            </Text>
            <HStack spacing={4} justify="center">
              <Button size="sm" colorScheme="blue" variant="outline">
                Call +234 801 234 5678
              </Button>
              <Button size="sm" colorScheme="green" variant="outline">
                WhatsApp Support
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default Booking