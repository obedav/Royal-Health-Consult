import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Icon,
  Flex,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  CalendarIcon, 
  TimeIcon, 
  PhoneIcon, 
  EmailIcon,
  CheckCircleIcon,
  WarningIcon,
  InfoIcon,
  AddIcon
} from '@chakra-ui/icons';

// Real API Integration
const API_BASE_URL = 'http://localhost:3001/api/v1';

interface Booking {
  id: string;
  serviceType: string;
  serviceName: string;
  serviceDescription: string;
  basePrice: string;
  totalPrice: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  patientAddress: string;
  city: string;
  state: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalConditions?: string;
  currentMedications?: string;
  createdAt: string;
  updatedAt: string;
  patient: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  assignedNurse?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null;
}

const PatientDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  
  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchMyBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      toast({
        title: 'Booking Cancelled',
        description: 'Your appointment has been cancelled successfully',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });

      // Refresh bookings
      await fetchMyBookings();
    } catch (err: any) {
      toast({
        title: 'Cancellation Failed',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'confirmed': return 'blue';
      case 'in_progress': return 'purple';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'paid': return 'green';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(parseFloat(price));
  };

  // Statistics
  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => 
      new Date(b.scheduledDate) > new Date() && 
      !['cancelled', 'completed'].includes(b.status)
    ).length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  if (isLoading) {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="7xl">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text>Loading your appointments...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Welcome Message */}
          <Card bg={cardBg}>
            <CardBody>
              <VStack spacing={4} align="start">
                <Heading size="lg" color="blue.600">
                  Welcome to Your Health Dashboard
                </Heading>
                <Text color="gray.600">
                  Manage your appointments, track your health journey, and connect with healthcare professionals.
                </Text>
              </VStack>
            </CardBody>
          </Card>

          {/* Quick Stats */}
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
            <Card bg={cardBg} border="2px" borderColor="blue.100">
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <CalendarIcon color="blue.500" />
                      <Text>Total Bookings</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="blue.500" fontSize="3xl">{stats.total}</StatNumber>
                  <StatHelpText>All time appointments</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card bg={cardBg} border="2px" borderColor="green.100">
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <TimeIcon color="green.500" />
                      <Text>Upcoming</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="green.500" fontSize="3xl">{stats.upcoming}</StatNumber>
                  <StatHelpText>Scheduled appointments</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card bg={cardBg} border="2px" borderColor="yellow.100">
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <WarningIcon color="yellow.500" />
                      <Text>Pending</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="yellow.500" fontSize="3xl">{stats.pending}</StatNumber>
                  <StatHelpText>Awaiting confirmation</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card bg={cardBg} border="2px" borderColor="purple.100">
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <CheckCircleIcon color="purple.500" />
                      <Text>Completed</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="purple.500" fontSize="3xl">{stats.completed}</StatNumber>
                  <StatHelpText>Finished appointments</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </Grid>

          {/* Error Alert */}
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <Card bg={cardBg}>
            <CardBody>
              <VStack spacing={4}>
                <Heading size="md" color="gray.700">Quick Actions</Heading>
                <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4} w="full">
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    size="lg"
                    height="60px"
                    onClick={() => window.location.href = '/book-appointment'}
                  >
                    Book New Appointment
                  </Button>
                  <Button
                    leftIcon={<CalendarIcon />}
                    variant="outline"
                    colorScheme="blue"
                    size="lg"
                    height="60px"
                    onClick={() => window.location.href = '/appointments'}
                  >
                    View All Appointments
                  </Button>
                  <Button
                    leftIcon={<InfoIcon />}
                    variant="outline"
                    colorScheme="purple"
                    size="lg"
                    height="60px"
                    onClick={() => window.location.href = '/profile'}
                  >
                    Update Medical Info
                  </Button>
                </Grid>
              </VStack>
            </CardBody>
          </Card>

          {/* Recent Appointments */}
          <Card bg={cardBg}>
            <CardBody>
              <Flex justify="space-between" align="center" mb={6}>
                <Heading size="md" color="gray.700">Your Appointments</Heading>
                <Button 
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={() => window.location.href = '/appointments'}
                >
                  View All
                </Button>
              </Flex>

              {bookings.length === 0 ? (
                <VStack spacing={6} py={12}>
                  <CalendarIcon boxSize={16} color="gray.300" />
                  <VStack spacing={2}>
                    <Text fontSize="xl" color="gray.500" fontWeight="medium">
                      No appointments found
                    </Text>
                    <Text color="gray.400" textAlign="center">
                      Ready to take care of your health? Book your first appointment with our professional healthcare team.
                    </Text>
                  </VStack>
                  <Button 
                    colorScheme="blue" 
                    leftIcon={<AddIcon />}
                    size="lg"
                    onClick={() => window.location.href = '/book-appointment'}
                  >
                    Book Your First Appointment
                  </Button>
                </VStack>
              ) : (
                <VStack spacing={4} align="stretch">
                  {bookings.slice(0, 3).map((booking) => (
                    <Card key={booking.id} variant="outline" borderWidth="2px">
                      <CardBody>
                        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
                          {/* Main Info */}
                          <VStack align="start" spacing={4}>
                            <HStack justify="space-between" w="full">
                              <VStack align="start" spacing={1}>
                                <Heading size="md" color="blue.600">{booking.serviceName}</Heading>
                                <Text color="gray.600" fontSize="sm">
                                  {booking.serviceDescription}
                                </Text>
                              </VStack>
                              <VStack align="end" spacing={2}>
                                <Badge colorScheme={getStatusColor(booking.status)} fontSize="sm" px={3} py={1}>
                                  {booking.status.toUpperCase()}
                                </Badge>
                                <Badge colorScheme={getPaymentStatusColor(booking.paymentStatus)} fontSize="xs">
                                  Payment: {booking.paymentStatus.toUpperCase()}
                                </Badge>
                              </VStack>
                            </HStack>

                            <Divider />

                            <Grid templateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={6} w="full">
                              <VStack align="start" spacing={2}>
                                <HStack>
                                  <CalendarIcon color="blue.500" />
                                  <Text fontWeight="semibold" color="gray.700">Date & Time</Text>
                                </HStack>
                                <Text fontSize="sm" fontWeight="medium">{formatDate(booking.scheduledDate)}</Text>
                                <Text color="blue.600" fontWeight="semibold" fontSize="sm">
                                  {booking.scheduledTime} ({booking.duration} mins)
                                </Text>
                              </VStack>

                              <VStack align="start" spacing={2}>
                                <HStack>
                                  <PhoneIcon color="green.500" />
                                  <Text fontWeight="semibold" color="gray.700">Emergency Contact</Text>
                                </HStack>
                                <Text fontSize="sm" fontWeight="medium">{booking.emergencyContactName}</Text>
                                <Text color="green.600" fontSize="sm" fontWeight="semibold">{booking.emergencyContactPhone}</Text>
                              </VStack>

                              <VStack align="start" spacing={2}>
                                <HStack>
                                  <InfoIcon color="purple.500" />
                                  <Text fontWeight="semibold" color="gray.700">Location</Text>
                                </HStack>
                                <Text fontSize="sm" fontWeight="medium">{booking.city}, {booking.state}</Text>
                                <Text fontSize="xs" color="gray.500">{booking.patientAddress}</Text>
                              </VStack>
                            </Grid>

                            {(booking.medicalConditions || booking.currentMedications) && (
                              <>
                                <Divider />
                                <VStack align="start" spacing={2} w="full">
                                  <Text fontWeight="semibold" color="gray.700">Medical Information</Text>
                                  {booking.medicalConditions && (
                                    <Text fontSize="sm" color="gray.600">
                                      <Text as="span" fontWeight="medium">Conditions:</Text> {booking.medicalConditions}
                                    </Text>
                                  )}
                                  {booking.currentMedications && (
                                    <Text fontSize="sm" color="gray.600">
                                      <Text as="span" fontWeight="medium">Medications:</Text> {booking.currentMedications}
                                    </Text>
                                  )}
                                </VStack>
                              </>
                            )}
                          </VStack>

                          {/* Actions & Price */}
                          <VStack align="end" spacing={4}>
                            <VStack align="end" spacing={1}>
                              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                                {formatPrice(booking.totalPrice)}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                Booking ID: {booking.id.slice(-8)}
                              </Text>
                            </VStack>

                            {booking.assignedNurse && (
                              <Card size="sm" variant="outline" bg="blue.50">
                                <CardBody p={3}>
                                  <VStack align="start" spacing={1}>
                                    <Text fontWeight="semibold" fontSize="xs" color="blue.600">
                                      ASSIGNED NURSE
                                    </Text>
                                    <Text fontSize="sm" fontWeight="medium">
                                      {booking.assignedNurse.firstName} {booking.assignedNurse.lastName}
                                    </Text>
                                    <Text fontSize="xs" color="gray.600">
                                      📞 {booking.assignedNurse.phone}
                                    </Text>
                                  </VStack>
                                </CardBody>
                              </Card>
                            )}

                            <VStack spacing={2} w="full">
                              {booking.status === 'pending' && (
                                <Button
                                  colorScheme="red"
                                  variant="outline"
                                  size="sm"
                                  w="full"
                                  onClick={() => cancelBooking(booking.id)}
                                >
                                  Cancel Booking
                                </Button>
                              )}
                              
                              <Button
                                colorScheme="blue"
                                variant="ghost"
                                size="sm"
                                w="full"
                                onClick={() => window.open(`/booking/${booking.id}`, '_blank')}
                              >
                                View Details
                              </Button>
                            </VStack>

                            <Text fontSize="xs" color="gray.500" textAlign="right">
                              Created: {new Date(booking.createdAt).toLocaleDateString('en-NG')}
                            </Text>
                          </VStack>
                        </Grid>
                      </CardBody>
                    </Card>
                  ))}
                  
                  {bookings.length > 3 && (
                    <Card variant="outline" borderStyle="dashed">
                      <CardBody textAlign="center" py={6}>
                        <VStack spacing={3}>
                          <Text color="gray.500">
                            You have {bookings.length - 3} more appointments
                          </Text>
                          <Button
                            variant="outline"
                            colorScheme="blue"
                            onClick={() => window.location.href = '/appointments'}
                          >
                            View All Appointments
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}
                </VStack>
              )}
            </CardBody>
          </Card>

          {/* Health Tips */}
          <Card bg="gradient-to-r from-blue.50 to-purple.50" borderColor="blue.200">
            <CardBody>
              <VStack spacing={4} align="start">
                <Heading size="md" color="blue.700">
                  💡 Health Tips
                </Heading>
                <Text color="gray.700">
                  <strong>Stay Hydrated:</strong> Drink at least 8 glasses of water daily to maintain optimal health. 
                  Proper hydration helps with energy levels, skin health, and overall wellness.
                </Text>
                <Text color="gray.700">
                  <strong>Regular Check-ups:</strong> Schedule routine health screenings to catch potential issues early. 
                  Prevention is always better than treatment.
                </Text>
                <Button size="sm" colorScheme="blue" variant="outline">
                  View More Health Tips
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default PatientDashboard;