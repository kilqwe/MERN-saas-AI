// src/components/Header.tsx
import { Box, Flex, Spacer, HStack } from "@chakra-ui/react"; // Added HStack
import React from "react";
import { useAuth } from "../context/AuthContext";
import NavLinkButton from "./shared/NavigationLink";
import Logo from "./shared/Logo";

const Header = () => {
  const auth = useAuth();

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="10"
      p={{ base: 2, md: 3 }} // Reduced padding
    >
      <Flex
        as="nav"
        maxW="container.xl"
        mx="auto"
        px={{ base: 4, md: 6 }} // Reduced padding
        py={3} // Reduced padding
        justifyContent="space-between"
        alignItems="center"
        borderRadius="full"
        bg="rgba(13, 19, 33, 0.75)"
        sx={{
          backdropFilter: "blur(10px) saturate(180%)",
          WebkitBackdropFilter: "blur(10px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Logo />
        <Spacer />
        {auth?.isLoggedIn ? (
          <HStack spacing={2}>
            <NavLinkButton
              to="/chat"
              text="Go To Chat"
              size="md" // Reduced size
              fontSize="md" // Reduced size
              borderRadius="full"
            />
            <NavLinkButton
              to="/"
              text="Logout"
              onClick={auth.logout}
              variant="ghost"
              size="md" // Reduced size
              fontSize="md" // Reduced size
              borderRadius="full"
            />
          </HStack>
        ) : (
          <HStack spacing={2}>
            <NavLinkButton
              to="/login"
              text="Login"
              variant="ghost"
              size="md" // Reduced size
              fontSize="md" // Reduced size
              borderRadius="full"
            />
            <NavLinkButton
              to="/signup"
              text="Signup"
              size="md" // Reduced size
              fontSize="md" // Reduced size
              borderRadius="full"
            />
          </HStack>
        )}
      </Flex>
    </Box>
  );
};

export default Header;