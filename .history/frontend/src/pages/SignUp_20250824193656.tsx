import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import CustomizedInput from "../components/shared/CustomizedInput";
import { IoIosLogIn } from "react-icons/io";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      toast.loading("Signing up!", { id: "signup" });
      await auth?.signup(name, email, password);
      toast.success("Signed up successfully!", { id: "signup" });
    } catch (error) {
      console.log(error);
      toast.error("Sign up failed!", { id: "signup" });
    }
  };

  useEffect(() => {
    if (auth?.user) {
      navigate("/chat");
    }
  }, [auth]);

  return (
    <Flex minH="100vh" align="center" justify="center" p={4}>
      <Flex
        w="full"
        maxW="1000px"
        h={{ base: "auto", md: "650px" }}
        borderRadius="3xl"
        overflow="hidden"
        boxShadow="lg"
        direction={{ base: "column", md: "row" }}
      >
        {/* Left Panel: GIF */}
        <Flex
          flex={1}
          color="white"
          direction="column"
          justify="space-between"
          p={10}
          bgImage="url('/ventbotgif.gif')"
          bgSize="cover"
          bgPosition="center"
          display={{ base: "none", md: "flex" }}
        />

        {/* Right Panel: Glassmorphic Sign Up */}
        <Flex
          flex={1}
          p={10}
          direction="column"
          justify="center"
          align="center"
          sx={{
            backdropFilter: "blur(14px) saturate(160%)",
            WebkitBackdropFilter: "blur(14px) saturate(160%)",
          }}
          borderLeft={{ base: "none", md: "1px solid rgba(255,255,255,0.12)" }}
          bgGradient="linear(to-br, rgba(255,255,255,0.08), rgba(255,255,255,0.02))"
        >
          <Box as="form" onSubmit={handleSubmit} w="full" maxW="350px">
            <VStack spacing={6} align="stretch">
              <VStack spacing={1} align="flex-start" w="full">
                <Heading color="white">Sign Up</Heading>
                <Text color="gray.300">
                  Enter your credentials to create your account
                </Text>
              </VStack>

              <FormControl>
                <FormLabel color="white">Name</FormLabel>
                <CustomizedInput type="text" name="name" label="Name" />
              </FormControl>

              <FormControl>
                <FormLabel color="white">Email</FormLabel>
                <CustomizedInput type="email" name="email" label="Email" />
              </FormControl>

              <FormControl>
                <FormLabel color="white">Password</FormLabel>
                <CustomizedInput type="password" name="password" label="Password" />
              </FormControl>

              <Button
                type="submit"
                bg="#4A90E2"
                color="white"
                size="lg"
                fontSize="md"
                fontWeight="bold"
                rightIcon={<IoIosLogIn />}
                w="full"
                borderRadius="lg"
                _hover={{
                  bg: '#357ABD',
                  transform: 'scale(1.02)',
                  boxShadow: '0 0 15px rgba(74, 144, 226, 0.7)',
                }}
                transition="all 0.2s ease-in-out"
              >
                Sign Up
              </Button>
            </VStack>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SignUp;