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
        // ✅ Changed user avatar to have a white initial on a black background
        bg={isUser ? "#5B21B6" : "white"}
        color={isUser ? "white" : "black"}
        name={isUser ? auth?.user?.name : undefined}
        src={isUser ? undefined : "/openai.png"}
        p={!isUser ? 0.5 : undefined}
      />

      <Box
        // ✅ Changed user chat color to a complementary purple
        bg={isUser ? "#5B21B6" : "rgba(30, 25, 60, 0.7)"}
        color="white"
        borderRadius="xl"
        px={5}
        py={3}
        maxW={{ base: "90%", md: "80%" }}
        border="1px solid"
        borderColor="whiteAlpha.300"
        fontFamily="Work Sans"
      >
        <Text fontSize="lg" as="div">
          <ReactMarkdown components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </Text>
      </Box>
    </Flex>
  );
};

export default ChatItem;