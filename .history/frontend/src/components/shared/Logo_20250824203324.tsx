import React from 'react';
import {
  HStack,
  Link,
  Image,
  Text,
  usePrefersReducedMotion,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { Link as RouterLink } from 'react-router-dom';

// Animation for rotation
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ✅ Animation for a pulsing glow effect
const glow = keyframes`
  0% { box-shadow: 0 0 5px #64f3d5; }
  50% { box-shadow: 0 0 20px #88f7e2; }
  100% { box-shadow: 0 0 5px #64f3d5; }
`;

const Logo = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // ✅ Combine both animations
  const spinAnimation = `${spin} infinite 10s linear`;
  const glowAnimation = `${glow} infinite 4s ease-in-out`;

  const animation = prefersReducedMotion
    ? undefined
    : `${spinAnimation}, ${glowAnimation}`;

  return (
    <HStack spacing={3} mr="auto">
      <Link as={RouterLink} to="/">
        <Image
          src="/openai.png"
          alt="openai logo"
          boxSize="30px"
          className="image-inverted"
          borderRadius="full"
          animation={animation}
          transition="transform 0.3s ease, box-shadow 0.3s ease"
          _hover={{
            transform: 'scale(1.2) rotate(10deg)', // keep rotation + add scale
            boxShadow: '0 0 25px #88f7e2',
          }}
        />
      </Link>
      <Text
        display={{ base: 'none', md: 'block' }}
        mr="auto"
        fontWeight="normal"
        textShadow="2px 2px 20px #000"
        fontSize="20px"
        color="white"
      >
        <Text as="span" fontWeight="bold">VENT</Text>BOT
      </Text>
    </HStack>
  );
};

export default Logo;
