// src/pages/Chat.tsx
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IoMdSend } from 'react-icons/io';
import { CgStopwatch } from 'react-icons/cg';
import { HamburgerIcon, DeleteIcon } from '@chakra-ui/icons';
import { deleteUserChats, getUserChats, sendChatRequest } from '../helpers/api-communicator';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ChatItem from '../components/chat/ChatItem';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export const Chat = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSubmit = async () => {
    const content = inputValue.trim();
    if (!content || isGenerating) return;

    abortControllerRef.current = new AbortController();
    setInputValue('');
    const newMessage: Message = { role: 'user', content };
    setChatMessages((prev) => [...prev, newMessage]);

    try {
      setIsGenerating(true);
      setChatMessages((prev) => [...prev, { role: 'assistant', content: "" }]);
      const chatData = await sendChatRequest(content);
      setChatMessages([...chatData.chats]);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        toast.success('Chat generation stopped.');
      } else {
        console.error(err);
        toast.error('Failed to send message');
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading('Deleting Chats', { id: 'deletechats' });
      await deleteUserChats();
      setChatMessages([]);
      toast.success('Successfully Deleted Chats', { id: 'deletechats' });
    } catch (error) {
      toast.error('Deleting chats failed.', { id: 'deletechats' });
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading('Loading Chats', { id: 'loadchats' });
      getUserChats()
        .then((data) => {
          setChatMessages([...data.chats]);
          toast.success('Successfully loaded chats', { id: 'loadchats' });
        })
        .catch(() => {
          toast.error('Loading Failed.', { id: 'loadchats' });
        });
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      navigate('/login');
    }
  }, [auth, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const newGradient = "linear(to-r, #1f1027, #2c2a68, #5f2c5d)";

  return (
    <Flex
      h="100vh"
      bgGradient={newGradient}
      color="white"
      overflow="hidden"
    >
      <Sidebar
        isOpen={isSidebarOpen}
        user={auth?.user}
        onDeleteChats={handleDeleteChats}
      />

      <Flex
        flex={1}
        direction="column"
        bgGradient={newGradient}
      >
        <Flex
          align="center"
          p={4}
          bg="rgba(0,0,0,0.2)"
          borderBottom="1px solid rgba(255,255,255,0.1)"
        >
          <IconButton
            icon={<HamburgerIcon />}
            aria-label="Toggle Sidebar"
            variant="ghost"
            _hover={{ bg: 'rgba(255,255,255,0.1)' }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            mr={4}
          />
          <Heading size="md" fontWeight="medium">
            Model - llama3-8b-8192
          </Heading>
        </Flex>

        <VStack
          flex={1}
          overflowY="auto"
          px={{ base: 4, md: 6 }}
          pt={{ base: 4, md: 6 }}
          pb={0}
          spacing={4}
          css={{
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '4px',
            },
          }}
        >
          {chatMessages.map((chat, index) => (
            <ChatItem key={index} role={chat.role} content={chat.content} />
          ))}

          {isGenerating && chatMessages[chatMessages.length - 1]?.role !== 'assistant' && (
             <ChatItem role="assistant" content="" />
          )}
          <Box ref={chatEndRef} />
        </VStack>

        <Box px={{ base: 4, md: 6 }} py={2} bg="rgba(0,0,0,0.2)">
          <Flex
            bg="rgba(0,0,0,0.2)"
            borderRadius="xl"
            p={2}
            align="center"
            border="1px solid rgba(255,255,255,0.1)"
          >
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Type your message..."
              isDisabled={isGenerating}
              variant="unstyled"
              flex={1}
              px={3}
              rows={1}
              resize="none"
              _focus={{ boxShadow: 'none' }}
            />
            {isGenerating ? (
              <Button
                onClick={handleStopGeneration}
                leftIcon={<CgStopwatch />}
                colorScheme="red"
                variant="solid"
                ml={2}
              >
                Stop
              </Button>
            ) : (
              <IconButton
                onClick={handleSubmit}
                aria-label="Send message"
                icon={<IoMdSend />}
                colorScheme="yellow"
                isRound
                isDisabled={!inputValue.trim()}
              />
            )}
          </Flex>
          <Text fontSize="xs" color="gray.400" textAlign="center" mt={2}>
            You are talking to a ventbot. Share your feelings, but avoid sharing personal information.
          </Text>
        </Box>
        
        {/* ✅ ADDED: This empty box pushes the input area up */}
        <Box h="40px" />

      </Flex>
    </Flex>
  );
};

// --- Sidebar Sub-Component ---
const Sidebar = ({ isOpen, user, onDeleteChats }: any) => {
  return (
    <Flex
      w={isOpen ? '280px' : '0'}
      p={isOpen ? 6 : 0}
      transition="width 0.3s ease-in-out, padding 0.3s ease-in-out"
      overflow="hidden"
      h="100vh"
      direction="column"
      bg="rgba(0, 0, 0, 0.2)"
      borderRight={isOpen ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'}
    >
      <VStack align="stretch" spacing={8}>
        <Flex align="center" direction="column" textAlign="center">
          <Avatar
            my={2}
            name={user?.name}
            bg="white"
            color="black"
            fontWeight="700"
            size="md"
          />
          <Heading fontSize="xl" fontWeight={600} color="white">
            Ventbot
          </Heading>
          <Text fontSize="sm" color="gray.300" px={2}>
            You can share your feelings without hesitation.
          </Text>

          <Button
            onClick={onDeleteChats}
            colorScheme="red"
            variant="outline"
            fontWeight="medium"
            leftIcon={<DeleteIcon />}
            mt={6}
          >
            Clear Conversation
          </Button>
        </Flex>
      </VStack>
    </Flex>
  );
};