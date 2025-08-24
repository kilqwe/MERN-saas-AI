import React from 'react';
import { Box, Flex, VStack, Image } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import TyperAnimation from '../components/typer/TyperAnimation';
import Footer from '../components/footer/Footer';

// 1. Define the keyframes for the fade-in animation
const fadeInBottom = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Home = () => {
  // 2. Create the animation string to apply to the component
  const fadeInAnimation = `${fadeInBottom} 1s ease-out forwards`;

  return (
    <>
      <VStack w="100%" align="center" mx="auto" mt={3}>
        <Box>
          <TyperAnimation />
        </Box>

        <Flex
          w="100%"
          direction={{ base: 'column', md: 'row' }}
          gap={5}
          my={10}
        >
          <Image src="/home2.jpg" alt="home2" w="200px" m="auto" borderRadius="10%" />
          <Image
            className="image-inverted rotate"
            src="/openai.png"
            alt="openai"
            w="200px"
            m="auto"
            borderRadius="50%"
          />
        </Flex>

        <Flex w="100%" mx="auto" justify="center">
          <Image
            src="/chatbot.png"
            alt="chatbot"
            w={{ base: '80%', md: '60%' }}
            animation={fadeInAnimation} // Apply the animation
            borderRadius="20px" // Reduced round edges
            boxShadow="0 0 40px #a78bfa" // Reduced glow intensity
            mt={20}
            mb={20}
          />
        </Flex>
      </VStack>
      <Footer />
    </>
  );
};

export default Home;