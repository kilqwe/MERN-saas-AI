import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { red } from "@mui/material/colors";
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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const handleSubmit = async () => {
    const content = inputRef.current?.value?.trim();
    if (!content) return;

    if (inputRef.current) {
      inputRef.current.value = "";
    }

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
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth]);

  const getInitials = (name?: string) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    const firstInitial = parts[0]?.[0] || "";
    const secondInitial = parts[1]?.[0] || "";
    return (firstInitial + secondInitial).toUpperCase();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      {/* Sidebar */}
      <Box sx={{ display: { md: "flex", xs: "none", sm: "none" }, flex: 0.25, flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            mx: 3,
            p: 3,
            height: "100%",
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
              width: 60,
              height: 60,
            }}
          >
            {getInitials(auth?.user?.name) || "U"}
          </Avatar>

          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              fontFamily: "Work Sans",
              fontWeight: 600,
              mb: 1,
              color: "white",
            }}
          >
            You are talking to a ventbot
          </Typography>
          <Typography
            variant="body2"
            sx={{ textAlign: "center", fontFamily: "Work Sans", color: "gray" }}
          >
            You can share your feelings without hesitation, but don't give away personal information unnecessarily.
          </Typography>

          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              mt: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": { bgcolor: red.A400 },
            }}
          >
            CLEAR CONVERSATION
          </Button>
        </Box>
      </Box>

      {/* Main Chat Area */}
      <Box sx={{ display: "flex", flex: { md: 0.75, xs: 1, sm: 1 }, flexDirection: "column", px: 3 }}>
        <Typography sx={{ textAlign: "center", fontSize: "28px", fontWeight: 600, color: "white", mb: 2 }}>
          Model - llama3-8b-8192
        </Typography>

        <Box
          sx={{
            flex: 1,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            px: 4,
            py: 2,
            backgroundColor: "rgba(255,255,255,0.02)",
            gap: 2,
          }}
        >
          {chatMessages.map((chat, index) => (
            <ChatItem key={index} role={chat.role} content={chat.content} />
          ))}
        </Box>

        {/* Input */}
        <Box>
          <div
            style={{
              width: "100%",
              padding: "20px",
              borderRadius: "8",
              backgroundColor: "rgb(17,27,39)",
              display: "flex",
              margin: "auto",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              style={{
                width: "100%",
                backgroundColor: "transparent",
                padding: "10px",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "20px",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
            <IconButton onClick={handleSubmit} sx={{ ml: "auto", color: "white" }}>
              <IoMdSend />
            </IconButton>
          </div>
        </Box>
      </Box>
    </Box>
  );
};
