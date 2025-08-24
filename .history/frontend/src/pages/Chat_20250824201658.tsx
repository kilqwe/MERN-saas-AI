import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Text,
  VStack,
  Avatar
} from '@chakra-ui/react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAuth, User } from '../context/AuthContext'; // Assuming you export the User type from your context
import { IoMdSend } from 'react-icons/io';
import { CgStopwatch } from 'react-icons/cg';
import { HamburgerIcon, DeleteIcon } from '@chakra-ui/icons';
import { deleteUserChats, getUserChats, sendChatRequest } from '../helpers/api-communicator';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ChatItem from '../components/chat/ChatItem';
import TextareaAutosize from 'react-textarea-autosize';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

// --- Main Chat Component ---
export const Chat = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
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
      setIsLoadingChats(true);
      toast.loading('Loading Chats', { id: 'loadchats' });
      getUserChats()
        .then((data) => {
          setChatMessages([...data.chats]);
          toast.success('Successfully loaded chats', { id: 'loadchats' });
        })
        .catch(() => toast.error('Loading Failed.', { id: 'loadchats' }))
        .finally(() => setIsLoadingChats(false));
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      navigate('/login');
    }
  }, [auth, navigate]);

  const newGradient = "linear(to-r, #1f1027, #2c2a68, #5f2c5d)";

  return (
    <Flex h="100vh" bgGradient={newGradient} color="white" overflow="hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        user={auth?.user}
        onDeleteChats={handleDeleteChats}
      />

      <Flex flex={1} direction="column" bgGradient={newGradient}>
        <ChatHeader onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <MessageList
          messages={chatMessages}
          isLoading={isLoadingChats}
          isGenerating={isGenerating}
        />
        <ChatInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSubmit={handleSubmit}
          onStop={handleStopGeneration}
          isGenerating={isGenerating}
        />
      </Flex>
    </Flex>
  );
};

// =================================================================
// --- SUB-COMPONENTS (All in the same file as requested) ---
// =================================================================

type SidebarProps = {
  isOpen: boolean;
  user?: User | null;
  onDeleteChats: () => void;
};

const Sidebar = ({ isOpen, user, onDeleteChats }: SidebarProps) => {
  return (
    <Flex
      w={isOpen ? { base: '100%', md: '280px' } : '0'}
      p={isOpen ? 6 : 0}
      transition="width 0.3s ease-in-out, padding 0.3s ease-in-out"
      overflow="hidden"
      h="100vh"
      direction="column"
      bg="rgba(0, 0, 0, 0.2)"
      borderRight={isOpen ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'}
    >
      <VStack align="stretch" spacing={8} opacity={isOpen ? 1 : 0} transition="opacity 0.3s">
        <Flex align="center" direction="column" textAlign="center">
          <Avatar
            my={2}
            name={user?.name}
            bg="white"
            color="black"
            fontWeight="700"
            size="md"
          />
          <Heading fontSize="xl" fontWeight={600} color="white" noOfLines={1}>
            {user?.name}
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


const ChatHeader = ({ onSidebarToggle }: { onSidebarToggle: () => void }) => (
  <Flex align="center" p={4} bg="rgba(0,0,0,0.2)" borderBottom="1px solid rgba(255,255,255,0.1)">
    <IconButton
      icon={<HamburgerIcon />}
      aria-label="Toggle Sidebar"
      variant="ghost"
      _hover={{ bg: 'rgba(255,255,255,0.1)' }}
      onClick={onSidebarToggle}
      mr={4}
    />
    <Heading size="md" fontWeight="medium">
      Model - llama3-8b-8192
    </Heading>
  </Flex>
);

const MessageList = ({ messages, isLoading, isGenerating }: { messages: Message[], isLoading: boolean, isGenerating: boolean }) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  if (isLoading) {
    return (
      <Flex flex={1} justify="center" align="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <VStack
      flex={1}
      overflowY="auto"
      px={{ base: 4, md: 6 }}
      pt={{ base: 4, md: 6 }}
      spacing={4}
      css={{ '&::-webkit-scrollbar': { display: 'none' } }}
    >
      {messages.length === 0 ? (
        <Flex flex={1} justify="center" align="center" direction="column" color="gray.400">
          <Heading size="lg">Ventbot</Heading>
          <Text mt={2}>Ask me anything to start the conversation.</Text>
        </Flex>
      ) : (
        messages.map((chat, index) => (
          <ChatItem key={index} role={chat.role} content={chat.content} />
        ))
      )}
      {isGenerating && <TypingIndicator />}
      <Box ref={chatEndRef} />
    </VStack>
  );
};

const ChatInput = ({ value, onChange, onSubmit, onStop, isGenerating }: any) => (
  <Box px={{ base: 4, md: 6 }} py={4} bg="rgba(0,0,0,0.2)">
    <Flex bg="rgba(0,0,0,0.2)" borderRadius="xl" p={2} align="center" border="1px solid rgba(255,255,255,0.1)">
      <TextareaAutosize
        minRows={1}
        maxRows={5}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder="Type your message..."
        disabled={isGenerating}
        style={{
          backgroundColor: 'transparent',
          color: 'white',
          width: '100%',
          resize: 'none',
          border: 'none',
          outline: 'none',
          paddingLeft: '12px',
          paddingRight: '12px',
        }}
      />
      {isGenerating ? (
        <Button onClick={onStop} leftIcon={<CgStopwatch />} colorScheme="red">Stop</Button>
      ) : (
        <IconButton
          onClick={onSubmit}
          aria-label="Send message"
          icon={<IoMdSend />}
          colorScheme="yellow"
          isRound
          isDisabled={!value.trim()}
        />
      )}
    </Flex>
  </Box>
);

const TypingIndicator = () => (
    <Flex alignSelf="flex-start" bg="rgba(255,255,255,0.1)" p={3} borderRadius="lg">
        <Spinner size="sm" />
    </Flex>
);