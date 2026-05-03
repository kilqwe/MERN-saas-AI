import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL; 
axios.defaults.withCredentials = true;

// Error helper
const handleError = (err: any, defaultMsg: string) => {
  throw new Error(err.response?.data?.message || defaultMsg);
};

// ------------------- AUTH -------------------

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await axios.post("/user/login", { email, password });
    return res.data;
  } catch (err: any) {
    handleError(err, "Unable to login.");
  }
};

export const signupUser = async (name: string, email: string, password: string) => {
  try {
    const res = await axios.post("/user/signup", { name, email, password });
    return res.data;
  } catch (err: any) {
    handleError(err, "Unable to signup.");
  }
};

export const checkAuthStatus = async () => {
  try {
    const res = await axios.get("/user/auth-status");
    return res.data;
  } catch (err: any) {
    handleError(err, "Unable to authenticate.");
  }
};

export const logoutUser = async () => {
  try {
    const res = await axios.get("/user/logout");
    return res.data;
  } catch (err: any) {
    handleError(err, "Unable to logout.");
  }
};

// ------------------- CHATS -------------------
export const sendChatRequestStream = async (
  message: string,
  onToken: (token: string) => void,
  onDone: (crisisLevel: string) => void,
  onError: (error: string) => void,
  signal?: AbortSignal
) => {
  const baseURL = import.meta.env.VITE_API_URL;

  const response = await fetch(`${baseURL}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ message }),
    signal,
  });

  if (!response.ok) {
    onError("Failed to connect to stream");
    return;
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    onError("Stream not available");
    return;
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(line => line.startsWith("data: "));

      for (const line of lines) {
        try {
          const data = JSON.parse(line.replace("data: ", ""));
          if (data.type === "token") onToken(data.content);
          if (data.type === "done") onDone(data.crisisLevel);
          if (data.type === "error") onError(data.message);
        } catch {
          // skip malformed chunks
        }
      }
    }
  } catch (err: any) {
    if (err.name !== "AbortError") onError(err.message);
  }
};
export const sendChatRequest = async (message: string) => {
  try {
    const res = await axios.post("/chat/new", { message });
    return res.data;
  } catch (err: any) {
    handleError(err, "Unable to send chat request.");
  }
};

export const getUserChats = async () => {
  try {
    const res = await axios.get("/chat/all-chats");
    return res.data;
  } catch (err: any) {
    handleError(err, "Unable to get chat history.");
  }
};

export const deleteUserChats = async () => {
  try {
    const res = await axios.delete("/chat/delete");
    return res.data;
  } catch (err: any) {
    handleError(err, "Unable to delete chats.");
  }
};
