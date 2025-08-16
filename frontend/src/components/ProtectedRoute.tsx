// src/components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Spinner, Center, Text, VStack } from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: ('client' | 'nurse' | 'admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  allowedRoles 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Center minH="100vh" bg="gray.50">
        <VStack spacing={4}>
          <Spinner size="xl" color="primary.500" thickness="4px" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Center>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <Center minH="100vh" bg="gray.50">
        <VStack spacing={4} textAlign="center">
          <Text fontSize="xl" fontWeight="bold" color="red.500">
            Access Denied
          </Text>
          <Text color="gray.600">
            You don't have permission to access this page.
          </Text>
        </VStack>
      </Center>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;