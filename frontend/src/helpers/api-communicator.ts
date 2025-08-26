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
    const res = await axios.post("/api/v1/user/login", { email, password });
    return res.data;
  } catch (err: any) {
    handleError(err, "Unable to login.");
  }
};

export const signupUser = async (name: string, email: string, password: string) => {
  try {
    const res = await axios.post("/api/v1/user/signup", { name, email, password });
    return res.data;
  } catch (err: any) {
    handleError(err, "Unable to signup.");
  }
};

export const checkAuthStatus = async () => {
  try {
    const res = await axios.get("/api/v1/user/auth-status");
    return res.data;
  } catch (err: any) {
    handleError(err, "Unable to authenticate.");
  }
};

export const logoutUser = async () => {
  try {
    const res = await axios.get("/api/v1/user/logout");
    return res.data;
  } catch (err: any) {
    handleError(err, "Unable to logout.");
  }
};

// ------------------- CHATS -------------------

export const sendChatRequest = async (message: string) => {
  try {
    const res = await axios.post("/api/v1/chat/new", { message });
    return res.data;
  } catch (err: any) {
    handleError(err, "Unable to send chat request.");
  }
};

export const getUserChats = async () => {
  try {
    const res = await axios.get("/api/v1/chat/all-chats");
    return res.data;
  } catch (err: any) {
    handleError(err, "Unable to get chat history.");
  }
};

export const deleteUserChats = async () => {
  try {
    const res = await axios.delete("/api/v1/chat/delete");
    return res.data;
  } catch (err: any) {
    handleError(err, "Unable to delete chats.");
  }
};
