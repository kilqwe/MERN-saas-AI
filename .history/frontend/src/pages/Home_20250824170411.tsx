import React from 'react';
// 1. Import Chakra UI components
import { Box, Flex, VStack, Image } from '@chakra-ui/react';
import TyperAnimation from '../components/typer/TyperAnimation';
import Footer from '../components/footer/Footer';

const Home = () => {
  return (
    // Box is similar in both libraries
    <Box width="100%" height="100%">
      {/* 2. VStack is a specialized Flex component for vertical stacking */}
      <VStack width="100%" align="center" mx="auto" mt={3}>
        <Box>
          <TyperAnimation />
        </Box>

        {/* 3. Using Flex for layout and responsive direction */}
        <Flex
          width="100%"
          // Responsive styles are now objects/arrays on the prop itself
          direction={{ base: 'column', md: 'row' }}
          gap={5}
          my={10}
        >
          {/* Using Chakra's Image component for better style prop integration */}
          <Image src='home2.jpg' alt='home2' width="200px" m="auto" borderRadius="10%" />
          <Image
            className='image-inverted rotate'
            src='openai.png'
            alt='openai'
            width="200px"
            m="auto"
            borderRadius="50%"
          />
        </Flex>

        {/* Using Flex to center the main image */}
        <Flex width="100%" mx="auto" justify="center">
          <Image
            src='chatbot.png'
            alt="chatbot"
            // 4. Responsive logic is now declarative, removing the need for useMediaQuery
            width={{ base: '80%', md: '60%' }}
            borderRadius="40px"
            boxShadow="-5px -5px 105px #64f3d5"
            mt={20}
            mb={20}
          />
        </Flex>
      </VStack>

      <Footer />
    </Box>
  );
}

export default Home;