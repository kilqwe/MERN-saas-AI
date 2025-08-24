import React from 'react';
import { Box, Flex, VStack, Image } from '@chakra-ui/react';
import TyperAnimation from '../components/typer/TyperAnimation';
import Footer from '../components/footer/Footer';

const Home = () => {
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
          

          <Flex w="100%" mx="auto" justify="center">
            <Image
              src="/chat2.png"
              alt="chatbot"
              w={{ base: '80%', md: '60%' }}
              borderRadius="40px"
              boxShadow="-5px -5px 105px #a78bfa"
              mt={20}
              mb={20}
            />
          </Flex>
        </Flex>
      </VStack>
      <Footer />
    </>
  );
};

export default Home;