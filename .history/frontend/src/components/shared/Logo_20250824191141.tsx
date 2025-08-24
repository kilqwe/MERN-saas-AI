import React from 'react';
import { HStack, Link, Image, Text, usePrefersReducedMotion } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { Link as RouterLink } from 'react-router-dom';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Logo = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  // ✅ Changed animation duration from '20s' to '10s' for a faster spin
  const animation = prefersReducedMotion
    ? undefined
    : `${spin} infinite 10s linear`;

  return (
    <HStack spacing={3} mr="auto">
      <Link as={RouterLink} to="/">
        <Image
          src="/openai.png"
          alt="openai logo"
          boxSize="30px"
          className="image-inverted"
          animation={animation}
          borderRadius="full" // ✅ Added this prop to make the image round
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
        <Text as="span" color="#8fccb7ff" fontWeight="bold">VENTBOT
      </Text>
    </HStack>
  );
};

export default Logo;