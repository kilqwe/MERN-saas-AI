import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"; // ✅ use environment variable for base URL
axios.defaults.withCredentials = true; // ✅ allow cookies for auth

// ------------------- AUTH -------------------

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await axios.post("/user/login", { email, password });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Unable to login.");
  }
};

export const signupUser = async (name: string, email: string, password: string) => {
  try {
    const res = await axios.post("/user/signup", { name, email, password });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Unable to signup.");
  }
};

export const checkAuthStatus = async () => {
  try {
    const res = await axios.get("/user/auth-status");
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Unable to authenticate.");
  }
};

export const logoutUser = async () => {
  try {
    const res = await axios.get("/user/logout");
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Unable to logout.");
  }
};

// ------------------- CHATS -------------------

export const sendChatRequest = async (message: string) => {
  try {
    // ✅ Backend route is /chat/new (not /user/chat/new)
    const res = await axios.post("/chat/new", { message });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Unable to send chat request.");
  }
};

export const getUserChats = async () => {
  try {
    const res = await axios.get("/chat/all-chats");
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Unable to get chat history.");
  }
};

export const deleteUserChats = async () => {
  try {
    const res = await axios.delete("/chat/delete");
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Unable to delete chats.");
  }
};
