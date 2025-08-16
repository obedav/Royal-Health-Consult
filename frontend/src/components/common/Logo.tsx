import { Box, Image, Text, HStack, VStack } from '@chakra-ui/react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  variant?: 'horizontal' | 'vertical'
  onClick?: () => void
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  variant = 'horizontal',
  onClick 
}) => {
  const sizeMap = {
    sm: { icon: '32px', text: 'sm' },
    md: { icon: '48px', text: 'lg' },
    lg: { icon: '64px', text: 'xl' },
    xl: { icon: '80px', text: '2xl' }
  }

  const dimensions = sizeMap[size]

  const LogoIcon = () => (
    <Box
      width={dimensions.icon}
      height={dimensions.icon}
      position="relative"
      cursor={onClick ? 'pointer' : 'default'}
    >
      {/* Fallback SVG representation of your logo concept */}
      <Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="transparent"
        borderRadius="md"
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {/* Stylized person figure with pink and purple colors */}
          <circle cx="50" cy="25" r="12" fill="#E91E63" />
          <path
            d="M30 45 Q50 35 70 45 L75 75 Q50 85 25 75 Z"
            fill="url(#gradient)"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E91E63" />
              <stop offset="100%" stopColor="#9C27B0" />
            </linearGradient>
          </defs>
        </svg>
      </Box>
    </Box>
  )

  const LogoText = () => (
    <VStack spacing={0} align={variant === 'horizontal' ? 'flex-start' : 'center'}>
      <Text
        fontSize={dimensions.text}
        fontWeight="800"
        letterSpacing="tight"
        bgGradient="linear(45deg, primary.500, secondary.500)"
        bgClip="text"
        color="transparent"
        lineHeight="1"
      >
        ROYAL HEALTH
      </Text>
      <Text
        fontSize={size === 'sm' ? 'xs' : size === 'md' ? 'sm' : 'md'}
        fontWeight="600"
        color="primary.500"
        letterSpacing="wide"
        lineHeight="1"
      >
        CONSULT
      </Text>
    </VStack>
  )

  if (variant === 'vertical') {
    return (
      <VStack spacing={3} align="center" onClick={onClick} cursor={onClick ? 'pointer' : 'default'}>
        <LogoIcon />
        {showText && <LogoText />}
      </VStack>
    )
  }

  return (
    <HStack spacing={3} align="center" onClick={onClick} cursor={onClick ? 'pointer' : 'default'}>
      <LogoIcon />
      {showText && <LogoText />}
    </HStack>
  )
}

export default Logo