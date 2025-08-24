import React from 'react';
import { HStack, Link, Image, Text, usePrefersReducedMotion } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { Link as RouterLink } from 'react-router-dom';

// 1. Define the rotation animation using keyframes
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Logo = () => {
  // 2. Check for user's motion preference for accessibility
  const prefersReducedMotion = usePrefersReducedMotion();
  const animation = prefersReducedMotion
    ? undefined
    : `${spin} infinite 20s linear`;

  return (
    <HStack spacing={3} mr="auto">
      <Link as={RouterLink} to="/">
        <Image
          src="/openai.png"
          alt="openai logo"
          boxSize="30px"
          className="image-inverted"
          animation={animation} // 3. Apply the animation here
        />
      </Link>
      <Text
        display={{ base: 'none', md: 'block' }}
        mr="auto"
        fontWeight="normal" // Set the base font weight
        textShadow="2px 2px 20px #000"
        fontSize="20px"
        color="white"
      >
        {/* 4. Style "VENT" and "BOT" differently */}
        <Text as="span" fontWeight="bold">VENT</Text>BOT
      </Text>
    </HStack>
  );
};

export default Logo;