// src/components/booking/AppointmentScheduling.tsx
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Button,
  Icon,
  Badge,
  Avatar,
  Flex,
  useColorModeValue,
  Select,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
} from '@chakra-ui/react'
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserNurse,
  FaStar,
  FaCheckCircle,
  FaInfoCircle,
} from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { BookingService } from '../../types/booking.types'

interface SchedulingProps {
  selectedService: BookingService
  onScheduleSelect: (scheduleData: ScheduleData) => void
  selectedSchedule?: ScheduleData
}

export interface ScheduleData {
  date: string
  timeSlot: TimeSlot
  nurse: Nurse
  address: Address
  specialRequirements?: string
}

interface TimeSlot {
  id: string
  time: string
  duration: number
  available: boolean
  price?: number // May vary based on time (emergency rates, etc.)
}

interface Nurse {
  id: string
  name: string
  avatar?: string
  rating: number
  experience: number
  specializations: string[]
  availability: string[]
  verified: boolean
}

interface Address {
  street: string
  city: string
  state: string
  landmark?: string
  phoneNumber: string
}

const AppointmentScheduling: React.FC<SchedulingProps> = ({
  selectedService,
  onScheduleSelect,
  selectedSchedule,
}) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  // State management
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null)
  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    state: 'Lagos', // Default to Lagos
    phoneNumber: '',
  })
  const [specialRequirements, setSpecialRequirements] = useState('')

  // Generate next 14 days for date selection
  const generateAvailableDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Skip if it's too late today (after 6 PM)
      if (i === 0 && today.getHours() >= 18) continue
      
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-NG', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        isToday: i === 0,
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      })
    }
    return dates
  }

  // Mock time slots based on service type
  const generateTimeSlots = (date: string): TimeSlot[] => {
    const baseSlots = [
      { time: '08:00', label: '8:00 AM' },
      { time: '10:00', label: '10:00 AM' },
      { time: '12:00', label: '12:00 PM' },
      { time: '14:00', label: '2:00 PM' },
      { time: '16:00', label: '4:00 PM' },
      { time: '18:00', label: '6:00 PM' },
    ]

    // Emergency care available 24/7
    if (selectedService.category === 'emergency') {
      const emergencySlots = []
      for (let i = 0; i < 24; i += 2) {
        const hour = i.toString().padStart(2, '0')
        emergencySlots.push({
          time: `${hour}:00`,
          label: `${i === 0 ? 12 : i > 12 ? i - 12 : i}:00 ${i < 12 ? 'AM' : 'PM'}`
        })
      }
      baseSlots.push(...emergencySlots)
    }

    return baseSlots.map((slot, index) => ({
      id: `${date}-${slot.time}`,
      time: slot.label,
      duration: selectedService.duration,
      available: Math.random() > 0.3, // Mock availability
      price: selectedService.category === 'emergency' && (parseInt(slot.time) < 8 || parseInt(slot.time) > 18) 
        ? selectedService.price * 1.5 // Emergency rates
        : selectedService.price
    }))
  }

  // Mock nurse data
  const availableNurses: Nurse[] = [
    {
      id: '1',
      name: 'Adunni Adebayo',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
      rating: 4.9,
      experience: 8,
      specializations: ['Home Nursing', 'Elderly Care', 'Post-Surgery Care'],
      availability: ['Lagos', 'Abuja'],
      verified: true
    },
    {
      id: '2',
      name: 'Kemi Okonkwo',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150',
      rating: 4.8,
      experience: 5,
      specializations: ['Chronic Care', 'Medication Administration', 'Health Monitoring'],
      availability: ['Lagos', 'Ogun'],
      verified: true
    },
    {
      id: '3',
      name: 'Fatima Ibrahim',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150',
      rating: 4.7,
      experience: 6,
      specializations: ['Physiotherapy', 'Wound Care', 'Emergency Care'],
      availability: ['Lagos', 'Abuja', 'Kano'],
      verified: true
    }
  ]

  // Nigerian states
  const nigerianStates = [
    'Lagos', 'Abuja', 'Kano', 'Rivers', 'Oyo', 'Kaduna', 'Ogun', 'Ondo', 'Osun',
    'Delta', 'Anambra', 'Imo', 'Enugu', 'Edo', 'Plateau', 'Cross River', 'Akwa Ibom'
  ]

  const availableDates = generateAvailableDates()
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : []
  const filteredNurses = availableNurses.filter(nurse => 
    nurse.availability.includes(address.state) &&
    nurse.specializations.some(spec => 
      spec.toLowerCase().includes(selectedService.category) ||
      selectedService.name.toLowerCase().includes(spec.toLowerCase())
    )
  )

  // Update schedule when all required fields are filled
  useEffect(() => {
    if (selectedDate && selectedTimeSlot && selectedNurse && address.street && address.phoneNumber) {
      const scheduleData: ScheduleData = {
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        nurse: selectedNurse,
        address,
        specialRequirements: specialRequirements || undefined
      }
      onScheduleSelect(scheduleData)
    }
  }, [selectedDate, selectedTimeSlot, selectedNurse, address.street, address.city, address.state, address.phoneNumber, address.landmark, specialRequirements]) // Only depend on the actual values, not the function

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price)
  }

  const isFormComplete = selectedDate && selectedTimeSlot && selectedNurse && address.street && address.phoneNumber

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <VStack spacing={4} textAlign="center">
          <Heading size="lg" color="gray.800">
            Schedule Your {selectedService.name}
          </Heading>
          <Text color="gray.600">
            Choose your preferred date, time, and healthcare professional
          </Text>
          
          {/* Service Summary */}
          <Box bg="primary.50" borderRadius="lg" p={4} w="full" maxW="500px">
            <HStack spacing={4}>
              <Box>
                <Text fontWeight="600" color="primary.700">{selectedService.name}</Text>
                <Text fontSize="sm" color="gray.600">
                  {selectedService.duration / 60}h session • {formatPrice(selectedService.price)}
                </Text>
              </Box>
            </HStack>
          </Box>
        </VStack>

        {/* Step 1: Select Date */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody p={6}>
            <VStack spacing={4} align="start">
              <HStack spacing={2}>
                <Icon as={FaCalendarAlt} color="primary.500" />
                <Heading size="md">1. Select Date</Heading>
              </HStack>
              
              <SimpleGrid columns={{ base: 2, md: 4, lg: 7 }} spacing={3} w="full">
                {availableDates.map((date) => (
                  <Button
                    key={date.value}
                    variant={selectedDate === date.value ? 'solid' : 'outline'}
                    colorScheme={selectedDate === date.value ? 'primary' : 'gray'}
                    size="sm"
                    onClick={() => setSelectedDate(date.value)}
                    flexDirection="column"
                    h="auto"
                    py={3}
                    isDisabled={date.isWeekend && selectedService.category !== 'emergency'}
                  >
                    <Text fontSize="xs" opacity={date.isToday ? 1 : 0.7}>
                      {date.isToday ? 'Today' : date.label.split(' ')[0]}
                    </Text>
                    <Text fontWeight="bold">
                      {date.label.split(' ').slice(1).join(' ')}
                    </Text>
                    {date.isWeekend && selectedService.category !== 'emergency' && (
                      <Text fontSize="xs" color="red.500">Weekend</Text>
                    )}
                  </Button>
                ))}
              </SimpleGrid>
              
              {selectedService.category !== 'emergency' && (
                <Text fontSize="xs" color="gray.500">
                  * Weekend appointments available for emergency services only
                </Text>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Step 2: Select Time */}
        {selectedDate && (
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody p={6}>
              <VStack spacing={4} align="start">
                <HStack spacing={2}>
                  <Icon as={FaClock} color="primary.500" />
                  <Heading size="md">2. Select Time</Heading>
                </HStack>
                
                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={3} w="full">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedTimeSlot?.id === slot.id ? 'solid' : 'outline'}
                      colorScheme={selectedTimeSlot?.id === slot.id ? 'primary' : 'gray'}
                      size="md"
                      onClick={() => setSelectedTimeSlot(slot)}
                      isDisabled={!slot.available}
                      flexDirection="column"
                      h="auto"
                      py={3}
                    >
                      <Text fontWeight="bold">{slot.time}</Text>
                      <Text fontSize="xs">
                        {slot.available ? formatPrice(slot.price || selectedService.price) : 'Unavailable'}
                      </Text>
                      {slot.price && slot.price > selectedService.price && (
                        <Badge colorScheme="orange" fontSize="xs">Emergency Rate</Badge>
                      )}
                    </Button>
                  ))}
                </SimpleGrid>
                
                {timeSlots.length === 0 && (
                  <Alert status="info">
                    <AlertIcon />
                    <AlertTitle>No slots available!</AlertTitle>
                    <AlertDescription>Please select a different date.</AlertDescription>
                  </Alert>
                )}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Step 3: Select Nurse */}
        {selectedDate && selectedTimeSlot && (
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody p={6}>
              <VStack spacing={4} align="start">
                <HStack spacing={2}>
                  <Icon as={FaUserNurse} color="primary.500" />
                  <Heading size="md">3. Choose Your Healthcare Professional</Heading>
                </HStack>
                
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} w="full">
                  {filteredNurses.map((nurse) => (
                    <Card
                      key={nurse.id}
                      variant={selectedNurse?.id === nurse.id ? 'filled' : 'outline'}
                      borderColor={selectedNurse?.id === nurse.id ? 'primary.500' : borderColor}
                      borderWidth="2px"
                      cursor="pointer"
                      onClick={() => setSelectedNurse(nurse)}
                      transition="all 0.2s"
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                    >
                      <CardBody p={4}>
                        <VStack spacing={3}>
                          <HStack spacing={3} w="full">
                            <Avatar src={nurse.avatar} name={nurse.name} size="md" />
                            <VStack spacing={1} align="start" flex={1}>
                              <HStack spacing={2}>
                                <Text fontWeight="600">{nurse.name}</Text>
                                {nurse.verified && (
                                  <Icon as={FaCheckCircle} color="green.500" fontSize="sm" />
                                )}
                              </HStack>
                              <HStack spacing={1}>
                                <Icon as={FaStar} color="yellow.400" fontSize="sm" />
                                <Text fontSize="sm">{nurse.rating}</Text>
                                <Text fontSize="sm" color="gray.500">
                                  ({nurse.experience} years exp.)
                                </Text>
                              </HStack>
                            </VStack>
                          </HStack>
                          
                          <VStack spacing={2} w="full" align="start">
                            <Text fontSize="xs" color="gray.600" fontWeight="600">
                              Specializations:
                            </Text>
                            <Flex wrap="wrap" gap={1}>
                              {nurse.specializations.slice(0, 2).map((spec, index) => (
                                <Badge key={index} colorScheme="blue" fontSize="xs">
                                  {spec}
                                </Badge>
                              ))}
                              {nurse.specializations.length > 2 && (
                                <Badge colorScheme="gray" fontSize="xs">
                                  +{nurse.specializations.length - 2} more
                                </Badge>
                              )}
                            </Flex>
                          </VStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
                
                {filteredNurses.length === 0 && (
                  <Alert status="warning">
                    <AlertIcon />
                    <AlertTitle>No nurses available!</AlertTitle>
                    <AlertDescription>
                      No healthcare professionals available for {selectedService.name} in your area. 
                      Please try a different date or contact support.
                    </AlertDescription>
                  </Alert>
                )}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Step 4: Address Details */}
        {selectedNurse && (
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody p={6}>
              <VStack spacing={4} align="start">
                <HStack spacing={2}>
                  <Icon as={FaMapMarkerAlt} color="primary.500" />
                  <Heading size="md">4. Service Location</Heading>
                </HStack>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Street Address</FormLabel>
                    <Input
                      value={address.street}
                      onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
                      placeholder="Enter your street address"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Phone Number</FormLabel>
                    <Input
                      value={address.phoneNumber}
                      onChange={(e) => setAddress(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="+234 801 234 5678"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">State</FormLabel>
                    <Select
                      value={address.state}
                      onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                    >
                      {nigerianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel fontSize="sm">City/LGA</FormLabel>
                    <Input
                      value={address.city}
                      onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Enter city or local government area"
                    />
                  </FormControl>
                  
                  <FormControl gridColumn={{ md: 'span 2' }}>
                    <FormLabel fontSize="sm">Landmark (Optional)</FormLabel>
                    <Input
                      value={address.landmark}
                      onChange={(e) => setAddress(prev => ({ ...prev, landmark: e.target.value }))}
                      placeholder="Nearest landmark for easy location"
                    />
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Step 5: Special Requirements */}
        {isFormComplete && (
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody p={6}>
              <VStack spacing={4} align="start">
                <HStack spacing={2}>
                  <Icon as={FaInfoCircle} color="primary.500" />
                  <Heading size="md">5. Special Requirements (Optional)</Heading>
                </HStack>
                
                <FormControl w="full">
                  <FormLabel fontSize="sm">
                    Any specific requirements or medical conditions we should know about?
                  </FormLabel>
                  <Textarea
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    placeholder="e.g., Patient has mobility issues, specific medication allergies, preferred language, etc."
                    rows={4}
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Summary */}
        {isFormComplete && (
          <Alert status="success">
            <AlertIcon />
            <Box>
              <AlertTitle>Appointment Details Confirmed!</AlertTitle>
              <AlertDescription>
                <VStack spacing={1} align="start" mt={2}>
                  <Text fontSize="sm">
                    <strong>Service:</strong> {selectedService.name}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Date & Time:</strong> {new Date(selectedDate).toLocaleDateString('en-NG', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {selectedTimeSlot.time}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Healthcare Professional:</strong> {selectedNurse.name}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Location:</strong> {address.street}, {address.city}, {address.state}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Total Cost:</strong> {formatPrice(selectedTimeSlot.price || selectedService.price)}
                  </Text>
                </VStack>
              </AlertDescription>
            </Box>
          </Alert>
        )}
      </VStack>
    </Container>
  )
}

export default AppointmentScheduling