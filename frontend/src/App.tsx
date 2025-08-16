// src/App.tsx - Updated with proper route protection
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import theme from './styles/theme'
import './styles/globals.css'

// Import components
import Header from './components/common/Header'
import { AuthProvider, ProtectedRoute } from './hooks/useAuth'

// Import pages
import Home from './pages/Home'
import Booking from './pages/Booking'
import Login from './pages/Login'
import Register from './pages/Register'
import Services from './pages/Services'
import Dashboard from './pages/Dashboard'

// Simple components for other pages
const About = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h2>About Page</h2>
    <p>Learn more about Royal Health Consult</p>
  </div>
)

const Contact = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h2>Contact Page</h2>
    <p>Get in touch with us</p>
  </div>
)

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Router>
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Protected routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/booking" 
                    element={
                      <ProtectedRoute>
                        <Booking />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
            </div>
          </Router>
        </AuthProvider>
      </ChakraProvider>
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}

export default App