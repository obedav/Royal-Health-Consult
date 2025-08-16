// src/components/booking/ServiceSelection.tsx
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Button,
  Icon,
  Card,
  CardBody,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { 
  FaUserNurse, 
  FaHeartbeat, 
  FaWheelchair, 
  FaStethoscope,
  FaSyringe,
  FaHome,
  FaAmbulance,
  FaClock,
  FaTag,
  FaExternalLinkAlt
} from 'react-icons/fa'
import { MdHealthAndSafety, MdElderlyWoman } from 'react-icons/md'
import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { BookingService } from '../../types/booking.types'

// Import shared service data from Services page
import { healthcareServices } from '../../pages/Services'

interface ServiceSelectionProps {
  onServiceSelect: (service: BookingService) => void
  selectedService?: BookingService
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ 
  onServiceSelect, 
  selectedService 
}) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Convert healthcareServices to BookingService format
  const services: BookingService[] = healthcareServices.map(service => ({
    id: service.id,
    name: service.name,
    description: service.shortDescription || service.description,
    price: service.price,
    duration: service.duration,
    category: service.category as BookingService['category'],
    icon: service.icon,
    popular: service.popular,
    requirements: service.requirements
  }))

  // Check for pre-selected service from URL
  useEffect(() => {
    const serviceParam = searchParams.get('service')
    if (serviceParam && !selectedService) {
      const preSelectedService = services.find(s => s.id === serviceParam)
      if (preSelectedService) {
        onServiceSelect(preSelectedService)
      }
    }
  }, [searchParams, selectedService, onServiceSelect, services])

  const getServiceIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'FaUserNurse': FaUserNurse,
      'MdElderlyWoman': MdElderlyWoman,
      'MdHealthAndSafety': MdHealthAndSafety,
      'FaHeartbeat': FaHeartbeat,
      'FaStethoscope': FaStethoscope,
      'FaWheelchair': FaWheelchair,
      'FaSyringe': FaSyringe,
      'FaAmbulance': FaAmbulance
    }
    return iconMap[iconName] || FaHome
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <Box bg="gray.50" minH="calc(100vh - 80px)" py={8} w="100%">
      <Container maxW="1200px" centerContent>
        <VStack spacing={10} align="center" w="full">
          {/* Header */}
          <VStack spacing={6} textAlign="center" maxW="700px" px={4}>
            <Heading size="xl" color="gray.800">
              Choose Your Healthcare Service
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Select the type of professional healthcare service you need. 
              Our qualified nurses will provide care in the comfort of your home.
            </Text>
            
            {/* Link to detailed services page */}
            <Text fontSize="sm" color="gray.500">
              Need more details? {' '}
              <Link 
                color="primary.500" 
                fontWeight="600"
                onClick={() => navigate('/services')}
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}
              >
                View detailed service information
                <Icon as={FaExternalLinkAlt} ml={1} fontSize="xs" />
              </Link>
            </Text>
          </VStack>

          {/* Pre-selection Notice */}
          {selectedService && (
            <Box
              bg="primary.50"
              border="1px"
              borderColor="primary.200"
              borderRadius="lg"
              p={4}
              w="full"
              maxW="600px"
            >
              <Text fontSize="sm" color="primary.700" textAlign="center">
                <Text as="span" fontWeight="600">{selectedService.name}</Text> is pre-selected. 
                You can change your selection below or continue with this service.
              </Text>
            </Box>
          )}

          {/* Services Grid - Streamlined for booking */}
          <Box w="full" px={4}>
            <SimpleGrid 
              columns={{ base: 1, md: 2, xl: 3 }} 
              spacing={6}
              w="full"
              maxW="1200px"
              mx="auto"
            >
            {services.map((service) => {
              const isSelected = selectedService?.id === service.id
              const IconComponent = getServiceIcon(service.icon)

              return (
                <Card
                  key={service.id}
                  bg={cardBg}
                  borderColor={isSelected ? 'primary.500' : borderColor}
                  borderWidth="2px"
                  borderRadius="xl"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'lg',
                    borderColor: 'primary.300'
                  }}
                  onClick={() => onServiceSelect(service)}
                  position="relative"
                  overflow="hidden"
                  maxW="400px"
                  mx="auto"
                >
                  {service.popular && (
                    <Badge
                      colorScheme="primary"
                      position="absolute"
                      top={4}
                      right={4}
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      Popular
                    </Badge>
                  )}

                  <CardBody p={6} display="flex" flexDirection="column" h="full">
                    <VStack spacing={5} align="center" flex={1}>
                      {/* Service Icon & Category */}
                      <VStack spacing={2}>
                        <Box
                          w={14}
                          h={14}
                          bg="primary.50"
                          borderRadius="lg"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          boxShadow="sm"
                        >
                          <Icon as={IconComponent} color="primary.500" fontSize="2xl" />
                        </Box>
                        <Badge 
                          colorScheme={service.category === 'emergency' ? 'red' : 'blue'}
                          variant="subtle"
                          textTransform="capitalize"
                          px={2}
                          py={1}
                          borderRadius="full"
                          fontSize="xs"
                        >
                          {service.category}
                        </Badge>
                      </VStack>

                      {/* Service Details - Simplified for booking */}
                      <VStack spacing={2} align="center" flex={1} justify="center">
                        <Heading size="sm" color="gray.800" lineHeight="1.3" textAlign="center">
                          {service.name}
                        </Heading>
                        <Text color="gray.600" fontSize="xs" lineHeight="1.4" textAlign="center">
                          {service.description}
                        </Text>
                      </VStack>

                      {/* Pricing & Duration - Compact */}
                      <VStack spacing={3} w="full">
                        <HStack justify="center" spacing={4}>
                          <VStack spacing={0}>
                            <Text fontSize="lg" fontWeight="bold" color="primary.500">
                              {formatPrice(service.price)}
                            </Text>
                            <Text fontSize="xs" color="gray.500">Starting price</Text>
                          </VStack>
                          <Box w="1px" h="8" bg="gray.300" />
                          <VStack spacing={0}>
                            <Text fontSize="sm" fontWeight="medium" color="gray.700">
                              {formatDuration(service.duration)}
                            </Text>
                            <Text fontSize="xs" color="gray.500">Duration</Text>
                          </VStack>
                        </HStack>

                        {/* Requirements - Simplified */}
                        {service.requirements && (
                          <Text fontSize="xs" color="gray.500" textAlign="center">
                            Required: {service.requirements.slice(0, 2).join(', ')}
                            {service.requirements.length > 2 && '...'}
                          </Text>
                        )}

                        {/* Select Button */}
                        <Button
                          w="full"
                          variant={isSelected ? "solid" : "outline"}
                          colorScheme="primary"
                          size="md"
                          onClick={(e) => {
                            e.stopPropagation()
                            onServiceSelect(service)
                          }}
                          fontWeight="bold"
                          fontSize="sm"
                        >
                          {isSelected ? 'Selected ✓' : 'Select Service'}
                        </Button>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              )
            })}
            </SimpleGrid>
          </Box>

          {/* Emergency Notice */}
          <Box maxW="800px" w="full" px={4}>
            <Box
              bg="red.50"
              border="1px"
              borderColor="red.200"
              borderRadius="xl"
              p={4}
            >
              <HStack spacing={3} align="start">
                <Icon as={FaAmbulance} color="red.500" fontSize="lg" mt={1} />
                <VStack spacing={1} align="start">
                  <Text fontWeight="bold" color="red.700" fontSize="sm">
                    Medical Emergency?
                  </Text>
                  <Text fontSize="xs" color="red.600" lineHeight="1.4">
                    For life-threatening emergencies, call <strong>199 (Nigeria Emergency)</strong> 
                    or go to the nearest hospital. Our services are for non-emergency healthcare.
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default ServiceSelection