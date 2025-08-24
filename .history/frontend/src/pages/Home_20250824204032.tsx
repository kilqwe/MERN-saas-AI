import React from 'react';
import { Box, Flex, VStack, Image } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import TyperAnimation from '../components/typer/TyperAnimation';
import Footer from '../components/footer/Footer';

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
  const fadeInAnimation = `${fadeInBottom} 1s ease-out forwards`;

  return (
    <>
      <VStack w="100%" align="center" mx="auto" mt={3}>
        {/* ✅ Push typing text lower */}
        <Box mt={60}>
          <TyperAnimation />
        </Box>

        <Flex
          w="100%"
          direction={{ base: 'column', md: 'row' }}
          gap={5}
          my={10}
        >
          {/* Placeholder Flex (currently empty) */}
        </Flex>

        <Flex w="100%" mx="auto" justify="center">
          <Image
            src="/chat2.png"
            alt="chatbot"
            w={{ base: '80%', md: '60%' }}
            animation={fadeInAnimation}
            borderRadius="20px"
            boxShadow="0 0 40px #a78bfa"
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
