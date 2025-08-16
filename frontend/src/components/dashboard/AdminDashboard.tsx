import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Button,
  Icon,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  VStack,
  HStack,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import {
  FaUsers,
  FaUserMd,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserPlus,
  FaFileExport,
  FaEye,
  FaEdit,
  FaSignInAlt,
  FaExclamationTriangle,
} from 'react-icons/fa';

// Types
interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  revenue: number;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  phone: string;
  createdAt: string;
}

interface Booking {
  id: string;
  serviceType: string;
  serviceName: string;
  status: string;
  totalPrice: number;
  scheduledDate: string;
  scheduledTime: string;
  patient: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  // State
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Login modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loginEmail, setLoginEmail] = useState('fresh.new@royalhealth.ng');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginLoading, setLoginLoading] = useState(false);

  // Theme
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const toast = useToast();

  // API Base URL
  const API_BASE_URL = 'http://localhost:3001/api/v1';

  // Check if user is authenticated
  const checkAuthentication = (): boolean => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (token) {
      console.log('✅ Authentication token found');
      setIsAuthenticated(true);
      return true;
    }
    console.log('❌ No authentication token found');
    setIsAuthenticated(false);
    return false;
  };

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  // Login function
  const handleLogin = async () => {
    setLoginLoading(true);
    try {
      console.log('🔐 Attempting login...');
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login successful:', data);
        
        // Store the token
        localStorage.setItem('token', data.accessToken || data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setIsAuthenticated(true);
        onClose();
        
        toast({
          title: 'Login Successful',
          description: 'Welcome back! Loading dashboard data...',
          status: 'success',
          duration: 3000,
        });
        
        // Fetch data after successful login
        fetchData();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
    } catch (err) {
      console.error('❌ Login failed:', err);
      toast({
        title: 'Login Failed',
        description: err instanceof Error ? err.message : 'Please check your credentials',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoginLoading(false);
    }
  };

  // Fetch real data from APIs
  const fetchData = async () => {
    if (!checkAuthentication()) {
      setLoading(false);
      setError('Please log in to access admin dashboard');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔄 Fetching real data from backend...');

      // Fetch booking statistics
      try {
        console.log('📊 Fetching booking stats...');
        const statsResponse = await fetch(`${API_BASE_URL}/bookings/stats`, {
          headers: getAuthHeaders(),
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          console.log('✅ Real booking stats:', statsData);
          setStats(statsData);
        } else if (statsResponse.status === 401) {
          throw new Error('Authentication expired');
        } else {
          console.warn('⚠️ Stats endpoint returned:', statsResponse.status);
        }
      } catch (err) {
        console.error('❌ Failed to fetch stats:', err);
      }

      // Fetch all bookings
      try {
        console.log('📅 Fetching all bookings...');
        const bookingsResponse = await fetch(`${API_BASE_URL}/bookings/all`, {
          headers: getAuthHeaders(),
        });

        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          console.log('✅ Real bookings data:', bookingsData);
          setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        } else if (bookingsResponse.status === 401) {
          throw new Error('Authentication expired');
        } else {
          console.warn('⚠️ Bookings endpoint returned:', bookingsResponse.status);
        }
      } catch (err) {
        console.error('❌ Failed to fetch bookings:', err);
      }

      // Fetch users
      try {
        console.log('👥 Fetching all users...');
        const usersResponse = await fetch(`${API_BASE_URL}/users`, {
          headers: getAuthHeaders(),
        });

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          console.log('✅ Real users data:', usersData);
          setUsers(Array.isArray(usersData) ? usersData : []);
        } else if (usersResponse.status === 401) {
          throw new Error('Authentication expired');
        } else {
          console.warn('⚠️ Users endpoint returned:', usersResponse.status);
        }
      } catch (err) {
        console.error('❌ Failed to fetch users:', err);
      }

    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      if (err instanceof Error && err.message === 'Authentication expired') {
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate derived stats
  const totalPatients = users.filter(user => user.role === 'client' || user.role === 'patient').length;
  const totalNurses = users.filter(user => user.role === 'nurse' || user.role === 'healthcare_professional').length;
  const todayBookings = bookings.filter(booking => {
    const today = new Date().toISOString().split('T')[0];
    return booking.scheduledDate === today;
  }).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'yellow';
      case 'confirmed':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <Box bg={bg} minH="100vh">
        <Container maxW="md" py={20}>
          <VStack spacing={8} align="center">
            <Icon as={FaExclamationTriangle} fontSize="6xl" color="orange.500" />
            <VStack spacing={4} textAlign="center">
              <Heading size="lg" color="gray.700">
                Admin Access Required
              </Heading>
              <Text color="gray.600">
                Please log in with admin credentials to access the dashboard
              </Text>
            </VStack>
            
            <Card bg={cardBg} p={6} w="full">
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@royalhealth.ng"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </FormControl>
                
                <Button
                  colorScheme="purple"
                  size="lg"
                  leftIcon={<FaSignInAlt />}
                  onClick={handleLogin}
                  isLoading={loginLoading}
                  loadingText="Logging in..."
                  w="full"
                >
                  Login to Dashboard
                </Button>
              </VStack>
            </Card>
            
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle fontSize="sm">Demo Credentials</AlertTitle>
                <AlertDescription fontSize="sm">
                  Use the pre-filled credentials or create an admin account through your backend
                </AlertDescription>
              </Box>
            </Alert>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="purple.500" thickness="4px" />
          <Text>Loading real dashboard data...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box bg={bg} minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={2}>
              <Heading size="xl" color="purple.600">
                Admin Dashboard
              </Heading>
              <Text color="gray.600">
                Real-time data from Royal Health Consult backend
              </Text>
            </VStack>
            
            <HStack spacing={4}>
              <Badge colorScheme="green" px={3} py={1}>
                Live Data
              </Badge>
              <Button
                leftIcon={<FaFileExport />}
                colorScheme="purple"
                variant="outline"
                onClick={() => toast({
                  title: 'Export Started',
                  description: 'Report will be ready shortly',
                  status: 'info',
                  duration: 3000,
                })}
              >
                Export Report
              </Button>
            </HStack>
          </HStack>

          {/* Error Alert */}
          {error && (
            <Alert status="warning">
              <AlertIcon />
              <Box>
                <AlertTitle>Notice</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Box>
            </Alert>
          )}

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {/* Total Patients */}
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody>
                <Stat>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <StatLabel color="gray.600" fontSize="sm">
                        Total Patients
                      </StatLabel>
                      <StatNumber fontSize="3xl" color="blue.600">
                        {totalPatients}
                      </StatNumber>
                      <StatHelpText color="blue.500" fontSize="sm">
                        Registered users
                      </StatHelpText>
                    </VStack>
                    <Icon as={FaUsers} fontSize="3xl" color="blue.500" />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>

            {/* Active Nurses */}
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody>
                <Stat>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <StatLabel color="gray.600" fontSize="sm">
                        Healthcare Professionals
                      </StatLabel>
                      <StatNumber fontSize="3xl" color="green.600">
                        {totalNurses}
                      </StatNumber>
                      <StatHelpText color="green.500" fontSize="sm">
                        Active staff
                      </StatHelpText>
                    </VStack>
                    <Icon as={FaUserMd} fontSize="3xl" color="green.500" />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>

            {/* Today's Appointments */}
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody>
                <Stat>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <StatLabel color="gray.600" fontSize="sm">
                        Today's Appointments
                      </StatLabel>
                      <StatNumber fontSize="3xl" color="orange.600">
                        {todayBookings}
                      </StatNumber>
                      <StatHelpText color="orange.500" fontSize="sm">
                        Scheduled for today
                      </StatHelpText>
                    </VStack>
                    <Icon as={FaCalendarAlt} fontSize="3xl" color="orange.500" />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>

            {/* Total Revenue */}
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody>
                <Stat>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <StatLabel color="gray.600" fontSize="sm">
                        Total Revenue
                      </StatLabel>
                      <StatNumber fontSize="3xl" color="purple.600">
                        {formatCurrency(stats?.revenue || 0)}
                      </StatNumber>
                      <StatHelpText color="purple.500" fontSize="sm">
                        From bookings
                      </StatHelpText>
                    </VStack>
                    <Icon as={FaMoneyBillWave} fontSize="3xl" color="purple.500" />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
            {/* Booking Statistics */}
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardHeader>
                <Heading size="md" color="gray.700">
                  Booking Statistics
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {stats ? (
                    <>
                      <HStack justify="space-between">
                        <Text>Total Bookings</Text>
                        <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                          {stats.total}
                        </Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Pending</Text>
                        <Badge colorScheme="yellow" fontSize="md" px={3} py={1}>
                          {stats.pending}
                        </Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Confirmed</Text>
                        <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                          {stats.confirmed}
                        </Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Completed</Text>
                        <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                          {stats.completed}
                        </Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Cancelled</Text>
                        <Badge colorScheme="red" fontSize="md" px={3} py={1}>
                          {stats.cancelled}
                        </Badge>
                      </HStack>
                    </>
                  ) : (
                    <Center py={8}>
                      <Text color="gray.500">No booking statistics available</Text>
                    </Center>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardHeader>
                <Heading size="md" color="gray.700">
                  Quick Actions
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Button
                    leftIcon={<FaUserPlus />}
                    colorScheme="purple"
                    variant="outline"
                    onClick={() => toast({
                      title: 'Add Nurse',
                      description: 'Redirect to add nurse form',
                      status: 'info',
                      duration: 3000,
                    })}
                  >
                    Add Healthcare Professional
                  </Button>
                  
                  <Button
                    leftIcon={<FaCalendarAlt />}
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => toast({
                      title: 'View Calendar',
                      description: 'Opening appointment calendar',
                      status: 'info',
                      duration: 3000,
                    })}
                  >
                    View Appointment Calendar
                  </Button>
                  
                  <Button
                    leftIcon={<FaFileExport />}
                    colorScheme="green"
                    variant="outline"
                    onClick={() => toast({
                      title: 'Generate Report',
                      description: 'Creating monthly report',
                      status: 'info',
                      duration: 3000,
                    })}
                  >
                    Generate Monthly Report
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </Grid>

          {/* Recent Bookings */}
          <Card bg={cardBg} shadow="lg" borderRadius="xl">
            <CardHeader>
              <Heading size="md" color="gray.700">
                Recent Bookings ({bookings.length} total)
              </Heading>
            </CardHeader>
            <CardBody>
              {bookings.length > 0 ? (
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Patient</Th>
                        <Th>Service</Th>
                        <Th>Date & Time</Th>
                        <Th>Amount</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {bookings.slice(0, 10).map((booking) => (
                        <Tr key={booking.id}>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium">
                                {booking.patient.firstName} {booking.patient.lastName}
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                {booking.patient.email}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium">{booking.serviceName}</Text>
                              <Text fontSize="sm" color="gray.500">
                                {booking.serviceType}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Text>{new Date(booking.scheduledDate).toLocaleDateString()}</Text>
                              <Text fontSize="sm" color="gray.500">
                                {booking.scheduledTime}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <Text fontWeight="bold" color="green.600">
                              {formatCurrency(booking.totalPrice)}
                            </Text>
                          </Td>
                          <Td>
                            <Badge 
                              colorScheme={getStatusColor(booking.status)}
                              textTransform="capitalize"
                            >
                              {booking.status}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Button size="sm" variant="ghost" colorScheme="blue">
                                <FaEye />
                              </Button>
                              <Button size="sm" variant="ghost" colorScheme="green">
                                <FaEdit />
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <Center py={8}>
                  <VStack spacing={4}>
                    <Icon as={FaCalendarAlt} fontSize="4xl" color="gray.400" />
                    <Text color="gray.500">No bookings found</Text>
                    <Text fontSize="sm" color="gray.400">
                      Bookings will appear here once patients start making appointments
                    </Text>
                  </VStack>
                </Center>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminDashboard;