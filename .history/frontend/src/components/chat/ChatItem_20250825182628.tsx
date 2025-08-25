import React from "react";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const auth = useAuth();
  const isUser = role === "user";

  const markdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={coldarkDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <Flex
      direction={isUser ? "row-reverse" : "row"}
      align="flex-start"
      gap={3}
      my={1.5}
      w="100%"
    >
      <Avatar
        bg={isUser ? "black" : "white"}
        name={isUser ? auth?.user?.name : undefined}
        src={isUser ? undefined : "/openai.png"}
        p={!isUser ? 0.5 : undefined}
      />

      {/* --- EDITS ARE BELOW --- */}
      <Box
        bg={isUser ? "#007b8a" : "rgba(30, 25, 60, 0.7)"} // ✅ New complementary color for AI
        color="white"
        borderRadius="xl"
        px={5} // ✅ Increased horizontal padding
        py={3} // ✅ Increased vertical padding
        maxW={{ base: "70%", md: "65%" }} // ✅ Made the bubble wider
        border="1px solid" // ✅ Added a border
        borderColor="whiteAlpha.300" // ✅ Subtle white border color
        fontFamily="Work Sans"
      >
        <Text fontSize="md" as="div">
          <ReactMarkdown components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </Text>
      </Box>
    </Flex>
  );
};

export default ChatItem;