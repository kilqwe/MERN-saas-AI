// src/components/chat/ChatItem.tsx
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import { TypeAnimation } from 'react-type-animation';

// Helper functions remain the same
function extractCodeFromString(message: string): string[] | null {
  if (message.includes('```')) {
    return message.split('```');
  }
  return null;
}

function isCodeBlock(str: string) {
  return (
    str.includes('=') || str.includes(';') || str.includes('[') ||
    str.includes(']') || str.includes('{') || str.includes('}') ||
    str.includes('#') || str.includes('//')
  );
}

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: 'user' | 'assistant';
}) => {
  const auth = useAuth();
  const messageBlocks = extractCodeFromString(content);
  const isUser = role === 'user';

  // ✨ Renders the typing indicator for the assistant
  if (!isUser && content === "") {
    return (
      <Flex w="100%" justify="flex-start" mb={4}>
        <Flex
          maxW={{ base: '90%', md: '80%' }}
          align="flex-start"
          direction="row"
          gap={3}
        >
          {/* SIMPLIFIED: Use the `src` prop directly on the Avatar */}
          <Avatar size="sm" src="/openai.png" />
          <Box
            bg="gray.700"
            color="white"
            px={4}
            py={2}
            borderRadius="lg"
            borderTopLeftRadius="none"
          >
            <TypeAnimation
              sequence={['▋', 500, '▋', 500, '▋', 500]} // Blinking cursor effect
              speed={70}
              repeat={Infinity}
              cursor={false}
              wrapper="span"
            />
          </Box>
        </Flex>
      </Flex>
    );
  }

  // --- Functions for rendering message content ---
  const renderTextBlock = (block: string, key: number) => (
    <Text key={key} fontSize="md" as="span">
      <ReactMarkdown>{block}</ReactMarkdown>
    </Text>
  );

  const renderCodeBlock = (block: string, key: number) => (
    <Box key={key} my={2} >
      <SyntaxHighlighter language="javascript" style={coldarkDark} customStyle={{ borderRadius: '8px', fontSize: '1em' }}>
        {block}
      </SyntaxHighlighter>
    </Box>
  );

  return (
    <Flex w="100%" justify={isUser ? 'flex-end' : 'flex-start'} mb={4}>
      <Flex
        maxW={{ base: '90%', md: '80%' }}
        align="flex-start"
        direction={isUser ? 'row-reverse' : 'row'}
        gap={3}
      >
        {/* --- REFACTORED AVATAR LOGIC --- */}
        {/* This is the standard and correct way to use Chakra's Avatar. */}
        {/* It uses the `name` prop for initials or the `src` prop for an image. */}
        <Avatar
          size="sm"
          name={isUser ? auth?.user?.name : undefined} // Generate initials for user if name exists
          src={
            isUser
              ? auth?.user?.name ? '' : '/user.png' // If no name, use fallback user image
              : '/openai.png' // Assistant always uses its image
          }
          bg={isUser ? 'blue.500' : 'gray.600'}
          color="white"
        />
        <Box
          bg={isUser ? 'blue.500' : 'gray.700'}
          color="white"
          px={4}
          py={2}
          borderRadius="lg"
          borderTopRightRadius={isUser ? 'none' : 'lg'}
          borderTopLeftRadius={isUser ? 'lg' : 'none'}
        >
          {!messageBlocks && renderTextBlock(content, 0)}
          {messageBlocks &&
            messageBlocks.map((block, index) =>
              isCodeBlock(block)
                ? renderCodeBlock(block, index)
                // Ensure plain text blocks are wrapped correctly for markdown
                : renderTextBlock(block.trim(), index) 
            )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default ChatItem;