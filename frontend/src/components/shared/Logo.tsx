import React from 'react';
import { HStack, Link, Image, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Logo = () => {
  return (
    <HStack spacing={4} mr="auto">
      <Link as={RouterLink} to="/">
        <Image
          src="/openai.png"
          alt="openai"
          boxSize="30px"
          className="image-inverted"
        />
      </Link>
      <Text
        display={{ base: 'none', md: 'block' }}
        mr="auto"
        fontWeight="800"
        textShadow="2px 2px 20px #000"
      >
        <Text as="span" fontSize="20px">VENTBOT</Text>-ai
      </Text>
    </HStack>
  );
};

export default Logo;