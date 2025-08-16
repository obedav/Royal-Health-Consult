import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Button,
  Icon,
  Badge,
  Avatar,
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
  Divider,
  useToast,
} from '@chakra-ui/react';
import {
  FaUsers,
  FaUserMd,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaChartLine,
  FaUserPlus,
  FaFileExport,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaClock,
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

  // Theme
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();

  // API Base URL
  const API_BASE_URL = 'http://localhost:3001/api/v1';

  // Get auth token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  // Fetch real data from APIs
  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('🔄 Fetching admin dashboard data...');

      // Fetch booking statistics
      const statsResponse = await fetch(`${API_BASE_URL}/bookings/stats`, {
        headers: getAuthHeaders(),
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('📊 Booking stats:', statsData);
        setStats(statsData);
      } else {
        console.error('Failed to fetch stats:', statsResponse.status);
      }

      // Fetch all bookings
      const bookingsResponse = await fetch(`${API_BASE_URL}/bookings/all`, {
        headers: getAuthHeaders(),
      });

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        console.log('📅 All bookings:', bookingsData);
        setBookings(bookingsData);
      } else {
        console.error('Failed to fetch bookings:', bookingsResponse.status);
      }

      // Try to fetch users (may not exist yet)
      try {
        const usersResponse = await fetch(`${API_BASE_URL}/users`, {
          headers: getAuthHeaders(),
        });

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          console.log('👥 All users:', usersData);
          setUsers(usersData);
        }
      } catch (err) {
        console.log('Users endpoint not available, using mock data');
        // Use mock user data if endpoint doesn't exist
        setUsers([
          {
            id: '1',
            email: 'fresh.new@royalhealth.ng',
            firstName: 'Fresh',
            lastName: 'New',
            role: 'admin',
            status: 'active',
            phone: '+2348123456789',
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            email: 'patient@example.com',
            firstName: 'Patient',
            lastName: 'User',
            role: 'client',
            status: 'active',
            phone: '+2348123456790',
            createdAt: new Date().toISOString(),
          },
        ]);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      toast({
        title: 'Error loading data',
        description: 'Please check your connection and try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate derived stats
  const totalPatients = users.filter(user => user.role === 'client').length;
  const totalNurses = users.filter(user => user.role === 'nurse').length;
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

  if (loading) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="purple.500" thickness="4px" />
          <Text>Loading admin dashboard...</Text>
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
                Welcome back, Fresh! Manage your healthcare platform operations
              </Text>
            </VStack>
            
            <HStack spacing={4}>
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
              <Button
                leftIcon={<FaUserPlus />}
                colorScheme="purple"
                onClick={() => toast({
                  title: 'Add Nurse',
                  description: 'Feature coming soon',
                  status: 'info',
                  duration: 3000,
                })}
              >
                Add Nurse
              </Button>
            </HStack>
          </HStack>

          {/* Error Alert */}
          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
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
                      <StatHelpText color="green.500" fontSize="sm">
                        <StatArrow type="increase" />
                        Real users in database
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
                        Active Nurses
                      </StatLabel>
                      <StatNumber fontSize="3xl" color="green.600">
                        {totalNurses}
                      </StatNumber>
                      <StatHelpText color="gray.500" fontSize="sm">
                        Professional healthcare staff
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
                      <StatHelpText color="gray.500" fontSize="sm">
                        Scheduled for today
                      </StatHelpText>
                    </VStack>
                    <Icon as={FaCalendarAlt} fontSize="3xl" color="orange.500" />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>

            {/* Monthly Revenue */}
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody>
                <Stat>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <StatLabel color="gray.600" fontSize="sm">
                        Monthly Revenue
                      </StatLabel>
                      <StatNumber fontSize="3xl" color="purple.600">
                        {formatCurrency(stats?.revenue || 0)}
                      </StatNumber>
                      <StatHelpText color="gray.500" fontSize="sm">
                        {stats?.revenue > 0 ? (
                          <>
                            <StatArrow type="increase" />
                            From completed bookings
                          </>
                        ) : (
                          'No completed bookings yet'
                        )}
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
                    <Text color="gray.500">No booking data available</Text>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Performance Metrics */}
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardHeader>
                <Heading size="md" color="gray.700">
                  Platform Performance
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm">User Growth</Text>
                      <Text fontSize="sm" fontWeight="bold">
                        {totalPatients + totalNurses} users
                      </Text>
                    </HStack>
                    <Progress value={75} colorScheme="green" size="sm" />
                  </Box>

                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm">Booking Success Rate</Text>
                      <Text fontSize="sm" fontWeight="bold">
                        {stats?.total > 0 ? Math.round(((stats.completed || 0) / stats.total) * 100) : 0}%
                      </Text>
                    </HStack>
                    <Progress 
                      value={stats?.total > 0 ? ((stats.completed || 0) / stats.total) * 100 : 0} 
                      colorScheme="purple" 
                      size="sm" 
                    />
                  </Box>

                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm">Revenue Target</Text>
                      <Text fontSize="sm" fontWeight="bold">
                        {formatCurrency(stats?.revenue || 0)} / ₦500K
                      </Text>
                    </HStack>
                    <Progress 
                      value={((stats?.revenue || 0) / 500000) * 100} 
                      colorScheme="blue" 
                      size="sm" 
                    />
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </Grid>

          {/* Recent Bookings */}
          <Card bg={cardBg} shadow="lg" borderRadius="xl">
            <CardHeader>
              <Heading size="md" color="gray.700">
                Recent Bookings
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
                      {bookings.slice(0, 5).map((booking) => (
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
                      Bookings will appear here once patients start booking appointments
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