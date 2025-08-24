import React from 'react';
// 1. Import Chakra UI components
import { Box, Flex, VStack, Image } from '@chakra-ui/react';
import TyperAnimation from '../components/typer/TyperAnimation';
import Footer from '../components/footer/Footer';

const Home = () => {
  return (
    
      <><VStack w="100%" align="center" mx="auto" mt={3}>
      <Box>
        <TyperAnimation />
      </Box>

      <Flex
        w="100%"
        direction={{ base: 'column', md: 'row' }}
        gap={5}
        my={10}
      >


      </Flex>

      <Flex w="100%" mx="auto" justify="center">
        <Image
          src="/chatbot.png"
          alt="chatbot"
          w={{ base: '80%', md: '60%' }}
          borderRadius="40px"
          boxShadow="-5px -5px 105px #64f3d5"
          mt={20}
          mb={20} />
      </Flex>
    </VStack><Footer /></>
 
  );
};

export default Home;
