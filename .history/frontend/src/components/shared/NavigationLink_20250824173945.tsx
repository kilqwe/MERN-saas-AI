// src/components/shared/NavigationLink.tsx

import { Button, type ButtonProps } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

type Props = {
  to: string;
  text: string;
  // ✅ 1. ADDED: An optional prop for the gradient string
  gradient?: string;
} & ButtonProps;

const NavigationLink = ({
  to,
  text,
  variant,
  borderRadius = 'full',
  // ✅ 2. SET a default value for the new gradient prop
  gradient = 'linear-gradient(270deg, #FF69B4, #8A2BE2, #00FFFF, #FF69B4)',
  ...rest
}: Props) => {
  const isGhost = variant === 'ghost';
  const isSolid = !isGhost;

  return (
    <Link to={to}>
      <Button
        px={6}
        mx={2}
        fontWeight="semibold"
        color="white"
        bg={isSolid ? 'transparent' : 'transparent'}
        transition="all 0.25s ease-in-out"
        borderRadius={borderRadius}
        {...rest}
        _hover={{
          bg: isSolid ? 'gray.800' : 'rgba(255,255,255,0.1)',
          boxShadow: isGhost
            ? '0 0 18px rgba(236, 72, 153, 0.9)'
            : '0 0 18px rgba(168, 85, 247, 0.9)',
          transform: 'scale(1.07)',
        }}
        sx={{
          position: 'relative',
          border: '2px solid transparent',
          backgroundClip: 'padding-box',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-2px', left: '-2px', right: '-2px', bottom: '-2px',
            borderRadius: borderRadius,
            // ✅ 3. USE the gradient prop here instead of the hardcoded value
            background: gradient,
            backgroundSize: '400% 400%',
            zIndex: -1,
            animation: 'gradientShift 8s ease infinite',
          },
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      >
        {text}
      </Button>
    </Link>
  );
};

export default NavigationLink;