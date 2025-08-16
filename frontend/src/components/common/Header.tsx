import {
  Box,
  Flex,
  HStack,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useBreakpointValue,
  Container,
} from '@chakra-ui/react'
import { HiMenuAlt3 } from 'react-icons/hi'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'

const Header: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Book Appointment', path: '/booking' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ]

  const authItems = [
    { label: 'Login', path: '/login', variant: 'ghost' },
    { label: 'Register', path: '/register', variant: 'solid' },
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
    onClose()
  }

  const isActive = (path: string) => location.pathname === path

  const NavItems = ({ isMobile = false }) => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.path}
          variant="ghost"
          onClick={() => handleNavigation(item.path)}
          color={isActive(item.path) ? 'primary.500' : 'gray.600'}
          fontWeight={isActive(item.path) ? '600' : '500'}
          bg={isActive(item.path) ? 'primary.50' : 'transparent'}
          _hover={{
            color: 'primary.500',
            bg: 'primary.50',
          }}
          size={isMobile ? 'lg' : 'md'}
          justifyContent={isMobile ? 'flex-start' : 'center'}
        >
          {item.label}
        </Button>
      ))}
    </>
  )

  const AuthButtons = ({ isMobile = false }) => (
    <>
      {authItems.map((item) => (
        <Button
          key={item.path}
          variant={item.variant as 'ghost' | 'solid'}
          onClick={() => handleNavigation(item.path)}
          size={isMobile ? 'lg' : 'md'}
          colorScheme="primary"
          width={isMobile ? 'full' : 'auto'}
        >
          {item.label}
        </Button>
      ))}
    </>
  )

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg="white"
      boxShadow="sm"
      borderBottom="1px"
      borderColor="gray.200"
    >
      <Container maxW="7xl">
        <Flex h="80px" alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Logo 
            size="md" 
            onClick={() => handleNavigation('/')}
            variant="horizontal"
          />

          {/* Desktop Navigation */}
          {!isMobile && (
            <HStack spacing={8}>
              <HStack spacing={6}>
                <NavItems />
              </HStack>
              <HStack spacing={4}>
                <AuthButtons />
              </HStack>
            </HStack>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              aria-label="Open menu"
              icon={<HiMenuAlt3 />}
              variant="ghost"
              colorScheme="primary"
              onClick={onOpen}
              fontSize="20px"
            />
          )}
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Logo size="sm" variant="horizontal" />
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" pt={6}>
              <VStack spacing={2} align="stretch">
                <NavItems isMobile />
              </VStack>
              <Box pt={6} borderTop="1px" borderColor="gray.200">
                <VStack spacing={3} align="stretch">
                  <AuthButtons isMobile />
                </VStack>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default Header