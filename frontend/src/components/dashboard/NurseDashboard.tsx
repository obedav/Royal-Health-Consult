import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Avatar,
  Divider,
  Progress,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Switch,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import {
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUserInjured,
  FaClipboardList,
  FaHeart,
  FaStethoscope,
} from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:3001/api/v1';

interface NurseStats {
  totalAssignments: number;
  completedToday: number;
  upcomingToday: number;
  monthlyEarnings: number;
  patientsSeen: number;
  averageRating: number;
}

interface Assignment {
  id: string;
  serviceName: string;
  patient: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  status: string;
  totalPrice: string;
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
  specialInstructions?: string;
  createdAt: string;
}

const NurseDashboard: React.FC = () => {
  const [stats, setStats] = useState<NurseStats | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchNurseData = async () => {
    setIsLoading(true);
    try {
      // Fetch nurse assignments (using my-bookings endpoint since nurse is assigned)
      const assignmentsResponse = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
        headers: getAuthHeaders(),
      });
      
      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json();
        setAssignments(assignmentsData);
        
        // Calculate stats from assignments
        const today = new Date().toDateString();
        const completedToday = assignmentsData.filter((a: Assignment) => 
          a.status === 'completed' && new Date(a.scheduledDate).toDateString() === today
        ).length;
        
        const upcomingToday = assignmentsData.filter((a: Assignment) => 
          new Date(a.scheduledDate).toDateString() === today && 
          ['pending', 'confirmed'].includes(a.status)
        ).length;

        const monthlyEarnings = assignmentsData
          .filter((a: Assignment) => a.status === 'completed')
          .reduce((sum: number, a: Assignment) => sum + parseFloat(a.totalPrice) * 0.7, 0); // Assuming 70% commission

        setStats({
          totalAssignments: assignmentsData.length,
          completedToday,
          upcomingToday,
          monthlyEarnings,
          patientsSeen: assignmentsData.filter((a: Assignment) => a.status === 'completed').length,
          averageRating: 4.8, // Mock rating
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNurseData();
  }, []);

  const updateAssignmentStatus = async (assignmentId: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${assignmentId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: 'Status Updated',
          description: `Assignment status updated to ${newStatus}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchNurseData();
      }
    } catch (err: any) {
      toast({
        title: 'Update Failed',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

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

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(parseFloat(price));
  };

  const getTodaysAssignments = () => {
    const today = new Date().toDateString();
    return assignments.filter(assignment => 
      new Date(assignment.scheduledDate).toDateString() === today
    );
  };

  if (isLoading) {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="7xl">
          <VStack spacing={4}>
            <Spinner size="xl" color="green.500" />
            <Text>Loading nurse dashboard...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Flex justify="space-between" align="center" mb={4}>
              <VStack align="start" spacing={1}>
                <Heading size="lg" color="green.600">
                  Nurse Dashboard
                </Heading>
                <Text color="gray.600">
                  Manage your patient assignments and schedule
                </Text>
              </VStack>
              
              <Card bg={cardBg} p={4}>
                <HStack spacing={4}>
                  <VStack spacing={1} align="start">
                    <Text fontSize="sm" color="gray.500">Availability Status</Text>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="availability" mb="0" fontSize="sm">
                        {isAvailable ? 'Available' : 'Unavailable'}
                      </FormLabel>
                      <Switch
                        id="availability"
                        colorScheme="green"
                        isChecked={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.checked)}
                      />
                    </FormControl>
                  </VStack>
                  <Avatar
                    size="md"
                    name="Nurse"
                    bg="green.500"
                    icon={<Icon as={FaStethoscope} fontSize="1.5rem" />}
                  />
                </HStack>
              </Card>
            </Flex>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert status="error">
              <AlertIcon />
              <Text>{error}</Text>
            </Alert>
          )}

          {/* Stats Grid */}
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
            <Card bg={cardBg} border="2px" borderColor="blue.100">
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <Icon as={FaCalendarAlt} color="blue.500" />
                      <Text>Today's Appointments</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="blue.500" fontSize="3xl">
                    {stats?.upcomingToday || 0}
                  </StatNumber>
                  <StatHelpText>Scheduled for today</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="2px" borderColor="green.100">
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <Icon as={FaUsers} color="green.500" />
                      <Text>Completed Today</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="green.500" fontSize="3xl">
                    {stats?.completedToday || 0}
                  </StatNumber>
                  <StatHelpText>Patients served</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="2px" borderColor="purple.100">
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <Icon as={FaDollarSign} color="purple.500" />
                      <Text>Monthly Earnings</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="purple.500" fontSize="3xl">
                    {formatPrice(stats?.monthlyEarnings?.toString() || '0')}
                  </StatNumber>
                  <StatHelpText>This month</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="2px" borderColor="orange.100">
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <Icon as={FaHeart} color="orange.500" />
                      <Text>Patient Rating</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber color="orange.500" fontSize="3xl">
                    {stats?.averageRating || 0}/5
                  </StatNumber>
                  <StatHelpText>Average rating</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </Grid>

          {/* Main Content Tabs */}
          <Tabs variant="enclosed" colorScheme="green">
            <TabList>
              <Tab>Today's Schedule</Tab>
              <Tab>All Assignments</Tab>
              <Tab>Patient Care Notes</Tab>
              <Tab>Earnings</Tab>
            </TabList>

            <TabPanels>
              {/* Today's Schedule */}
              <TabPanel p={0} pt={6}>
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">Today's Schedule</Heading>
                    <Text color="gray.600" fontSize="sm">
                      {new Date().toLocaleDateString('en-NG', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Text>
                  </CardHeader>
                  <CardBody>
                    {getTodaysAssignments().length === 0 ? (
                      <VStack spacing={4} py={8}>
                        <Icon as={FaCalendarAlt} fontSize="4xl" color="gray.300" />
                        <Text color="gray.500">No appointments scheduled for today</Text>
                        <Text fontSize="sm" color="gray.400">
                          Enjoy your day off or check back for new assignments
                        </Text>
                      </VStack>
                    ) : (
                      <VStack spacing={4} align="stretch">
                        {getTodaysAssignments().map((assignment) => (
                          <Card key={assignment.id} variant="outline" borderWidth="2px">
                            <CardBody>
                              <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6}>
                                <VStack align="start" spacing={3}>
                                  <HStack justify="space-between" w="full">
                                    <VStack align="start" spacing={1}>
                                      <Heading size="sm" color="green.600">
                                        {assignment.patient.firstName} {assignment.patient.lastName}
                                      </Heading>
                                      <Text fontSize="sm" color="gray.600">
                                        {assignment.serviceName}
                                      </Text>
                                    </VStack>
                                    <Badge colorScheme={getStatusColor(assignment.status)}>
                                      {assignment.status.toUpperCase()}
                                    </Badge>
                                  </HStack>

                                  <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4} w="full">
                                    <VStack align="start" spacing={1}>
                                      <HStack>
                                        <Icon as={FaClock} color="blue.500" />
                                        <Text fontWeight="medium" fontSize="sm">Time</Text>
                                      </HStack>
                                      <Text fontSize="sm">{assignment.scheduledTime}</Text>
                                      <Text fontSize="xs" color="gray.500">
                                        Duration: {assignment.duration} mins
                                      </Text>
                                    </VStack>

                                    <VStack align="start" spacing={1}>
                                      <HStack>
                                        <Icon as={FaMapMarkerAlt} color="red.500" />
                                        <Text fontWeight="medium" fontSize="sm">Location</Text>
                                      </HStack>
                                      <Text fontSize="sm">{assignment.city}, {assignment.state}</Text>
                                      <Text fontSize="xs" color="gray.500">
                                        {assignment.patientAddress}
                                      </Text>
                                    </VStack>

                                    <VStack align="start" spacing={1}>
                                      <HStack>
                                        <Icon as={FaPhoneAlt} color="green.500" />
                                        <Text fontWeight="medium" fontSize="sm">Contact</Text>
                                      </HStack>
                                      <Text fontSize="sm">{assignment.patient.phone}</Text>
                                      <Text fontSize="xs" color="gray.500">
                                        Emergency: {assignment.emergencyContactPhone}
                                      </Text>
                                    </VStack>
                                  </Grid>

                                  {assignment.medicalConditions && (
                                    <Box w="full">
                                      <Text fontWeight="medium" fontSize="sm" mb={1}>
                                        Medical Conditions:
                                      </Text>
                                      <Text fontSize="sm" color="gray.600">
                                        {assignment.medicalConditions}
                                      </Text>
                                    </Box>
                                  )}
                                </VStack>

                                <VStack spacing={4}>
                                  <Text fontSize="xl" fontWeight="bold" color="green.600">
                                    {formatPrice(assignment.totalPrice)}
                                  </Text>
                                  
                                  <VStack spacing={2} w="full">
                                    {assignment.status === 'confirmed' && (
                                      <Button
                                        colorScheme="blue"
                                        size="sm"
                                        w="full"
                                        onClick={() => updateAssignmentStatus(assignment.id, 'in_progress')}
                                      >
                                        Start Visit
                                      </Button>
                                    )}
                                    {assignment.status === 'in_progress' && (
                                      <Button
                                        colorScheme="green"
                                        size="sm"
                                        w="full"
                                        onClick={() => updateAssignmentStatus(assignment.id, 'completed')}
                                      >
                                        Complete Visit
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      w="full"
                                      onClick={() => setSelectedAssignment(assignment)}
                                    >
                                      View Details
                                    </Button>
                                  </VStack>
                                </VStack>
                              </Grid>
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    )}
                  </CardBody>
                </Card>
              </TabPanel>

              {/* All Assignments */}
              <TabPanel p={0} pt={6}>
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">All Assignments</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box overflowX="auto">
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Patient</Th>
                            <Th>Service</Th>
                            <Th>Date & Time</Th>
                            <Th>Status</Th>
                            <Th>Amount</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {assignments.map((assignment) => (
                            <Tr key={assignment.id}>
                              <Td>
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="medium" fontSize="sm">
                                    {assignment.patient.firstName} {assignment.patient.lastName}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {assignment.patient.phone}
                                  </Text>
                                </VStack>
                              </Td>
                              <Td>
                                <Text fontSize="sm">{assignment.serviceName}</Text>
                              </Td>
                              <Td>
                                <VStack align="start" spacing={0}>
                                  <Text fontSize="sm">
                                    {new Date(assignment.scheduledDate).toLocaleDateString()}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {assignment.scheduledTime}
                                  </Text>
                                </VStack>
                              </Td>
                              <Td>
                                <Badge colorScheme={getStatusColor(assignment.status)}>
                                  {assignment.status.toUpperCase()}
                                </Badge>
                              </Td>
                              <Td fontWeight="medium" fontSize="sm">
                                {formatPrice(assignment.totalPrice)}
                              </Td>
                              <Td>
                                <Button size="xs" colorScheme="green">
                                  View
                                </Button>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Patient Care Notes */}
              <TabPanel p={0} pt={6}>
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">Patient Care Notes</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel>Select Patient</FormLabel>
                        <Select placeholder="Choose a patient">
                          {assignments.map((assignment) => (
                            <option key={assignment.id} value={assignment.id}>
                              {assignment.patient.firstName} {assignment.patient.lastName} - {assignment.serviceName}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>Care Notes</FormLabel>
                        <Textarea
                          placeholder="Enter patient care notes, observations, and treatment details..."
                          rows={6}
                        />
                      </FormControl>
                      
                      <Button colorScheme="green" w="fit-content">
                        Save Notes
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Earnings */}
              <TabPanel p={0} pt={6}>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                  <Card bg={cardBg}>
                    <CardHeader>
                      <Heading size="md">Earnings Summary</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4}>
                        <Box w="full">
                          <Flex justify="space-between" mb={2}>
                            <Text>This Month</Text>
                            <Text fontWeight="bold">
                              {formatPrice(stats?.monthlyEarnings?.toString() || '0')}
                            </Text>
                          </Flex>
                          <Progress value={70} colorScheme="green" />
                          <Text fontSize="xs" color="gray.500" mt={1}>
                            70% of monthly goal
                          </Text>
                        </Box>
                        
                        <Divider />
                        
                        <VStack spacing={2} w="full">
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm">Completed Visits</Text>
                            <Text fontSize="sm" fontWeight="medium">
                              {stats?.patientsSeen || 0}
                            </Text>
                          </HStack>
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm">Average per Visit</Text>
                            <Text fontSize="sm" fontWeight="medium">
                              {stats?.patientsSeen ? 
                                formatPrice(((stats?.monthlyEarnings || 0) / stats.patientsSeen).toString()) : 
                                '₦0'
                              }
                            </Text>
                          </HStack>
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm">Commission Rate</Text>
                            <Text fontSize="sm" fontWeight="medium">70%</Text>
                          </HStack>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg}>
                    <CardHeader>
                      <Heading size="md">Performance</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4}>
                        <Box w="full" textAlign="center">
                          <Text fontSize="3xl" fontWeight="bold" color="orange.500">
                            {stats?.averageRating || 0}/5
                          </Text>
                          <Text color="gray.600">Patient Rating</Text>
                        </Box>
                        
                        <Divider />
                        
                        <VStack spacing={2} w="full">
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm">On-time Arrivals</Text>
                            <Text fontSize="sm" fontWeight="medium" color="green.500">
                              98%
                            </Text>
                          </HStack>
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm">Patient Satisfaction</Text>
                            <Text fontSize="sm" fontWeight="medium" color="green.500">
                              96%
                            </Text>
                          </HStack>
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm">Monthly Bonus</Text>
                            <Text fontSize="sm" fontWeight="medium" color="purple.500">
                              Eligible
                            </Text>
                          </HStack>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </Grid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
};

export default NurseDashboard;