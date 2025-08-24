import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

function extractCodeFromString(message: string): string[] | null {
  if (message.includes("```")) {
    return message.split("```");
  }
  return null;
}

function isCodeBlock(str: string) {
  return (
    str.includes("=") ||
    str.includes(";") ||
    str.includes("[") ||
    str.includes("]") ||
    str.includes("{") ||
    str.includes("}") ||
    str.includes("#") ||
    str.includes("//")
  );
}

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const auth = useAuth();
  const messageBlocks = extractCodeFromString(content);

  const getInitials = (name?: string) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
  };

  const isUser = role === "user";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        gap: 2,
        my: 1.5,
      }}
    >
      {/* Avatar */}
      {isUser ? (
        <Avatar
          sx={{
            bgcolor: "black",
            color: "white",
            fontWeight: 700,
            width: 40,
            height: 40,
          }}
        >
          {getInitials(auth?.user?.name) || "U"}
        </Avatar>
      ) : (
        <Avatar
          sx={{
            bgcolor: "white",
            width: 40,
            height: 40,
            p: 0.5,
          }}
        >
          <img
            src="/openai.png"
            alt="assistant"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Avatar>
      )}

      {/* Message bubble */}
      <Box
        sx={{
          bgcolor: isUser ? "#007b8a" : "#004d5612",
          color: isUser ? "white" : "black",
          borderRadius: 2,
          px: 2,
          py: 1.2,
          maxWidth: "70%",
          fontFamily: "Work Sans",
          boxShadow: isUser
            ? "0 1px 3px rgba(0,0,0,0.2)"
            : "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {!messageBlocks && (
          <Typography sx={{ fontSize: "20px" }}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </Typography>
        )}

        {messageBlocks &&
          messageBlocks.length > 0 &&
          messageBlocks.map((block, index) => {
            if (isCodeBlock(block)) {
              const lines = block.trim().split("\n");
              let language = "javascript";
              let code = block;

              // Detect language from first line if present
              if (lines.length > 1 && /^[a-zA-Z0-9+#-]+$/.test(lines[0])) {
                language = lines[0].trim().toLowerCase();
                code = lines.slice(1).join("\n");
              }

              return (
                <SyntaxHighlighter
                  key={index}
                  style={coldarkDark}
                  language={language}
                >
                  {code}
                </SyntaxHighlighter>
              );
            }

            return (
              <Typography key={index} sx={{ fontSize: "20px" }}>
                <ReactMarkdown>{block}</ReactMarkdown>
              </Typography>
            );
          })}
      </Box>
    </Box>
  );
};

export default ChatItem;
