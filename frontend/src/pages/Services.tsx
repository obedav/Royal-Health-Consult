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
  FaArrowRight,
  FaClipboardCheck,
  FaBaby
} from 'react-icons/fa'
import { MdHealthAndSafety, MdElderlyWoman, MdPsychology } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

// Import assessment data from constants
import { healthcareAssessments } from '../constants/assessments'

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
      general: 'blue',
      specialized: 'purple',
      routine: 'green',
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
              <BreadcrumbLink color="gray.600">Health Assessments</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header Section */}
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <Heading size="2xl" color="gray.800">
              Professional Health Assessments
            </Heading>
            <Text color="gray.600" fontSize="xl" lineHeight="1.6">
              Comprehensive health assessments delivered to your home by qualified healthcare professionals. 
              Professional evaluations with detailed reports and personalized recommendations.
            </Text>
            
            {/* Assessment Value Highlight */}
            <Box 
              bg="primary.50" 
              border="2px solid" 
              borderColor="primary.200" 
              borderRadius="xl" 
              p={6} 
              maxW="600px"
            >
              <VStack spacing={2}>
                <Text fontSize="sm" color="primary.600" fontWeight="600">
                  COMPREHENSIVE HEALTH ASSESSMENTS
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="primary.500">
                  Professional Evaluation • Detailed Report • Home Comfort
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Fixed pricing for all assessment types • Transparent pricing shown at booking
                </Text>
              </VStack>
            </Box>
            
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
              Book Assessment Now
            </Button>

            {/* Stats */}
            <HStack spacing={8} pt={4}>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="primary.500">500+</Text>
                <Text fontSize="sm" color="gray.600">Assessments Done</Text>
              </VStack>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="primary.500">50+</Text>
                <Text fontSize="sm" color="gray.600">Health Professionals</Text>
              </VStack>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="primary.500">24/7</Text>
                <Text fontSize="sm" color="gray.600">Emergency Available</Text>
              </VStack>
            </HStack>
          </VStack>

          {/* Assessment Services Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={8}>
            {healthcareAssessments.map((service) => {
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
                          {service.category} Assessment
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

                        {/* Assessment Features */}
                        <VStack spacing={2} align="start" w="full">
                          <Text fontSize="sm" fontWeight="600" color="gray.700">
                            Assessment Includes:
                          </Text>
                          {service.features.slice(0, 3).map((feature, index) => (
                            <HStack key={index} spacing={2}>
                              <Icon as={FaCheckCircle} color="green.500" fontSize="sm" />
                              <Text fontSize="xs" color="gray.600">{feature}</Text>
                            </HStack>
                          ))}
                          {service.features.length > 3 && (
                            <Text fontSize="xs" color="primary.500" fontWeight="500">
                              +{service.features.length - 3} more assessment components
                            </Text>
                          )}
                        </VStack>
                      </VStack>

                      <Divider />

                      {/* Assessment Duration & Availability */}
                      <VStack spacing={3} w="full">
                        <HStack justify="space-between" w="full">
                          <VStack spacing={1} align="start">
                            <HStack spacing={1}>
                              <Icon as={FaClock} color="gray.500" fontSize="sm" />
                              <Text fontSize="xs" color="gray.500">Duration</Text>
                            </HStack>
                            <Text color="gray.700" fontSize="sm" fontWeight="medium">
                              {formatDuration(service.duration)}
                            </Text>
                          </VStack>
                          <VStack spacing={1} align="end">
                            <HStack spacing={1}>
                              <Icon as={FaCalendarAlt} color="gray.500" fontSize="sm" />
                              <Text fontSize="xs" color="gray.500">Availability</Text>
                            </HStack>
                            <Text color="gray.700" fontSize="xs" textAlign="right">
                              {service.availability.length > 20 ? service.availability.substring(0, 20) + '...' : service.availability}
                            </Text>
                          </VStack>
                        </HStack>
                      </VStack>

                      {/* Book Assessment Button */}
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
                        Book Assessment
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
                  Need Help Choosing an Assessment?
                </Heading>
                <Text color="gray.600" maxW="600px">
                  Our healthcare consultants are available 24/7 to help you select the right assessment 
                  for your specific health needs. Get personalized recommendations today.
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
                  Quick Assessment Booking
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* Assessment Process */}
          <Box
            bg="white"
            borderRadius="2xl"
            p={8}
            border="1px"
            borderColor="gray.200"
          >
            <VStack spacing={6}>
              <Heading size="lg" color="gray.800" textAlign="center">
                How Our Health Assessments Work
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                {[
                  {
                    step: '1',
                    title: 'Book Online',
                    description: 'Choose your assessment type and preferred time slot',
                    icon: FaCalendarAlt,
                    color: 'blue'
                  },
                  {
                    step: '2',
                    title: 'Professional Arrives',
                    description: 'Qualified healthcare professional comes to your location',
                    icon: FaUserNurse,
                    color: 'green'
                  },
                  {
                    step: '3',
                    title: 'Comprehensive Assessment',
                    description: 'Thorough health evaluation based on your selected assessment type',
                    icon: FaStethoscope,
                    color: 'purple'
                  },
                  {
                    step: '4',
                    title: 'Detailed Report',
                    description: 'Receive comprehensive report with recommendations within 24 hours',
                    icon: FaClipboardCheck,
                    color: 'orange'
                  }
                ].map((item, index) => (
                  <VStack key={index} spacing={4} textAlign="center">
                    <Box
                      w={16}
                      h={16}
                      bg={`${item.color}.50`}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      position="relative"
                    >
                      <Icon as={item.icon} color={`${item.color}.500`} fontSize="2xl" />
                      <Badge
                        position="absolute"
                        top="-8px"
                        right="-8px"
                        colorScheme={item.color}
                        borderRadius="full"
                        w={8}
                        h={8}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        {item.step}
                      </Badge>
                    </Box>
                    <VStack spacing={2}>
                      <Text fontWeight="600" color="gray.800">
                        {item.title}
                      </Text>
                      <Text fontSize="sm" color="gray.600" textAlign="center">
                        {item.description}
                      </Text>
                    </VStack>
                  </VStack>
                ))}
              </SimpleGrid>
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
                  go to the nearest hospital immediately. Our assessment services are for non-emergency health evaluations.
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