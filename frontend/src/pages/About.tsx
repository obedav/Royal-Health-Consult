// src/pages/About.tsx - Dynamic version with real backend data
import React, { useState, useEffect } from 'react';
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
  Badge,
  Icon,
  Button,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  Avatar,
  Divider,
  List,
  ListItem,
  ListIcon,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import {
  FaHeart,
  FaUserMd,
  FaHome,
  FaShieldAlt,
  FaClock,
  FaPhone,
  FaCheck,
  FaAward,
  FaUsers,
  FaStethoscope,
  FaHandsHelping,
  FaGlobe,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Types for real data
interface CompanyStats {
  totalPatients: number;
  totalProfessionals: number;
  statesCovered: number;
  successRate: number;
  totalBookings: number;
  completedAssessments: number;
}

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  specialization: string;
  experience: number;
  credentials: string[];
  bio?: string;
  profileImage?: string;
  isActive: boolean;
}

interface CompanyInfo {
  mission: string;
  vision: string;
  foundedYear: number;
  story: string;
  values: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

const About: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // State for real data
  const [companyStats, setCompanyStats] = useState<CompanyStats | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:3001/api/v1';

  // Fetch real data from backend
  const fetchAboutData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch company statistics
      const statsResponse = await fetch(`${API_BASE_URL}/company/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setCompanyStats(statsData);
      }

      // Fetch team members
      const teamResponse = await fetch(`${API_BASE_URL}/team/members`);
      if (teamResponse.ok) {
        const teamData = await teamResponse.json();
        setTeamMembers(teamData.filter((member: TeamMember) => member.isActive));
      }

      // Fetch company information
      const companyResponse = await fetch(`${API_BASE_URL}/company/info`);
      if (companyResponse.ok) {
        const companyData = await companyResponse.json();
        setCompanyInfo(companyData);
      }

    } catch (err) {
      console.error('Error fetching about data:', err);
      setError('Failed to load company information');
      
      // Fallback: Use minimal real data from other endpoints
      try {
        const bookingStatsResponse = await fetch(`${API_BASE_URL}/bookings/stats`);
        const usersResponse = await fetch(`${API_BASE_URL}/users`);
        
        if (bookingStatsResponse.ok && usersResponse.ok) {
          const bookingStats = await bookingStatsResponse.json();
          const users = await usersResponse.json();
          
          // Calculate stats from existing data
          const patients = users.filter((user: any) => user.role === 'client' || user.role === 'patient');
          const professionals = users.filter((user: any) => user.role === 'nurse' || user.role === 'healthcare_professional');
          
          setCompanyStats({
            totalPatients: patients.length,
            totalProfessionals: professionals.length,
            statesCovered: 15, // You can calculate this from user addresses
            successRate: bookingStats.total > 0 ? Math.round((bookingStats.completed / bookingStats.total) * 100) : 0,
            totalBookings: bookingStats.total || 0,
            completedAssessments: bookingStats.completed || 0,
          });
        }
      } catch (fallbackErr) {
        console.error('Fallback data fetch failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  // Default values (you can move these to a config file)
  const defaultCompanyInfo: CompanyInfo = {
    mission: "To revolutionize healthcare accessibility in Nigeria by providing high-quality, professional medical services in the comfort and safety of patients' homes.",
    vision: "To become the leading home healthcare platform in West Africa, known for excellence, innovation, and compassionate care.",
    foundedYear: 2023,
    story: "Royal Health Consult was born from a simple yet powerful observation: many Nigerians struggle to access quality healthcare due to distance, mobility issues, or busy schedules.",
    values: [
      {
        title: 'Compassionate Care',
        description: 'We provide healthcare with empathy, understanding, and genuine concern for every patient\'s wellbeing.',
        icon: 'heart'
      },
      {
        title: 'Quality & Safety',
        description: 'Our healthcare professionals are thoroughly vetted, licensed, and committed to the highest standards of care.',
        icon: 'shield'
      },
      {
        title: 'Convenience',
        description: 'Bringing professional healthcare directly to your home, making quality care accessible and comfortable.',
        icon: 'home'
      },
      {
        title: 'Reliability',
        description: '24/7 availability for emergency assessments and punctual, dependable service for all appointments.',
        icon: 'clock'
      }
    ]
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      heart: FaHeart,
      shield: FaShieldAlt,
      home: FaHome,
      clock: FaClock,
    };
    return iconMap[iconName] || FaCheck;
  };

  const getColorScheme = (index: number) => {
    const colors = ['red', 'blue', 'green', 'orange'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="primary.500" thickness="4px" />
          <Text>Loading company information...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box bg={bg} minH="100vh">
      {/* Hero Section */}
      <Box bg="primary.600" color="white" py={20}>
        <Container maxW="6xl">
          <VStack spacing={6} textAlign="center">
            <Heading size="2xl" fontWeight="bold">
              About Royal Health Consult
            </Heading>
            <Text fontSize="xl" maxW="3xl" opacity={0.9}>
              {companyInfo?.mission || defaultCompanyInfo.mission}
            </Text>
            <Badge bg="white" color="primary.600" px={4} py={2} fontSize="md" borderRadius="full">
              Pioneering Home Healthcare Since {companyInfo?.foundedYear || defaultCompanyInfo.foundedYear}
            </Badge>
          </VStack>
        </Container>
      </Box>

      <Container maxW="6xl" py={16}>
        <VStack spacing={20} align="stretch">
          {/* Error Alert */}
          {error && (
            <Alert status="warning">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Notice</Text>
                <Text fontSize="sm">{error}. Showing available data from the system.</Text>
              </Box>
            </Alert>
          )}

          {/* Mission & Vision */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12}>
            <Card bg={cardBg} shadow="xl" borderRadius="2xl" overflow="hidden">
              <CardBody p={8}>
                <VStack spacing={6} align="start">
                  <HStack spacing={3}>
                    <Icon as={FaStethoscope} fontSize="2xl" color="primary.500" />
                    <Heading size="lg" color="primary.600">Our Mission</Heading>
                  </HStack>
                  <Text fontSize="lg" lineHeight="tall" color="gray.600">
                    {companyInfo?.mission || defaultCompanyInfo.mission}
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg} shadow="xl" borderRadius="2xl" overflow="hidden">
              <CardBody p={8}>
                <VStack spacing={6} align="start">
                  <HStack spacing={3}>
                    <Icon as={FaHandsHelping} fontSize="2xl" color="secondary.500" />
                    <Heading size="lg" color="secondary.600">Our Vision</Heading>
                  </HStack>
                  <Text fontSize="lg" lineHeight="tall" color="gray.600">
                    {companyInfo?.vision || defaultCompanyInfo.vision}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Real Statistics from Backend */}
          {companyStats && (
            <Box bg="gray.100" borderRadius="3xl" p={12}>
              <VStack spacing={8} textAlign="center" mb={12}>
                <Heading size="xl" color="gray.800">Our Real Impact</Heading>
                <Text fontSize="lg" maxW="3xl" color="gray.600">
                  Live statistics from our healthcare platform
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
                <Card bg="white" shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={8}>
                    <Stat>
                      <VStack spacing={3}>
                        <Icon as={FaUsers} fontSize="3xl" color="primary.500" />
                        <StatNumber fontSize="3xl" color="gray.800" fontWeight="bold">
                          {companyStats.totalPatients.toLocaleString()}
                        </StatNumber>
                        <StatLabel fontSize="md" color="gray.600" fontWeight="medium">
                          Patients Served
                        </StatLabel>
                      </VStack>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg="white" shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={8}>
                    <Stat>
                      <VStack spacing={3}>
                        <Icon as={FaUserMd} fontSize="3xl" color="green.500" />
                        <StatNumber fontSize="3xl" color="gray.800" fontWeight="bold">
                          {companyStats.totalProfessionals}
                        </StatNumber>
                        <StatLabel fontSize="md" color="gray.600" fontWeight="medium">
                          Healthcare Professionals
                        </StatLabel>
                      </VStack>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg="white" shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={8}>
                    <Stat>
                      <VStack spacing={3}>
                        <Icon as={FaGlobe} fontSize="3xl" color="blue.500" />
                        <StatNumber fontSize="3xl" color="gray.800" fontWeight="bold">
                          {companyStats.statesCovered}+
                        </StatNumber>
                        <StatLabel fontSize="md" color="gray.600" fontWeight="medium">
                          States Covered
                        </StatLabel>
                      </VStack>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg="white" shadow="md" borderRadius="xl">
                  <CardBody textAlign="center" py={8}>
                    <Stat>
                      <VStack spacing={3}>
                        <Icon as={FaAward} fontSize="3xl" color="purple.500" />
                        <StatNumber fontSize="3xl" color="gray.800" fontWeight="bold">
                          {companyStats.successRate}%
                        </StatNumber>
                        <StatLabel fontSize="md" color="gray.600" fontWeight="medium">
                          Success Rate
                        </StatLabel>
                      </VStack>
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </Box>
          )}

          {/* Core Values - Dynamic or Default */}
          <Box>
            <VStack spacing={8} textAlign="center" mb={12}>
              <Heading size="xl" color="gray.800">Our Core Values</Heading>
              <Text fontSize="lg" maxW="3xl" color="gray.600">
                These values guide everything we do and shape how we interact with patients and healthcare professionals.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {(companyInfo?.values || defaultCompanyInfo.values).map((value, index) => (
                <Card key={index} bg={cardBg} shadow="lg" borderRadius="xl" overflow="hidden">
                  <CardBody p={8}>
                    <HStack spacing={6} align="start">
                      <Box bg={`${getColorScheme(index)}.100`} p={4} borderRadius="full">
                        <Icon as={getIconComponent(value.icon)} fontSize="xl" color={`${getColorScheme(index)}.500`} />
                      </Box>
                      <VStack spacing={3} align="start" flex={1}>
                        <Heading size="md" color={`${getColorScheme(index)}.600`}>
                          {value.title}
                        </Heading>
                        <Text color="gray.600" lineHeight="tall">
                          {value.description}
                        </Text>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Real Team Members */}
          {teamMembers.length > 0 && (
            <Box>
              <VStack spacing={8} textAlign="center" mb={12}>
                <Heading size="xl" color="gray.800">Meet Our Team</Heading>
                <Text fontSize="lg" maxW="3xl" color="gray.600">
                  Our experienced healthcare professionals committed to providing exceptional care.
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                {teamMembers.slice(0, 6).map((member) => (
                  <Card key={member.id} bg={cardBg} shadow="xl" borderRadius="2xl" overflow="hidden">
                    <CardBody p={8} textAlign="center">
                      <VStack spacing={6}>
                        <Avatar 
                          size="2xl" 
                          name={`${member.firstName} ${member.lastName}`} 
                          src={member.profileImage}
                          bg="primary.500" 
                        />
                        <VStack spacing={2}>
                          <Heading size="md" color="gray.800">
                            {member.firstName} {member.lastName}
                          </Heading>
                          <Text fontWeight="600" color="primary.600">{member.role}</Text>
                          <Text fontSize="sm" color="gray.600">{member.specialization}</Text>
                          <Badge colorScheme="green">{member.experience} years experience</Badge>
                        </VStack>
                        {member.bio && (
                          <>
                            <Divider />
                            <Text fontSize="sm" color="gray.600" textAlign="center">
                              {member.bio}
                            </Text>
                          </>
                        )}
                        {member.credentials.length > 0 && (
                          <>
                            <Divider />
                            <VStack spacing={2}>
                              <Text fontSize="sm" fontWeight="600" color="gray.700">Credentials:</Text>
                              <HStack spacing={2} flexWrap="wrap" justify="center">
                                {member.credentials.map((credential, idx) => (
                                  <Badge key={idx} variant="outline" colorScheme="blue" fontSize="xs">
                                    {credential}
                                  </Badge>
                                ))}
                              </HStack>
                            </VStack>
                          </>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Quality Assurance */}
          <Box>
            <VStack spacing={8} textAlign="center" mb={12}>
              <Heading size="xl" color="gray.800">Quality Assurance</Heading>
              <Text fontSize="lg" maxW="3xl" color="gray.600">
                We maintain the highest standards of healthcare delivery through rigorous quality control.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <Card bg={cardBg} shadow="lg" borderRadius="xl">
                <CardBody p={8}>
                  <VStack spacing={6} align="start">
                    <Heading size="lg" color="primary.600">Professional Standards</Heading>
                    <List spacing={3}>
                      <ListItem>
                        <ListIcon as={FaCheck} color="green.500" />
                        All healthcare professionals are licensed and verified
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheck} color="green.500" />
                        Continuous professional development and training
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheck} color="green.500" />
                        Regular performance evaluations and assessments
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheck} color="green.500" />
                        Adherence to international healthcare standards
                      </ListItem>
                    </List>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={cardBg} shadow="lg" borderRadius="xl">
                <CardBody p={8}>
                  <VStack spacing={6} align="start">
                    <Heading size="lg" color="secondary.600">Patient Safety</Heading>
                    <List spacing={3}>
                      <ListItem>
                        <ListIcon as={FaCheck} color="green.500" />
                        Comprehensive background checks for all staff
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheck} color="green.500" />
                        Strict infection control and safety protocols
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheck} color="green.500" />
                        24/7 emergency support and consultation
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheck} color="green.500" />
                        Regular quality audits and patient feedback reviews
                      </ListItem>
                    </List>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </Box>

          {/* Call to Action */}
          <Box bg="primary.600" color="white" borderRadius="3xl" p={12} textAlign="center">
            <VStack spacing={8}>
              <VStack spacing={4}>
                <Heading size="xl">Ready to Experience Quality Healthcare at Home?</Heading>
                <Text fontSize="lg" maxW="3xl" opacity={0.9}>
                  Join {companyStats?.totalPatients || 'thousands of'} satisfied patients who have chosen 
                  Royal Health Consult for their healthcare needs.
                </Text>
              </VStack>
              <HStack spacing={6}>
                <Button
                  size="lg"
                  bg="white"
                  color="primary.600"
                  _hover={{ bg: 'gray.100' }}
                  onClick={() => navigate('/booking')}
                  leftIcon={<FaPhone />}
                >
                  Book Appointment
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  borderColor="white"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  onClick={() => navigate('/contact')}
                >
                  Contact Us
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default About;