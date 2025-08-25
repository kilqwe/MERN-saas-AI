import { Flex, Spacer, HStack } from "@chakra-ui/react";
import React from "react";
import { useAuth } from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLink";
import Logo from "./shared/Logo";

const Header = () => {
  const auth = useAuth();

  return (
    <Flex
      as="header"
      position="sticky"
      top="0"
      zIndex="10"
      px={{ base: 4, md: 6 }}
      py={3}
      justifyContent="space-between"
      alignItems="center"
      bg="rgba(13, 19, 33, 0.75)"
      borderRadius="xl" // ✅ Made the header container more rounded
      sx={{
        backdropFilter: "blur(10px) saturate(180%)",
        WebkitBackdropFilter: "blur(10px) saturate(180%)",
      }}
    >
      <Logo />
      <Spacer />
      {auth?.isLoggedIn ? (
        <HStack spacing={4}> {/* ✅ Increased spacing */}
          <NavigationLink
            to="/chat"
            text="Go To Chat"
            size="md"
            fontSize="md"
            borderRadius="full"
          />
          <NavigationLink
            to="/"
            text="Logout"
            onClick={auth.logout}
            variant="ghost"
            size="md"
            fontSize="md"
            borderRadius="full"
          />
        </HStack>
      ) : (
        <HStack spacing={4}> {/* ✅ Increased spacing */}
          <NavigationLink
            to="/login"
            text="Login"
            variant="ghost"
            size="md"
            fontSize="md"
            borderRadius="full"
          />
          <NavigationLink
            to="/signup"
            text="Signup"
            size="md"
            fontSize="md"
            borderRadius="full"
          />
        </HStack>
      )}
    </Flex>
  );
};

export default Header;