// src/pages/Services.tsx
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Flex,
} from '@chakra-ui/react'
import { 
  FaUserNurse, 
  FaHeartbeat, 
  FaWheelchair, 
  FaStethoscope,
  FaSyringe,
  FaAmbulance,
  FaClock,
  FaTag,
  FaChevronRight,
  FaCheckCircle,
  FaPhone,
  FaWhatsapp,
  FaCalendarAlt,
  FaArrowRight
} from 'react-icons/fa'
import { MdHealthAndSafety, MdElderlyWoman } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

// Shared service data (you can move this to a separate file later)
export const healthcareServices = [
  {
    id: 'home-nursing',
    name: 'Home Nursing Care',
    description: 'Professional nursing care in the comfort of your home. Our qualified nurses provide personalized medical attention.',
    shortDescription: 'Professional nursing care in the comfort of your home',
    price: 15000,
    duration: 240, // 4 hours
    category: 'nursing',
    icon: 'FaUserNurse',
    iconComponent: FaUserNurse,
    popular: true,
    features: ['Medication administration', 'Vital signs monitoring', 'Wound care', 'Patient education'],
    requirements: ['Valid ID', 'Medical history if available'],
    availability: '24/7'
  },
  {
    id: 'elderly-care',
    name: 'Elderly Care',
    description: 'Specialized care for elderly patients with chronic conditions, ensuring dignity and comfort.',
    shortDescription: 'Specialized care for elderly patients with chronic conditions',
    price: 20000,
    duration: 480, // 8 hours
    category: 'nursing',
    icon: 'MdElderlyWoman',
    iconComponent: MdElderlyWoman,
    popular: true,
    features: ['Daily living assistance', 'Medication management', 'Companionship', 'Health monitoring'],
    requirements: ['Medical records', 'Emergency contact'],
    availability: '24/7'
  },
  {
    id: 'post-surgery',
    name: 'Post-Surgery Care',
    description: 'Recovery assistance and wound care after surgery to ensure optimal healing.',
    shortDescription: 'Recovery assistance and wound care after surgery',
    price: 25000,
    duration: 180, // 3 hours
    category: 'nursing',
    icon: 'MdHealthAndSafety',
    iconComponent: MdHealthAndSafety,
    features: ['Wound care & dressing', 'Pain management', 'Mobility assistance', 'Recovery monitoring'],
    requirements: ['Surgery discharge notes', 'Medication list'],
    availability: 'On-demand'
  },
  {
    id: 'chronic-care',
    name: 'Chronic Disease Management',
    description: 'Ongoing care for diabetes, hypertension, and other chronic conditions.',
    shortDescription: 'Ongoing care for diabetes, hypertension, and other conditions',
    price: 18000,
    duration: 120, // 2 hours
    category: 'monitoring',
    icon: 'FaHeartbeat',
    iconComponent: FaHeartbeat,
    features: ['Blood pressure monitoring', 'Blood sugar checks', 'Medication compliance', 'Lifestyle counseling'],
    requirements: ['Medical diagnosis', 'Current medications'],
    availability: 'Weekly/Monthly'
  },
  {
    id: 'wound-care',
    name: 'Wound Care & Dressing',
    description: 'Professional wound cleaning and dressing changes for optimal healing.',
    shortDescription: 'Professional wound cleaning and dressing changes',
    price: 8000,
    duration: 60, // 1 hour
    category: 'nursing',
    icon: 'FaStethoscope',
    iconComponent: FaStethoscope,
    features: ['Sterile dressing changes', 'Wound assessment', 'Infection prevention', 'Healing progress monitoring'],
    availability: 'Daily/As needed'
  },
  {
    id: 'physiotherapy',
    name: 'Physiotherapy',
    description: 'Physical therapy and rehabilitation exercises for recovery and mobility.',
    shortDescription: 'Physical therapy and rehabilitation exercises',
    price: 12000,
    duration: 90, // 1.5 hours
    category: 'therapy',
    icon: 'FaWheelchair',
    iconComponent: FaWheelchair,
    features: ['Exercise therapy', 'Mobility training', 'Pain relief', 'Strength building'],
    availability: '2-3x per week'
  },
  {
    id: 'medication-admin',
    name: 'Medication Administration',
    description: 'Safe administration of injections and IV medications by qualified nurses.',
    shortDescription: 'Safe administration of injections and IV medications',
    price: 5000,
    duration: 30, // 30 minutes
    category: 'nursing',
    icon: 'FaSyringe',
    iconComponent: FaSyringe,
    features: ['Injectable medications', 'IV therapy', 'Dosage verification', 'Side effect monitoring'],
    availability: 'As prescribed'
  },
  {
    id: 'health-monitoring',
    name: 'Health Monitoring',
    description: 'Comprehensive vital signs monitoring and health assessment.',
    shortDescription: 'Vital signs monitoring and health assessment',
    price: 6000,
    duration: 45, // 45 minutes
    category: 'monitoring',
    icon: 'FaHeartbeat',
    iconComponent: FaHeartbeat,
    features: ['Vital signs check', 'Health assessment', 'Report generation', 'Trend analysis'],
    availability: 'Regular intervals'
  },
  {
    id: 'emergency-care',
    name: 'Emergency Home Care',
    description: 'Urgent medical care for non-life threatening emergencies.',
    shortDescription: 'Urgent medical care for non-life threatening emergencies',
    price: 35000,
    duration: 120, // 2 hours
    category: 'emergency',
    icon: 'FaAmbulance',
    iconComponent: FaAmbulance,
    features: ['Rapid response', 'Emergency assessment', 'Stabilization', 'Hospital coordination'],
    requirements: ['Immediate availability needed'],
    availability: '24/7 Emergency'
  }
]

const Services: React.FC = () => {
  const navigate = useNavigate()
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

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

  const getCategoryColor = (category: string) => {
    const colors = {
      nursing: 'blue',
      monitoring: 'green',
      therapy: 'purple',
      emergency: 'red'
    }
    return colors[category as keyof typeof colors] || 'gray'
  }

  // Updated to redirect to booking with pre-selected service
  const handleBookService = (serviceId: string) => {
    navigate(`/booking?service=${serviceId}`)
  }

  // Quick booking for popular services
  const handleQuickBook = () => {
    navigate('/booking')
  }

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={10} align="stretch">
          {/* Breadcrumb */}
          <Breadcrumb spacing="8px" separator={<FaChevronRight color="gray.500" />}>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/')} color="primary.500" cursor="pointer">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="gray.600">Services</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header Section */}
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <Heading size="2xl" color="gray.800">
              Professional Healthcare Services
            </Heading>
            <Text color="gray.600" fontSize="xl" lineHeight="1.6">
              Comprehensive medical care delivered to your home by qualified healthcare professionals. 
              Safe, reliable, and professional healthcare when you need it most.
            </Text>
            
            {/* Quick Action */}
            <Button
              size="lg"
              colorScheme="primary"
              rightIcon={<FaCalendarAlt />}
              onClick={handleQuickBook}
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="bold"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg'
              }}
            >
              Book Any Service Now
            </Button>

            {/* Stats */}
            <HStack spacing={8} pt={4}>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="primary.500">500+</Text>
                <Text fontSize="sm" color="gray.600">Happy Patients</Text>
              </VStack>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="primary.500">50+</Text>
                <Text fontSize="sm" color="gray.600">Qualified Nurses</Text>
              </VStack>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="primary.500">24/7</Text>
                <Text fontSize="sm" color="gray.600">Availability</Text>
              </VStack>
            </HStack>
          </VStack>

          {/* Services Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={8}>
            {healthcareServices.map((service) => {
              const IconComponent = service.iconComponent

              return (
                <Card
                  key={service.id}
                  bg={cardBg}
                  borderColor={borderColor}
                  borderWidth="1px"
                  borderRadius="xl"
                  overflow="hidden"
                  transition="all 0.3s"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'xl',
                    borderColor: 'primary.300'
                  }}
                  position="relative"
                  h="full"
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
                      zIndex={1}
                    >
                      Popular
                    </Badge>
                  )}

                  <CardBody p={8} display="flex" flexDirection="column" h="full">
                    <VStack spacing={6} align="start" flex={1}>
                      {/* Icon & Category */}
                      <Flex justify="space-between" align="start" w="full">
                        <Box
                          w={16}
                          h={16}
                          bg="primary.50"
                          borderRadius="xl"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={IconComponent} color="primary.500" fontSize="2xl" />
                        </Box>
                        <Badge 
                          colorScheme={getCategoryColor(service.category)}
                          variant="subtle"
                          textTransform="capitalize"
                          px={3}
                          py={1}
                          borderRadius="full"
                        >
                          {service.category}
                        </Badge>
                      </Flex>

                      {/* Service Details */}
                      <VStack spacing={3} align="start" flex={1}>
                        <Heading size="md" color="gray.800" lineHeight="1.3">
                          {service.name}
                        </Heading>
                        <Text color="gray.600" fontSize="sm" lineHeight="1.5">
                          {service.description}
                        </Text>

                        {/* Features */}
                        <VStack spacing={2} align="start" w="full">
                          <Text fontSize="sm" fontWeight="600" color="gray.700">
                            What's Included:
                          </Text>
                          {service.features.slice(0, 3).map((feature, index) => (
                            <HStack key={index} spacing={2}>
                              <Icon as={FaCheckCircle} color="green.500" fontSize="sm" />
                              <Text fontSize="xs" color="gray.600">{feature}</Text>
                            </HStack>
                          ))}
                          {service.features.length > 3 && (
                            <Text fontSize="xs" color="primary.500" fontWeight="500">
                              +{service.features.length - 3} more features
                            </Text>
                          )}
                        </VStack>
                      </VStack>

                      <Divider />

                      {/* Pricing & Duration */}
                      <HStack justify="space-between" w="full">
                        <VStack spacing={1} align="start">
                          <HStack spacing={1}>
                            <Icon as={FaTag} color="primary.500" fontSize="sm" />
                            <Text fontSize="xs" color="gray.500">Starting at</Text>
                          </HStack>
                          <Text fontWeight="bold" color="primary.500" fontSize="xl">
                            {formatPrice(service.price)}
                          </Text>
                        </VStack>
                        <VStack spacing={1} align="end">
                          <HStack spacing={1}>
                            <Icon as={FaClock} color="gray.500" fontSize="sm" />
                            <Text fontSize="xs" color="gray.500">Duration</Text>
                          </HStack>
                          <Text color="gray.600" fontSize="sm" fontWeight="medium">
                            {formatDuration(service.duration)}
                          </Text>
                        </VStack>
                      </HStack>

                      {/* Availability */}
                      <HStack spacing={2} w="full">
                        <Icon as={FaClock} color="green.500" fontSize="sm" />
                        <Text fontSize="sm" color="gray.600">
                          <Text as="span" fontWeight="600">Available:</Text> {service.availability}
                        </Text>
                      </HStack>

                      {/* Book Button */}
                      <Button
                        w="full"
                        colorScheme="primary"
                        size="lg"
                        onClick={() => handleBookService(service.id)}
                        fontWeight="bold"
                        rightIcon={<FaArrowRight />}
                        _hover={{
                          transform: 'translateY(-1px)'
                        }}
                      >
                        Book This Service
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              )
            })}
          </SimpleGrid>

          {/* Contact Section */}
          <Box
            bg="primary.50"
            borderRadius="2xl"
            p={8}
            textAlign="center"
          >
            <VStack spacing={6}>
              <VStack spacing={3}>
                <Heading size="lg" color="gray.800">
                  Need Help Choosing a Service?
                </Heading>
                <Text color="gray.600" maxW="600px">
                  Our healthcare consultants are available 24/7 to help you select the right service 
                  for your specific needs. Get personalized recommendations today.
                </Text>
              </VStack>
              <HStack spacing={4} flexWrap="wrap" justify="center">
                <Button
                  leftIcon={<FaPhone />}
                  colorScheme="primary"
                  variant="solid"
                  size="lg"
                >
                  Call +234 801 234 5678
                </Button>
                <Button
                  leftIcon={<FaWhatsapp />}
                  colorScheme="green"
                  variant="outline"
                  size="lg"
                >
                  WhatsApp Us
                </Button>
                <Button
                  leftIcon={<FaCalendarAlt />}
                  colorScheme="purple"
                  variant="outline"
                  size="lg"
                  onClick={handleQuickBook}
                >
                  Quick Booking
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* Emergency Notice */}
          <Box
            bg="red.50"
            border="1px"
            borderColor="red.200"
            borderRadius="xl"
            p={6}
          >
            <HStack spacing={4} align="start">
              <Icon as={FaAmbulance} color="red.500" fontSize="2xl" mt={1} />
              <VStack spacing={2} align="start">
                <Text fontWeight="bold" color="red.700" fontSize="lg">
                  Medical Emergency?
                </Text>
                <Text fontSize="sm" color="red.600" lineHeight="1.5">
                  For life-threatening emergencies, please call <strong>199 (Nigeria Emergency)</strong> or 
                  go to the nearest hospital immediately. Our services are for non-emergency healthcare needs.
                </Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default Services