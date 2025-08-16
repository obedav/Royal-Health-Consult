// src/hooks/useAuth.tsx - Updated to include ProtectedRoute
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Spinner, Center, VStack, Text } from '@chakra-ui/react';

const API_BASE_URL = 'http://localhost:3001/api/v1';

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'client' | 'nurse' | 'admin';
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  state?: string;
  city?: string;
  avatar?: string;
  preferredLanguage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role?: 'client' | 'nurse' | 'admin';
  state?: string;
  city?: string;
  preferredLanguage?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Verify token is still valid by calling profile endpoint
          await fetchUserProfile(token);
        } catch (error) {
          console.error('Error loading saved user:', error);
          // Clear invalid data
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
      } else if (response.status === 401) {
        // Token is invalid, clear auth data
        logout();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // On network error, keep existing user data but don't logout
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful - API returns { accessToken, refreshToken, user, expiresIn }
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        // Registration failed - API returns { message, error, statusCode }
        return { 
          success: false, 
          error: data.message || 'Registration failed. Please try again.' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: 'Network error. Please check your connection and try again.' 
      };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful - API returns { accessToken, refreshToken, user, expiresIn }
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        // Login failed - API returns { message, error, statusCode }
        return { 
          success: false, 
          error: data.message || 'Invalid email or password.' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Network error. Please check your connection and try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ProtectedRoute Component
interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: ('client' | 'nurse' | 'admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  allowedRoles
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Center h="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text color="gray.600">Loading...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page with the current location as state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check user role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User doesn't have required role, redirect to appropriate page
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'nurse':
        return <Navigate to="/nurse-dashboard" replace />;
      case 'client':
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  // If all checks pass, render the children
  return <>{children}</>;
};