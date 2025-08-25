// src/components/Header.tsx
import { Box, Flex, Spacer, HStack } from "@chakra-ui/react";
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
      w="100%"
    >
      <Flex
        as="nav"
        w="100%"                   // full width
        px={{ base: 4, md: 6 }}
        py={3}
        justifyContent="space-between"
        alignItems="center"
        bg="rgba(13, 19, 33, 0.75)"
        sx={{
          backdropFilter: "blur(10px) saturate(180%)",
          WebkitBackdropFilter: "blur(10px) saturate(180%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)", // optional subtle border
        }}
      >
        <Logo />
        <Spacer />
        {auth?.isLoggedIn ? (
          <HStack spacing={2}>
            <NavLinkButton to="/chat" text="Go To Chat" size="md" fontSize="md" borderRadius="3xl" width="140px" />
            <NavLinkButton
              to="/"
              text="Logout"
              onClick={auth.logout}
              size="md"
              fontSize="md"
              bgGradient="linear-gradient(90deg, #c64453ff, #f04262ff, #ed80aaff, #c64453ff)"
              width="140px"
            />
          </HStack>
        ) : (
          <HStack spacing={4}>
            <NavLinkButton to="/login" text="Login" size="md" fontSize="md" borderRadius="3xl" width="140px" />
            <NavLinkButton to="/signup" text="Signup" size="md" fontSize="md" borderRadius="3xl" width="140px" bgGradient = "linear-gradient(90deg, #EC4899, #8e46e5ff, #a25ce4ff, #EC4899)" />
          </HStack>
        )}
      </Flex>
    </Box>
  );
};

export default Header;
