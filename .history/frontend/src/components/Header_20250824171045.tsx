// src/components/Header.tsx
import { Flex, Spacer, HStack } from '@chakra-ui/react'; // 1. Import Chakra components
import React from 'react';
import Logo from './shared/Logo';
import { useAuth } from '../context/AuthContext';
import NavigationLink from './shared/NavigationLink'; // 2. We'll use the new Chakra-based version

const Header = () => {
  const auth = useAuth();
  return (
    // 3. Replaced AppBar with a styled Flex component
    <Flex
      as="header"
      position="sticky"
      top="1rem"
      mx="auto"
      maxW="container.lg" // 4. Using theme-aware size token
      borderRadius="50px"
      bg="rgba(17, 25, 40, 0.75)" // background color
      backdropFilter="blur(16px) saturate(180%)"
      css={{ WebkitBackdropFilter: 'blur(16px) saturate(180%)' }} // For Safari
      boxShadow="none"
      p={{ base: 2, md: 3 }} // Responsive padding
      align="center"
    >
      <Logo />
      <Spacer /> {/* 5. A clean way to push content apart */}
      {auth?.isLoggedIn ? (
        <HStack> {/* 6. HStack for consistent spacing */}
          <NavigationLink to="/chat" text="Go To Chat" />
          <NavigationLink to="/" text="Logout" onClick={auth.logout} variant="ghost" />
        </HStack>
      ) : (
        <HStack>
          <NavigationLink to="/login" text="Login" variant="ghost" />
          <NavigationLink to="/signup" text="Signup" />
        </HStack>
      )}
    </Flex>
  );
};

export default Header;