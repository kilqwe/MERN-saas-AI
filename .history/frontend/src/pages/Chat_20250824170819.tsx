import { Box, Button, IconButton, Heading, Text, Flex, VStack, Input } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { IoMdSend } from "react-icons/io";
import { deleteUserChats, getUserChats, sendChatRequest } from "../helpers/api-communicator";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ChatItem from "../components/chat/ChatItem";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export const Chat = () => {
  // All this logic remains exactly the same
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const handleSubmit = async () => {
    const content = inputRef.current?.value?.trim();
    if (!content) return;
    if (inputRef.current) inputRef.current.value = "";
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    try {
      const chatData = await sendChatRequest(content);
      setChatMessages([...chatData.chats]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    }
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Successfully Deleted Chats", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed.", { id: "deletechats" });
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", { id: "loadchats" });
      getUserChats()
        .then((data) => {
          setChatMessages([...data.chats]);
          toast.success("Successfully loaded chats", { id: "loadchats" });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Loading Failed.", { id: "loadchats" });
        });
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) navigate("/login");
  }, [auth]);

  const getInitials = (name?: string) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
  };

  return (
    <Flex flex={1} width="100%" height="100%" mt={3} gap={3}>
      {/* Sidebar */}
      <VStack
        flex={{ md: 0.25 }}
        display={{ base: "none", md: "flex" }} // Responsive display
        p={3}
        mx={3}
        bg="rgb(17,29,39)"
        borderRadius={10}
        height="100%"
      >
        <Avatar
          mx="auto"
          my={2}
          bg="white"
          color="black"
          fontWeight="700"
          boxSize="60px" // Chakra's prop for width & height
          name={getInitials(auth?.user?.name) || "U"}
        />
        <Heading as="h2" size="md" textAlign="center" fontFamily="Work Sans" fontWeight={600} mb={1} color="white">
          You are talking to a ventbot
        </Heading>
        <Text textAlign="center" fontFamily="Work Sans" color="gray">
          You can share your feelings without hesitation, but don't give away personal information unnecessarily.
        </Text>
        <Button
          onClick={handleDeleteChats}
          width="200px"
          mt="auto"
          color="white"
          fontWeight="700"
          borderRadius={8}
          mx="auto"
          bg="red.300" // Chakra color scale
          _hover={{ bg: "red.400" }} // Chakra's hover prop
        >
          CLEAR CONVERSATION
        </Button>
      </VStack>

      {/* Main Chat Area */}
      <VStack flex={{ base: 1, md: 0.75 }} px={3} align="stretch">
        <Heading as="h1" size="lg" textAlign="center" fontWeight={600} color="white" mb={2}>
          Model - llama3-8b-8192
        </Heading>
        <VStack
          flex={1}
          borderRadius={8}
          overflowY="auto"
          px={4}
          py={2}
          bg="rgba(255,255,255,0.02)"
          gap={2}
          align="stretch"
        >
          {chatMessages.map((chat, index) => (
            <ChatItem key={index} role={chat.role} content={chat.content} />
          ))}
        </VStack>

        {/* Input */}
        <Flex p={5} borderRadius={8} bg="rgb(17,27,39)" mt={2}>
          <Input
            ref={inputRef}
            variant="outline" // Use allowed variant value
            p={2}
            color="white"
            fontSize="20px"
            placeholder="Type your message..."
            _placeholder={{ color: "gray.500" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
          <IconButton
            onClick={handleSubmit}
            aria-label="Send message"
            ml="auto"
            color="white"
            icon={<IoMdSend />}
            variant="ghost"
            _hover={{ bg: "whiteAlpha.200" }}
          />
        </Flex>
      </VStack>
    </Flex>
  );
};