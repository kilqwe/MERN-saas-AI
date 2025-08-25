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

const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      toast.loading("Logging in!", { id: "login" });
      await auth?.login(email, password);
      toast.success("Logged in successfully!", { id: "login" });
    } catch (error) {
      console.log(error);
      toast.error("Login failed!", { id: "login" });
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
          bgImage="url('/ventbotgif.gif')"
          bgSize="cover"
          bgPosition="center"
          display={{ base: "none", md: "flex" }}
        />

        {/* Right Panel: Glassmorphic Login */}
        <Flex
          flex={1}
          p={10}
          direction="column"
          justify="center"
          align="center"
          sx={{
            backdropFilter: "blur(100px) saturate(180%)",
            WebkitBackdropFilter: "blur(100px) saturate(180%)",
          }}
          // ✅ Switched to a darker, "duller" gradient
          bgGradient="linear(to-br, rgba(20, 20, 20, 0.5), rgba(20, 20, 20, 0.3))"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.1)" // ✅ Made border more subtle
        >
          <Box as="form" onSubmit={handleSubmit} w="full" maxW="350px">
            <VStack spacing={6} align="stretch">
              <VStack spacing={1} align="flex-start" w="full" mb={2}>
                <Heading color="white">Login</Heading>
                <Text color="gray.300">Enter your credentials to continue</Text>
              </VStack>

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
                Login
              </Button>
            </VStack>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Login;