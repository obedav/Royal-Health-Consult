// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Center,
  useColorModeValue,
} from '@chakra-ui/react'
import { FaUser, FaUserMd, FaUserShield, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

// Import all dashboard components
import PatientDashboard from '../components/dashboard/PatientDashboard'
import AdminDashboard from '../components/dashboard/AdminDashboard'
import NurseDashboard from '../components/dashboard/NurseDashboard'
import { useAuth } from '../hooks/useAuth'

type UserRole = 'client' | 'nurse' | 'admin'

interface DashboardUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardUser, setDashboardUser] = useState<DashboardUser | null>(null)

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      try {
        // In a real app, this would fetch user data from your API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (isAuthenticated && user) {
          // Mock user data based on auth state
          const mockUser: DashboardUser = {
            id: user.id || '1',
            name: `${user.firstName || 'John'} ${user.lastName || 'Doe'}`,
            email: user.email || 'user@example.com',
            role: user.role as UserRole || 'client',
            avatar: undefined
          }
          setDashboardUser(mockUser)
        } else {
          // Redirect to login if not authenticated
          navigate('/login')
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        navigate('/login')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [isAuthenticated, user, navigate])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleRoleSwitch = (role: UserRole) => {
    // For demo purposes, allow role switching
    if (dashboardUser) {
      setDashboardUser({
        ...dashboardUser,
        role
      })
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <Box bg="gray.50" minH="100vh">
        <Center h="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="primary.500" />
            <Text>Loading your dashboard...</Text>
          </VStack>
        </Center>
      </Box>
    )
  }

  // Not authenticated or no user data
  if (!dashboardUser) {
    return (
      <Box bg="gray.50" minH="100vh" py={8}>
        <Container maxW="4xl">
          <VStack spacing={6}>
            <Alert status="error">
              <AlertIcon />
              <Box>
                <AlertTitle>Access Denied!</AlertTitle>
                <AlertDescription>
                  You need to be logged in to access the dashboard.
                </AlertDescription>
              </Box>
            </Alert>
            <Button colorScheme="primary" onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </VStack>
        </Container>
      </Box>
    )
  }

  // Role-based dashboard rendering
  const renderDashboard = () => {
    console.log('🎯 Rendering dashboard for role:', dashboardUser.role) // Debug log
    
    switch (dashboardUser.role) {
      case 'admin':
        console.log('📊 Loading AdminDashboard component')
        return <AdminDashboard />
      case 'nurse':
        console.log('🏥 Loading NurseDashboard component')
        return <NurseDashboard />
      case 'client':
      default:
        console.log('👤 Loading PatientDashboard component')
        return <PatientDashboard />
    }
  }

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Dashboard Header */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
        <Container maxW="7xl">
          <HStack justify="space-between" align="center">
            <VStack spacing={1} align="start">
              <Heading size="md" color="gray.800">
                {dashboardUser.role === 'admin' ? 'Admin Panel' :
                 dashboardUser.role === 'nurse' ? 'Nurse Portal' :
                 'Patient Portal'}
              </Heading>
              <Text fontSize="sm" color="gray.600">
                Welcome back, {dashboardUser.name}
              </Text>
            </VStack>

            <HStack spacing={4}>
              {/* Demo Role Switcher */}
              <VStack spacing={2}>
                <Text fontSize="xs" color="gray.500">Demo: Switch Role</Text>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    variant={dashboardUser.role === 'client' ? 'solid' : 'outline'}
                    colorScheme="blue"
                    leftIcon={<FaUser />}
                    onClick={() => handleRoleSwitch('client')}
                  >
                    Patient
                  </Button>
                  <Button
                    size="sm"
                    variant={dashboardUser.role === 'nurse' ? 'solid' : 'outline'}
                    colorScheme="green"
                    leftIcon={<FaUserMd />}
                    onClick={() => handleRoleSwitch('nurse')}
                  >
                    Nurse
                  </Button>
                  <Button
                    size="sm"
                    variant={dashboardUser.role === 'admin' ? 'solid' : 'outline'}
                    colorScheme="purple"
                    leftIcon={<FaUserShield />}
                    onClick={() => handleRoleSwitch('admin')}
                  >
                    Admin
                  </Button>
                </HStack>
              </VStack>

              <Button
                leftIcon={<FaSignOutAlt />}
                variant="outline"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Dashboard Content */}
      {renderDashboard()}
    </Box>
  )
}

export default Dashboard