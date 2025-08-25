import { Button } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { Link as RouterLink } from 'react-router-dom';

const pulseGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

type Props = {
  to: string;
  text: string;
  onClick?: () => void;
  variant?: 'solid' | 'ghost';
  bgGradient?: string;
  size?: string;
  fontSize?: string;
  borderRadius?: string;
  width?: string;
};

const NavigationLink = ({
  to,
  text,
  onClick,
  variant = 'solid',
  bgGradient = "linear-gradient(90deg, #4F46E5, #A855F7, #EC4899, #4F46E5)",
  size,
  fontSize,
  borderRadius,
  width
}: Props) => {
  
  const animationProps = {
    bgImage: bgGradient,
    bgSize: "300% 300%",
    animation: `${pulseGradient} 4s ease-in-out infinite`,
  };

  if (variant === 'ghost') {
    return (
      <Button
        as={RouterLink}
        to={to}
        onClick={onClick}
        variant="ghost"
        color="white"
        fontWeight="600"
        _hover={{ bg: 'whiteAlpha.200' }}
        size={size}
        fontSize={fontSize}
        borderRadius={borderRadius}
        width={width}
      >
        {text}
      </Button>
    );
  }

  return (
    <Button
      as={RouterLink}
      to={to}
      onClick={onClick}
      color="white"
      fontWeight="600"
      {...animationProps}
      _hover={{
        boxShadow: '0 0 15px rgba(255, 255, 255, 0.4)',
      }}
      size={size}
      fontSize={fontSize}
      borderRadius={borderRadius}
      width={width}
    >
      {text}
    </Button>
  );
};

export default NavigationLink;