// src/components/Header.tsx
import { Box, Flex, Spacer } from "@chakra-ui/react";
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
      p={{ base: 5, md: 6 }}
    >
      <Flex
        as="nav"
        maxW="container.xl"
        mx="auto"
        px={10}
        py={6}
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
        <Box fontSize="3xl">
          <Logo />
        </Box>
        <Spacer />
        {auth?.isLoggedIn ? (
          <>
            <NavLinkButton
              to="/chat"
              text="Go To Chat"
              size="lg"
              fontSize="lg"
              borderRadius="full"
            />
            <NavLinkButton
              to="/"
              text="Logout"
              onClick={auth.logout}
              variant="ghost"
              size="lg"
              fontSize="lg"
              borderRadius="full"
            />
          </>
        ) : (
          <>
            <NavLinkButton
              to="/login"
              text="Login"
              variant="ghost"
              size="lg"
              fontSize="lg"
              borderRadius="full"
            />
            <NavLinkButton
              to="/signup"
              text="Signup"
              size="lg"
              fontSize="lg"
              borderRadius="full"
            />
          </>
        )}
      </Flex>
    </Box>
  );
};

export default Header;
